interface courts {
  court: string,
  searchTypes: string[]
}

export const filterData = (input: any): courts[] => {

  let result = []

  const getQueries = (input: any): string[] => {
    let result = []
    for (const item of input) {
      result.push(item.query)
    }
    return result
  }

  for (const row of input) {
    for (const subRow of row.searches) {
      const obj = {
        court: subRow.search,
        searchTypes: getQueries(subRow.queries)
      }
      result.push(obj)
    }
  }
  return result
}

const listSearches = (input: any): string[] => {

  let result: string[] = []

  for (const row of input) {
    for (const subRow of row.searches) {
      for (const item of subRow.queries) {
        !result.includes(item.query) && (result.push(item.query))
      }
    }
  }

  return result.sort()
}

const listCourts = (input: courts[]): string[] => {

  let result: string[] = []

  for (const row of input) {
    result.push(row.court)
  }

  return result.sort()
}

export const buildTable = (dataset: courts[]): any[] => {
  /**
  * This function builds an object array which may be used to build a table where each row represents a court and specifies its search types
  *
  * @param dataset - The expected raw dataset, as defined by the courts interface
  *
  * @returns An object array where each object represents a court and specifies which search types it utilizes
  *
  */

  let result: any[] = []

  for (const row of dataset) {
    const identifier = result.findIndex(obj => obj.court === row.court)

    if (identifier > -1) {
      result[identifier] = {
        court: row.court,
        eletronico: row.searchTypes.includes('eletronico') ? true : result[identifier].eletronico,
        execucaopenal: row.searchTypes.includes('execucaopenal') ? true : result[identifier].execucaopenal,
        jespecial: row.searchTypes.includes('jespecial') ? true : result[identifier].jespecial,
        juizadocivel: row.searchTypes.includes('juizadocivel') ? true : result[identifier].juizadocivel,
        precatorio: row.searchTypes.includes('precatorio') ? true : result[identifier].precatorio,
        principal: row.searchTypes.includes('principal') ? true : result[identifier].principal,
        recursal: row.searchTypes.includes('recursal') ? true : result[identifier].recursal,
        tru: row.searchTypes.includes('tru') ? true : result[identifier].tru,
        turmarecursal: row.searchTypes.includes('turmarecursal') ? true : result[identifier].turmarecursal,
        unificada: row.searchTypes.includes('unificada') ? true : result[identifier].unificada
      }
    } else {
      result.push({
        court: row.court,
        eletronico: row.searchTypes.includes('eletronico') ? true : null,
        execucaopenal: row.searchTypes.includes('execucaopenal') ? true : null,
        jespecial: row.searchTypes.includes('jespecial') ? true : null,
        juizadocivel: row.searchTypes.includes('juizadocivel') ? true : null,
        precatorio: row.searchTypes.includes('precatorio') ? true : null,
        principal: row.searchTypes.includes('principal') ? true : null,
        recursal: row.searchTypes.includes('recursal') ? true : null,
        tru: row.searchTypes.includes('tru') ? true : null,
        turmarecursal: row.searchTypes.includes('turmarecursal') ? true : null,
        unificada: row.searchTypes.includes('unificada') ? true : null
      })
    }
  }

  return result
}