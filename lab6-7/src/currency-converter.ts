
import type { RateProvider } from "./rate-provider.js";

export class CurrencyConverter {
  constructor(
    private readonly rateProvider: RateProvider
  ) {}

  async convertCurrency(from: string, to: string, amount: number): Promise<number> {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new RangeError(
        "Amount must be a non-negative finite number"
      );
    }

    if (from === to) {
      return amount;
    }

    const [fromRate, toRate] = await Promise.all([
      this.rateProvider.getRate(from),
      this.rateProvider.getRate(to)
    ]);

    return amount * (fromRate / toRate);
  }
}
