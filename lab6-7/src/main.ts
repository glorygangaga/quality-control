
import express from "express";

import { RateService } from "./rate-service.js";
import { CurrencyConverter } from "./currency-converter.js";
import { APIHandler } from "./api-handler.js";

import {
  MOCK_RATE_SERVICE_URL,
  API_PORT
} from './constants.js';

const app = express();

const rateService = new RateService(
  MOCK_RATE_SERVICE_URL
);

const converter = new CurrencyConverter(rateService);
const apiHandler = new APIHandler(converter);

app.get("/currencies", async (_req, res) => {
  try {
    res.json(
      await rateService.getSupportedCurrencies()
    );
  } catch (error) {
    res.status(502).json({
      error: error instanceof Error
        ? error.message
        : "Rate service error"
    });
  }
});

app.get("/convert", (req, res) => {
  return apiHandler.convert(req, res);
});

app.listen(API_PORT, () => {
  console.log(
    `Currency API listening at http://localhost:${API_PORT}`
  );
});
