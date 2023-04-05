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
		await page.waitForNavigation(); // Comment out if using headless
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

			let pagePromise = (link, gameId) => new Promise(async (resolve, reject) => {
				let dataObj = {};
				let date, time, field, gender, league, client, level, authority, division, season, priority, type, status, rank, home, away, ref, ar1, ar2, r4, mtr, refPay, ar1Pay, ar2Pay, r4Pay, mtrPay;
				let infoPage = await browser.newPage();
				await infoPage.goto(link);

				date = await infoPage.$eval(`tr:nth-child(2) > .inputNormal:nth-child(2)`, text => text.textContent);
				time = await infoPage.$eval(`tr:nth-child(2) > .inputNormal:nth-child(4)`, text => text.textContent);
				field = await infoPage.$eval(`tr:nth-child(3) > .inputNormal:nth-child(2)`, text => text.textContent);
				gender = await infoPage.$eval(`tr:nth-child(3) > .inputNormal:nth-child(4)`, text => text.textContent);
				league = await infoPage.$eval(`tr:nth-child(4) > .inputNormal:nth-child(2)`, text => text.textContent);
				client = await infoPage.$eval(`tr:nth-child(4) > .inputNormal:nth-child(4)`, text => text.textContent);
				level = await infoPage.$eval(`tr:nth-child(5) > .inputNormal:nth-child(2)`, text => text.textContent);
				authority = await infoPage.$eval(`tr:nth-child(5) > .inputNormal:nth-child(4)`, text => text.textContent);
				division = await infoPage.$eval(`tr:nth-child(6) > .inputNormal:nth-child(2)`, text => text.textContent);
				season = await infoPage.$eval(`tr:nth-child(6) > .inputNormal:nth-child(4)`, text => text.textContent);
				priority = await infoPage.$eval(`tr:nth-child(7) > .inputNormal:nth-child(2)`, text => text.textContent);
				type = await infoPage.$eval(`tr:nth-child(7) > .inputNormal:nth-child(4)`, text => text.textContent);
				status = await infoPage.$eval(`tr:nth-child(8) > .inputNormal:nth-child(2)`, text => text.textContent);
				rank = await infoPage.$eval(`tr:nth-child(8) > .inputNormal:nth-child(4)`, text => text.textContent);
				home = await infoPage.$eval(`tr:nth-child(9) > .inputNormal:nth-child(2)`, text => text.textContent);
				away = await infoPage.$eval(`tr:nth-child(9) > .inputNormal:nth-child(4)`, text => text.textContent);
				ref = await infoPage.$eval(`tr:nth-child(11) > .input`, text => text.textContent);
				try { ar1 = await infoPage.$eval(`tr:nth-child(12) > .input`, text => text.textContent) } catch(err) { ar1 = "nan" };
				try { ar2 = await infoPage.$eval(`tr:nth-child(13) > .input`, text => text.textContent) } catch(err) { ar2 = "nan" };
				try { r4 = await infoPage.$eval(`tr:nth-child(14) > .input`, text => text.textContent) } catch(err) { r4 = "nan" };
			 	try { mtr = await infoPage.$eval(`tr:nth-child(15) > .input`, text => text.textContent) } catch(err) { mtr = "nan" };
				refPay = await infoPage.$eval(`tr:nth-child(11) > .inputNormal`, text => text.textContent);
				try { ar1Pay = await infoPage.$eval(`tr:nth-child(12) > .inputNormal`, text => text.textContent) }  catch(err) { ar1Pay = "nan" };
				try { ar2Pay = await infoPage.$eval(`tr:nth-child(13) > .inputNormal`, text => text.textContent) }  catch(err) { ar2Pay = "nan" };
				try { r4Pay = await infoPage.$eval(`tr:nth-child(14) > .inputNormal`, text => text.textContent) }  catch(err) { r4Pay = "nan" };
				try { mtrPay = await infoPage.$eval(`tr:nth-child(15) > .inputNormal`, text => text.textContent) }  catch(err) { mtrPay = "nan" };

				dataObj = {
					source: 'EKCSRA',
					id: gameId,
					date: date,
					time: time,
					field: field,
					gender: gender,
					league: league,
					client: client,
					level: level,
					authority: authority,
					division: division,
					season: season,
					priority: priority,
					type: type,
					status: status,
					rank: rank,
					home: home,
					away: away,
					ref: ref,
					ar1: ar1,
					ar2: ar2,
					r4: r4,
					mtr: mtr,
					refPay: refPay,
					ar1Pay: ar1Pay,
					ar2Pay: ar2Pay,
					r4Pay: r4Pay,
					mtrPay: mtrPay,
				}
				resolve(dataObj);
				await infoPage.close();
			});

			for (let linkNum = 0; linkNum < links.length; linkNum++) {
				console.log(`on link ${links[linkNum]}`)
				let currentPageData = await pagePromise(`https://www.ekcsra.org/refereeinquiry?action=Display&key=${links[linkNum]}`, links[linkNum]);
				scrapedData.push(currentPageData);
			}

			// Pagination control
			let nextButtonExist = false;
			try {
				const nextButton = await page.$eval('tr:nth-child(102)', a => a.textContent);
				nextButtonExist = true;
			}
			catch(err) {
				nextButtonExist = false;
			}
			if (nextButtonExist) {
				await page.click('tr:nth-child(102) a:nth-child(1) > img');
				return scrapeCurrentPage();
			}
			await page.close();

			return scrapedData;
		}

		let data = await scrapeCurrentPage();
		fs.writeFile('data/ekcsraGames.json', JSON.stringify(data), (error) => {
			if (error) console.log(error);
			console.log('Data written to ekcsraGames.json successfully')
		});
		return data;
	}
}

module.exports = scraperObject;