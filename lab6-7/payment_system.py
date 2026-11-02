class PaymentSystem:
    def __init__(self, initial_balance, rate_service, base_currency="USD"):
        if not isinstance(initial_balance, (int, float)):
            raise TypeError("Initial balance must be a number")
        if initial_balance < 0:
            raise ValueError("Initial balance cannot be negative")
        if not isinstance(base_currency, str):
            raise TypeError("Base currency must be a string")

        self.balance = initial_balance
        self.commission_rate = 0.05
        self.status = None
        self.base_currency = base_currency
        self.rate_service = rate_service

    def check_balance(self):
        return self.balance

    def make_payment(self, amount):
        if not isinstance(amount, (int, float)):
            raise TypeError("Amount must be a number")
        if amount <= 0:
            raise ValueError("Amount must be positive")

        total_amount = amount * (1 + self.commission_rate)
        if self.balance >= total_amount:
            self.balance -= total_amount
            self.status = "Success"
            return True
        self.status = "Insufficient funds"
        return False

    def add_funds(self, amount):
        if not isinstance(amount, (int, float)):
            raise TypeError("Amount must be a number")
        if amount <= 0:
            raise ValueError("Amount must be positive")
        self.balance += amount

    def set_commission_rate(self, rate):
        if not isinstance(rate, (int, float)):
            raise TypeError("Rate must be a number")
        if rate < 0:
            self.status = "Negative commission"
            self.commission_rate = 0
        else:
            self.commission_rate = rate

    def get_status(self):
        return self.status

    def _convert(self, amount, from_currency, to_currency):
        """Перевести amount из from_currency в to_currency."""
        if from_currency == to_currency:
            return amount
        from_rate = self.rate_service.get_rate(from_currency)
        to_rate = self.rate_service.get_rate(to_currency)
        return amount * (from_rate / to_rate)

    def _to_base(self, amount, currency):
        """Перевести сумму из валюты currency в базовую валюту."""
        return self._convert(amount, currency, self.base_currency)

    def _from_base(self, amount, currency):
        """Перевести сумму из базовой валюты в валюту currency."""
        return self._convert(amount, self.base_currency, currency)

    def check_balance_in(self, currency):
        if not isinstance(currency, str):
            raise TypeError("Currency must be a string")
        return self._from_base(self.balance, currency)

    def make_payment_in(self, amount, currency):
        if not isinstance(amount, (int, float)):
            raise TypeError("Amount must be a number")
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if not isinstance(currency, str):
            raise TypeError("Currency must be a string")
        amount_in_base = self._to_base(amount, currency)
        return self.make_payment(amount_in_base)

    def set_base_currency(self, currency):
        if not isinstance(currency, str):
            raise TypeError("Currency must be a string")
        self.base_currency = currency