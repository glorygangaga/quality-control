from pages.product_page import ProductPage


def test_add_product_in_cart(driver, load_config):
    config = load_config("add_to_cart.yaml")

    page = ProductPage(driver)
    page.open(config["product_page"])
    page.choose_color(config["color"])
    page.remember_price()
    page.remember_title()
    page.add_product_in_cart()

    assert page.get_product_price_in_cart() == page.get_product_price()[1:]
    assert page.get_product_title_in_cart() == page.get_product_title()
    assert page.get_product_count_in_cart() == config["expected_count"]
    assert page.get_total_count() == config["expected_count"]
    assert page.get_total_cost() == page.get_product_price()