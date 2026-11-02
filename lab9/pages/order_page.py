from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class OrderPage(BasePage):
    ORDER_BUTTON = (
        By.XPATH,
        "//form//button[contains(@class,'btn-default')]"
    )
    
    SUCCESS_MESSAGE = (By.CSS_SELECTOR, ".alert.alert-success")

    def order_product(self):
        self.click(self.ORDER_BUTTON)

    def get_success_message(self):
        return self.get_text(self.SUCCESS_MESSAGE)