import { authenticate, pendingItems } from '../../../utils/requests'
import { writeJson } from '../../../utils/writeFiles'

export const getUnifiedQueries = (listObject: any) => {
  let consultas = []

  const buildCovers = (covers: { id: string, description: string, value: string, index: string, confirmed: boolean }[]) => {
    let result: any = {}
    for (const cover of covers) {
      const propertyName = cover.description
      const propertyValue = cover.value
      result[propertyName] = propertyValue
    }
    return result
  }

  for (const consulta of listObject.info) {
    if (!!consulta.data[0] && consulta.queryTag === "unificada") {
      const item = {
        cnj: listObject.cnj,
        sourceTag: consulta.sourceTag,
        platformTag: consulta.platformTag,
        searchTag: consulta.searchTag,
        covers: !!consulta.data[0].cover ? buildCovers(consulta.data[0].cover) : null,
        properties: !!consulta.data[0].properties ? consulta.data[0].properties : null,
      }
      consultas.push(item)
    }
  }
  return consultas
}

export const saveResponses = async (CNJs: string[]) => {

  const token = await authenticate()

  let count = 0
  for (const row of CNJs) {
    const response = await pendingItems(token, row)
    const result = response.data.list[0]

    if (!!result) { writeJson(result, result.cnj) } else { console.log(`${row} missing info`) }
    count++
    console.log(`Done ${count} out of ${CNJs.length}...`)
  }
}

export const listProps = (input: any): any => {

  let allCovers = []
  for (const consulta of input) {
    const object = consulta.covers
    allCovers.push(...Object.getOwnPropertyNames(object))
  }

  let allProperties = []
  for (const consulta of input) {
    const object = consulta.properties
    allProperties.push(...Object.getOwnPropertyNames(object))
  }

  let uniqueProps = []
  for (const property of allCovers) {
    const index = uniqueProps.findIndex(item => item.name === property && item.type === 'property')
    index < 0 ? uniqueProps.push({ name: property, type: 'property', occurences: 1 }) : uniqueProps[index].occurences++
  }

  for (const property of allProperties) {
    const index = uniqueProps.findIndex(item => item.name === property && item.type === 'cover')
    index < 0 ? uniqueProps.push({ name: property, type: 'cover', occurences: 1 }) : uniqueProps[index].occurences++
  }

  return uniqueProps
}

export const detailProps = (input: any): any => {

  let result = []
  for (const consulta of input) {
    for (const cover in consulta.covers) {
      let item = {
        cnj: consulta.cnj,
        sourceTag: consulta.sourceTag,
        platformTag: consulta.platformTag,
        searchTag: consulta.searchTag,
        type: 'cover',
        propName: cover,
        propValue: consulta.covers[cover]
      }
      result.push(item)
    }

    for (const property in consulta.properties) {
      let item = {
        cnj: consulta.cnj,
        sourceTag: consulta.sourceTag,
        platformTag: consulta.platformTag,
        searchTag: consulta.searchTag,
        type: 'property',
        propName: property,
        propValue: consulta.properties[property]
      }
      result.push(item)
    }
  }

  return result
}



export const responsesFunnel = (input: any): any => {

  const filterSuperiores = (input: any): any => {
    const result = input.filter(function (object: any) {
      return object.platformTag != "superiores"
    })
    return result
  }

  const filterGrau = (input: any): any => {
    let result: any = []
    for (const object of input) {
      let check = false
      'Grau' in object.covers && (check = true)
      'degree' in object.properties && (check = true)
      !check && (result.push(object))
    }
    return result
  }

  const filterOrgao = (input: any): any => {
    let result: any = []
    for (const object of input) {
      let check = false
      'Órgão Julgador' in object.covers && (check = true)
      'Orgão Julgador' in object.covers && (check = true)
      'Orgao Julgador' in object.covers && (check = true)

      !check && (result.push(object))
    }
    return result
  }

  const filterRelator = (input: any): any => {
    let result: any = []
    for (const object of input) {
      let check = false
      'Relatora' in object.covers && (check = true)
      'RELATOR(A)' in object.covers && (check = true)
      'Relator(a)' in object.covers && (check = true)
      'Relator' in object.covers && (check = true)
      'Desembargador-Relator' in object.covers && (check = true)
      'Relator do último incidente' in object.covers && (check = true)

      !check && (result.push(object))
    }
    return result
  }

  const filterInstancia = (input: any): any => {
    let result: any = []
    for (const object of input) {
      let check = false
      'Instância' in object.covers && (check = true)

      !check && (result.push(object))
    }
    return result
  }

  const filterVara = (input: any): any => {
    let result: any = []
    for (const object of input) {
      let check = false
      'Vara' in object.covers && (check = true)
      'VARA' in object.covers && (check = true)

      !check && (result.push(object))
    }
    return result
  }

  const filterSecretaria = (input: any): any => {
    let result: any = []
    for (const object of input) {
      let check = false
      'Secretaria' in object.covers && (check = true)
      'SECRETARIA' in object.covers && (check = true)

      !check && (result.push(object))
    }
    return result
  }

  const filterServentia = (input: any): any => {
    let result: any = []
    for (const object of input) {
      let check = false
      'Serventia' in object.covers && (check = true)

      !check && (result.push(object))
    }
    return result
  }

  const filterJuízo = (input: any): any => {
    let result: any = []
    for (const object of input) {
      let check = false
      'Juízo' in object.covers && (check = true)

      !check && (result.push(object))
    }
    return result
  }

  const filterComarca = (input: any): any => {
    let result: any = []
    for (const object of input) {
      let check = false
      'Comarca da Capital' in object.covers && (check = true)
      'Comarca de Volta Redonda' in object.covers && (check = true)
      'Comarca de Maricá' in object.covers && (check = true)

      !check && (result.push(object))
    }
    return result
  }

  const filterCompetencia = (input: any): any => {
    let result: any = []
    for (const object of input) {

      if ('Competência' in object.covers) {
        let check = false
        object.covers.Competência.includes('Vara') && (check = true)
        object.covers.Competência.includes('Juizado Especial') && (check = true)

        !check && (result.push(object))
      } else if ('Competencia' in object.covers) {
        let check = false
        object.covers.Competencia.includes('Vara') && (check = true)
        object.covers.Competencia.includes('Juizado Especial') && (check = true)

        !check && (result.push(object))
      } else {
        result.push(object)
      }
    }
    return result
  }

  const filteredSuperiores = filterSuperiores(input)
  const filteredGrau = filterGrau(filteredSuperiores)
  const filteredOrgao = filterOrgao(filteredGrau)
  const filteredRelator = filterRelator(filteredOrgao)
  const filteredInstancia = filterInstancia(filteredRelator)
  const filteredVara = filterVara(filteredInstancia)
  const filteredSecretaria = filterSecretaria(filteredVara)
  const filteredServentia = filterServentia(filteredSecretaria)
  const filteredJuizo = filterJuízo(filteredServentia)
  const filteredComarca = filterComarca(filteredJuizo)
  const filteredCompetencia = filterCompetencia(filteredComarca)

  // console.log(input.length)
  // console.log(filteredSuperiores.length)
  // console.log(filteredGrau.length)
  // console.log(filteredOrgao.length)
  // console.log(filteredRelator.length)
  // console.log(filteredInstancia.length)
  // console.log(filteredVara.length)
  // console.log(filteredSecretaria.length)
  // console.log(filteredServentia.length)
  // console.log(filteredComarca.length)
  // console.log(filteredCompetencia.length)

  const returnCNJs = (input: any): any => {
    let result = []

    for (const object of input) {
      result.push({
        cnj: object.cnj, platformTag: object.platformTag,
        searchTag: object.searchTag,
      })
    }

    return result
  }

  console.log(returnCNJs(filteredCompetencia))
}