import PelicanBicycle from "@/components/PelicanBicycle";
import Link from "next/link";

export default function PelicanPage() {
  return (
    <div className="flex min-h-screen flex-col items-center py-16 px-4 bg-zinc-50 dark:bg-[#020617]">
      <div className="w-full max-w-5xl mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-2">
            The Pelican Express
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            A majestic pure SVG animation driven by React standard requestAnimationFrame with Inverse Kinematics.
          </p>
        </div>
        <Link 
          href="/" 
          className="px-4 py-2 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
        >
          Back Home
        </Link>
      </div>

      <div className="w-full">
        <PelicanBicycle />
      </div>
    </div>
  );
}
