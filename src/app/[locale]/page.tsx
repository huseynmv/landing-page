import Image from "next/image";
import heroImg from "@/assets/heroImg.jpg";
import HeroSlider from "@/components/HeroSlider";
import TeamSlider from "@/components/Team";
import Testimonials from "@/components/Testimonials";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: "en" | "ar" }>;
}) {

  return (
    <>
      <section className="relative h-screen overflow-hidden">
        <Image
          src={heroImg}
          alt="Background"
          fill
          priority
          className="object-cover saturate-0"
        />
        <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(271.47deg,rgba(75,38,21,0.28)_1.2%,rgba(75,38,21,0.68)_86.38%)]" />
        <HeroSlider />
      </section>

      <section>
        <TeamSlider />
      </section>

      <section>
        <Testimonials />
      </section>
    </>
  );
}
