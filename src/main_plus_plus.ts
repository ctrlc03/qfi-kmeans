import fs from "fs"
import { findNumberOfProjects, parseVoteData, calculateTraditionalQFForAllProjects, MAX_ITERATIONS, TOLERANCE, outputToJSON, kmeansQFFixedIndexes } from "./ts/index.js"
import { kmeansQFPlusPlus } from "./ts/k-means.js"

const main = () => {
    const k = process.argv[2] ? parseInt(process.argv[2]) : 5

    const data = fs.readFileSync('./tests/data/usersBallotState.json').toString()

    const ballots: any = parseVoteData(data)
    const projects: any = findNumberOfProjects(ballots)

    const qf = kmeansQFPlusPlus(ballots, ballots.length, projects, k, MAX_ITERATIONS, TOLERANCE)
    console.log(qf)

    outputToJSON(qf, `./tests/data/output_k_means_plus_plus_k_${k}.json`)
}

main()