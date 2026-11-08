
import { describe, expect, it } from "vitest";

import { RateService } from "../src/rate-service.js";
import { MOCK_RATE_SERVICE_URL } from "../src/constants.js";

describe("RateService — Mountebank integration", () => {
  const service = new RateService(MOCK_RATE_SERVICE_URL);

  it("получает курс USD", async () => {
    await expect(
      service.getRate("USD")
    ).resolves.toBe(70.5);
  });

  it("получает курс EUR", async () => {
    await expect(
      service.getRate("EUR")
    ).resolves.toBe(80.2);
  });

  it("получает список валют", async () => {
    const currencies =
      await service.getSupportedCurrencies();

    expect(currencies).toContain("USD");
    expect(currencies).toContain("EUR");
    expect(currencies).toContain("GBP");
    expect(currencies).toContain("JPY");
  });

  it("возвращает ошибку для неизвестной валюты", async () => {
    await expect(
      service.getRate("XXX")
    ).rejects.toThrow("Currency not found");
  });
});
