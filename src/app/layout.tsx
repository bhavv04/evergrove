import "./globals.css";
import { getSearchIndex } from "@/lib/search/getSearchIndex";
import { RootLayoutClient } from "@/components/layout/RootLayoutClient";

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
	const searchIndex = getSearchIndex();

	return (
		<html lang="en">
			<head></head>
			<body className="relative 2xl:zoom-[1.1]">
				<RootLayoutClient searchIndex={searchIndex}>{children}</RootLayoutClient>
			</body>
		</html>
	);
}
