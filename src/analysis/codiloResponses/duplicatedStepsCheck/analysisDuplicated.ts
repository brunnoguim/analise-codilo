import { authenticate, pendingItems } from '../../../utils/requests'
import resultAnalysis4 from './output/resultAnalysis4.json'

interface step {
  cnj: string,
  source: string,
  platform: string,
  search: string,
  query: string,
  date: string,
  title: string | null,
  description: string | null
}

const analyzeSteps = (response: any) => {

  const concatContent = (title: string | null, description: string | null) => {
    let result = ''
    !!title && (result = result + title)
    !!description && (result = result + description)
    return result
  }

  let consultas = []
  if (!!response.data && !!response.data.list[0]) {
    for (const row of response.data.list[0].info) {
      if (!!row.data[0] && !!row.data[0].steps) {
        for (const step of row.data[0].steps) {
          let consulta = {
            cnj: response.data.list[0].cnj,
            source: row.source,
            platform: row.platform,
            search: row.search,
            query: row.query,
            date: step.timestamp,
            title: step.title,
            description: step.description,
          }
          consultas.push(consulta)
        }
      }
    }
    return consultas
  } else {
    return null
  }
}

export const getAllResponses = async (CNJs: string[]) => {

  const token = await authenticate()

  let result = resultAnalysis4

  let count = 0
  for (const row of CNJs) {
    const response = await pendingItems(token, row)
    const analyzedData = analyzeSteps(response)
    if (!!analyzedData) { result.push(...analyzedData) } else { console.log(`${row} missing info`) }
    count++
    console.log(`Done ${count} out of ${CNJs.length}...`)
  }

  const print = JSON.stringify(result)
  var fs = require('fs')
  fs.writeFile('./src/analysis/codiloResponses/duplicatedStepsCheck/output/resultAnalysis4.json', print, 'utf8', function (err: any) {
    if (err) throw err
    console.log('complete')
  })
  console.log('File Wrote')
}

const getNulls = (steps: step[], isDescription?: boolean): step[] => {
  let result = []
  for (const step of steps) {
    isDescription ? step.description === null && (result.push(step)) : step.title === null && (result.push(step))
  }
  return result
}

interface refinedStep {
  cnj: string,
  source: string,
  platform: string,
  search: string,
  query: string,
  ocurrences: number
}

export const categorizeNulls = (steps: step[]): refinedStep[] => {
  let nullSteps = getNulls(steps)
  let result: refinedStep[] = []
  for (const step of nullSteps) {
    const index = result.map(function (item) { return item.cnj }).indexOf(step.cnj)
    index > 0 ? result[index].ocurrences++ : result.push({
      cnj: step.cnj,
      source: step.source,
      platform: step.platform,
      search: step.search,
      query: step.query,
      ocurrences: 1
    })
  }
  return result
}