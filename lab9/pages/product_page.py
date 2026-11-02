from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from pages.base_page import BasePage


class ProductPage(BasePage):
    COLOR_MENU = (By.XPATH, "//div[contains(@class,'available')]//select")
    PRODUCT_PRICE_FIELD = (By.XPATH, "//h5[@id='base-price']")
    PRODUCT_TITLE_FIELD = (By.XPATH, "//div[contains(@class,'single-para')]/h2")
    ADD_BUTTON = (By.XPATH, "//a[@id='productAdd']")
    CART_BUTTON = (By.XPATH, "//div[contains(@class,'cart')]//a")

    PRODUCT_TITLE_IN_CART = (
        By.XPATH, "//div[@id='cart']//table//tbody/tr[1]/td[2]/a"
    )
    PRODUCT_COUNT_IN_CART = (
        By.XPATH, "//div[@id='cart']//table//tbody/tr[1]/td[3]"
    )
    PRODUCT_PRICE_IN_CART = (
        By.XPATH, "//div[@id='cart']//table//tbody/tr[1]/td[4]"
    )
    TOTAL_COUNT = (
        By.XPATH, "//div[@id='cart']//table//tbody/tr[2]/td[contains(@class,'cart-qty')]"
    )
    TOTAL_COST = (
        By.XPATH, "//div[@id='cart']//table//tbody/tr[3]/td[contains(@class,'cart-sum')]"
    )
    ORDER_BUTTON = (
        By.XPATH, "//div[@id='cart']//div[@class='modal-footer']/a[contains(@class,'btn-primary')]"
    )

    def __init__(self, driver, timeout=10):
        super().__init__(driver, timeout)
        self.product_price = None
        self.product_title = None
        self.product_color = None

    def open(self, url):
        self.driver.get(url)

    def choose_color(self, color):
        Select(self.find(self.COLOR_MENU)).select_by_visible_text(color)
        self.product_color = f"({color})"

    def remember_price(self):
        self.product_price = self.get_text(self.PRODUCT_PRICE_FIELD)

    def get_product_price(self):
        return self.product_price

    def remember_title(self):
        title = self.get_text(self.PRODUCT_TITLE_FIELD)
        self.product_title = f"{title} {self.product_color or ''}".strip()

    def get_product_title(self):
        return self.product_title

    def add_product_in_cart(self):
        self.click(self.ADD_BUTTON)

    def get_product_title_in_cart(self):
        return self.get_text(self.PRODUCT_TITLE_IN_CART)

    def get_product_count_in_cart(self):
        return self.get_text(self.PRODUCT_COUNT_IN_CART)

    def get_product_price_in_cart(self):
        return self.get_text(self.PRODUCT_PRICE_IN_CART)

    def get_total_count(self):
        return self.get_text(self.TOTAL_COUNT)

    def get_total_cost(self):
        return self.get_text(self.TOTAL_COST)

    def order_product_from_cart(self):
        self.click(self.ORDER_BUTTON)