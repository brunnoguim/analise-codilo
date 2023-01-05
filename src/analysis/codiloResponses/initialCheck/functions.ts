import credentials from '../secrets/credentials.json'
import resultCodilo from '../output/resultCodilo.json'
import { authenticate, pendingItems } from '../../../utils/requests'

export const analyzeResponse = (response: any) => {
  let consultas = []
  if (!!response.data.list[0]) {
    for (const row of response.data.list[0].info) {
      if (!!row.data[0]) {
        let consulta = {
          cnj: response.data.list[0].cnj,
          source: row.source,
          platform: row.platform,
          search: row.search,
          query: row.query,
          covers: !!row.data[0].cover ? row.data[0].cover.length : null,
          properties: !!row.data[0].propertiesArray ? row.data[0].propertiesArray.length : null,
          peoples: !!row.data[0].people ? row.data[0].people.length : null,
          steps: !!row.data[0].steps ? row.data[0].steps.length : null
        }
        consultas.push(consulta)
      }
    }
    return consultas
  } else {
    return null
  }
}

export const getAllResponses = async (CNJs: string[]) => {

  const token = await authenticate(credentials.id, credentials.secret)

  let result = resultCodilo

  let count = 0
  for (const row of CNJs) {
    const response = await pendingItems(token, row)
    const analyzedData = analyzeResponse(response)
    if (!!analyzedData) { result.push(...analyzedData) } else { console.log(`${row} missing info`) }
    count++
    console.log(`Done ${count} out of ${CNJs.length}...`)
  }

  const print = JSON.stringify(result)
  var fs = require('fs')
  fs.writeFile('./src/analysis/codiloResponses/output/resultCodilo.json', print, 'utf8', function (err: any) {
    if (err) throw err
    console.log('complete')
  })
  console.log('File Wrote')
}