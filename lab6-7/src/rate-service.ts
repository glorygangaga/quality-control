
import type { RateProvider } from "./rate-provider.js";

export class RateService implements RateProvider {
  public readonly baseUrl: string;

  constructor(baseUrl: string) {
    if (typeof baseUrl !== "string") {
      throw new TypeError("baseUrl must be a string");
    }

    if (!baseUrl.trim()) {
      throw new TypeError("baseUrl must not be empty");
    }

    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  async getRate(currencyCode: string): Promise<number> {
    if (typeof currencyCode !== "string") {
      throw new TypeError("currencyCode must be a string");
    }

    if (!currencyCode.trim()) {
      throw new TypeError("currencyCode must not be empty");
    }

    const response = await fetch(
      `${this.baseUrl}/rates/${encodeURIComponent(currencyCode)}`,
      { signal: AbortSignal.timeout(5000) }
    );

    if (response.status === 404) {
      throw new Error(`Currency not found: ${currencyCode}`);
    }

    if (!response.ok) {
      throw new Error(`Rate service error: ${response.status}`);
    }

    const body: unknown = await response.json();

    if (typeof body !== "object" || body === null || !("rate" in body) || typeof body.rate !== "number" || !Number.isFinite(body.rate) || body.rate <= 0) {
      throw new Error("Invalid rate response");
    }

    return body.rate;
  }

  async getSupportedCurrencies(): Promise<string[]> {
    const response = await fetch(
      `${this.baseUrl}/currencies`,
      { signal: AbortSignal.timeout(5000) }
    );

    if (!response.ok) {
      throw new Error(`Rate service error: ${response.status}`);
    }

    const body: unknown = await response.json();

    if (
      !Array.isArray(body) ||
      !body.every(
        (item): item is string => typeof item === "string"
      )
    ) {
      throw new Error("Invalid currencies response");
    }

    return body;
  }
}
