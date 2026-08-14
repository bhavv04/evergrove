import HeroSection from "@/views/Hero";
import ProjectsView from "@/views/Projects";
import ResearchView from "@/views/Research";
import Skills from "@/views/Skills";
import Activity from "@/views/Activity";
import Footer from "@/views/Footer";

export default function Home() {
	return (
		<div className="pb-20 xl:pb-0">
			<HeroSection />
			<div className="" />
			<Skills />
			<div className="my-12" />
			<ProjectsView />
			<div className="my-12" />
			<ResearchView />
			<div className="my-12" />
			<Activity />
			<div className="my-24" />
			<Footer />
		</div>
	);
}
