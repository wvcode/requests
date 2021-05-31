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
  #safeObject = {}
  #useAuth = null
  #authType = null

  /**
   * Cria instância da classe requests
   * @param {Object} cfg - configuração da classe
   */
  constructor({
    clientConfig = null,
    useAuth = false,
    authType = null,
    credentials = null,
  } = {}) {
    this.#config = config()
    this.#useAuth = useAuth
    this.#authType = authType

    // Adiciona/Altera propriedades a configuração padrão que foi carregada
    if (clientConfig) {
      Object.entries(clientConfig).forEach(([key, value]) => {
        this.#config[key] = value
      })
    }

    if (!useAuth) {
      this.#client = axios.create(this.#config)
    } else {
      if (credentials?.username && credentials?.password) {
        if (authType == 'NTLM') {
          this.#client = {
            get: util.promisify(httpntlm.get),
            post: util.promisify(httpntlm.post),
          }

          Object.entries(credentials).forEach(([key, value]) => {
            this.#safeObject[key] = value
          })
        } else if (authType == 'Basic') {
          this.#client = axios.create(this.#config)

          Object.entries(credentials).forEach(([key, value]) => {
            this.#safeObject['auth'][key] = value
          })
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
    let formattedURL = url.startsWith('http')
      ? `${url}`
      : `${this.#config.baseURL || ''}${url}`
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
    if (!this.#useAuth) {
      response = await this.#client.get(this.returnFormattedURL(url))
    } else if (this.#useAuth && this.#authType == 'Basic') {
      response = await this.#client.get(
        this.returnFormattedURL(url),
        this.#safeObject
      )
    } else if (this.#useAuth && this.#authType == 'NTLM') {
      let obj = { ...this.#safeObject }
      obj['url'] = url
      let res = await this.#client.get(obj)
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

  /**
   * Realizar uma chamada HTTP no modo POST
   * @param {String} url - a url a ser chamada via HTTP
   * @param {Objeto JSON} data - dados (body) organizado em formato JSON
   * @returns Objeto JSON contendo os dados e o status da chamada
   */
  async post(url, data = null) {
    let response = null
    if (!this.#useAuth) {
      response = await this.#client.post(this.returnFormattedURL(url), data)
    } else if (this.#useAuth && this.#authType == 'Basic') {
      response = await this.#client.post(
        this.returnFormattedURL(url),
        data,
        this.#safeObject
      )
    } else if (this.#useAuth && this.#authType == 'NTLM') {
      let obj = { ...this.#safeObject }
      obj['url'] = url
      obj['data'] = data
      let res = await this.#client.post(obj)
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
        status_code: 998,
      }
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
