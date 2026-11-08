
import type { Request, Response } from "express";
import { CurrencyConverter } from "./currency-converter.js";

export class APIHandler {
  constructor(
    private readonly converter: CurrencyConverter
  ) {}

  async convert(req: Request, res: Response): Promise<void> {
    const from = String(req.query.from ?? "");
    const to = String(req.query.to ?? "");
    const amount = Number(req.query.amount ?? 1);

    if (!from || !to || !Number.isFinite(amount)) {
      res.status(400).json({
        error: "from, to and valid amount are required"
      });
      return;
    }

    try {
      const convertedAmount =
        await this.converter.convertCurrency(
          from,
          to,
          amount
        );

      res.json({
        from,
        to,
        amount,
        converted_amount: convertedAmount
      });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error
          ? error.message
          : "Conversion failed"
      });
    }
  }
}
