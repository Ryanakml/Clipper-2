import LandingPage from "~/components/landing/landing-page";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Find the moments worth sharing",
  description:
    "Upload a long video and turn its best moments into sharp vertical clips for Shorts, Reels, and TikTok.",
};

export default function LandingPageRoute() {
  return <LandingPage />;
}
