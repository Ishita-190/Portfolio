import CoverPage from "@/components/pages/CoverPage";
import MusicToggle from "@/components/music/MusicToggle";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <MusicToggle />
      <CoverPage />
    </main>
  );
}
