from pages.main_page import MainPage


def test_search_product(driver, load_config):
    config = load_config("product_search.yaml")

    page = MainPage(driver)
    page.open(config["main_page"])
    page.input_search_bar(config["search_string"])
    page.submit_search_bar()

    assert page.first_product_card_title_contains_string()