import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

const postsDirectory = path.join(process.cwd(), "src/content/blog");

export interface PostMeta {
	slug: string;
	title: string;
	date: string;
	updatedAt?: string;
	excerpt: string;
}

export function getSortedPostsMeta(): PostMeta[] {
	if (!fs.existsSync(postsDirectory)) {
		return [];
	}

	const fileNames = fs.readdirSync(postsDirectory);
	const posts = fileNames.map((fileName) => {
		const slug = fileName.replace(/\.md$/, "");
		const fullPath = path.join(postsDirectory, fileName);
		const fileContents = fs.readFileSync(fullPath, "utf8");
		const { data } = matter(fileContents);
		return { slug, ...(data as Omit<PostMeta, "slug">) };
	});

	return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string) {
	const fullPath = path.join(postsDirectory, `${slug}.md`);
	const fileContents = fs.readFileSync(fullPath, "utf8");
	const { data, content } = matter(fileContents);

	const processedContent = await unified().use(remarkParse).use(remarkRehype).use(rehypeHighlight).use(rehypeStringify).process(content);

	const contentHtml = processedContent.toString();

	return {
		slug,
		contentHtml,
		...(data as Omit<PostMeta, "slug">)
	};
}

export function getAllSlugs(): string[] {
	if (!fs.existsSync(postsDirectory)) {
		return [];
	}
	return fs.readdirSync(postsDirectory).map((f) => f.replace(/\.md$/, ""));
}
