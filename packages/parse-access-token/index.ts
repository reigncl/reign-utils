type Token = string
type BearerToken = `Bearer ${Token}`

interface Query {
  access_token?: Token
  key?: Token
  [k: string]: any
  [k: number]: any
}

interface Headers {
  'x-api-key'?: Token
  'authorization'?: Token | BearerToken
  [k: string]: any
  [k: number]: any
}

type ReqObj = {
  query?: Query
  headers?: Headers;
  [k: string]: any
  [k: number]: any
}

export const isString = (v: any): v is Token => typeof v === 'string'
export const isBearerToken = (v: any): v is BearerToken => isString(v) && /^Bearer\s/i.test(v)

export function parseAccessToken(opts: ReqObj): string | null {
  const { query, headers } = opts

  const queryAccessToken = query?.access_token
  const queryKey = query?.key
  const headerApiKey = headers?.['x-api-key']
  const headerAuthorization = headers?.authorization

  if (isBearerToken(headerAuthorization)) return headerAuthorization.split(' ')[1]
  if (isString(queryAccessToken)) return queryAccessToken
  if (isString(queryKey)) return queryKey
  if (isString(headerApiKey)) return headerApiKey

  return null
}

export default parseAccessToken
