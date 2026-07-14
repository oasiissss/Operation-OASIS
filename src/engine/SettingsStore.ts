export interface GameSettings {
  masterVolume: number;
  musicVolume: number;
  effectsVolume: number;
  reducedMotion: boolean;
}

const STORAGE_KEY = "operation-oasis-settings";

const defaults: GameSettings = {
  masterVolume: 0.8,
  musicVolume: 0.45,
  effectsVolume: 0.8,
  reducedMotion: false
};

export class SettingsStore {
  load(): GameSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaults, ...JSON.parse(saved) } : { ...defaults };
    } catch {
      return { ...defaults };
    }
  }

  save(settings: GameSettings): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }
}
