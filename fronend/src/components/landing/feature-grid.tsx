import { Settings, Target, Timer } from "lucide-react";

const FEATURES = [
  {
    icon: <Settings className="h-5 w-5" />,
    toneClass: "bg-primary/10 text-primary dark:bg-primary/20",
    title: "Automatic",
    desc: "Upload your podcast and let AI create engaging highlights for social media automatically, no hassle.",
  },
  {
    icon: <Target className="h-5 w-5" />,
    toneClass:
      "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-100",
    title: "Accurate",
    desc: "Our AI technology analyzes conversation context to get the most relevant and viral clip segments.",
  },
  {
    icon: <Timer className="h-5 w-5" />,
    toneClass:
      "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-100",
    title: "Fast",
    desc: "Super fast rendering. Save hours of editing in just minutes.",
  },
];

export default function FeatureGrid() {
  return (
    <div className="border-border grid w-full max-w-5xl grid-cols-1 gap-x-12 gap-y-12 border-t pt-20 md:grid-cols-3">
      {FEATURES.map((feature) => (
        <div
          key={feature.title}
          className="group flex flex-col items-center px-4 text-center"
        >
          <div
            className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${feature.toneClass}`}
          >
            {feature.icon}
          </div>
          <h3 className="text-foreground mb-2 text-xl font-semibold">
            {feature.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {feature.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
