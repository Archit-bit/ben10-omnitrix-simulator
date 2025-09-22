import OmnitrixDial from "@/components/dial/OmnitrixDial";

const aliens = [
  { id: "heatblast", name: "Heatblast", icon: "/aliens/heatblast.png" },
  { id: "fourarms", name: "Four Arms", icon: "/aliens/fourarms.png" },
  { id: "xlr8", name: "XLR8", icon: "/aliens/xlr8.png" },
  { id: "diamondhead", name: "Diamondhead", icon: "/aliens/diamondhead.png" },
  { id: "wildmutt", name: "Wildmutt", icon: "/aliens/wildmutt.png" },
  { id: "upgrade", name: "Upgrade", icon: "/aliens/upgrade.png" },
  { id: "ghostfreak", name: "Ghostfreak", icon: "/aliens/ghostfreak.png" },
];

export default function Page() {
  return (
    <main className="min-h-screen grid place-items-center relative">
      <div className="absolute inset-0 bg-carbon" />
      <section className="relative vignette grain">
        <OmnitrixDial
          aliens={aliens}
          onConfirm={(id) => console.log("Transform →", id)}
        />
      </section>
    </main>
  );
}
