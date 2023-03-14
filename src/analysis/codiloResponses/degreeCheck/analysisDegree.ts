import { authenticate, pendingItems } from '../../../utils/requests'
import { writeJson } from '../../../utils/writeFiles'

interface degreeCheck {
  cnj: string,
  degrees: string[]
}

const buildResponse = (input: any): degreeCheck => {

  let result: degreeCheck = {
    cnj: input.cnj,
    degrees: []
  }

  for (const info of input.info) {
    for (const data of info.data) {
      const degree: string = !!data.properties.degree ? data.properties.degree : null
      result.degrees.push(degree)
    }
  }
  return result
}

export const getDegrees = async (CNJs: string[]) => {

  const token = await authenticate()

  let count = 0
  let result: any[] = []
  for (const row of CNJs) {
    const response = await pendingItems(token, row)
    const data = response.data.list[0]
    if (!!data) { result.push(buildResponse(data)) } else { console.log(`${row} missing info`) }
    count++
    console.log(`Done ${count} out of ${CNJs.length}...`)
  }
  writeJson(result, 'analysis/codiloResponses/degreeCheck/output', 'lastResult')
}

interface resultInterface {
  degreeType: string,
  ocurrences: number
}

export const analyzeResult = (lawsuits: degreeCheck[]) => {
  let result: resultInterface[] = []

  for (const lawsuit of lawsuits) {
    for (const degree of lawsuit.degrees) {
      const index = result.findIndex(item => item.degreeType === degree)
      index >= 0 ? result[index].ocurrences++ : result.push({ degreeType: degree, ocurrences: 0 })
    }
  }

  writeJson(result, 'analysis/codiloResponses/degreeCheck/output', 'analyzedResult')
}

export const checkCNJs = (degreeLawsuits: degreeCheck[], lawsuits: string[]): string[] => {
  let result: string[] = []

  for (const lawsuit of lawsuits) {
    const index = degreeLawsuits.findIndex(item => item.cnj === lawsuit)
    index < 0 && (result.push(lawsuit))
  }

  return result
}