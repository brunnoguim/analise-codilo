import { authenticate, pendingItems } from '../../../utils/requests'
import { writeJson } from '../../../utils/writeFiles'
import groupedSearches from './output/groupedSearches.json'

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

const analyzeActionBy = (response: any) => {

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
            actionBy: row.actionBy
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

  let result = []

  let count = 0
  for (const row of CNJs) {
    const response = await pendingItems(token, row)
    const analyzedData = analyzeSteps(response)
    if (!!analyzedData) { result.push(...analyzedData) } else { console.log(`${row} missing info`) }
    count++
    console.log(`Done ${count} out of ${CNJs.length}...`)
  }

  writeJson(result, 'analysis/codiloResponses/duplicatedStepsCheck/output', 'actionsBy1')
}

export const getNulls = (steps: step[], isDescription?: boolean): step[] => {

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
  bothFilled: number,
  bothEmpty: number,
  titleEmpty: number,
  descriptionEmpty: number,
}

export const categorizeNulls = (steps: step[]): refinedStep[] => {
  let result: refinedStep[] = []
  for (const step of steps) {
    const index = result.findIndex(
      object => object.cnj === step.cnj &&
        object.source === step.source &&
        object.platform === step.platform &&
        object.search === step.search &&
        object.query === step.query
    )
    if (index >= 0) {
      if (step.title === null && step.description === null) {
        result[index].bothEmpty++
      } else if (step.title != null && step.description != null) {
        result[index].bothFilled++
      } else if (step.title === null && step.description != null) {
        result[index].titleEmpty++
      } else if (step.title != null && step.description === null) {
        result[index].descriptionEmpty++
      }
    } else {

      let object = {
        cnj: step.cnj,
        source: step.source,
        platform: step.platform,
        search: step.search,
        query: step.query,
        bothFilled: 0,
        bothEmpty: 0,
        titleEmpty: 0,
        descriptionEmpty: 0,
      }

      if (step.title === null && step.description === null) {
        object.bothEmpty++
      } else if (step.title != null && step.description != null) {
        object.bothFilled++
      } else if (step.title === null && step.description != null) {
        object.titleEmpty++
      } else if (step.title != null && step.description === null) {
        object.descriptionEmpty++
      }
      result.push(object)
    }
  }
  return result
}

interface titleLengthStep {
  cnj: string,
  source: string,
  platform: string,
  search: string,
  query: string,
  under: number,
  over: number,
  maxLength: number,
}

export const getTitlesLength = (input: step[]): titleLengthStep[] => {

  let result: titleLengthStep[] = []
  for (const step of input) {
    const index = result.findIndex(
      object => object.cnj === step.cnj &&
        object.source === step.source &&
        object.platform === step.platform &&
        object.search === step.search &&
        object.query === step.query
    )
    if (index >= 0) {
      if (step.title != null) {
        step.title.length < 501 ? result[index].under++ : (result[index].over++, step.title.length > result[index].maxLength && (result[index].maxLength = step.title.length))
      }
    } else {

      let object = {
        cnj: step.cnj,
        source: step.source,
        platform: step.platform,
        search: step.search,
        query: step.query,
        under: 0,
        over: 0,
        maxLength: step.title != null ? step.title.length : 0,
      }

      if (step.title != null) {
        step.title.length < 501 ? object.under++ : object.over++
      }

      result.push(object)
    }
  }
  return result
}

export const getLongTitles = (input: step[]): step[] => {

  let result: step[] = []
  for (const step of input) {
    step.title != null && step.title.length > 500 ? result.push(step) : null
  }
  return result
}

interface search {
  source: string,
  platform: string,
  search: string,
  query: string,
}

interface lawsuit {
  cnj: string,
  searches: search[],
}

export const groupSearches = (input: step[]): lawsuit[] => {

  let result: lawsuit[] = []
  for (const step of input) {

    const searchObject = {
      source: step.source,
      platform: step.platform,
      search: step.search,
      query: step.query,
    }

    const lawsuitIndex = result.findIndex(object => object.cnj === step.cnj)
    if (lawsuitIndex >= 0) {

      const searchIndex = result[lawsuitIndex].searches.findIndex(search =>
        search.source === step.source &&
        search.platform === step.platform &&
        search.search === step.search &&
        search.query === step.query
      )

      searchIndex < 0 && (result[lawsuitIndex].searches.push(searchObject))

    } else {

      const lawsuitObject = {
        cnj: step.cnj,
        searches: [searchObject],
      }

      result.push(lawsuitObject)

    }
  }
  return result
}

export const filterSteps = (input: step[]): step[] => {

  let result: step[] = []

  for (const row of input) {
    const index = groupedSearches.findIndex(object => object.cnj === row.cnj)
    groupedSearches[index].searches.length > 1 && (result.push(row))
  }

  return result
}