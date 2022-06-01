require("dotenv").config();
const puppeteer = require("puppeteer");

const chooseRandomFromBank = require("./utils");
const wsChromeEndpointurl =
  "ws://127.0.0.1:9222/devtools/browser/d16b82a8-df19-413d-9992-8d48288890a1";
const REVIEW_LINK =
  "https://shopee.vn/user/purchase/order/106719935200586?type=3";
const DEFAULT_REVIEW_TEXT_BANK = process.env.DEFAULT_REVIEW_TEXT_BANK;

const IMAGES_NAME_BANK = process.env.IMAGES_NAME_BANK;
const DEFAULT_PATH = process.env.DEFAULT_PATH;
let imagesPathBank = IMAGES_NAME_BANK.map((name) => DEFAULT_PATH + name);

(async () => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsChromeEndpointurl,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto(REVIEW_LINK);
  await page.waitForTimeout(4000);

  //
  await page.click(".stardust-button.stardust-button--primary.Kz9HeM");
  await page.waitForTimeout(4000);
  await page.waitForSelector(".shopee-popup__container");
  //

  const elStarArray = await page.$$(
    ".rating-stars__star.rating-stars__star--clickable.ytO7le:last-child"
  );
  for (const el of elStarArray) {
    await el.click();
  }
  await page.waitForTimeout(2000);
  const elTextArray = await page.$$("._0rMaIu ._65Vt8K + textarea");
  for (const el of elTextArray) {
    await el.click();
    await el.type(chooseRandomFromBank(DEFAULT_REVIEW_TEXT_BANK));
  }

  // //Add an image
  const elImageArray = await page.$$("input[type=file]");
  for (const el of elImageArray) {
    await el.uploadFile(chooseRandomFromBank(imagesPathBank));
  }
  //Submit
  await page.click(".shopee-popup-form__footer button[type='button']");
})();
/**
 * To-do list:
 * + Add an image. Done
 *    ++ Add random image
 *        . Create a list of images
 *        . Choose one
 * + Submit
 * + Random reviews
 */
