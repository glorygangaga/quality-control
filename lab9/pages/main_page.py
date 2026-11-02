from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from pages.base_page import BasePage


class MainPage(BasePage):
    SEARCH_BAR = (By.XPATH, "//input[@id='typeahead']")
    # Первая карточка товара в результатах поиска
    FIRST_PRODUCT_CARD = (
        By.XPATH,
        "//div[contains(@class,'product-one')]"
        "//div[contains(@class,'product-left')][1]"
        "//div[contains(@class,'product-main')]"
    )
    FIRST_PRODUCT_TITLE = (By.XPATH, ".//div[contains(@class,'product-bottom')]//h3")

    def __init__(self, driver, timeout=10):
        super().__init__(driver, timeout)
        self.search_string = ""

    def open(self, url):
        self.driver.get(url)

    def input_search_bar(self, text):
        self.type(self.SEARCH_BAR, text)
        self.search_string = text

    def submit_search_bar(self):
        self.find(self.SEARCH_BAR).submit()
        WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located(self.FIRST_PRODUCT_CARD)
        )

    def first_product_card_title_contains_string(self):
        card = self.find(self.FIRST_PRODUCT_CARD)
        title = card.find_element(*self.FIRST_PRODUCT_TITLE).text
        return self.search_string.lower() in title.lower()