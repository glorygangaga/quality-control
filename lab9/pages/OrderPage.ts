import { By, WebDriver } from "selenium-webdriver";
import { BasePage } from "./BasePage";

export class OrderPage extends BasePage {
  private readonly ORDER_BUTTON = By.xpath(
    "//form//button[contains(@class,'btn-default')]"
  );

  private readonly SUCCESS_MESSAGE =
    By.css(".alert.alert-success");

  constructor(driver: WebDriver, timeout = 10) {
    super(driver, timeout);
  }

  async orderProduct(): Promise<void> {
    await this.click(this.ORDER_BUTTON);
  }

  async getSuccessMessage(): Promise<string> {
    return await this.getText(this.SUCCESS_MESSAGE);
  }
}