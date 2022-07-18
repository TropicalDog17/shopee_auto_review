const axios = require("axios").default;
const localStorage = require("node-localstorage");
axios.get("http://127.0.0.1:9222/json/version").then((res) => {
  console.log(res.data.webSocketDebuggerUrl);
  localStorage.webSocketDebuggerUrl = res.data.webSocketDebuggerUrl;
});
