# requests

O requests é um módulo node para facilitar a utilização das bibliotecas axios e ntlm.

O módulo requests torna transparente a utilização das duas bibliotecas, decidindo qual deve ser usada de acordo com a situação. A biblioteca ntlm é utilizada quando as chamadas de HTTP precisam de autenticação NTLM para acessar os dados.

## Como instalar?

```bash
npm install @wvcode/gsheet-wrapper
```

or

```bash
yarn add @wvcode/gsheet-wrapper
```

## Como utilizar

É bem simples, veja o exemplo abaixo:

```javascript
const requests = require('./requests')

const r = new requests()

console.log(JSON.stringify(r.getConfig()))

async function execute() {
  let response = await r.get('https://randomuser.me/api/')
  console.log(JSON.stringify(response))
}

execute()
```

## Finalizando

Esperamos que esse repositório te ajude em seus projetos!!!

**Bom código!!!**

### Autoria:

- Vanessa Stangherlin
- Walter Ritzel
