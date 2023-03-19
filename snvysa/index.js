const fs = require('fs')

let payScale = fs.readFileSync('snvysa/payScale.json', 'utf-8');

export function displayPay() {
    console.log(payScale)
}
