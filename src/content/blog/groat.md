---
title: "Groat: A Proxy That Tries to Spend Your LLM Budget Like It's Its Own"
date: "2026-07-06"
updatedAt: ""
excerpt: "Most LLM proxies show you the bill. Groat, a self-hosted Rust proxy, tries to shrink it -four levers, ordered by how much you should trust them, plus two research-stage ideas borrowed from OS scheduling."
---

## thinking through Groat

Groat is the name I landed on for a self-hosted LLM proxy I'm building - the old English coin, worth very little on its own, but the whole point of a groat is that it counts. That's basically the thesis: sit in front of your LLM traffic as a drop-in OpenAI-compatible endpoint, don't make anyone change their application code, and find every place money is leaking out of the request path.

I want to write this one differently than the last pass - less "here's the finished feature," more actually walking through how I got to each piece and where I'm still not sure.

## starting point: what's already annoying me about the alternatives

Before any of the levers, the thing that got me started was just being annoyed at the existing options. LiteLLM is a Python library dressed up as a product - you have to hand-configure routing yourself, the caching is exact-match only (so it basically never fires on real traffic), and the dashboard sits behind a paywall. Portkey is SaaS-first, which means your traffic goes through someone else's servers, which is a non-starter for a chunk of the people who'd want this. Helicone is honest about what it is - it tells you what you spent - but it doesn't do anything to help you spend less, which felt like leaving the actual hard/interesting problem on the table.

So the wedge I kept coming back to: self-hosted, zero required config, and actually try to reduce spend rather than just report on it.

## the four levers, and why I ordered them this way

I didn't come up with these levers all at once - I built out from "what am I most confident will work with basically zero risk" toward "what's the most interesting but least proven idea." That ordering matters to me more than the individual levers do, because it's really a statement about how much I trust automated decisions to touch someone's LLM traffic without asking.

**Semantic caching** is the one I trust most. Embed the incoming request (`bge-small-en-v1.5`), check LanceDB for something similar already sitting in the cache, and if it clears a similarity threshold (0.95 by default) just hand back the cached response. At a high threshold this is close to zero quality risk - you're really just deduplicating near-identical requests, which happens constantly in dev/staging where you're asking the same handful of questions over and over while iterating. I'd guess 30-60% hit rate in that kind of environment, though I haven't measured it against real traffic yet, just intuition from watching my own usage patterns.

**Prompt cache injection** was almost an afterthought but might actually be the easiest win in the whole list. Anthropic and OpenAI already give you 50-90% off cached prefix tokens - you just have to manually mark where the cache boundary goes, and apparently almost nobody bothers. So Groat watches for stable system-prompt prefixes across requests and injects the `cache_control` breakpoint automatically. No tradeoff at all here, which is rare enough that it's worth calling out explicitly: you're not changing what the model sees, just telling the provider "this part is identical to last time, charge me accordingly."

**User-defined routing** is where I decided to deliberately *not* be clever. I could build a classifier that guesses which model tier a request needs. I chose not to, at least for now, because I don't trust a classifier to know someone's workload better than they do. So it's just a TOML file - you pin your own use cases to your own tiers, Groat enforces it and shows you savings per route. The one place I did let it be a little smart: structured-output requests with a JSON schema attached get auto-routed cheap, because the schema itself is doing enough constraining that a small model usually holds up fine. That felt like a safe exception rather than the start of a slippery slope, though I'm still watching myself on that.

**Retroactive suggestions** is the one I actually think is the product, not just a feature. After Groat's logged enough traffic - I'm using ~10k requests as a rough floor, though that number is a guess, not a result of any experiment - it looks for patterns and surfaces something like: "these 340 requests look like extraction tasks, routing to GPT-4o-mini would've saved $12.40, want a rule for it?" And then it waits. It doesn't reroute anything on its own.

That last part is the actual design decision, and it came out of not trusting myself, honestly. Once you let a classifier silently make routing decisions, you've made a bet that it's right often enough that nobody notices when it's wrong. I don't want to make that bet on someone else's production traffic. An advisor that shows its work and asks permission is a much smaller trust surface than a classifier making live decisions, even if it's less impressive as a demo.

## two things I haven't built yet, and I'm still turning over

**Conversation graph routing.** The framing I keep going back to is an OS scheduler treating a new process differently from a continuation of an existing one. Right now every proxy - including Groat, currently - treats each request as independent. But that's not actually true of a conversation. A root question is setting context for the first time and probably deserves the expensive model. A follow-up already has that context established, so it can probably get away with less. Depth and branching factor in the conversation graph become routing signals themselves - I think "how many siblings does this node have" ends up mattering, though I don't yet have a clean story for exactly how that should shift the routing decision versus just depth alone. This is the part of the project I'd genuinely like to sketch out on paper before writing any code, because I think the graph shape matters more than I can currently articulate.

**Speculative prefetching.** Same OS-theory well, different bucket - memory prefetching instead of scheduling. If request pattern A is reliably followed by pattern B within some window, fire B speculatively against a cheap model the moment A arrives, so the answer's sitting there before anyone asks. I like this idea a lot and trust it the least of anything here. It needs the conversation graph logging to already exist, it needs a real pattern-detection step over a meaningful sample, and it has to be strictly async - never on the critical path, never adding latency while something speculative is in flight. My honest worry is that this could easily turn into burning money on speculative calls that don't pay off often enough to justify themselves, and I don't have a good answer yet for how I'd know that was happening before it had already cost real money.

## the math I want to actually draw out, not just describe

Two things feel worth sketching by hand rather than just explaining in prose - this is where I want to sit down with a diagram tool rather than write more paragraphs.

The first is a direction vector between "simple" and "complex" clusters in embedding space, as an alternative to training or hand-writing a classifier for request complexity. Find the centroid of a "simple" cluster and a "complex" cluster, take the vector between them, and project an incoming request's embedding onto that axis. Something like a 0.73 score maps to "route to the powerful tier." What I like about this is it's not a new trick - it's the exact same operation the semantic cache is already doing. 

![Emdding complexity diagram](/images/content/blog/groat/groat-embedding-complexity.svg)


Cosine similarity is a dot product. I'm already comparing vectors to ask "is this request the same as one I've seen." Using a dot product against a direction vector instead asks "is this request more like the simple cluster or the complex one" - same math, pointed at a different question. I haven't validated that a linear direction genuinely separates simple/complex requests in practice, though - that's an assumption I'm making because it worked for the caching case, not something I've tested.

![Cosine similarity diagram](/images/content/blog/groat/groat-cosine-similarity.svg)

The second is the conversation graph itself - nodes as requests, edges as parent-child relationships, living in SQLite with depth, branching factor, and accumulated context tokens as queryable properties. This is the piece I think is genuinely new; I haven't seen another proxy modeling conversations this way instead of as a flat stream of independent calls. I want to draw this one out as an actual graph before I decide what the routing function looks like, because I suspect the right function isn't obvious from the description alone.

![Tier diagram](/images/content/blog/groat/groat-conversation-graph.svg)

## where I actually am

Rust workspace, four crates - `groat` (the binary: axum server, clap CLI), `groat-core` (pure logic, no I/O), `groat-providers` (one file per provider behind a shared trait), `groat-storage` (SQLite via sqlx, LanceDB for vectors). Dashboard is plain HTML baked into the binary with `include_str!()`, no build step, because I don't want a frontend toolchain to be a reason this stalls. Right now: requests flow end to end through Groat to a local Ollama instance running Llama 3. Levers 1-3 and the provider layer are next; the graph work comes after I actually trust the shape of it enough to write code against it.