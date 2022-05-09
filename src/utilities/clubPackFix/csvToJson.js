/**
 * https://www.convertcsv.com/csv-to-json.htm
 *
 * @type {{
 *    "Link": {
 *       "id": "https://private.globalclub.it/admin/users/profile/5fc8d38ed9c4e80021cb21f1"
 *    },
 *    "Nome Cognome": " Ornella Terrin",
 *    "Pack Attuale": "Basic",
 *    "gennaio": "Basic",
 *    "febbraio": "Basic",
 *    "marzo": "Basic",
 *    "aprile": "Basic",
 *    "maggio": "Basic",
 *    "giugno": "Basic",
 *    "SEMESTRE 1": "Basic",
 *    "luglio": "Basic",
 *    "agosto": "Basic",
 *    "settembre": "Basic",
 *    "ottobre": "Basic",
 *    "novembre": "Basic",
 *    "dicembre": "Basic",
 *    "Semestre__1": string,
 *    "Gennaio__1": "Basic",
 *     "Febbraio__1": "Basic",
 *     "Marzo__1": "Basic",
 *     "Aprile__1": "Basic",
 *     "Maggio__1": "",
 *     "Giugno__1": "",
 *     "Semestre__2": "",
 *     "Luglio__1": "",
 *     "Agosto__1": "",
 *     "Settembre__1": "",
 *     "Ottobre__1": "",
 *     "Novembre__1": "",
 *     "Dicembre__1": "",
 * }[]}
 */
const data = require('./lista.json')
const fs = require('fs')
const queries = {}
const finalString = [
  'var bulk = db.movements.initializeUnorderedBulkOp();\n'
]

for (const user of data) {
  const userUrl = user['Link/ID']
  const userId = userUrl.substring(userUrl.lastIndexOf('/') + 1).trim()
  const userName = user['nome'] + ' ' + user['cognome']
  // const months = [user['gennaio'], user['febbraio'], user['marzo'], user['aprile'], user['maggio'], user['giugno'], user['luglio'], user['agosto'], user['settembre'], user['ottobre'], user['novembre'], user['dicembre']]
  const months = [user['Febbraio__1'], user['Marzo__1'], user['Aprile__1']]
  
  if (!userId) {
    continue
  }
  
  queries[userId] = []
  
  for (const month in months) {
    let pack = months[month]
    
    // if no pack is provided, continue
    if (!pack) {
      continue
    }
    
    const startDate = new Date(2022, +month, 1)
    const endDate = new Date(2022, +month + 1, 1)
    
    if (pack.startsWith('Non Iscritto')) {
      pack = 'unsubscribed'
    } else {
      pack = pack.toLowerCase()
    }
    
    const filter = `"userId": ObjectId('${userId}'), "createdAt": {$gte: ISODate('${startDate.toISOString()}'), $lt: ISODate('${endDate.toISOString()}')}`
    const set = `clubPack: "${pack}"`
    
    finalString.push(`bulk.find( { ${filter} } ).update( { $set: { ${set} } } );`)
    
    queries[userId].push([
      {
        'userId': `ObjectId('${userId}')`,
        'created_at': {
          $gte: `ISODate('${startDate.toISOString()}')`,
          $lt: `ISODate('${endDate.toISOString()}')`
        }
      },
      { $set: { clubPack: pack } }
    ])
  }
  
  queries[userId] = `db.getCollection("movements").updateMany(
   ${queries[userId]}
  )`
}

finalString.push('\nbulk.execute().tojson();')

fs.writeFile('queries.js', finalString.join('\n'), () => {
})
