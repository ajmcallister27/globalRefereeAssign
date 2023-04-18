const fs = require('fs')

let payScale = fs.readFileSync('data/snvysaPayScale.json', 'utf-8');

export function displayPay() {
    console.log(payScale)
}
