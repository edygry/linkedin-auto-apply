const {
  author,
  dependencies,
  repository,
  version,
} = require("../package.json");

module.exports = {
  name: {
    $: "linkedin-auto-apply",
  },
  namespace: "",
  version: version,
  author: author,
  source: repository.url,
  // 'license': 'MIT',
  match: ["*://*.linkedin.com/jobs/search/*", "*://*.linkedin.com/jobs/collections/*"],
  require: [
    // `https://cdn.jsdelivr.net/npm/jquery@${dependencies.jquery}/dist/jquery.min.js`,
  ],
  grant: [
    // "GM.xmlHttpRequest"
  ],
  connect: [
    // "httpbin.org"
  ],
  "run-at": "document-end",
};
