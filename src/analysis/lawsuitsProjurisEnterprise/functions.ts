const segments = [
  'Supremo Tribunal Federal',
  'Conselho Nacional de Justica',
  'Superior Tribunal de Justica',
  'Justica Federal',
  'Justica do Trabalho',
  'Justica Eleitoral',
  'Justica Militar da Uniao',
  'Justica dos Estados e do Distrito Federal e Territorios',
  'Justica Militar Estadual'
]

const courts = [
  'do Acre',
  'de Alagoas',
  'do Amapa',
  'de Amazonas',
  'da Bahia',
  'do Ceara',
  'do Distrito Federal',
  'do Espirito Santo',
  'de Goias',
  'do Maranhao',
  'do Mato Grosso',
  'do Mato Grosso do Sul',
  'de Minas Gerais',
  'do Para',
  'da Paraiba',
  'do Parana',
  'de Pernambuco',
  'do Piaui',
  'do Rio de Janeiro',
  'do Rio Grande do Norte',
  'do Rio Grande do Sul',
  'de Rondonia',
  'de Roraima',
  'de Santa Catarina',
  'de Sergipe',
  'de Sao Paulo',
  'do Tocantins'
]

interface labeledLawsuit {
  numeroProcesso: string,
  segmento: string,
  tribunal: string,
}

const checkCNJ = (lawsuitNo: string): boolean => {

  let result = true

  /** checking the string length */
  lawsuitNo.length != 25 && (result = false)

  /** checking the CNJ mask */
  if (result) {
    let check = lawsuitNo.charAt(7)
    check += lawsuitNo.charAt(10)
    check += lawsuitNo.charAt(15)
    check += lawsuitNo.charAt(17)
    check += lawsuitNo.charAt(20)
    if (check != '-....' || lawsuitNo.charAt(16) === '0') { result = false }
  }

  /** checking the lawsuit's year */
  if (result) {
    const year = Number(lawsuitNo.substring(11, 15))
    if (year < 1950 || year > 2022) { result = false }
  }
  return result
}

export const filterNonCNJ = (input: string[]): string[] => {
  let result: string[] = []

  for (const item of input) {
    checkCNJ(item) && result.push(item)
  }

  return result
}

const checkSegment = (segmentNo: number): string => {
  return segments[segmentNo - 1]
}

const checkCourt = (courtNo: number, segmentNo: number): string => {
  if (segmentNo === 8) { return `Tribunal de Justica ${courts[courtNo - 1]}` }
  else if (segmentNo === 5) { return `TRT${courtNo}` }
  else if (segmentNo === 4) { return `TRF${courtNo}` }
  else if (segmentNo === 6) { return `Tribunal Regional Eleitoral ${courts[courtNo - 1]}` }
  else { return 'N/A' }
}

export const labelLawsuits = (lawsuits: string[]): labeledLawsuit[] => {

  let result: labeledLawsuit[] = []

  for (const lawsuit of lawsuits) {
    result.push({
      numeroProcesso: lawsuit,
      segmento: checkSegment(Number(lawsuit.substring(16, 17))),
      tribunal: checkCourt(Number(lawsuit.substring(18, 20)), Number(lawsuit.substring(16, 17))),
    })
  }

  return result
}