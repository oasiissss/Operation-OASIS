export class AudioManager {
  private masterVolume = 0.8;

  setMasterVolume(value: number): void {
    this.masterVolume = Math.max(0, Math.min(1, value));
  }

  getMasterVolume(): number {
    return this.masterVolume;
  }
}
