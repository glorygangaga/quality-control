# Лабораторные работы №6 и №7

Проект реализован на Node.js и TypeScript.

## Лабораторная №6

Тестируемый класс: PaymentSystem.

Класс содержит бизнес-логику платежной системы:

- Проверка баланса.
- Выполнение платежей.
- Пополнение баланса.
- Изменение комиссии.
- Изменение базовой валюты.
- Конвертация валют.
- Проверка статуса операции.

Для тестирования используется FixedRateProvider,
возвращающий фиксированные курсы валют.

Инструменты:

- Vitest
- V8 Coverage

Запуск:
npm test
npm run coverage

## Лабораторная №7

Используется Mountebank.

MOCK-сервис предоставляет HTTP API:

- GET /currencies
- GET /rates/USD
- GET /rates/EUR
- GET /rates/GBP
- GET /rates/JPY

Неизвестная валюта возвращает HTTP 404.

Запуск:
docker compose up -d

Проверка:
curl http://localhost:4545/currencies

Демонстрация:
npm run demo

Интеграционные тесты:
npm run test -- tests/rate-service.test.ts
