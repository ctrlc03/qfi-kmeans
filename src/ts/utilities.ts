import { UserBallot, Vote } from "./interfaces";

/**
 * Generate a random integer between min and max
 * @param min <number> The minimum value
 * @param max <number> The maximum value
 * @returns <number> A random integer between min and max
 */
export const randomIntegerIncluded = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Expand a number to an array of number 1 <= num 
 * @param num <number> The number to expand
 * @returns <number[]> The expanded number
 */
export const expandNumberToArray = (num: number): number[] => {
    return Array.from({ length: num }, (_, index) => index+1)
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

// the maximum amount that a user can contribute to a project
export const MAX_CONTRIBUTION_AMOUNT = 50
// how many times should we run the algorithm
export const MAX_ITERATIONS = 100
// @todo calculate tolerance based on the number of projects, voters, vote amounts
export const TOLERANCE = 0.1