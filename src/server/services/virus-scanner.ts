/* eslint-disable class-methods-use-this */
// temp solution for placeholder
import { env } from "@env/server.mjs";

class VirusScanner {
  async scanFile(file: File): Promise<boolean> {
    return Promise.resolve(true);
  }

  async scanUrl(url: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var virusScanner: VirusScanner | undefined;
}

export const virusScanner = global.virusScanner || new VirusScanner();

if (env.NODE_ENV !== "production") {
  global.virusScanner = virusScanner;
}
