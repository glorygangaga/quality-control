import unittest
from unittest.mock import MagicMock, patch

from payment_system import PaymentSystem
from rate_service import RateService


class TestRateService(unittest.TestCase):
    def setUp(self):
        self.service = RateService("http://localhost:4545")

    def test_init_invalid_type(self):
        with self.assertRaises(TypeError):
            RateService(123)

    @patch("rate_service.requests.get")
    def test_get_rate_success(self, mock_get):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"code": "USD", "rate": 70.5}
        mock_get.return_value = mock_response

        self.assertEqual(self.service.get_rate("USD"), 70.5)
        mock_get.assert_called_once_with("http://localhost:4545/rates/USD", timeout=5)

    @patch("rate_service.requests.get")
    def test_get_rate_not_found(self, mock_get):
        mock_response = MagicMock()
        mock_response.status_code = 404
        mock_get.return_value = mock_response

        with self.assertRaises(ValueError):
            self.service.get_rate("XXX")

    @patch("rate_service.requests.get")
    def test_get_supported_currencies(self, mock_get):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = ["USD", "EUR"]
        mock_get.return_value = mock_response

        self.assertEqual(self.service.get_supported_currencies(), ["USD", "EUR"])

    def test_get_rate_invalid_type(self):
        with self.assertRaises(TypeError):
            self.service.get_rate(123)


class TestPaymentSystemBase(unittest.TestCase):
    """Тесты методов, не зависящих от rate_service."""

    def setUp(self):
        self.rate_service = MagicMock()
        self.ps = PaymentSystem(initial_balance=100, rate_service=self.rate_service)

    def test_check_balance(self):
        self.assertEqual(self.ps.check_balance(), 100)

    def test_make_payment_success(self):
        self.assertTrue(self.ps.make_payment(50))
        self.assertEqual(self.ps.balance, 47.5)
        self.assertEqual(self.ps.get_status(), "Success")

    def test_make_payment_insufficient(self):
        self.assertFalse(self.ps.make_payment(150))
        self.assertEqual(self.ps.balance, 100)
        self.assertEqual(self.ps.get_status(), "Insufficient funds")

    def test_make_payment_all_funds(self):
        self.assertTrue(self.ps.make_payment(100 / 1.05))
        self.assertAlmostEqual(self.ps.balance, 0, places=6)

    def test_make_payment_invalid_type(self):
        for bad in ["50", {"a": 1}, [50]]:
            with self.subTest(bad=bad):
                with self.assertRaises(TypeError):
                    self.ps.make_payment(bad)

    def test_make_payment_negative(self):
        with self.assertRaises(ValueError):
            self.ps.make_payment(-1)

    def test_add_funds(self):
        self.ps.add_funds(50)
        self.assertEqual(self.ps.balance, 150)

    def test_add_funds_invalid_type(self):
        with self.assertRaises(TypeError):
            self.ps.add_funds("50")

    def test_add_funds_negative(self):
        with self.assertRaises(ValueError):
            self.ps.add_funds(-1)

    def test_set_commission_rate_positive(self):
        self.ps.set_commission_rate(0.1)
        self.assertEqual(self.ps.commission_rate, 0.1)

    def test_set_commission_rate_zero(self):
        self.ps.set_commission_rate(0)
        self.assertEqual(self.ps.commission_rate, 0)

    def test_set_commission_rate_negative(self):
        self.ps.set_commission_rate(-0.1)
        self.assertEqual(self.ps.commission_rate, 0)
        self.assertEqual(self.ps.get_status(), "Negative commission")

    def test_set_commission_rate_invalid_type(self):
        with self.assertRaises(TypeError):
            self.ps.set_commission_rate("0.1")

    def test_get_status_initial(self):
        self.assertIsNone(self.ps.get_status())

    def test_initial_balance_invalid_type(self):
        with self.assertRaises(TypeError):
            PaymentSystem("100", MagicMock())

    def test_initial_balance_negative(self):
        with self.assertRaises(ValueError):
            PaymentSystem(-1, MagicMock())

    def test_base_currency_invalid_type(self):
        with self.assertRaises(TypeError):
            PaymentSystem(100, MagicMock(), base_currency=123)


class TestPaymentSystemWithRates(unittest.TestCase):
    """Тесты методов, использующих rate_service (MOCK)."""

    def setUp(self):
        self.rate_service = MagicMock()
        self.rate_service.get_rate.side_effect = lambda code: {
            "USD": 70.5, "EUR": 80.2, "GBP": 90.8
        }[code]
        self.ps = PaymentSystem(initial_balance=100, rate_service=self.rate_service,
                                base_currency="USD")

    def test_check_balance_in_same_currency(self):
        self.assertEqual(self.ps.check_balance_in("USD"), 100)
        self.rate_service.get_rate.assert_not_called()

    def test_check_balance_in_other_currency(self):
        result = self.ps.check_balance_in("EUR")
        self.assertAlmostEqual(result, 100 * (70.5 / 80.2), places=6)
        self.assertEqual(self.rate_service.get_rate.call_count, 2)

    def test_check_balance_in_invalid_type(self):
        with self.assertRaises(TypeError):
            self.ps.check_balance_in(123)

    def test_make_payment_in_same_currency(self):
        self.assertTrue(self.ps.make_payment_in(50, "USD"))
        self.assertEqual(self.ps.balance, 47.5)

    def test_make_payment_in_other_currency(self):
        # 50 EUR -> USD: 50 * (80.2 / 70.5) ≈ 56.88 USD
        self.assertTrue(self.ps.make_payment_in(50, "EUR"))
        expected = 100 - 50 * (80.2 / 70.5) * 1.05
        self.assertAlmostEqual(self.ps.balance, expected, places=6)

    def test_make_payment_in_insufficient(self):
        self.assertFalse(self.ps.make_payment_in(1000, "EUR"))
        self.assertEqual(self.ps.balance, 100)

    def test_make_payment_in_invalid_type(self):
        with self.assertRaises(TypeError):
            self.ps.make_payment_in("50", "EUR")

    def test_make_payment_in_negative(self):
        with self.assertRaises(ValueError):
            self.ps.make_payment_in(-1, "EUR")

    def test_make_payment_in_unknown_currency(self):
        self.rate_service.get_rate.side_effect = ValueError("Currency not found")
        with self.assertRaises(ValueError):
            self.ps.make_payment_in(50, "XXX")

    def test_set_base_currency(self):
        self.ps.set_base_currency("EUR")
        self.assertEqual(self.ps.base_currency, "EUR")

    def test_set_base_currency_invalid_type(self):
        with self.assertRaises(TypeError):
            self.ps.set_base_currency(123)


if __name__ == "__main__":
    unittest.main()