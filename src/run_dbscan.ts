import { UserBallot, parseVoteData, DBSCAN } from "./ts/index.js"
import fs from "fs"
import { expandNumberToArray } from "./ts/utilities.js"

function gridSearchDBSCAN(dataset: number[][], epsValues: number[], minPtsValues: number[]): any {
    let bestEpsSilhouette = -1
    let bestMinPtsSilhouette = -1
    let bestSilhouetteScore = -Infinity  // Higher is better

    let bestEpsDunn = -1
    let bestMinPtsDunn = -1
    let bestDunnScore = -Infinity  // Higher is better

    let bestEpsDB = -1
    let bestMinPtsDB = -1
    let bestDBScore = Infinity  // Lower is better

    for (let eps of epsValues) {
        for (let minPts of minPtsValues) {
            const dbscan = new DBSCAN(dataset, eps, minPts)
            dbscan.fit()

            const silhouetteScore = dbscan.silhouetteScore()
            const dunnScore = dbscan.dunnIndex()
            const dbScore = dbscan.daviesBouldinIndex()

            // Check for best Silhouette score
            if (silhouetteScore > bestSilhouetteScore) {
                bestEpsSilhouette = eps
                bestMinPtsSilhouette = minPts
                bestSilhouetteScore = silhouetteScore
            }

            // Check for best Dunn score
            if (dunnScore > bestDunnScore) {
                bestEpsDunn = eps
                bestMinPtsDunn = minPts
                bestDunnScore = dunnScore
            }

            // Check for best Davies-Bouldin score
            if (dbScore < bestDBScore) {
                bestEpsDB = eps
                bestMinPtsDB = minPts
                bestDBScore = dbScore
            }
        }
    }

    return {
        silhouette: {
            bestEps: bestEpsSilhouette,
            bestMinPts: bestMinPtsSilhouette,
            bestScore: bestSilhouetteScore
        },
        dunn: {
            bestEps: bestEpsDunn,
            bestMinPts: bestMinPtsDunn,
            bestScore: bestDunnScore
        },
        daviesBouldin: {
            bestEps: bestEpsDB,
            bestMinPts: bestMinPtsDB,
            bestScore: bestDBScore
        }
    }
}

const findNumberOfProjects = (ballots: UserBallot[]) => {
    let largestVoteIndex = 0 
    for (const ballot of ballots) {
        for (const vote of ballot.votes) {
            if (vote.voteOption > largestVoteIndex) largestVoteIndex = vote.voteOption
        }
    }

    return largestVoteIndex 
}

const voteOptionExists = (ballot: UserBallot, voteOption: number): boolean => {
    return ballot.votes.some(vote => vote.voteOption === voteOption)
}

/**
 * Method to identify and add zero votes to a ballot
 * @param ballot <UserBallot> The ballot to add the zero votes to
 * @param projects <number> The number of projects
 * @returns <UserBallot> The ballot with the zero votes 
 */ 
const extractZeroVotes = (ballot: UserBallot, projects: number): UserBallot => {
    // extract the vote options for a ballot 
    const existingVoteOptions = ballot.votes.map(vote => vote.voteOption)
    // find the missing vote options for a particular ballot
    const missingVoteOptions = expandNumberToArray(projects).filter(option => !existingVoteOptions.includes(option))
    // create the zero votes
    const zeroVotes = missingVoteOptions.map(option => ({
        voteOption: option,
        voteWeight: 0
    }))
    // return the ballot with the zero votes added
    const newBallot = [...ballot.votes, ...zeroVotes]

    return {
        votes: newBallot.sort((a, b) => a.voteOption - b.voteOption)
    }
}

/**
 * Add zero votes to the ballots which are missing certain vote indexes
 */
const addZeroVotesToBallots = (ballots: UserBallot[], projects: number) => {
    // modify the array passed as reference
    ballots.forEach((ballot, index) => {
        const missingVotes = extractZeroVotes(ballot, projects);
        
        ballots[index] = {
            votes: [...missingVotes.votes]
        }
    })  
}

const main = () => {
    const data = fs.readFileSync("./tests/data/gitcoin/mainnet_votes_parsed_0xe575282b376e3c9886779a841a2510f1dd8c2ce4.json").toString()

    const ballots: UserBallot[] = parseVoteData(data)
   

    const projects = findNumberOfProjects(ballots)
    addZeroVotesToBallots(ballots, projects)

    const weights = ballots.map(ballot => ballot.votes.map(vote => vote.voteWeight))
    fs.writeFileSync("./tests/data/gitcoin/weights.json", JSON.stringify(weights, null, 4))

    return 
    const epsValues = [0.1, 0.2, 0.3, 0.4, 0.5]  // Example eps values for grid search
    const minPtsValues = [2, 3, 4, 5, 6]  // Example minPts values for grid search

    const bestParams = gridSearchDBSCAN(weights, epsValues, minPtsValues)
    console.log("Best Parameters based on Silhouette Score:", bestParams.silhouette)
    console.log("Best Parameters based on Dunn Index:", bestParams.dunn)
    console.log("Best Parameters based on Davies-Bouldin Index:", bestParams.daviesBouldin)
}

main()


