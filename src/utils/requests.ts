import axios from 'axios'
import credentials from './secrets/credentials.json'

const id = credentials.id
const secret = credentials.secret

const URL = {
  auth: 'https://auth.codilo.com.br/oauth/token',
  pendentes: 'https://api.push.codilo.com.br/v1/pendentes'
}

export const authenticate = async () => {
  try {
    const body = {
      grant_type: 'client_credentials',
      id: id,
      secret: secret
    }
    const headers = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
    const result = await axios.post(URL.auth, body, headers)
    return result.data.access_token
  } catch (error) {
    return error
  }
}

export const pendingItems = async (token: string, CNJ: string) => {
  try {
    const headers = {
      headers: { 'Authorization': `Bearer ${token}` }
    }
    const result = await axios.get(`${URL.pendentes}?cnj=${CNJ}`, headers)
    return result.data
  } catch (error) {
    return error
  }
}

export const downloadFile = async (token: string, path: string) => {
  try {
    const headers = {
      headers: { 'Authorization': `Bearer ${token}` }
    }
    const result = await axios.get(path, headers)
    return result
  } catch (error) {
    return error
  }
}