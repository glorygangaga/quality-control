
import {
  describe,
  expect,
  it,
  beforeEach
} from "vitest";

import { PaymentSystem } from "../src/payment-system.js";
import type { RateProvider } from "../src/rate-provider.js";

class FixedRateProvider implements RateProvider {
  private readonly rates: Record<string, number> = {
    USD: 70.5,
    EUR: 80.2,
    GBP: 90.8,
    JPY: 0.48
  };

  async getRate(code: string): Promise<number> {
    const rate = this.rates[code];

    if (rate === undefined) {
      throw new Error(`Currency not found: ${code}`);
    }

    return rate;
  }

  async getSupportedCurrencies(): Promise<string[]> {
    return Object.keys(this.rates);
  }
}

describe("PaymentSystem", () => {
  let system: PaymentSystem;

  beforeEach(() => {
    system = new PaymentSystem(
      100,
      new FixedRateProvider(),
      "USD"
    );
  });

  it("создаёт объект с начальными значениями", () => {
    expect(system.balance).toBe(100);
    expect(system.commissionRate).toBe(0.05);
    expect(system.baseCurrency).toBe("USD");
    expect(system.getStatus()).toBeNull();
  });

  it("отклоняет некорректный начальный баланс", () => {
    expect(
      () => new PaymentSystem(
        NaN,
        new FixedRateProvider()
      )
    ).toThrow(TypeError);

    expect(
      () => new PaymentSystem(
        -1,
        new FixedRateProvider()
      )
    ).toThrow(RangeError);
  });

  it("отклоняет некорректную базовую валюту", () => {
    expect(
      () => new PaymentSystem(
        100,
        new FixedRateProvider(),
        ""
      )
    ).toThrow(TypeError);
  });

  it("возвращает баланс", () => {
    expect(system.getBalance()).toBe(100);
  });

  it("успешно проводит оплату с комиссией", () => {
    expect(system.makePayment(50)).toBe(true);
    expect(system.balance).toBeCloseTo(47.5);
    expect(system.getStatus()).toBe("Success");
  });

  it("отклоняет платёж при недостатке средств", () => {
    expect(system.makePayment(150)).toBe(false);
    expect(system.balance).toBe(100);
    expect(system.getStatus()).toBe("Insufficient funds");
  });

  it("позволяет потратить весь баланс с учётом комиссии", () => {
    expect(system.makePayment(100 / 1.05)).toBe(true);
    expect(system.balance).toBeCloseTo(0);
  });

  it("проверяет некорректные суммы платежа", () => {
    expect(
      () => system.makePayment("50" as unknown as number)
    ).toThrow(TypeError);

    expect(
      () => system.makePayment(Infinity)
    ).toThrow(TypeError);

    expect(
      () => system.makePayment(0)
    ).toThrow(RangeError);

    expect(
      () => system.makePayment(-1)
    ).toThrow(RangeError);
  });

  it("пополняет баланс", () => {
    system.addFunds(25);

    expect(system.balance).toBe(125);
  });

  it("проверяет сумму пополнения", () => {
    expect(
      () => system.addFunds("5" as unknown as number)
    ).toThrow(TypeError);

    expect(
      () => system.addFunds(-5)
    ).toThrow(RangeError);
  });

  it("изменяет комиссию", () => {
    system.setCommissionRate(0.1);

    expect(system.commissionRate).toBe(0.1);

    system.setCommissionRate(0);

    expect(system.commissionRate).toBe(0);
  });

  it("обрабатывает отрицательную комиссию", () => {
    system.setCommissionRate(-0.1);

    expect(system.commissionRate).toBe(0);
    expect(system.getStatus()).toBe("Negative commission");
  });

  it("проверяет тип комиссии", () => {
    expect(
      () => system.setCommissionRate(
        "0.1" as unknown as number
      )
    ).toThrow(TypeError);

    expect(
      () => system.setCommissionRate(NaN)
    ).toThrow(TypeError);
  });

  it("возвращает баланс в той же валюте", async () => {
    await expect(
      system.checkBalanceIn("USD")
    ).resolves.toBe(100);
  });

  it("конвертирует баланс в другую валюту", async () => {
    await expect(
      system.checkBalanceIn("EUR")
    ).resolves.toBeCloseTo(
      100 * (70.5 / 80.2)
    );
  });

  it("проверяет валюту баланса", async () => {
    await expect(
      system.checkBalanceIn("" as unknown as string)
    ).rejects.toThrow(TypeError);
  });

  it("проводит платёж в базовой валюте", async () => {
    await expect(
      system.makePaymentIn(50, "USD")
    ).resolves.toBe(true);

    expect(system.balance).toBeCloseTo(47.5);
  });

  it("конвертирует иностранную валюту при оплате", async () => {
    await expect(
      system.makePaymentIn(50, "EUR")
    ).resolves.toBe(true);

    expect(system.balance).toBeCloseTo(
      100 - 50 * (80.2 / 70.5) * 1.05
    );
  });

  it("отклоняет иностранный платёж при недостатке средств", async () => {
    await expect(
      system.makePaymentIn(1000, "EUR")
    ).resolves.toBe(false);

    expect(system.balance).toBe(100);
    expect(system.getStatus()).toBe("Insufficient funds");
  });

  it("проверяет аргументы иностранного платежа", async () => {
    await expect(
      system.makePaymentIn(
        "5" as unknown as number,
        "EUR"
      )
    ).rejects.toThrow(TypeError);

    await expect(
      system.makePaymentIn(-5, "EUR")
    ).rejects.toThrow(RangeError);

    await expect(
      system.makePaymentIn(5, "" as unknown as string)
    ).rejects.toThrow(TypeError);
  });

  it("обрабатывает неизвестную валюту", async () => {
    await expect(
      system.checkBalanceIn("XXX")
    ).rejects.toThrow("Currency not found");
  });

  it("изменяет базовую валюту", () => {
    system.setBaseCurrency("EUR");

    expect(system.baseCurrency).toBe("EUR");
  });

  it("проверяет базовую валюту", () => {
    expect(
      () => system.setBaseCurrency(
        "" as unknown as string
      )
    ).toThrow(TypeError);
  });
});
