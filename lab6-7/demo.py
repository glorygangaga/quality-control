"""Демонстрация: PaymentSystem использует MOCK (Mountebank) для курсов валют."""
from rate_service import RateService
from payment_system import PaymentSystem
from consts import MOCK_RATE_SERVICE_URL


def main():
    print(f"MOCK rate service: {MOCK_RATE_SERVICE_URL}")
    rate_service = RateService(MOCK_RATE_SERVICE_URL)

    print("\nВалюты из MOCK:")
    print(" ", rate_service.get_supported_currencies())

    print("\nКурсы из MOCK:")
    for code in ["USD", "EUR", "GBP", "JPY"]:
        print(f"  {code}: {rate_service.get_rate(code)}")

    ps = PaymentSystem(initial_balance=100, rate_service=rate_service,
                       base_currency="USD")
    print(f"\nНачальный баланс: {ps.check_balance()} USD")

    print("\nБаланс в разных валютах (через MOCK):")
    for code in ["USD", "EUR", "GBP", "JPY"]:
        print(f"  {ps.check_balance_in(code):.2f} {code}")

    print("\nОплата 50 EUR (через MOCK):")
    ok = ps.make_payment_in(50, "EUR")
    print(f"  Успех: {ok}, статус: {ps.get_status()}, баланс: {ps.balance:.2f} USD")

    print("\nОплата 1000 EUR (недостаточно средств):")
    ok = ps.make_payment_in(1000, "EUR")
    print(f"  Успех: {ok}, статус: {ps.get_status()}, баланс: {ps.balance:.2f} USD")

    print("\nНеизвестная валюта (ожидаем ошибку):")
    try:
        rate_service.get_rate("XXX")
    except ValueError as e:
        print(f"  ValueError: {e}")


if __name__ == "__main__":
    main()