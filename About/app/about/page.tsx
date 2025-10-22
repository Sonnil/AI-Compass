/* app/about/page.tsx (Next.js App Router example) */
import dynamic from "next/dynamic";

const AboutAICompass = dynamic(() => import("@/src/components/AboutAICompass"), { ssr: false });

export default function Page() {
  return <AboutAICompass />;
}
