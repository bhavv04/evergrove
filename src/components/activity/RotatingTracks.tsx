// @/components/activity/RotatingTracks.tsx
"use client";

import TracksActivityCard from "@/components/activity/TracksActivityCard";
import { useRotatingTracks } from "@/lib/activity/useRotatingTracks";
import tracksData from "@/lib/activity/tracks.json";

export default function RotatingTracks() {
	const tracks = useRotatingTracks(tracksData, 6);
	return <TracksActivityCard tracks={tracks} />;
}
