/**
 *
 * @type {{
 *    "_id": {
 *     "user": {
 *       "$oid": "5fc4a525a5a62400217a2e3f"
 *      },
 *     "year": 2021,
 *     "month": 4
 *    },
 *   "num": number,
 *   "sumEarned": number,
 *   "sumUsed": number,
 *   "sumRemaining": number
 *   }[]}
 */
const jsonData = require("./Users_fast_6000.json");
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
  const month = data._id.month;
  const year = data._id.year;
  const remaining = 1000 - data.sumUsed;
  
  if (remaining > 0 && year === 2021) {
    const diff = data.sumEarned - remaining;
    const semester = (month >= 7 ? 2 : 1);
    const semesterId = year.toString() + "_" + semester;
    
    const dates = calcBritesUsage(semesterId);
    
    // console.log(data.sumRemaining, remaining, diff);
    const createdAt = new Date(year, month-1, null, 23, 50)
    
    finalString.push(`bulk.insert( {
  "amountChange": ${diff},
  "userId": ObjectId("${userId}"),
  "semesterId": "${semesterId}",
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
