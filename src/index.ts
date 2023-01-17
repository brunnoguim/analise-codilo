import { getLongSteps } from './analysis/codiloResponses/filesCheck/analysisFiles'
import { writeJson } from './utils/writeFiles'

writeJson(getLongSteps(100), 'analysis/codiloResponses/fileSCheck/output', 'longSteps')