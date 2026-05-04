import LandingPage from "~/components/landing/landing-page";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "ClipperAI - Turn One Long Video Into Viral Clips",
  description:
    "AI-powered video clipping tool. Upload a long YouTube video, Zoom recording, or podcast — AI finds the best moments and creates vertical short clips.",
};

export default function LandingPageRoute() {
  return <LandingPage />;
}
