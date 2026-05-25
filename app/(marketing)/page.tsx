import { WebNav } from "@/components/WebNav";
import { WebHero } from "@/components/WebHero";
import { WebBento } from "@/components/WebBento";
import { WebShowcaseJumpStrip } from "@/components/WebShowcaseJumpStrip";
import { WebMatchPreview } from "@/components/WebMatchPreview";
import { WebPulse } from "@/components/WebPulse";
import { WebMarket } from "@/components/WebMarket";
import { WebStories } from "@/components/WebStories";
import { WebRoadmap } from "@/components/WebRoadmap";
import { WebCta } from "@/components/WebCta";

export default function HomePage() {
  return (
    <>
      <WebNav />
      <main>
        <WebHero />
        <WebBento />
        <WebShowcaseJumpStrip />
        <WebMatchPreview />
        <WebPulse />
        <WebMarket />
        <WebStories />
        <WebRoadmap />
        <WebCta />
      </main>
    </>
  );
}
