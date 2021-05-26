const axios = require('axios').default
const httpntlm = require('httpntlm')
const config = require('./requests-config')
const _ = require('lodash')
const util = require('util')

/**
 * Classe para realizar operações via web
 */
class requests {
  #client = null
  #config = null
  #safeObject = null
  #useAuth = null
  #authType = null

  /**
   * Cria instância da classe requests
   * @param {Object} cfg - configuração da classe
   */
  constructor({
    cfg = null,
    useAuth = false,
    authType = null,
    credentials = null,
  } = {}) {
    this.#config = config()
    this.#useAuth = useAuth
    this.#authType = authType

    if (cfg) {
      Object.entries(cfg).forEach(([key, value]) => {
        this.#config[key] = value
      })
    }
    if (!useAuth) {
      this.#client = axios.create(this.#config)
    } else {
      if (credentials.username && credentials.password) {
        if (authType == 'NTLM') {
          this.#client = util.promisify(httpntlm.get)
          this.#safeObject = {
            username: credentials.username,
            password: credentials.password,
            domain: credentials.domain,
            workstation: credentials.workstation,
          }
        } else if (authType == 'Basic') {
          this.#client = axios.create(this.#config)
          this.#safeObject = {
            auth: {
              username: credentials.username,
              password: credentials.password,
            },
          }
        } else {
          throw `Método ${authType} não reconhecido...`
        }
      } else {
        throw 'As credenciais não foram fornecidas.'
      }
    }
  }

  /**
   * Formata a URL, levando em consideração a existência de baseURL na configuração
   * @param {String} url - a URL a ser formatada
   * @returns a URL formatada
   */
  returnFormattedURL(url) {
    let formattedURL = ''
    if (url.startsWith('http')) {
      formattedURL = `${url}`
    } else {
      formattedURL = `${this.#config.baseURL || ''}${url}`
    }
    return formattedURL
  }

  /**
   * Realizar uma chamada HTTP no modo GET
   * @param {String} url - a url a ser chamada via HTTP
   * @param {Objeto JSON} params - parâmetros (query strings)
   * @returns Objeto JSON contendo os dados e o status da chamada
   */
  async get(url, params = null) {
    let response = null
    if (!this.#useAuth || (this.#useAuth && this.#authType == 'Basic')) {
      response = await this.#client.get(this.returnFormattedURL(url))
    } else if (this.#useAuth && this.#authType == 'Basic') {
      response = await this.#client.get(
        this.returnFormattedURL(url),
        this.#safeObject
      )
    } else if (this.#useAuth && this.#authType == 'NTLM') {
      let obj = { ...this.#safeObject }
      obj['url'] = url
      obj['rejectUnauthorized'] = false
      let res = await this.#client(obj)
      response = {
        data:
          this.#config.responseType == 'json' ? JSON.parse(res.body) : res.body,
        status: res.statusCode,
      }
    }
    if (response) return { data: response.data, status_code: response.status }
    else
      return {
        data: { error: 'Erro desconhecido' },
        status_code: 999,
      }
  }

  async getNtlm(url, params = null) {
    const response = await this.#client({
      url: this.returnFormattedURL(url),
      method: 'get',
    })
    return { data: response.data, status_code: response.status }
  }

  /**
   * Realizar uma chamada HTTP no modo POST
   * @param {String} url - a url a ser chamada via HTTP
   * @param {Objeto JSON} data - dados (body) organizado em formato JSON
   * @returns Objeto JSON contendo os dados e o status da chamada
   */
  async post(url, data = null) {
    const response = await this.#client.post(this.returnFormattedURL(url), data)
    return { data: response.data, status_code: response.status_code }
  }

  /**
   * Retorna a configuração que o objeto de requests está usando
   * @returns Objeto JSON de configuração
   */
  getConfig() {
    return this.#config
  }
}

module.exports = requests
