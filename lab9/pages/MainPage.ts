import { By, WebDriver, until } from "selenium-webdriver";
import { BasePage } from "./BasePage";

export class MainPage extends BasePage {
  private readonly SEARCH_BAR =
    By.xpath("//input[@id='typeahead']");

  private readonly FIRST_PRODUCT_CARD = By.xpath(
    "//div[contains(@class,'product-one')]" +
    "//div[contains(@class,'product-left')][1]" +
    "//div[contains(@class,'product-main')]"
  );

  private readonly FIRST_PRODUCT_TITLE =
    By.xpath(".//div[contains(@class,'product-bottom')]//h3");

  private searchString = "";

  constructor(driver: WebDriver, timeout = 10) {
    super(driver, timeout);
  }

  async open(url: string): Promise<void> {
    await super.open(url);
  }

  async inputSearchBar(text: string): Promise<void> {
    await this.type(this.SEARCH_BAR, text);
    this.searchString = text;
  }

  async submitSearchBar(): Promise<void> {
    const search = await this.find(this.SEARCH_BAR);

    await search.submit();

    await this.driver.wait(
      until.elementLocated(this.FIRST_PRODUCT_CARD),
      this.timeout * 1000
    );
  }

  async firstProductCardTitleContainsString(): Promise<boolean> {
    const card = await this.find(this.FIRST_PRODUCT_CARD);

    const title = await card.findElement(
      this.FIRST_PRODUCT_TITLE
    );

    const titleText = await title.getText();

    return titleText
      .toLowerCase()
      .includes(this.searchString.toLowerCase());
  }
}