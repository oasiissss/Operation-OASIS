export const GAME_WIDTH = 1920;
export const GAME_HEIGHT = 1080;

export const gameConfig = {
  background: 0x090b0d,
  antialias: true,
  resolution: Math.min(window.devicePixelRatio || 1, 2)
} as const;
