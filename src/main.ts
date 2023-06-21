import fs from "fs"
import { findNumberOfProjects, parseVoteData, kmeansQF, calculateTraditionalQFForAllProjects, MAX_ITERATIONS, TOLERANCE } from "./ts/index.js"

const main = () => {
    const k = 5

    const data = fs.readFileSync('./tests/usersBallotState.json').toString()

    const ballots: any = parseVoteData(data)
    const projects: any = findNumberOfProjects(ballots)

    const qf = kmeansQF(ballots, ballots.length, projects, k, MAX_ITERATIONS, TOLERANCE)

    console.log("Voters", qf.voters)
    console.log("Projects", qf.projects)
    console.log("K", qf.k)
    console.log("Centroids", qf.centroids)
    console.log("Clusters size", qf.clusters)
    console.log("Assignments", qf.assignmnets)
    console.log("Coefficients", qf.coefficients)
    console.log("Voters Coefficients", qf.votersCoefficients)
    console.log("k-means QF allocations", qf.qfs)
    console.log(`We have iterated ${qf.iterations} times until converged with a tolerance of ${TOLERANCE} and MAX_ITERATIONS of ${MAX_ITERATIONS}`)

    const traditionalQF = calculateTraditionalQFForAllProjects(ballots.map((ballot: any) =>
    ballot.votes.map((vote: any) => vote.voteWeight)
    ), projects)

    console.log("Traditional QF allocations", traditionalQF)
}

main()