import { RateService } from "./rate-service.js";
import { PaymentSystem } from "./payment-system.js";
import { MOCK_RATE_SERVICE_URL } from "./constants.js";

async function main(): Promise<void> {
  console.log(`MOCK rate service: ${MOCK_RATE_SERVICE_URL}`);

  const rateService = new RateService(
    MOCK_RATE_SERVICE_URL
  );

  console.log("\nВалюты из MOCK:");
  console.log(
    await rateService.getSupportedCurrencies()
  );

  console.log("\nКурсы из MOCK:");

  for (const code of ["USD", "EUR", "GBP", "JPY"]) {
    console.log(
      `${code}: ${await rateService.getRate(code)}`
    );
  }

  const ps = new PaymentSystem(
    100,
    rateService,
    "USD"
  );

  console.log(
    `\nНачальный баланс: ${ps.getBalance()} USD`
  );

  console.log("\nБаланс в разных валютах:");

  for (const code of ["USD", "EUR", "GBP", "JPY"]) {
    const balance = await ps.checkBalanceIn(code);

    console.log(
      `${balance.toFixed(2)} ${code}`
    );
  }

  console.log("\nОплата 50 EUR:");

  const success = await ps.makePaymentIn(50, "EUR");

  console.log({
    success,
    status: ps.getStatus(),
    balance: ps.balance
  });

  console.log("\nОплата 1000 EUR:");

  const failed = await ps.makePaymentIn(1000, "EUR");

  console.log({
    success: failed,
    status: ps.getStatus(),
    balance: ps.balance
  });

  console.log("\nНеизвестная валюта:");

  try {
    await rateService.getRate("XXX");
  } catch (error) {
    console.log(
      error instanceof Error
        ? error.message
        : error
    );
  }
}

main().catch(console.error);
