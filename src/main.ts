import "./style.css";
import { Game } from "./engine/Game";

const root = document.querySelector<HTMLDivElement>("#game-root");

if (!root) {
  throw new Error("Game root ontbreekt.");
}

const game = new Game(root);

game.start().catch((error: unknown) => {
  console.error("Operation OASIS kon niet starten:", error);
  root.textContent = "Operation OASIS kon niet starten.";
});
