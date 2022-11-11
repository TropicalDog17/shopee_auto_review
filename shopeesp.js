const puppeteer = require("puppeteer");
const download_image = require("./download");
const makeid = require("./makeid");
const fs = require("fs");
const path = require("path");
const chooseRandomFromBank = require("./utils");
const axios = require("axios").default;
const localStorage = require("node-localstorage");
const getWsUrl = require("./fetchh");
let wsChromeEndpointurl = getWsUrl().then(
  (result) => (wsChromeEndpointurl = result.data.webSocketDebuggerUrl)
);
const REVIEW_LINK =
  "https://shopee.vn/user/purchase/order/118651414207583?type=3";

const DEFAULT_REVIEW_TEXT_BANK = [
  "Chất lượng sản phẩm tuyệt vời ông mặt trời!! Đóng gói sản phẩm rất đẹp và chắc chắn! Rất đáng tiền.",
  "Sp tốt quá shop ơi. Giao hàng nhanh, sp gói rất kỹ k bị bể gì hết. Quá ưng 😚😚",
  "M rất hài lòng về cách phục vụ của shop, sản phẩm bị lỗi shop đổi trả miễn phí và tư vấn rất nhiệt tình. Cho shop 5 sao.",
  "Đóng gói sản phẩm rất kỹ và sản phẩm rất chất luợng tôi rất hài lòng về sản phẩm này tôi sẽ quay lại shop mua thêm những sản phâm khác và giới thiệu thêm nhiều bạn bè của tôi nữa.",
  "Rất thích cách chăm sóc khách hàng của bên shop. Chất lượng sp là 1 phần lớn nhưng có thể khi mua người ta mua cả cái tâm của người bán. Shop hướng dẫn rất tận tình. Sẽ ủng hộ shop dài giao hàng nhanh đóng gói cẩn thận giá sản phẩm rẻ hơn nhiều shop khác",
  "Sp chất lượng lắm ! Shop gói hàng cẩn thận, giao hàng rất nhanh . Giá rẻ hơn những chỗ khác. Các bạn yên tâm mua nhé",
  "Mình chưa dùng nhưng cách shop tư vấn rất nhiệt tình & thật tâm chứ k phải muốn bán cho dc hang. Đủ để cho 5 sao",
  "Chất lượng sản phẩm tuyệt vời Đóng gói sàn phẩm rất đẹp và chắc chắn Shop phục vụ tốt Rất đáng tiền Thời gian giao hàng nhanh",
  "Chất lượng rất ổn so với tầm giá, shop đóng gói đẹp và chắc chắn, thời gian giao hàng cũng cực nhanh.",
  "Rất là chim ưng, sản phẩm tốt lắm, trả lời cũng nhiệt tình nhẹ nhàng, mọi người nên mua dùng thử nhé ^ ^",
  "Chưa thấy shop nào nhiệt tình như thế này ạ, giải đáp mọi thắc mắc của mình. Chất lượng lại cực kỳ tốt, giá lại rất ổn so với các bên khác. Nếu có đánh giá 10 sao cũng cho shop luôn.",
  "Giao hàng nhanh, hàng nhận chất lượng y như hình và clip quảng cáo. Sẽ ủng hộ shop những lần tới và đánh giá 5 sao",
  "Giao hàng nhanh, đóng gói cẩn thận, mua của shop rồi thấy ưng nên mua thêm cho người nhà nữa.",
  "Lần trước mua ok nên lần này quyết định mua tiếp. Sản phẩm y hình, giao hàng nhanh, đóng gói cẩn thận, sẽ ủng hộ shop dài dài nữa.",
  "Tôi muốn khẳng định với các bạn là sản phẩm của shop rất tốt so với giá tiền, sẽ ủng hộ shop dài dài luôn nhen.",
  "Shop làm ăn uy tín lắm luôn. Nếu cần mua j nhất định lại ghé shop ủng hộ. Cám ơn shop rất nhiều. Lòng tin không đặt nhậm chỗ là đấy, phải nói là chất lượng quá ok luôn.",
  "Chất lượng sản phẩm tốt, đóng gói cẩn thận lại hàng nhanh, mình sẽ ủng hộ shop tiếp.",
  "Hàng chất đỉnh luôn !! Cái gì cũng ưng và đẹp, shop cực kỳ nhiệt tình và dễ thương ! ",
  "Rất thích cách chăm sóc khách hàng của bên shop. Chất lượng sp là 1 phần lớn nhưng có thể khi mua người ta mua cả cái tâm của người bán. Shop hướng dẫn rất tận tình. Sẽ ủng hộ shop dài",
  "Giao hàng nhanh, shop tư vấn nhiệt tình, chất lượng ok, có nhu cầu sẽ ủng hộ shop tiếp",
  "Đã nhân hàng và dùng thử, tương đối ổn định, giá chấp nhận dc so với chất lượng",
  "Hàng dùng ngon sợ với tầm giá quá rẻ, nói chung là ok lắm ạ!",
  "Giao hàng nhanh. Đóng gói ổn. Giá rẻ. Sẽ ủng hộ tiếp nếu có nhu cầu",
  "Giao hàng siêu nhanh, chất lượng sp tốt hơn mong đợi, mong là shop có dịch vụ bảo hành tốt",
  "Rất ưng,đóng hàng chắc chắn .lần sau sẽ tiếp tục ủng hộ shop",
  "Đã test rất ok. Giao hàng nhanh, hàng mới 100% .đóng gói cẩn thận. Giá thành rẻ hơn shop khác mấy chục. QUá tuyệt",
  "Giao hàng nhanh nha.Sẽ ủng hộ lần sau nè",
  "Sản phẩm khá ok ạ . Shop giao hàng nhanh , chất lượng 5 sao cho shop ạ . Cám ơn shop nhé",
  "Shop bọc hàng kỹ quá, loay hoay mãi mới mở ra đc. Chất lượng hàng tốt nha. Sẽ ủng hộ shop nữa",
  "Shop bọc hàng kỹ quá, loay hoay mãi mới mở ra đc. Chất lượng hàng tốt nha. Sẽ ủng hộ shop nữa",
  "Hàng rất đẹp nha, mua được giá sale nên rất thích, giao hàng nhanh chóng và sẽ ủng hộ shop nhé",
  "Thời gian giao hàng nhanh ,shipper nhiệt tình, hàng test sử dụng quá ok luôn. Cho shop 5 sao",
  "Sản pham dùng rat thich. Cho shop 5 sao, lan sau se tiep tuc ung ho shop",
  "Chất lượng sản phẩm tuyệt vời Đóng gói sàn phẩm rất đẹp và chắc chắn Shop phục vụ tốt Rất đáng tiền Thời gian giao hàng nhanh",
  "Chưa thấy shop nào nhiệt tình như thế này ạ, giải đáp mọi thắc mắc của mình.  Chất lượng lại cực kỳ tốt, giá lại rất ổn so với các bên khác. Nếu có đánh giá 10 sao cũng cho shop luôn Hi",
  "Giao hàng nhanh, đóng gói cẩn thận, mua của shop r thấy ưng nên mua thêm cho người nhà",
  "Đã từng mua để dùng thấy tốt nên mua thêm 4c hộ đồng nghiệp Giao hàng siêu nhanh luôn 👍🏻",
  "Sản phẩm đẹp, đóng gói rất kỹ càng, giao hạng khá nhanh so với dự kiến",
  "Chất lượng sản phẩm tốt Shop phục vụ cũng tốt Đóng gói cũng cẩn thận Rất đáng tiền Thời gian giao hàng nhanh ❤️❤️❤️",
  "Chất lượng sản phẩm tuyệt vời,mua hàng của shop nhiều lần rồi, mỗi lần đều là 1 sự trải nghiệm sản phẩm,nhưng chỉ có 1 đánh giá quá tuyệt vời,cảm ơn shop 👌👌👍👍",
  "Chất lượng sản phẩm được. Đóng gói hàng chắc chắn. Giá thành ok.",
].filter((ele) => ele.length > 50);
const IMAGES_NAME_BANK = [
  "117-536x354.jpg",
  "294-536x354.jpg",
  "667-536x354.jpg",
  "910-536x354.jpg",
  "527-536x354.jpg",
  "472-536x354.jpg",
  "35-536x354.jpg",
  "337-536x354.jpg",
  "391-536x354.jpg",
  "457-536x354.jpg",
  "350-536x354.jpg",
  "361-536x354.jpg",
  "698-536x354.jpg",
  "115-536x354.jpg",
  "466-536x354.jpg",
  "198-536x354.jpg",
  "827-536x354.jpg",
];

const DEFAULT_PATH = "C:\\Users\\Tuan17\\Downloads\\";

let imagesPathBank = IMAGES_NAME_BANK.map((name) => DEFAULT_PATH + name);
setTimeout(async () => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsChromeEndpointurl,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto(REVIEW_LINK);
  await page.waitForTimeout(4000);

  //
  await page.click(".stardust-button.stardust-button--primary.Kz9HeM");
  await page.waitForTimeout(1000);
  await page.waitForSelector(".shopee-popup__container");
  await page.waitForTimeout(3000);

  //

  // const elStarArray = await page.$$(
  //   ".rating-stars__star.rating-stars__star--clickable.ytO7le:last-child"
  // );
  // for (const el of elStarArray) {
  //   await el.click();
  // }
  // await page.waitForTimeout(2000);
  const elImageDivArray = await page.evaluate(
    'Array.from(document.querySelectorAll(".shopee-image__content")).map((el) => el.getAttribute("style"))'
  );
  const startLength = 'background-image: url("'.length;
  const imageURLsList = elImageDivArray.map((el) =>
    el.substring(startLength, el.length - 3)
  );
  console.log(imageURLsList.length);
  const count = await page.$$(".q-E\\+ql");
  console.log("text area count" + count.length);
  const elUploadArray = await page.$$("input[type=file][accept='image/*']");
  let index = imageURLsList.length - elUploadArray.length;

  const uploadImgUrl = imageURLsList[index];
  console.log("Images count:" + imageURLsList.length);
  console.log("expected coins: " + elUploadArray.length * 100);
  const uploadAllFiles = async () => {
    for (el of elUploadArray) {
      let img_name = makeid(10) + ".jpg";
      await download_image(imageURLsList[index++], img_name);
      await el.uploadFile(img_name);
      await fs.unlinkSync(img_name);
    }
  };
  uploadAllFiles();

  // Add random reviews
  const elTextArray = await page.$$(
    "div._0rMaIu > div:last-child textarea.q-E\\+ql"
  );
  // const elTextArray = await page.$$("div._0rMaIu > textarea");
  for (const el of elTextArray) {
    // await el.click();
    await el.type(chooseRandomFromBank(DEFAULT_REVIEW_TEXT_BANK));
  }

  // Add an image
  // const elImageArray = await page.$$("input[type=file]");
  // for (const el of elImageArray) {
  //   await el.uploadFile(chooseRandomFromBank(imagesPathBank));
  // }

  await page.waitForTimeout(3000);
  await page.click(".shopee-popup-form__footer button[type='button']");
}, 500);

/**
 * To-do list:
 * + Add an image. Done
 *    ++ Add random image
 *        . Create a list of images
 *        . Choose one
 * + Submit
 * + Random reviews
 */
