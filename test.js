const requests = require('./requests')

const r = new requests()

console.log(JSON.stringify(r.getConfig()))

async function execute() {
  let response = await r.get('https://randomuser.me/api/')
  console.log(JSON.stringify(response))
}

execute()
