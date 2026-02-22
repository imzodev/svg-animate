import StepSequence, { StepItem } from "@/components/StepSequence";
import BarChart, { BarData } from "@/components/BarChart";
import StackedLayers, { LayerData } from "@/components/StackedLayers";
import InfiniteProcessLoop, { ProcessPhase } from "@/components/InfiniteProcessLoop";

const sampleSteps: StepItem[] = [
  {
    id: "step1",
    label: "Inicio",
    iconPath: "M13 10V3L4 14h7v7l9-11h-7z", // Zap icon
  },
  {
    id: "step2",
    label: "Proceso",
    iconPath: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 4-8 5-8-5", // Mail/Message icon
  },
  {
    id: "step3",
    label: "Validación",
    iconPath: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z", // Check icon
  },
  {
    id: "step4",
    label: "Finalización",
    iconPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z", // Check circle
  },
  {
    id: "step5",
    label: "Fin",
    iconPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z", // Check circle
  }
];

const sampleData: BarData[] = [
  { label: "Lit", value: 320 },
  { label: "Vue", value: 180 },
  { label: "Angular", value: 210 },
  { label: "Svelte", value: 140 },
  { label: "Next.js", value: 450 },
];

const stackedLayersData: LayerData[] = [
  {
    id: "layer1",
    number: "01",
    label: "DATA INGESTION",
    description: "Recopilación de eventos en\ntiempo real desde fuentes externas",
    color: "#0ea5e9", // sky
    sideColor: "#082f49" 
  },
  {
    id: "layer2",
    number: "02",
    label: "PROCESSING",
    description: "Limpieza, normalización y\nenriquecimiento de datos",
    color: "#8b5cf6", // violet
    sideColor: "#2e1065"
  },
  {
    id: "layer3",
    number: "03",
    label: "STORAGE",
    description: "Almacenamiento estructurado\nen bases de datos vectoriales",
    color: "#f43f5e", // rose
    sideColor: "#881337"
  },
  {
    id: "layer4",
    number: "04",
    label: "AI ANALYSIS",
    description: "Inferencia y análisis\ncon modelos predictivos",
    color: "#10b981", // emerald
    sideColor: "#064e3b"
  }
];

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full flex flex-col items-center gap-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Progress Tracking & Charts
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Beautiful, SVG-powered step sequence and bar chart animations.
          </p>
        </div>

        <InfiniteProcessLoop />
        <StepSequence steps={sampleSteps} />
        <BarChart data={sampleData} />
        <StackedLayers data={stackedLayersData} />
      </main>
    </div>
  );
}
