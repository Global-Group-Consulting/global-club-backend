export function getLast4Semesters () {
  const now = new Date()
  const currSemester = now.getMonth() >= 6 ? 2 : 1
  const currYear = now.getFullYear()
  const toReturn = [`${currYear}_${currSemester}`]
  
  for (let i = 0; i < 3; i++) {
    const prevSemester = toReturn[toReturn.length - 1].split('_')
    let year = parseInt(prevSemester[0])
    let semester = parseInt(prevSemester[1]) - 1
    
    if (semester < 1) {
      semester = 2
      year--
    }
    
    toReturn.push(`${year}_${semester}`)
  }
  
  return toReturn
}

