const axios = require("axios").default;
const localStorage = require("node-localstorage");
let fetchWsURL;
async function getWsUrl() {
  let promise = new Promise((resolve, reject) => {
    const result = axios.get("http://127.0.0.1:9222/json/version");
    resolve(result);
  });
  return promise;
}
module.exports = getWsUrl;
