function getRequestsConfig() {
  return {
    baseURL: null,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 0,
    responseType: 'json',
    responseEncoding: 'utf8',
    proxy: null,
  }
}

module.exports = getRequestsConfig
