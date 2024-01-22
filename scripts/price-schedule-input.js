const fs = require('fs');
const inputFileName = 'input.txt'
const outputFileName = 'resource-prices.json'

/*
const expectedInterface = {
  oddMonth: {
    day: {
      '01': [
        mappedPrice
      ]
    }
  }
}
 */

const addPrices = (prices, isEvenMonth, dayOfTheMonth, previousData) => {
  const mappedHalfHours = []
  const halfHours = prices.split('<:clock_white:1076054104905887744>')
  for (const halfHour of halfHours) {
    const halfHourSplit = halfHour.split('\n')
    if (!halfHourSplit[1]) {
      continue
    }
    const halfHourSplit2 = halfHourSplit[1].split('CO')
    const timeArray = halfHourSplit[0].trim().split(':')
    const hours = Number(timeArray[0])
    const minutes = Number(timeArray[1])
    const time = createDateFromHhmm(hours, minutes, isEvenMonth, dayOfTheMonth)
    const fuel = Number(halfHourSplit2[0].replace('Fuel: ', '').split('$')[0].replace(',', ''))
    const co2 = Number(halfHourSplit2[1].split('$')[0].replace('₂: ', ''))
    mappedHalfHours.push({
      time,
      fuel,
      co2,
    })
  }
  writeToFile(mappedHalfHours, isEvenMonth, dayOfTheMonth)

}


  const createDateFromHhmm = (hours, minutes, isEvenMonth, dayOfTheMonth) => {
    const timeString = `2024-${isEvenMonth ? '02' : '01'}-${String(dayOfTheMonth).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00+01:00`
    const now = new Date(timeString)

    // convert date from berlin time to est by getting the diff between the two
    const invdate = new Date(now.toLocaleString('en-US', {
      timeZone: 'Europe/Berlin'
    }));
    const diff = Math.abs(now.getTime() - invdate.getTime());

    // TODO what do here
    return new Date(now.getTime() - diff)
  }

const writeToFile = (mappedHours, isEvenMonth, dayOfTheMonth) => {
  fs.readFile('./' + outputFileName, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const dataString = data + '';
    let previousPrices = {}
    if (!dataString.length < 1) {
      previousPrices = JSON.parse(data + '')
    }
    const month = previousPrices[isEvenMonth ? 'evenMonth' : 'oddMonth']
    if (month) {
      previousPrices[isEvenMonth ? 'evenMonth' : 'oddMonth'][String(dayOfTheMonth).padStart(2, '0')] = mappedHours
    }
    else {
      previousPrices[isEvenMonth ? 'evenMonth' : 'oddMonth'] = {}
      previousPrices[isEvenMonth ? 'evenMonth' : 'oddMonth'][String(dayOfTheMonth).padStart(2, '0')] = mappedHours
    }
    const output = JSON.stringify(previousPrices, null, 2)
    fs.writeFile("./" + outputFileName, output, function(err) {
      if(err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  });

}


const main = (isEvenMonth, dayOfTheMonth) => {
  fs.readFile('./' + inputFileName, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    addPrices(data + '', isEvenMonth, dayOfTheMonth)
  });
}

main(true, 22)
