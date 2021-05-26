const requests = require('./requests')

async function execute() {
  const r = new requests()
  console.log(JSON.stringify(r.getConfig()))
  let response = await r.get('https://randomuser.me/api/')
  console.log(JSON.stringify(response))
}

async function execute2() {
  const r = new requests({
    useAuth: true,
    authType: 'NTLM',
    credentials: {
      username: 'Walter_Ritzel',
      password: 'Wrpc.0522',
      workstation: 'workstation',
      domain: '',
    },
  })

  let response = await r.get(
    'https://lifecyclemgt.dell.com/api/LCM3Program/SearchByDomain?multiDomain=%22Christie%20Miller%22&dt=1621940925'
  )
  console.log(response.status_code, response.data.length)
}

execute()
execute2()
