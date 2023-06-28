import fs from "fs"
import { findNumberOfProjects, parseVoteData, calculateTraditionalQFForAllProjects, MAX_ITERATIONS, TOLERANCE, outputToJSON, kmeansQFFixedIndexes } from "./ts/index.js"

const main = () => {
    const k = process.argv[2] ? parseInt(process.argv[2]) : 5
    const indexes = process.argv[3] ? process.argv[3].split(",").map((index: string) => parseInt(index)) : []

    const data = fs.readFileSync('./tests/data/usersBallotState.json').toString()

    const ballots: any = parseVoteData(data)
    const projects: any = findNumberOfProjects(ballots)

    const qf = kmeansQFFixedIndexes(ballots, ballots.length, projects, k, indexes, MAX_ITERATIONS, TOLERANCE)

    // console.log("Voters", qf.voters)
    // console.log("Projects", qf.projects)
    // console.log("K", qf.k)
    // console.log("Centroids", qf.centroids)
    // console.log("Clusters size", qf.clusters)
    // console.log("Assignments", qf.assignments)
    // console.log("Coefficients", qf.coefficients)
    // console.log("Voters Coefficients", qf.votersCoefficients)
    // console.log("k-means QF allocations", qf.qfs)
    // console.log(`We have iterated ${qf.iterations} times until converged with a tolerance of ${TOLERANCE} and MAX_ITERATIONS of ${MAX_ITERATIONS}`)

    const traditionalQF = calculateTraditionalQFForAllProjects(ballots.map((ballot: any) =>
        ballot.votes.map((vote: any) => vote.voteWeight)
    ), projects)

    // console.log("Traditional QF allocations", traditionalQF)

    // console.log("Writing to file...", `./tests/data/output_fixed_indexes_k_${k}_indexes_${qf.initialCentroids.join("_")}.json`)
    outputToJSON(qf, `./tests/data/output_fixed_indexes_k_${k}_indexes_${qf.initialCentroids.join("_")}.json`)
}

main()