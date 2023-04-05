const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const fs = require('fs')
const path = require('path')
const finalString = [
  'var bulk = db.communications.initializeUnorderedBulkOp();\n'
]
/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const field = 'initiator'

MongoClient.connect(
  'mongodb+srv://ggc_production:1H%25Xv%246xm4iN@cluster0.t1po0.mongodb.net/global_club?retryWrites=true&w=majority',
  // 'mongodb+srv://ggc_staging:1H%25Xv%246xm4iN@cluster0.t1po0.mongodb.net/ggc_club_staging?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true },
  async function (connectErr, client) {
    assert.equal(null, connectErr)
    
    const collMovements = client.db('global_club').collection('communications')
    const targetRequests = await collMovements.aggregate([
      {
        '$match': {
          [`${field}.id`]: { $exists: true },
          [`${field}._id`]: {
            $ne: `${field}.id`
          }
        }
      }
    ]).toArray()
  
    targetRequests.map((item) => {
      if (!item[field].id) {
        return
      }
      
      finalString.push(
        `bulk.find({ _id: ObjectId("${item._id.toString()}") }).updateOne({ $set: { '${field}._id': ObjectId("${item.initiator.id.toString()}") } });`
      )
      
      // return collMovements.updateOne({ _id: item._id }, { $set: { 'initiator._id': castToObjectId(item.initiator.id) } })
    })
  
    finalString.push('\nbulk.execute().tojson();')
    
    // const deleteResult = await collMovements.deleteMany(query)
    fs.writeFile(path.resolve(__dirname, field + '_queries.js'), finalString.join('\n'), () => {})
    
    await client.close()
  })
