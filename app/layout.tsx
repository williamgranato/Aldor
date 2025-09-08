import "./globals.css";
import { GameProvider } from "../context/GameProvider";
import HUD from "../components/HUD";
import SaveControls from "../components/SaveControls";
import NavTabs from "../components/NavTabs";

export const metadata = { title: "Aldor (Client Only)", description: "Singleplayer idle RPG" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <GameProvider>
          <HUD />
          <div className="container"><SaveControls /></div>
          <NavTabs />
          <main className="container my-4">{children}</main>
        </GameProvider>
      </body>
    </html>
  );
}
