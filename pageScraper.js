const fs = require('fs');

const scraperObject = {
	url: 'https://www.ekcsra.org/logon',
	async scraper(browser) {
		let page = await browser.newPage();
		console.log(`Navigating to ${this.url}...`);
		await page.goto(this.url, {timeout: 0});
		let scrapedData = [];
		async function scrapeCurrentPage() {
			await page.waitForSelector('.body');

			let pagePromise = (link) => new Promise(async (resolve, reject) => {
				let dataObj = {};
				let page = await browser.newPage();
				await page.goto(link);
                await page.type('#sitename', 'Andrew James McAllister');
                await page.type('#password', 'WyceQSA59h!jJbk');
                await page.click('#zLogon');

				// if (await page.$eval('#col2 > dd > h1', text => text.textContent) !== 'Search AskTheRef.com Q&A Database') {
				// 	dataObj['questionTitle'] = await page.$eval('#col2 > dd > h1', text => text.textContent);
				// 	dataObj['questionSubtitle'] = await page.$eval('#col2 > dd > h2', text => text.textContent);
				// 	if (await page.$('#col2 > dd > h3 > strong') || "") dataObj['questionAsker'] = await page.$eval('#col2 > dd > h3 > strong', text => text.textContent);
				// 	if (await page.$('#col2 > dd > p > strong') || "") dataObj['questionLevel'] = await page.$eval('#col2 > dd > p > strong', text => text.textContent);
				// 	dataObj['question'] = await page.$eval('#col2 > dd > p:last-child', text => text.textContent);

				// 	dataObj['responses'] = [];
				// 	responses = await page.$$('#col2 > dd');

				// 	for (let i = 2; i <= responses.length - 2; i++) {
				// 		let responseObj = {};
				// 		if (await page.$(`#col2 > dd:nth-child(${i}) > h4`) || "") {
				// 			responseObj.responder = await page.$eval(`#col2 > dd:nth-child(${i}) > h4`, text => text.textContent);
				// 			responseObj.answer = await page.$eval(`#col2 > dd:nth-child(${i}) > p`, text => text.textContent);
				// 			dataObj['responses'].push(responseObj);
				// 		}
				// 	}
				// }
				// resolve(dataObj);
				await page.close();
			});

			// for (let linkNum = 12; linkNum <= 20; linkNum++) {
				let currentPageData = await pagePromise(`https://www.ekcsra.org/logon`);
			// 	console.log(`Scraped started on question ${linkNum}`)
				scrapedData.push(currentPageData);
			// }

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