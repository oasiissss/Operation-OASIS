
export class AssetManager {
  private loaded = false;
  async preload(): Promise<void> {
    // Placeholder: assets will be registered here in future builds.
    await Promise.resolve();
    this.loaded = true;
  }
  get isReady(): boolean {
    return this.loaded;
  }
}
