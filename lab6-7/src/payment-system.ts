import type {RateProvider} from './rate-provider.js';
import { currencies } from './constants.js';

export type PaymentStatus = | "Success"
| "Insufficient funds"
| "Negative commission"
| null;

export class PaymentSystem {
  public balance: number;
  public commissionRate = 0.05;
  public status: PaymentStatus = null;
  public baseCurrency: string;

  private readonly rateProvider: RateProvider;

  constructor(initialBalance: number, rateProvider: RateProvider, baseCurrency = "USD") {
    this.checkNumberIsValid(initialBalance);
    this.checkCurrencyIsValid(baseCurrency);

    this.balance = initialBalance;
    this.baseCurrency = baseCurrency;
    this.rateProvider = rateProvider;
  }

  public getBalance(): number {
    return this.balance;
  }

  public getStatus(): PaymentStatus {
    return this.status;
  }

  setBaseCurrency(currency: string): void {
    this.checkCurrencyIsValid(currency);

    this.baseCurrency = currency;
  }


  public makePayment(amount: number): boolean {
    this.checkNumberIsValid(amount);

    const total = amount + amount * this.commissionRate;

    if (total > this.balance) {
      this.status = "Insufficient funds";
      return false;
    }

    this.balance -= total;
    this.status = 'Success';

    return true;
  }

  public addFunds(amount: number) {
    this.checkNumberIsValid(amount);

    this.balance += amount;
  }

  public setCommissionRate(rate: number): void {
    if (typeof rate !== "number" || !Number.isFinite(rate)) {
      throw new TypeError("Rate must be a finite number");
    }

    if (rate < 0) {
      this.status = "Negative commission";
      this.commissionRate = 0;
      return;
    }

    this.commissionRate = rate;
  }

  public async checkBalanceIn(currency: string): Promise<number> {
    this.checkCurrencyIsValid(currency);

    return this.convert(
      this.balance,
      this.baseCurrency,
      currency
    );
  }

  public async makePaymentIn(amount: number, currency: string): Promise<boolean> {
    this.checkNumberIsValid(amount);
    this.checkCurrencyIsValid(currency);

    const amountInBase = await this.convert(
      amount,
      currency,
      this.baseCurrency
    );

    return this.makePayment(amountInBase);
  }

  private async convert(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const [fromRate, toRate] = await Promise.all([
      this.rateProvider.getRate(fromCurrency),
      this.rateProvider.getRate(toCurrency)
    ]);

    return amount * (fromRate / toRate);
  }

  private checkCurrencyIsValid(currency: string) {
    if (typeof currency !== "string" ||!currency.trim()) {
      throw new TypeError("Currency must be a non-empty string");
    }

    const isValidCurency = currencies.some(c => c.toLowerCase() === currency.toLowerCase());
    if (!isValidCurency) {
      throw new TypeError("Currency not found");
    }
  }

  private checkNumberIsValid(value: number) {
    if (value <= 0) {
      throw new RangeError("Initial balance cannot be negative");
    }
    if (!Number.isFinite(value)) {
      throw new TypeError("Initial balance must be a finite number");
    }
  }

}