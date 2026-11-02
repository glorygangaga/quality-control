import requests


class RateService:
    def __init__(self, base_url):
        if not isinstance(base_url, str):
            raise TypeError("base_url must be a string")
        self.base_url = base_url.rstrip("/")

    def get_rate(self, currency_code):
        if not isinstance(currency_code, str):
            raise TypeError("currency_code must be a string")

        url = f"{self.base_url}/rates/{currency_code}"
        response = requests.get(url, timeout=5)

        if response.status_code == 404:
            raise ValueError(f"Currency not found: {currency_code}")
        response.raise_for_status()

        return response.json()["rate"]

    def get_supported_currencies(self):
        url = f"{self.base_url}/currencies"
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        return response.json()