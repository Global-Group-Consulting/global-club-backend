const MongoClient = require('mongodb').MongoClient
const { ObjectId } = require('mongodb')
const assert = require('assert')
/**
 *
 * @type {{ _id: {$oid: string},
 *   userId: {$oid: string},
 *   movementType: number,
 *   amountChange: number,
 *   interestPercentage: number,
 *   depositOld: number,
 *   interestAmountOld: number,
 *   deposit: number,
 *   interestAmount: number,
 *   created_at: {"$date": {
 *       "$numberLong": "1642321009930"
 *     }}}[]}
 */
const movementsToCheck = require('./movimenti_a_zero.json')
const fs = require('fs')
const path = require('path')

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

MongoClient.connect(
  'mongodb+srv://ggc_production:1H%25Xv%246xm4iN@cluster0.t1po0.mongodb.net/global_club?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true },
  async function (connectErr, client) {
    assert.equal(null, connectErr)
    
    const query = { $or: [] }
    
    movementsToCheck.forEach((movement, i) => {
      const userId = movement.userId.$oid
      const date = new Date(+movement.created_at.$date.$numberLong)
      const month = date.getMonth()
      const year = date.getFullYear()
      
      /* if (i > 5) {
         return
       }*/
      
      query.$or.push({
        userId: ObjectId(userId),
        createdAt: {
          $gte: new Date(year, month, 1),
          $lt: new Date(year, month + 1, 1)
        },
        amountChange: { $gt: 0 },
        movementType: 'interest_recapitalized',
        clubPack: {
          $nin: ['unsubscribed', 'basic']
        }
      })
    })
    
    const collMovements = client.db('global_club').collection('movements')
    
    const targetRequests = await collMovements.find(query).toArray()
    
    console.log(targetRequests.length)
    fs.writeFileSync(path.resolve(__dirname, './movimentiDaCancellare.json'), JSON.stringify(targetRequests, null, 2))
    
    const deleteResult = await collMovements.deleteMany(query)
    fs.writeFileSync(path.resolve(__dirname, './deleteResult.json'), JSON.stringify(deleteResult, null, 2))
    
    client.close()
  })
