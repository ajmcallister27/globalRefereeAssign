const browserObject = require('./browser');
const scraperController = require('./pageController');

let browserInstance = browserObject.startBrowser();

module.exports.ekcsraScrape = function () {
    scraperController(browserInstance);
}