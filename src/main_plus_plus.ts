import fs from "fs"
import { findNumberOfProjects, parseVoteData, MAX_ITERATIONS, TOLERANCE } from "./ts/index.js"
import { kmeansQFPlusPlusAllCombinations } from "./ts/k-means.js"

const main = () => {
    const k = process.argv[2] ? parseInt(process.argv[2]) : 5

    const data = fs.readFileSync('./tests/data/usersBallotState.json').toString()

    const ballots: any = parseVoteData(data)
    const projects: any = findNumberOfProjects(ballots)

    kmeansQFPlusPlusAllCombinations(ballots, ballots.length, projects, k, MAX_ITERATIONS, TOLERANCE)
}

main()