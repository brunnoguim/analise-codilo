import ObjectsToCsv from 'objects-to-csv'

export const writeJson = (input: any, fileName: string) => {
  const print = JSON.stringify(input)
  var fs = require('fs')
  fs.writeFile(`./src/analysis/codiloResponses/output/${fileName}.json`, print, 'utf8', function (err: any) {
    if (err) throw err
    console.log('complete')
  })
  console.log('File Wrote')
}

export const writeCSV = async (input: any[]) => {
  /**
  * This function writes any input onto an existing csv file
  *
  * @param input - The expected data to be built into the outputed csv
  *
  */
  const exportedCSV = new ObjectsToCsv(input)
  await exportedCSV.toDisk('./result/analytics.csv')
  console.log('csv overwritten')
}