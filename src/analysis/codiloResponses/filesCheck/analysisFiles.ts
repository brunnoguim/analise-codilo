import { authenticate, pendingItems } from '../../../utils/requests'
import { writeJson } from '../../../utils/writeFiles'

const filterFiles = (response: any) => {

  let result = []
  if (!!response.data && !!response.data.list[0]) {
    for (const row of response.data.list[0].info) {
      if (!!row.data[0] && !!row.data[0].steps) {
        for (const step of row.data[0].steps) {
          if (!!step.files && step.files.length > 0) {
            let consulta = {
              cnj: response.data.list[0].cnj,
              source: row.source,
              platform: row.platform,
              search: row.search,
              query: row.query,
              date: step.timestamp,
              title: step.title,
              description: step.description,
              files: step.files
            }
            result.push(consulta)
          }
        }
      }
    }
    return result
  } else {
    return null
  }
}

export const getFiles = async (CNJs: string[], fileName: string) => {

  const token = await authenticate()

  let result = []

  let count = 0
  for (const row of CNJs) {
    const response = await pendingItems(token, row)
    const analyzedData = filterFiles(response)
    if (!!analyzedData) { result.push(...analyzedData) } else { console.log(`${row} missing info`) }
    count++
    console.log(`Done ${count} out of ${CNJs.length}...`)
  }

  writeJson(result, 'analysis/codiloResponses/filesCheck/input', fileName)
}

