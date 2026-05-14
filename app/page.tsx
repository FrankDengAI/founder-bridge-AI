import { WebNav } from "@/components/WebNav";
import { WebHero } from "@/components/WebHero";
import { WebBento } from "@/components/WebBento";
import { WebPulse } from "@/components/WebPulse";
import { WebCta } from "@/components/WebCta";

export default function HomePage() {
  return (
    <>
      <WebNav />
      <main>
        <WebHero />
        <WebBento />
        <WebPulse />
        <WebCta />
      </main>
    </>
  );
}
