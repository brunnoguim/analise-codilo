import axios from 'axios'

const URL = {
  auth: 'https://auth.codilo.com.br/oauth/token',
  pendentes: 'https://api.push.codilo.com.br/v1/pendentes'
}

export const authenticate = async (id: string, secret: string) => {
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