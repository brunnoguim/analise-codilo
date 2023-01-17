import { getFiles } from './analysis/codiloResponses/filesCheck/analysisFiles'
import lawsuits from './analysis/codiloResponses/initialCheck/input/lawsuitsCodilo.json'

const batch = lawsuits.slice(300)

getFiles(batch, 'batch5')