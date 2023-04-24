// What to do:
//  - Get games from SnVYSA
//  - Get games from EKCSRA
//  - Get games from NSO
//  - Display all games
//  - Update

const fs = require('fs');
const cron = require('node-cron');
const ekcsra = require('../ekcsra/index');

const allEkcsraGames = JSON.parse(fs.readFileSync('app/src/data/ekcsraGames.json', 'utf-8'));
const allGameOfficialsGames = JSON.parse(fs.readFileSync('app/src/data/gameOfficialsGames.json', 'utf-8'));
const allNSOGames = JSON.parse(fs.readFileSync('app/src/data/nsoGames.json', 'utf-8'));

let allGames = [];

function combineSources () {
    allGames = allEkcsraGames.concat(allGameOfficialsGames).concat(allNSOGames);
    allGames = allGames.filter(value => Object.keys(value).length !== 0);
    fs.writeFile('app/src/data/allGames.json', JSON.stringify(allGames), (error) => {
        if (error) console.log(error);
        console.log('Data written to allGames.json successfully')
    });
}

function filterGames(filter) {
    if (filter === 'available') {
        let availableGames = [];
        
        for (let i = 0; i < allEkcsraGames.length; i++) {
            let game = allEkcsraGames[i];
            if (game.ref == ' ' || game.ar1 == '' || game.ar2 == '' || game.r4 == '') {
                availableGames.push(game);
            }
        }
		fs.writeFile('app/src/data/availableGames.json', JSON.stringify(availableGames), (error) => {
			if (error) console.log(error);
			console.log('Data written to availableGames.json successfully')
		});
    }
}

cron.schedule('0 0 * * * *', () => init() )

function init() {
    ekcsra.ekcsraScrape();
    combineSources();
    filterGames('available');
}
function update() {
    combineSources();
    filterGames('available');
}

module.exports.init = function () { init(); }
module.exports.update = function () { update(); }

init();
// update();