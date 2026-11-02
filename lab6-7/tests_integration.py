import unittest

from payment_system import PaymentSystem
from rate_service import RateService
from consts import MOCK_RATE_SERVICE_URL


def _mountebank_is_up():
    import requests
    try:
        r = requests.get(f"{MOCK_RATE_SERVICE_URL}/rates/USD", timeout=1)
        return r.status_code == 200
    except Exception:
        return False


@unittest.skipUnless(_mountebank_is_up(), "Mountebank не запущен")
class TestWithRealMock(unittest.TestCase):
    def setUp(self):
        self.rate_service = RateService(MOCK_RATE_SERVICE_URL)
        self.ps = PaymentSystem(initial_balance=100, rate_service=self.rate_service,
                                base_currency="USD")

    def test_get_rate_from_mock(self):
        self.assertEqual(self.rate_service.get_rate("USD"), 70.5)
        self.assertEqual(self.rate_service.get_rate("EUR"), 80.2)

    def test_supported_currencies_from_mock(self):
        currencies = self.rate_service.get_supported_currencies()
        self.assertIn("USD", currencies)
        self.assertIn("EUR", currencies)

    def test_check_balance_in_eur_via_mock(self):
        result = self.ps.check_balance_in("EUR")
        self.assertAlmostEqual(result, 100 * (70.5 / 80.2), places=4)

    def test_make_payment_in_eur_via_mock(self):
        self.assertTrue(self.ps.make_payment_in(50, "EUR"))
        expected = 100 - 50 * (80.2 / 70.5) * 1.05
        self.assertAlmostEqual(self.ps.balance, expected, places=4)

    def test_unknown_currency_via_mock(self):
        with self.assertRaises(ValueError):
            self.rate_service.get_rate("XXX")


if __name__ == "__main__":
    unittest.main()