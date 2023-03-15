const fs = require('fs');

const scraperObject = {
	url: 'https://www.ekcsra.org/logon',
	async scraper(browser) {
		let page = await browser.newPage();
		console.log(`Navigating to ${this.url}...`);
		await page.goto(this.url, { timeout: 0 });
		let scrapedData = [];
		async function scrapeCurrentPage() {
			await page.waitForSelector('.body');

			let pagePromise = (link) => new Promise(async (resolve, reject) => {
				let links = [];
				let dataObj = {};
				let page = await browser.newPage();
				let tableLength = 102;

				await page.goto(link);
                await page.type('#sitename', 'Andrew James McAllister');
                await page.type('#password', 'WyceQSA59h!jJbk');
                await page.click('#zLogon');

                await page.goto('https://www.ekcsra.org/refereeinquiry');

				for (let i = 2; i < tableLength; i++) {
					let url, date, day, time, league, client;
                	if (await page.$(`tr:nth-child(${i}) > .term > a`) || "") url = await page.$eval(`tr:nth-child(${i}) > .term > a[href]`, text => text.textContent);
					// if (await page.$(`tr:nth-child(${i}) > .inctrNormal:nth-child(2)`) || "") date = await page.$eval(`tr:nth-child(${i}) > .inctrNormal:nth-child(2)`, text => text.textContent);
					// if (await page.$(`tr:nth-child(${i}) > .inctrNormal:nth-child(3)`) || "") day = await page.$eval(`tr:nth-child(${i}) > .inctrNormal:nth-child(3)`, text => text.textContent);
					// if (await page.$(`tr:nth-child(${i}) > .inctrNormal:nth-child(4)`) || "") time = await page.$eval(`tr:nth-child(${i}) > .inctrNormal:nth-child(4)`, text => text.textContent);
					// if (await page.$(`tr:nth-child(${i}) > .inctrNormal:nth-child(5)`) || "") league = await page.$eval(`tr:nth-child(${i}) > .inctrNormal:nth-child(5)`, text => text.textContent);
					// if (await page.$(`tr:nth-child(${i}) > .inctrNormal:nth-child(6)`) || "") client = await page.$eval(`tr:nth-child(${i}) > .inctrNormal:nth-child(6)`, text => text.textContent);
					links.push(url);
					// scrapedData.push({id: id, date: date, day: day, time: time, league: league, client: client});
				}
					console.log(links);

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
				resolve(dataObj);
				// await page.close();
			});

			// for (let linkNum = 12; linkNum <= 20; linkNum++) {
				let currentPageData = await pagePromise(`https://www.ekcsra.org/logon`);
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