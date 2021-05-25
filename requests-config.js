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
    useAuth: false,
    credentials: {
      username: null,
      password: null,
      domain: null,
      workstation: null,
    },
  }
}

module.exports = getRequestsConfig
