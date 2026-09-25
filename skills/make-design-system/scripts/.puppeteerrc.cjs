// Keep the browser inside the skill folder and download only chrome-headless-shell (~half the size of full Chrome).
const { join } = require('path');
module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
  chrome: { skipDownload: true },
  'chrome-headless-shell': { skipDownload: false },
};
