// What to do:
//  - Get games from SnVYSA
//  - Get games from EKCSRA
//  - Get games from NSO
//  - Display all games
//  - Update

const fs = require('fs');
const allEkcsraGames = JSON.parse(fs.readFileSync('data/ekcsraGames.json', 'utf-8'));
const allGameOfficialsGames = JSON.parse(fs.readFileSync('data/gameOfficialsGames.json', 'utf-8'));
const allNSOGames = JSON.parse(fs.readFileSync('data/NSOGames.json', 'utf-8'));

let allGames = [];

function combineSources() {
    allGames = allEkcsraGames.concat(allGameOfficialsGames).concat(allNSOGames);
    fs.writeFile('data/allGames.json', JSON.stringify(allGames), (error) => {
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
		fs.writeFile('data/availableGames.json', JSON.stringify(availableGames), (error) => {
			if (error) console.log(error);
			console.log('Data written to availableGames.json successfully')
		});
    }
}

function init() {
    combineSources();
    filterGames('available');
}

init();