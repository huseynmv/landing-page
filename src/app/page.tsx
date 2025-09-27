
//       {/* Custom CSS for animations */}
//       {/* <style jsx>{`
//         @keyframes slide-in-left {
//           from {
//             opacity: 0;
//             transform: translateX(-30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }

//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }

//         .animate-slide-in-left {
//           animation: slide-in-left 0.8s ease-out;
//         }

//         .animate-fade-in {
//           animation: fade-in 0.8s ease-out;
//         }
//       `}</style> */}
//     </section>
//   );
// }

import Image from "next/image";
import heroImg from "@/assets/heroImg.jpg";
import HeroSlider from "@/components/HeroSlider";
import Team from "@/components/Team";
import TeamSlider from "@/components/Team";

export default function HomePage() {

  return (
    <>
      <section className="-mt-16 relative h-screen overflow-hidden">
        <Image src={heroImg} alt="Background" fill priority className="object-cover saturate-0" />
        <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(271.47deg,rgba(75,38,21,0.28)_1.2%,rgba(75,38,21,0.68)_86.38%)]" />
        <HeroSlider />
      </section>
      <section className="" >
        <TeamSlider />
      </section>
    </>
  );
}
