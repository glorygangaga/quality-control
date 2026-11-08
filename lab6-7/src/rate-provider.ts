export interface RateProvider {
  getRate(currencyCode: string): Promise<number>;

  getSupportedCurrencies(): Promise<string[]>;
}
