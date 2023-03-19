const fs = require('fs');

const scraperObject = {
	url: 'https://www.ekcsra.org/logon',
	async scraper(browser) {
		let page = await browser.newPage();
		console.log(`Navigating to ${this.url}...`);
		await page.goto(this.url, { timeout: 0 });
		await page.type('#sitename', 'Andrew James McAllister');
		await page.type('#password', 'WyceQSA59h!jJbk');
		await page.click('#zLogon');
		await page.waitForNavigation();
		await page.goto('https://www.ekcsra.org/refereeinquiry');
		let scrapedData = [];

		async function scrapeCurrentPage() {
			let links = [];
			let tableLength = 102;

			for (let i = 2; i < tableLength; i++) {
				let url = '';
				if (await page.$$(`tr:nth-child(${i}) > .term > a`) || "") url = await page.$eval(`tr:nth-child(${i}) > .term > a`, text => text.textContent);
				console.log(url)
				links.push(url);
			}

			let pagePromise = (link) => new Promise(async (resolve, reject) => {
				let dataObj = {};
				let date = '';
				let infoPage = await browser.newPage();
				infoPage.goto(link);

				console.log(`I went to ${link}`)
				date = await infoPage.$eval(`tr:nth-child(2) > .inputNormal:nth-child(2)`, text => text.textContent);
				console.log('I work')
				console.log(date);
				resolve(dataObj);
			});

			for (let linkNum = 0; linkNum < links.length; linkNum++) {
				console.log(links);
				console.log(`on link ${links[linkNum]}`)
				let currentPageData = await pagePromise(`https://www.ekcsra.org/refereeinquiry?action=Display&key=${links[linkNum]}`);
				scrapedData.push(currentPageData);
			}

			return scrapedData;
		}
		let data = await scrapeCurrentPage();
		console.log(data);
		// fs.writeFile('games.json', JSON.stringify(data), (error) => {
		// 	if (error) console.log(error);
		// 	console.log('Data written successfully')
		// });
		return data;
	}
}

module.exports = scraperObject;