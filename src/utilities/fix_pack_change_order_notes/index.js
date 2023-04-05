const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const fs = require('fs')
const path = require('path')
const finalString = [
  'var bulk = db.orders.initializeUnorderedBulkOp();\n'
]
/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const field = 'notes'

MongoClient.connect(
  'mongodb+srv://ggc_production:1H%25Xv%246xm4iN@cluster0.t1po0.mongodb.net/global_club?retryWrites=true&w=majority',
  // 'mongodb+srv://ggc_staging:1H%25Xv%246xm4iN@cluster0.t1po0.mongodb.net/ggc_club_staging?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true },
  async function (connectErr, client) {
    assert.equal(null, connectErr)
    
    const collMovements = client.db('global_club').collection('orders')
    const targetRequests = await collMovements.find({ 'packChangeOrder': true }).toArray()
    
    targetRequests.map((item) => {
      const newNote = item.notes.split('\n').map((note) => {
        if (note.match(/Deposito(.*?)<br>/)) {
          return "";
        }
        return note.trim();
      })
      
      finalString.push(
        `bulk.find({ _id: ObjectId("${item._id.toString()}") }).updateOne({ $set: { 'notes': "${newNote.join("")}"} });`
      )
    })
    
    finalString.push('\nbulk.execute().tojson();')
    
    // const deleteResult = await collMovements.deleteMany(query)
    fs.writeFile(path.resolve(__dirname, field + '_queries.js'), finalString.join('\n'), () => {})
    
    await client.close()
  })
