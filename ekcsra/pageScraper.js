const fs = require('fs');
const app = require('../server/index');

const scraperObject = {
	url: 'https://www.ekcsra.org/logon',
	async scraper(browser) {
		let credentials = JSON.parse(fs.readFileSync('./credentials.json', 'utf-8'));
		let page = await browser.newPage();
		console.log(`Navigating to ${this.url}...`);
		await page.goto(this.url, { timeout: 0 });
		await page.type('#sitename', `${credentials.ekcsraUsername}`);
		await page.type('#password', `${credentials.ekcsraPassword}`);
		await page.click('#zLogon');
		// await page.waitForNavigation(); // Comment out if using headless
		await page.goto('https://www.ekcsra.org/refereeinquiry');
		let scrapedData = [];

		async function scrapeCurrentPage() {
			let links = [];

			for (let i = 2;; i++) {
				try {
					let url = '';
					if (await page.$$(`tr:nth-child(${i}) > .term > a`) || "") url = await page.$eval(`tr:nth-child(${i}) > .term > a`, text => text.textContent);
					console.log(url)
					links.push(url);
				}
				catch (e) {
					break;
				}
			}

			let pagePromise = (link, gameId) => new Promise(async (resolve, reject) => {

				let dataObj = {};
				let date, time, field, gender, league, client, level, authority, division, season, priority, type, status, rank, home, away, notes, ref, ar1, ar2, r4, mtr, refPay, ar1Pay, ar2Pay, r4Pay, mtrPay;
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
				try {
					notesLabel = await infoPage.$eval(`#x_formdata tr:nth-child(10) > .term`, text => text.textContent) 
					if (notesLabel == 'Notes' ) {
						notes = await infoPage.$eval(`tr:nth-child(10) > .inputNormal`, text => text.textContent)
						try { ref = await infoPage.$eval(`tr:nth-child(12) > .input`, text => text.textContent) } catch (err) { ref="NA"; console.log(err)};// try { ref = await infoPage.$eval(`tr:nth-child(12) > .input`, text => text.textContent) } catch(err) {ref="NA"} };
						try { ar1 = await infoPage.$eval(`tr:nth-child(13) > .input`, text => text.textContent) } catch (err) { ar1 = "NA" };
						try { ar2 = await infoPage.$eval(`tr:nth-child(14) > .input`, text => text.textContent) } catch (err) { ar2 = "NA" };
						try { r4 = await infoPage.$eval(`tr:nth-child(15) > .input`, text => text.textContent) } catch (err) { r4 = "NA" };
						try { mtr = await infoPage.$eval(`tr:nth-child(16) > .input`, text => text.textContent) } catch (err) { mtr = "NA" };
						refPay = await infoPage.$eval(`tr:nth-child(12) > .inputNormal`, text => text.textContent);
						try { ar1Pay = await infoPage.$eval(`tr:nth-child(13) > .inputNormal`, text => text.textContent) } catch (err) { ar1Pay = "NA" };
						try { ar2Pay = await infoPage.$eval(`tr:nth-child(14) > .inputNormal`, text => text.textContent) } catch (err) { ar2Pay = "NA" };
						try { r4Pay = await infoPage.$eval(`tr:nth-child(15) > .inputNormal`, text => text.textContent) } catch (err) { r4Pay = "NA" };
						try { mtrPay = await infoPage.$eval(`tr:nth-child(16) > .inputNormal`, text => text.textContent) } catch (err) { mtrPay = "NA" };
					}
				} catch (err) {
					try { ref = await infoPage.$eval(`tr:nth-child(11) > .input`, text => text.textContent) } catch (err) { ref="NA"; console.log(err)};// try { ref = await infoPage.$eval(`tr:nth-child(12) > .input`, text => text.textContent) } catch(err) {ref="NA"} };
					try { ar1 = await infoPage.$eval(`tr:nth-child(12) > .input`, text => text.textContent) } catch (err) { ar1 = "NA" };
					try { ar2 = await infoPage.$eval(`tr:nth-child(13) > .input`, text => text.textContent) } catch (err) { ar2 = "NA" };
					try { r4 = await infoPage.$eval(`tr:nth-child(14) > .input`, text => text.textContent) } catch (err) { r4 = "NA" };
					try { mtr = await infoPage.$eval(`tr:nth-child(15) > .input`, text => text.textContent) } catch (err) { mtr = "NA" };
					refPay = await infoPage.$eval(`tr:nth-child(11) > .inputNormal`, text => text.textContent);
					try { ar1Pay = await infoPage.$eval(`tr:nth-child(12) > .inputNormal`, text => text.textContent) } catch (err) { ar1Pay = "NA" };
					try { ar2Pay = await infoPage.$eval(`tr:nth-child(13) > .inputNormal`, text => text.textContent) } catch (err) { ar2Pay = "NA" };
					try { r4Pay = await infoPage.$eval(`tr:nth-child(14) > .inputNormal`, text => text.textContent) } catch (err) { r4Pay = "NA" };
					try { mtrPay = await infoPage.$eval(`tr:nth-child(15) > .inputNormal`, text => text.textContent) } catch (err) { mtrPay = "NA" };

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
			let moreGamesExist = false;
			let nextStartNum = 1;
			try {
				const moreGames = await page.$eval('tr:nth-child(102)', text => text.textContent);
				let gameNumsFull = moreGames.split("to ").pop();
				let gameNums = gameNumsFull.split(" of ");
				let lastGameNum = Number(gameNums[0]);
				let totalGameNum = Number(gameNums[1]);
				nextStartNum = lastGameNum + 1;
				console.log(nextStartNum);
				if (totalGameNum > nextStartNum) {
					moreGamesExist = true;
					console.log('exists')
				}
			}
			catch (err) {
				moreGamesExist = false;
			}
			while (moreGamesExist) {
				console.log('going there')
				await page.goto(`https://www.ekcsra.org/refereeinquiry?action=next&startat=${nextStartNum}`);
				return scrapeCurrentPage();
			}
			await page.close();

			return scrapedData;
		}

		let data = await scrapeCurrentPage();
		fs.writeFile('app/src/data/ekcsraGames.json', JSON.stringify(data), (error) => {
			if (error) console.log(error);
			console.log('Data written to ekcsraGames.json successfully')
			app.update();
			return;
		});
		return data;
	}
}

module.exports = scraperObject;