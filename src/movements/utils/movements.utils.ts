export function calcBritesUsage (semesterString: string): { semesterId: string, usableFrom: Date, expiresAt: Date } {
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

