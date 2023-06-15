import { UserBallot, Vote } from "./interfaces"
import { randomIntegerIncluded } from "./utilities"

/**
 * Check if a voteOption already exists in a UserBallot
 * @param ballot <UserBallot> The ballot to check
 * @param voteOption <number> The vote option to check
 * @returns <boolean> True if the vote option exists, false otherwise
 */
export const voteOptionExists = (ballot: UserBallot, voteOption: number): boolean => {
    return ballot.votes.some(vote => vote.voteOption === voteOption)
}

/**
 * Expand a number to an array of number 0 <= num 
 * @param num <number> The number to expand
 * @returns <number[]> The expanded number
 */
export const expandNumberToArray = (num: number): number[] => {
    return Array.from({ length: num + 1 }, (_, index) => index)
}

/**
 * Function to add a zero vote to a UserBallot for missing voteOptions
 * @param ballot <UserBallot> The ballot to add the zero votes to
 * @param projects <number> The number of projects
 * @returns <UserBallot> The ballot with the zero votes 
 */ 
export const extractZeroVotes = (ballot: UserBallot, projects: number): UserBallot => {
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
 * Find the number of projects based on the largest vote index 
 * @notice only used for testing, in real world scenarios we would know the number of projects
 * @param ballots <UserBallot[]> The ballots
 * @returns <number> The number of projects
 */
export const findNumberOfProjects = (ballots: UserBallot[]): number => {
    let largestVoteIndex = 0 
    for (const ballot of ballots) {
        for (const vote of ballot.votes) {
            if (vote.voteOption > largestVoteIndex) largestVoteIndex = vote.voteOption
        }
    }

    return largestVoteIndex
}

/**
 * Find the largest vote index for a user ballot
 * @param ballots <UserBallot[]> The ballots
 * @returns <number> The largest vote index
 */
export const findLargestVoteIndex = (ballots: UserBallot[]): number => {
    let largestVoteIndex = 0 
    for (const ballot of ballots) {
        if (ballot.votes.length - 1 > largestVoteIndex) largestVoteIndex = ballot.votes.length - 1
    }

    return largestVoteIndex
}

/**
 * Parse the JSON data into a UserBallot array
 * @param data <string> The data to parse
 * @returns <UserBallot[]> The parsed data
 */
export const parseVoteData = (data: string): UserBallot[] => {
    const userBallots: UserBallot[] = []
    // parse into JSON
    const parsed = JSON.parse(data)
    
    // loop through each ballot
    for (const ballot of parsed) {
        const userVotes: Vote[] = []
        // loop through each key 
        Object.keys(ballot).map((key: string) => {
            // create the tmp Vote object
            userVotes.push({
                voteOption: parseInt(ballot[key].voteOption),
                voteWeight: parseInt(ballot[key].voteWeight)
            })
        })

        userBallots.push({
            votes: userVotes
        })
    }

    return userBallots
}


/**
 * Add zero votes to a ballot
 * @param ballots <UserBallot[]> The ballots
 * @param projects <number> The number of projects
 */
export const addZeroVotesToBallots = (ballots: UserBallot[], projects: number): void => {
    // modify the array passed as reference
    ballots.forEach((ballot, index) => {
        const missingVotes = extractZeroVotes(ballot, projects);
        ballots[index] = {
            votes: [...missingVotes.votes]
        }
    })
}

/**
 * Generate the centroids with the extract of a QF/QV round
 * @param k <number> The number of clusters
 * @param ballots <UserBallot[]> The ballots
 * @returns <Vote[][]> The centroids
 */
export const generateCentroidsWithRealData = (k: number, ballots: UserBallot[]): Vote[][] => {
    const centroids: Vote[][] = []
    const selectedIndexes: number[] = []
    const numberOfVoters = ballots.length

    // loop for k times
    for (let i = 0; i < k; i++) {
        // create a temp random index
        let randomIndex = randomIntegerIncluded(0, numberOfVoters-1)
        // check that the index is not already in the array
        while(selectedIndexes.includes(randomIndex)) {
            randomIndex = randomIntegerIncluded(0, numberOfVoters-1)
        }

        // store it in the selected indexes array
        selectedIndexes.push(randomIndex)
        // store the votes at ballot randomIndex in the centroids array
        centroids.push(ballots[randomIndex].votes)
    }

    return centroids
}


/**
 * Calculate the euclidean distance between two votes
 * @notice in a simple k-means algo we would have two points
 * @notice point1 = {x: vote1, y: vote2} and point2 = {x: vote1, y: vote2}
 * @notice but in our case we have x votes (contributions) for each project
 * @param vote1 <number[]> The first array of votes
 * @param vote2 <number[]> The second array of votes
 * @param numberOfProjects <number> The number of projects
 * @returns <number> The distance between the two votes
 */
// export const calculateDistanceWithRealData = (votes1: Vote[], votes2: Vote[], numberOfProjects: number): number => {
//     // hold tmp result
//     let tmpDistance = 0
//     // loop through the projects that we have 
//     for (let i=0; i<numberOfProjects; i++) {
//         // need to calculate the tmp distance between the two votes (they should be for the same project)
//         // votes2[index] - votes1[index] * votes2[index] - votes1[index]
//         tmpDistance += (votes2[i] - votes1[i]) * (votes2[i] - votes1[i])
//     }
//     // return the square root 
//     return Math.sqrt(tmpDistance)
// }