import {
  WebDriver,
  WebElement,
  By,
  until
} from "selenium-webdriver";

export class BasePage {
  protected driver: WebDriver;
  protected timeout: number;

  constructor(driver: WebDriver, timeout = 10) {
    this.driver = driver;
    this.timeout = timeout;
  }

  async find(locator: By): Promise<WebElement> {
    const element = await this.driver.wait(
      until.elementLocated(locator),
      this.timeout * 1000
    );

    await this.driver.wait(
      until.elementIsVisible(element),
      this.timeout * 1000
    );

    return element;
  }

  async click(locator: By): Promise<void> {
    const element = await this.driver.wait(
      until.elementLocated(locator),
      this.timeout * 1000
    );

    await this.driver.wait(
      until.elementIsVisible(element),
      this.timeout * 1000
    );

    await this.driver.wait(
      until.elementIsEnabled(element),
      this.timeout * 1000
    );

    await element.click();
  }

  async type(locator: By, text: string): Promise<void> {
    const element = await this.find(locator);

    await element.clear();
    await element.sendKeys(text);
  }

  async getText(locator: By): Promise<string> {
    const element = await this.find(locator);
    return await element.getText();
  }

  async isVisible(
    locator: By,
    timeout = 5
  ): Promise<boolean> {
    try {
      const element = await this.driver.wait(
        until.elementLocated(locator),
        timeout * 1000
      );

      return await element.isDisplayed();
    } catch {
      return false;
    }
  }

  async open(url: string): Promise<void> {
    await this.driver.get(url);
  }
}