import { authenticate, pendingItems, downloadFile } from '../../../utils/requests'
import { writeJson } from '../../../utils/writeFiles'
import batch1 from './input/batch1.json'
import batch2 from './input/batch2.json'
import batch3 from './input/batch3.json'
import batch4 from './input/batch4.json'

interface file {
  id: string | null,
  mimeType: string | null,
  description: string | null,
  url: string | null,
}

interface step {
  cnj: string,
  source: string,
  platform: string,
  search: string,
  query: string,
  date: string,
  title: string | null,
  description: string | null,
  files: file[]
}

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

interface filesCount {
  filesCount: number,
  ocurrences: number
}

export const countFiles = (): filesCount[] => {

  //@ts-ignore
  const input = batch1.concat(batch2, batch3, batch4)

  let result: filesCount[] = []

  for (const step of input) {
    const index = result.findIndex(object => object.filesCount === step.files.length)
    index >= 0 ? result[index].ocurrences++ : result.push({ filesCount: step.files.length, ocurrences: 1 })
  }

  return result
}

export const getLongSteps = (filesCount: number): step[] => {

  //@ts-ignore
  const input = batch1.concat(batch2, batch3, batch4)

  let result: step[] = []

  for (const step of input) {
    step.files.length >= filesCount && (result.push(step))
  }

  return result
}

export const getURLs = (): string[] => {

  //@ts-ignore
  const input = batch1.concat(batch2, batch3, batch4)

  let result: string[] = []

  for (const step of input) {
    for (const file of step.files) {
      result.push(file.url)
    }
  }

  return result
}

export const checkFiles = async (urls: string[]) => {

  const token = await authenticate()

  let result: string[] = []

  let count = 1

  for (const url of urls) {
    const response: any = await downloadFile(token, url)
    !!response.status && response.status === 200 ? null : result.push(url)
    console.log(`Done ${count} out of ${urls.length}`)
    count++
  }

  writeJson(result, 'analysis/codiloResponses/filesCheck/output', 'errorFiles')
}