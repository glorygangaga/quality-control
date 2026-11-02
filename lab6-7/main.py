from flask import Flask, jsonify, request
from rate_service import RateService
from currency_converter import CurrencyConverter
from api_handler import APIHandler
from consts import MOCK_RATE_SERVICE_URL

app = Flask(__name__)

rate_service = RateService(MOCK_RATE_SERVICE_URL)
currency_converter = CurrencyConverter(rate_service)
api_handler = APIHandler(currency_converter)


@app.route('/currencies', methods=['GET'])
def get_currencies():
    return jsonify(rate_service.get_supported_currencies())


@app.route('/convert', methods=['GET'])
def convert_currency():
    from_currency = request.args.get('from')
    to_currency = request.args.get('to')
    amount = float(request.args.get('amount', 1.0))

    converted_amount = currency_converter.convert_currency(
        from_currency, to_currency, amount
    )

    return jsonify({
        "from": from_currency,
        "to": to_currency,
        "amount": amount,
        "converted_amount": converted_amount
    })


if __name__ == '__main__':
    app.run(debug=True)