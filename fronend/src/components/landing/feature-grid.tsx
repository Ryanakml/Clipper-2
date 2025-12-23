import { Settings, Target, Timer } from "lucide-react";

const FEATURES = [
  {
    icon: <Settings className="h-5 w-5" />,
    toneClass: "bg-primary/10 text-primary dark:bg-primary/20",
    title: "Otomatis",
    desc: "Unggah podcast dan biarkan AI membuat highlight menarik untuk sosial media secara otomatis tanpa repot.",
  },
  {
    icon: <Target className="h-5 w-5" />,
    toneClass: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-100",
    title: "Akurat",
    desc: "Teknologi AI kami memproses konteks pembicaraan untuk mendapatkan potongan klip yang paling relevan dan viral.",
  },
  {
    icon: <Timer className="h-5 w-5" />,
    toneClass: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-100",
    title: "Cepat",
    desc: "Proses rendering super cepat. Hemat waktu editing berjam-jam menjadi hanya beberapa menit saja.",
  },
];

export default function FeatureGrid() {
  return (
    <div className="grid w-full max-w-5xl grid-cols-1 gap-x-12 gap-y-12 border-t border-border pt-20 md:grid-cols-3">
      {FEATURES.map((feature) => (
        <div key={feature.title} className="group flex flex-col items-center px-4 text-center">
          <div
            className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${feature.toneClass}`}
          >
            {feature.icon}
          </div>
          <h3 className="mb-2 text-xl font-semibold text-foreground">{feature.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
        </div>
      ))}
    </div>
  );
}
