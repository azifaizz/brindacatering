import sys
from playwright.sync_api import sync_playwright

def main():
    print("Starting Playwright to test the Brinda Caterers site...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        print("Navigating to http://localhost:5173...")
        page.goto('http://localhost:5173')
        
        print("Waiting for network idle to ensure everything is loaded...")
        page.wait_for_load_state('networkidle')
        
        # Take a screenshot
        screenshot_path = 'homepage_test.png'
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"✅ Saved full page screenshot to {screenshot_path}")
        
        # Verify title
        title = page.title()
        print(f"✅ Page Title: {title}")
        
        # Find some key elements
        links = page.locator('a').all_inner_texts()
        print(f"✅ Found {len(links)} links on the page.")
        
        # Click on contact page
        print("Navigating to Contact page...")
        page.locator('text=Contact').first.click()
        page.wait_for_load_state('networkidle')
        
        contact_screenshot = 'contact_test.png'
        page.screenshot(path=contact_screenshot, full_page=True)
        print(f"✅ Saved Contact page screenshot to {contact_screenshot}")
        
        browser.close()
        print("✅ Testing completed successfully.")

if __name__ == "__main__":
    main()
