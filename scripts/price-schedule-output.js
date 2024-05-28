const fs = require('fs');
const inputFileName = 'resource-prices.json'

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

const outputPrices = (data, day) => {
  const dataString = data + '';
  if (!dataString || dataString.length < 1) {
    console.error("No prices")
    return
  }
  const dataJson = JSON.parse(dataString);
  const selectedDate = dataJson['oddMonth'][day]
  if (!selectedDate) {
    console.error("No prices for selected date")
    return
  }
  selectedDate.map((halfHourPrice, index) => {
    const now = new Date()
    const wrongMonthTime = new Date(halfHourPrice.time)
    const rightMonthTime = new Date(wrongMonthTime.setUTCMonth(now.getUTCMonth()))
    const timestamp = rightMonthTime.getTime() / 1000
    const fuelString = ':fuelpump: ' + halfHourPrice.fuel + ' ' + (halfHourPrice.fuel <= 600 ? ':green_line:' : ':red_line:')
    const co2String = ':seedling: ' + halfHourPrice.co2 + ' ' + (halfHourPrice.co2 <= 135 ? ':green_line:' : ':red_line:')
    const outputString = `<t:${timestamp}:t>  ${fuelString}  ${co2String}`
    console.log(outputString)
    if (index === 16 || index === 32) {
      console.log('-------')
    }
  })
}

const main = () => {
  fs.readFile('./' + inputFileName, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    outputPrices(data, '5')
  });
}

main()
