import {Injectable} from '@nestjs/common';
import {OnEvent} from "@nestjs/event-emitter";

@Injectable()
export class AppService {
  constructor() {
  }
  
  /*async getHello(): Promise<any> {
    const data = await this.movementsService.model.aggregate([
      {
        '$match': {
          'clubPack': {
            '$exists': false
          },
          'semesterId': '2021_1',
          'movementType': 'interest_recapitalized'
        }
      }, {
        '$group': {
          '_id': '$userId',
          'mov': {
            '$push': '$$ROOT'
          }
        }
      }/!*, {
        '$count': 'totale'
      }*!/
    ])
    const userIds = data.reduce((acc, curr) => {
      acc.push(curr._id);
      
      return acc;
    }, [])
    const firstMovements = await this.movementsService.model.aggregate([
      {
        "$match": {
          semesterId: "2021_2",
          userId: {"$in": userIds}
        }
      }, {
        '$group': {
          _id: {userId: "$userId"},
          movement: {
            "$push": "$$ROOT"
          },
          fast: {
            $push: {
              "$cond": [
                {"$eq": ["$clubPack", "fast"]},
                "$$ROOT",
                "$$REMOVE"
              ]
            }
          },
          premium: {
            $push: {
              "$cond": [
                {"$eq": ["$clubPack", "premium"]},
                "$$ROOT",
                "$$REMOVE"
              ]
            }
          },
          basic: {
            $push: {
              "$cond": [
                {"$eq": ["$clubPack", "basic"]},
                "$$ROOT",
                "$$REMOVE"
              ]
            }
          }
        }
      }, {
        '$addFields': {
          'first': {
            '$arrayElemAt': [
              '$movement', 0
            ]
          }
        }
      },/!* {
        "$project": {
          _id: 1,
          first: 1
        }
      }*!/
    ])
    
    return firstMovements.map(el => {
      const fast = el.fast.length;
      const basic = el.basic.length;
      const premium = el.premium.length;
      const changedPack = []
      
      if (fast) {
        changedPack.push("fast")
      }
      
      if (basic) {
        changedPack.push("basic")
      }
      
      if (premium) {
        changedPack.push("premium")
      }
      
      const toReturn = {
        userId: el._id.userId,
        pack: el.first?.clubPack,
        
        link: "https://private.globalclub.it/admin/users/profile/" + el._id.userId
      }
      
      if (changedPack.length > 1) {
        toReturn["packCambiati"] = changedPack;
      }
      
      return toReturn
    });
    
    const withPackChange = firstMovements.filter(el => {
      const fast = el.fast.length;
      const basic = el.basic.length;
      const premium = el.premium.length;
      const changedPack = []
      
      if (fast) {
        changedPack.push(fast)
      }
      
      if (basic) {
        changedPack.push(basic)
      }
      
      if (premium) {
        changedPack.push(premium)
      }
      
      return changedPack.length > 1
    })
    
    return withPackChange.map(el => {
      const fast = el.fast.length;
      const basic = el.basic.length;
      const premium = el.premium.length;
      const changedPack = []
      
      if (fast) {
        changedPack.push("fast")
      }
      
      if (basic) {
        changedPack.push("basic")
      }
      
      if (premium) {
        changedPack.push("premium")
      }
      
      return {
        userId: el._id.userId,
        pack: changedPack,
        link: "https://private.globalclub.it/admin/users/profile/" + el._id.userId
      }
    });
    // const test = await this.pippoQueue.getJobCounts()
    // await this.pippoQueue.add("send_pippo", {firstName: "Florian", lastName: "Leica"})
    // console.log(test);
    return 'Hi, nice to see you around!';
  }*/
  
  async getHello(): Promise<any> {
    return 'Hi, nice to see you around!';
  }
  
}
