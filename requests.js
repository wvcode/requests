const axios = require('axios').default
const ntlm = require('axios-ntlm').NtlmClient
const config = require('./requests-config')
const _ = require('lodash')

/**
 * Classe para realizar operações via web
 */
class requests {
  #client = null
  #config = null

  /**
   * Cria instância da classe requests
   * @param {Object} cfg - configuração da classe
   */
  constructor(cfg = null) {
    this.#config = config()
    if (cfg) {
      Object.entries(cfg).forEach(([key, value]) => {
        this.#config[key] = value
      })
    }
    if (!this.#config.useAuth) {
      this.#client = axios.create(this.#config)
    } else {
      let cred = {
        username: this.#config.credentials.username,
        password: this.#config.credentials.password,
        domain: this.#config.credentials.domain,
        workstation: this.#config.credentials.workstation,
      }

      if (cred.username && cred.password) {
        this.#client = ntlm(cred, this.#config)
      } else {
        throw 'Credentials were not provided.'
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
    const response = await this.#client.get(
      this.returnFormattedURL(url),
      params
    )
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
