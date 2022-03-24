/**
 *
 * @type {{
 *    "_id": {
 *     "user": {
 *       "$oid": "5fc4a525a5a62400217a2e3f"
 *      },
 *     "semsterId": string
 *    },
 *   "num": number,
 *   "sumEarned": number,
 *   "sumUsed": number,
 *   "sumRemaining": number
 *   }[]}
 */
const jsonData = require("./users_limit_fast.json");
const fs = require("fs");
const queries = {};
const finalString = [
  "var bulk = db.movements.initializeUnorderedBulkOp();\n",
]

function calcBritesUsage(semesterString) {
  const semesterData = semesterString.split("_")
  const semesterYear = +semesterData[0]
  const semesterId = +semesterData[1]
  
  /* Usable from the next semester */
  const usableFrom = new Date(
    new Date(semesterId === 1 ? semesterYear : semesterYear + 1,
      semesterId === 1 ? 6 : 0,
      1, 0, 0, 0, 0)
  )
  
  /* Expires in 1 year */
  const expiresAt = new Date(
    new Date(
      new Date(usableFrom).setFullYear(usableFrom.getFullYear() + 1)
    ).setHours(23, 59, 59, 999)
  )
  
  return {
    semesterId: semesterString,
    usableFrom,
    expiresAt
  }
}

for (const data of jsonData) {
  const userId = data._id.user.$oid;
  const year = +data._id.semsterId.split("_")[0];
  const semester =  +data._id.semsterId.split("_")[1];
  const month = semester === 1 ? 6 : 12;
  const remaining = 6000 - data.sumUsed;
  
  if (remaining > 0 && year === 2021) {
    const diff = data.sumEarned - 6000;
    
    const dates = calcBritesUsage(data._id.semsterId);
    
    // console.log(data.sumRemaining, remaining, diff);
    const createdAt = new Date(year, month, null, 23, 50)
    
    finalString.push(`bulk.insert( {
  "amountChange": ${diff},
  "userId": ObjectId("${userId}"),
  "semesterId": "${data._id.semsterId}",
  "movementType": "deposit_removed",
  "referenceSemester": ${semester},
  "clubPack": "fast",
  "notes": "Adeguamento pack Fast",
  "bulkBasedOn": ${JSON.stringify(data)},
  "usableFrom": ISODate("${dates.usableFrom.toISOString()}"),
  "expiresAt": ISODate("${dates.expiresAt.toISOString()}"),
  "createdAt": ISODate("${createdAt.toISOString()}"),
  "updatedAt": ISODate("${createdAt.toISOString()}"),
});`)
  }
}

finalString.push("\nbulk.execute().tojson();");

fs.writeFile("queries.js", finalString.join("\n"), () => {
});
