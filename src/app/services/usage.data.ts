
interface RawUsage {
  time: string;
  co2one: string;
  co2two: string;
  co2three: string;
  co2average: string;
  fuelOne: string;
  fuelTwo: string;
  fuelThree: string;
  fuelAverage: string;
}

interface ConvertedNumberUsage {
  time: string;
  co2one: number;
  co2two: number;
  co2three: number;
  co2average: number;
  fuelOne: number;
  fuelTwo: number;
  fuelThree: number;
  fuelAverage: number;
}

export const getRawData = (): RawUsage[] => {
  return [
    {
      time: "9:00",
      co2one: "133,093,224",
      co2two: "137,702,148",
      co2three: "129,232,491",
      co2average: "133,342,621",
      fuelOne: "38,208,384",
      fuelTwo: "39,260,521",
      fuelThree: "39,260,521",
      fuelAverage: "38,909,809"
    },
    {
      time: "9:30",
      co2one: "0",
      co2two: "0",
      co2three: "0",
      co2average: "0",
      fuelOne: "0",
      fuelTwo: "0",
      fuelThree: "0",
      fuelAverage: "0"
    },
    {
      time: "10:00",
      co2one: "922,780",
      co2two: "1,152,486",
      co2three: "530,887",
      co2average: "868,718",
      fuelOne: "381,962",
      fuelTwo: "353,388",
      fuelThree: "353,386",
      fuelAverage: "362,912"
    },
    {
      time: "10:30",
      co2one: "3,573,423",
      co2two: "2,001,250",
      co2three: "2,585,639",
      co2average: "2,720,104",
      fuelOne: "1,945,861",
      fuelTwo: "1,603,183",
      fuelThree: "1,720,183",
      fuelAverage: "1,756,409"
    },
    {
      time: "11:00",
      co2one: "4,033,176",
      co2two: "4,327,820",
      co2three: "3,883,081",
      co2average: "4,081,359",
      fuelOne: "2,364,449",
      fuelTwo: "2,435,594",
      fuelThree: "2,318,594",
      fuelAverage: "2,372,879"
    },
    {
      time: "11:30",
      co2one: "3,197,661",
      co2two: "2,924,477",
      co2three: "2,735,639",
      co2average: "2,952,592",
      fuelOne: "1,299,847",
      fuelTwo: "1,093,363",
      fuelThree: "1,093,364",
      fuelAverage: "1,162,191"
    },
    {
      time: "12:00",
      co2one: "5,373,858",
      co2two: "5,929,968",
      co2three: "4,754,881",
      co2average: "5,352,902",
      fuelOne: "1,648,824",
      fuelTwo: "1,970,638",
      fuelThree: "1,541,978",
      fuelAverage: "1,720,480"
    },
    {
      time: "12:30",
      co2one: "8,859,726",
      co2two: "9,147,682",
      co2three: "9,308,202",
      co2average: "9,105,203",
      fuelOne: "2,656,788",
      fuelTwo: "2,661,711",
      fuelThree: "3,050,979",
      fuelAverage: "2,789,826"
    },
    {
      time: "13:00",
      co2one: "8,662,130",
      co2two: "8,798,674",
      co2three: "8,692,777",
      co2average: "8,717,860",
      fuelOne: "3,005,027",
      fuelTwo: "2,861,113",
      fuelThree: "2,992,817",
      fuelAverage: "2,952,986"
    },
    {
      time: "13:30",
      co2one: "15,526,518",
      co2two: "9,268,168",
      co2three: "13,797,566",
      co2average: "12,864,084",
      fuelOne: "4,885,676",
      fuelTwo: "3,115,339",
      fuelThree: "4,627,302",
      fuelAverage: "4,209,439"
    },
    {
      time: "14:00",
      co2one: "23,961,258",
      co2two: "33,457,831",
      co2three: "24,862,871",
      co2average: "27,427,320",
      fuelOne: "6,877,879",
      fuelTwo: "9,804,015",
      fuelThree: "7,561,781",
      fuelAverage: "8,081,225"
    },
    {
      time: "14:30",
      co2one: "7,115,069",
      co2two: "6,304,608",
      co2three: "6,136,628",
      co2average: "6,518,768",
      fuelOne: "2,667,538",
      fuelTwo: "1,970,797",
      fuelThree: "2,322,621",
      fuelAverage: "2,320,319"
    },
    {
      time: "15:00",
      co2one: "4,526,012",
      co2two: "4,467,996",
      co2three: "2,814,406",
      co2average: "3,936,138",
      fuelOne: "1,695,270",
      fuelTwo: "1,841,739",
      fuelThree: "1,146,215",
      fuelAverage: "1,561,075"
    },
    {
      time: "15:30",
      co2one: "7,504,658",
      co2two: "5,956,604",
      co2three: "8,771,316",
      co2average: "7,410,859",
      fuelOne: "2,389,637",
      fuelTwo: "2,275,394",
      fuelThree: "3,453,558",
      fuelAverage: "2,706,196"
    },
    {
      time: "16:00",
      co2one: "16,360,055",
      co2two: "8,906,523",
      co2three: "7,900,619",
      co2average: "11,055,732",
      fuelOne: "5,344,825",
      fuelTwo: "2,996,923",
      fuelThree: "2,653,457",
      fuelAverage: "3,665,068"
    },
    {
      time: "16:30",
      co2one: "57,007,776",
      co2two: "31,405,502",
      co2three: "62,688,115",
      co2average: "50,367,131",
      fuelOne: "16,187,090",
      fuelTwo: "19,479,750",
      fuelThree: "18,678,432",
      fuelAverage: "18,115,091"
    },
    {
      time: "17:00",
      co2one: "5,517,619",
      co2two: "35,000,000",
      co2three: "5,780,282",
      co2average: "15,432,634",
      fuelOne: "2,166,080",
      fuelTwo: "0",
      fuelThree: "2,415,398",
      fuelAverage: "1,527,159"
    },
    {
      time: "17:30",
      co2one: "5,667,265",
      co2two: "5,820,211",
      co2three: "5,106,343",
      co2average: "5,531,273",
      fuelOne: "1,880,335",
      fuelTwo: "2,292,807",
      fuelThree: "2,155,197",
      fuelAverage: "2,109,446"
    },
    {
      time: "18:00",
      co2one: "8,159,889",
      co2two: "15,426,867",
      co2three: "8,434,611",
      co2average: "10,673,789",
      fuelOne: "2,638,758",
      fuelTwo: "4,988,974",
      fuelThree: "3,025,501",
      fuelAverage: "3,551,078"
    },
    {
      time: "18:30",
      co2one: "15,664,452",
      co2two: "2,574,067",
      co2three: "11,752,115",
      co2average: "9,996,878",
      fuelOne: "4,977,656",
      fuelTwo: "757,044",
      fuelThree: "3,920,821",
      fuelAverage: "3,218,507"
    },
    {
      time: "19:00",
      co2one: "7,439,036",
      co2two: "16,192,767",
      co2three: "11,813,875",
      co2average: "11,815,226",
      fuelOne: "2,249,721",
      fuelTwo: "4,921,974",
      fuelThree: "3,878,336",
      fuelAverage: "3,683,344"
    },
    {
      time: "19:30",
      co2one: "21,721,241",
      co2two: "25,540,312",
      co2three: "17,497,309",
      co2average: "21,586,287",
      fuelOne: "6,560,804",
      fuelTwo: "7,706,665",
      fuelThree: "5,438,714",
      fuelAverage: "6,568,728"
    },
    {
      time: "20:00",
      co2one: "8,831,313",
      co2two: "10,008,568",
      co2three: "5,908,934",
      co2average: "8,249,605",
      fuelOne: "3,174,627",
      fuelTwo: "3,627,655",
      fuelThree: "2,153,153",
      fuelAverage: "2,985,145"
    },
    {
      time: "20:30",
      co2one: "7,281,869",
      co2two: "4,304,013",
      co2three: "8,841,540",
      co2average: "6,809,141",
      fuelOne: "2,299,856",
      fuelTwo: "1,246,002",
      fuelThree: "3,218,625",
      fuelAverage: "2,254,828"
    },
    {
      time: "21:00",
      co2one: "4,480,367",
      co2two: "3,622,207",
      co2three: "3,089,323",
      co2average: "3,730,632",
      fuelOne: "1,805,389",
      fuelTwo: "1,501,354",
      fuelThree: "1,602,555",
      fuelAverage: "1,636,433"
    },
    {
      time: "21:30",
      co2one: "5,568,370",
      co2two: "6,789,578",
      co2three: "4,142,729",
      co2average: "5,500,226",
      fuelOne: "2,070,782",
      fuelTwo: "2,523,271",
      fuelThree: "1,303,530",
      fuelAverage: "1,965,861"
    },
    {
      time: "22:00",
      co2one: "5,969,359",
      co2two: "5,926,690",
      co2three: "7,985,293",
      co2average: "6,627,114",
      fuelOne: "2,201,158",
      fuelTwo: "1,967,663",
      fuelThree: "2,809,711",
      fuelAverage: "2,326,177"
    },
    {
      time: "22:30",
      co2one: "4,864,653",
      co2two: "8,597,014",
      co2three: "4,570,813",
      co2average: "6,010,827",
      fuelOne: "1,680,456",
      fuelTwo: "2,957,323",
      fuelThree: "1,840,517",
      fuelAverage: "2,159,432"
    },
    {
      time: "23:00",
      co2one: "8,666,142",
      co2two: "3,988,544",
      co2three: "8,808,817",
      co2average: "7,154,501",
      fuelOne: "2,782,809",
      fuelTwo: "1,322,768",
      fuelThree: "3,113,979",
      fuelAverage: "2,406,519"
    },
    {
      time: "23:30",
      co2one: "548,488",
      co2two: "15,408,321",
      co2three: "16,713,022",
      co2average: "10,889,944",
      fuelOne: "133,114",
      fuelTwo: "4,944,720",
      fuelThree: "5,283,636",
      fuelAverage: "3,453,823"
    },
    {
      time: "0:00",
      co2one: "86,048,332",
      co2two: "0",
      co2three: "64,103,123",
      co2average: "50,050,485",
      fuelOne: "24,924,900",
      fuelTwo: "0",
      fuelThree: "19,584,432",
      fuelAverage: "14,836,444"
    },
    {
      time: "0:30",
      co2one: "0",
      co2two: "98,580,204",
      co2three: "22,936,208",
      co2average: "40,505,471",
      fuelOne: "0",
      fuelTwo: "27,928,544",
      fuelThree: "7,138,474",
      fuelAverage: "11,689,006"
    },
    {
      time: "1:00",
      co2one: "21,568,699",
      co2two: "496,017",
      co2three: "0",
      co2average: "7,354,905",
      fuelOne: "6,682,620",
      fuelTwo: "191,091",
      fuelThree: "0",
      fuelAverage: "2,291,237"
    }
  ]
}

export const getRawDataConvertedToNumbers = (): ConvertedNumberUsage[] => {
  const numberConverter = (nan: string) => {
    return Number(nan.replace(/,/g, ''))
  }
  return getRawData().map((rawDataEntry) => {
    return {
      time: rawDataEntry.time,
      co2one: numberConverter(rawDataEntry.co2one),
      co2two: numberConverter(rawDataEntry.co2two),
      co2three: numberConverter(rawDataEntry.co2three),
      co2average: numberConverter(rawDataEntry.co2average),
      fuelOne: numberConverter(rawDataEntry.fuelOne),
      fuelTwo: numberConverter(rawDataEntry.fuelTwo),
      fuelThree: numberConverter(rawDataEntry.fuelThree),
      fuelAverage: numberConverter(rawDataEntry.fuelAverage),
    }
  })
}


