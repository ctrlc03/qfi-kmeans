import { Cluster, Coefficent, KMeansQF, UserBallot, Vote, VotersCoefficients } from "./interfaces.js"
import { MAX_ITERATIONS, TOLERANCE, randomIntegerIncluded } from "./utilities.js"
import fs from "fs"

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
 * Expand a number to an array of number 1 <= num 
 * @param num <number> The number to expand
 * @returns <number[]> The expanded number
 */
export const expandNumberToArray = (num: number): number[] => {
    return Array.from({ length: num }, (_, index) => index+1)
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
 * @returns <any> The centroids and selected indexes
 */
// @todo optimize - do not pass UserBallot but the weights only
export const calculateCentroids = (
    k: number, 
    ballots: UserBallot[]
    ): any => {
    // store the generated centroids
    const centroids: number[][] = []
    // holds the indexes that have already been selected
    const selectedIndexes: number[] = []

    // loop for k times
    for (let i = 0; i < k; i++) {
        // create a temp random index to pick a ballot
        let randomIndex = randomIntegerIncluded(0, ballots.length-1)
        // check that the index is not already in the array
        while(selectedIndexes.includes(randomIndex)) {
            randomIndex = randomIntegerIncluded(0, ballots.length-1)
        }

        // store it in the selected indexes array so it is not selected again
        selectedIndexes.push(randomIndex)
        // store the votes at ballots[randomIndex] in the centroids array
        centroids.push(ballots[randomIndex].votes.map(vote => vote.voteWeight))
    }

    return {
        centroids,
        selectedIndexes 
    }
}

/**
 * Calculate the initial centroids based on the k-means++
 * @param weights <number[][]> The weights taken from the ballots
 * @param k <number> The number of clusters
 * @returns <any> The initial centroids and the indexes 
 */
export const calculateInitialCentroidsPlusPlus = (
    weights: number[][],
    k: number
    ): any => {
    if (k > weights.length) throw new Error("The number of centroids cannot be greater than the number of ballots")

    // select the first centroid randomly
    const centroids: number[][] = [weights[randomIntegerIncluded(0, weights.length-1)]]

    // select the other centroids based on the distance from this centroid
    while (centroids.length < k) {
        const distances = calculateDistancePlusPlus(weights, centroids)
        centroids.push(selectNextCentroid(weights, distances))
    }

    const indexes: number[] = []

    for (const centroid of centroids) {
        indexes.push(weights.indexOf(centroid))
    }
    return {
        centroids,
        indexes
    } 
}

/**
 * Take the ballot weights and the centroids and 
 * return an array of distances between the weights and
 * their nearest centroid
 * @param weights <number[][]> The weights
 * @param centroids <number[][]> The centroids
 * @returns <number[]> The distances
 */
export const calculateDistancePlusPlus = (weights: number[][], centroids: number[][]): number[] => {
    return weights.map(weight => Math.min(...centroids.map(centroid => calculateDistance(weight, centroid))))
}

/**
 * Selects the next centroid based on the k-means++ initialization
 * 
 * @param weights <number[][]> The weights
 * @param distances <number[]> The distances
 * @returns <number[]> The next centroid
 */
export const selectNextCentroid = (weights: number[][], distances: number[]): number[] => {
    // sum all of the distances 
    const sum = distances.reduce((a, b) => a + b, 0)
    // probabilities are the relative distance of a weight to the 
    // nearest centroid
    const probabilities = distances.map(distance => distance / sum)
    // generate a random number between 0 and 1
    const random = Math.random()
    let sumProbabilities = 0
    // loop through the probabilities array
    for (let i = 0; i < probabilities.length; i++) {
        // sum them up
        sumProbabilities += probabilities[i]
        // if the random number is less or equal than the sum of the probabilities
        // we have found our next centroid
        if (random <= sumProbabilities) return weights[i]
    }

    // if no centroid was seleted, we return the last one
    // should not hit
    return weights[weights.length-1]
}

/**
 * Generate the centroids with the extract of a QF/QV round
 * @param k <number> The number of clusters
 * @param ballots <UserBallot[]> The ballots
 * @param indexes <number[]> The indexes to use for the centroids
 * @returns <number[][]> The centroids
 */
// @todo optimize - do not pass UserBallot but the weights only
export const calculateCentroidsWithIndexes = (
    k: number, 
    ballots: UserBallot[],
    indexes: number[]
    ): number[][] => {
    // store the generated centroids
    const centroids: number[][] = []
 
    // loop for k times
    for (let i = 0; i < k; i++) {
        // create a temp random index to pick a ballot
        const index = indexes[i]
        // store the votes at ballots[index] in the centroids array
        centroids.push(ballots[index].votes.map(vote => vote.voteWeight))
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
export const calculateDistance = (
    votes1: number[], 
    votes2: number[], 
    ): number => {
    // some error handling
    if (votes1.length !== votes2.length) 
        throw new Error("The two arrays of votes should have the same length")
    
    // hold tmp result
    let tmpDistance = 0
    // loop through the projects that we have 
    // we already added zero votes to make the vote array for each user 
    // the same length, and ordered it
    for (let i=0; i<votes1.length; i++) {
        // need to calculate the tmp distance between the two votes 
        // (they should be for the same project)
        // add to the tmp distance
        tmpDistance += Math.pow(votes2[i] - votes1[i], 2) 
    }
    // return the square root 
    return Math.sqrt(tmpDistance)
}

/**
 * Assign the votes to the nearest cluster
 * @param votes <number[][]> The votes
 * @param centroids <number[][]> The centroids
 * @returns <number[]> The centeroid to which each array of votes is assigned to
 */
// @todo optimize this and pass already the weights rather than mapping them again 
export const assignVotesToClusters = (
    ballots: UserBallot[], 
    centroids: number[][]
    ): number[] => {
    // we store the assignments in this array of numbers
    const assignments: number[] = []
    // loop through each vote

    for (const ballot of ballots) {
        let minDistance = Infinity
        let clusterIndex = -1
        const weights = ballot.votes.map(vote => vote.voteWeight)
        // loop through the centroids
        for (let i = 0; i < centroids.length; i++) {
            // break out early if the two arrays are the same
            if (JSON.stringify(weights) === JSON.stringify(centroids[i])) {
                clusterIndex = i
                break 
            }
            // calculate the distance between the vote array (for each user) and the centeroids
            const distance = calculateDistance(weights, centroids[i])

            // check if we have a new minimum distance 
            if (distance < minDistance) {
                minDistance = distance
                // once we found it - we assign the vote array to the nearest cluster
                clusterIndex = i
            }
        }
        // store the cluster index in the assignments array
        assignments.push(clusterIndex)
    }
    // each array of votes (of a contributor) is assigned to a cluster
    return assignments 
}

/**
 * Update the centroids
 * @notice to be run after the first distance calculation
 * @param votes <number[][]> The votes
 * @param assignments <number[]> The assignments
 * @param k <number> The number of clusters
 * @param projectsLength <number> The number of projects
 * @returns <number[][]> The updated centroids
 */
export const updateCentroids = (
    votes: number[][], 
    assignments: number[], 
    k: number, 
    projectsLength: number
    ): number[][] => {
    // store the new centroids 
    // (now they are an array of numbers as we only storing the vote weight)
    const newCentroids: number[][] = []
    // loop through the clusters
    for (let i = 0; i < k; i++) {
        // get the votes assigned to the cluster
        const assignedVotes = votes.filter((_, index) => assignments[index] === i)

        // store tmp mean 
        const tmpMean: number[] = []
        // loop through the projects
        for (let i = 0; i < projectsLength; i++) {
            // calculate the mean of the votes for each project
            const mean = assignedVotes.reduce(
                (sum, vote) => sum + vote[i], 0
                ) / assignedVotes.length
            // store it in the tmp sum array 
            tmpMean.push(mean)
        }
        // store it in the new centroids array 
        newCentroids.push(tmpMean)
    }
    
    return newCentroids
}

/**
 * Calculate how many votes are assigned to each cluster
 * @param assignments <number[]> The assignments
 * @param k <number> The number of clusters
 * @returns <Cluster[]> The size of each cluster
 */
export const calculateClustersSize = (assignments: number[], k: number): Cluster[] => {
    const clustersSizes: Cluster[] = Array.from({length: k}, (_, index) => ({index: index, size: 0}));
    
    for (let assignment of assignments) clustersSizes[assignment].size++;

    return clustersSizes
}

/**
 * Calculate the coefficents for each cluster
 * @notice the coefficient is 1/cluster size
 * @param clustersSize <Cluster[]> The object of clusters size
 * @returns <Coefficent[]> The coefficents
 */
export const calculateCoefficents = (clustersSize: Cluster[]): Coefficent[] => {
    const coefficents: Coefficent[] = []
    // loop through all the clusters
    for (const clusterSize of clustersSize) 
        // store the cluster index and the coefficient (1/cluster size)
        coefficents.push({
            clusterIndex: clusterSize.index,
            // if the size is zero then the coefficient is 1 (or zero)
            // this means no users will have this coefficient
            coefficient: clusterSize.size !== 0 ?  1/clusterSize.size : 1
        })
    
    return coefficents
}

/**
 * Assign each voter to its coefficient and cluster number
 * @param assignments <number[]> The assignments
 * @param coefficents <Coefficent[]> The coefficents
 * @returns <VotersCoefficents[]> The voters coefficents
 */
export const assignVotersCoefficient = (assignments: number[], coefficents: Coefficent[]): VotersCoefficients[] => {
    const votersCoefficients: VotersCoefficients[] = []
    // loop through all assignments
    for (let i = 0; i < assignments.length; i++) {
        // create and store a new object with the voter index, cluster index and coefficient
        votersCoefficients.push({
            voterIndex: i,
            clusterIndex: assignments[i],
            coefficent: coefficents.find(coefficent => coefficent.clusterIndex === assignments[i])?.coefficient || 0
        })
    }

    return votersCoefficients
}

/**
 * Calculate the matching amount per project based on the votes
 * and the coefficients
 * @param votersCoefficients <VotersCoefficients[]> The voters coefficents
 * @param ballots <UserBallot[]> The user ballots with the votes
 * @param projectIndex <number> The project index
 * @returns <number> The matching amount
 */
export const calculateQFPerProject = (
    votersCoefficients: VotersCoefficients[], 
    ballots: UserBallot[], 
    projectIndex: number
    ): number => {
    // =SUM([vote1User1*s,vote1User2*r,vote1User3*t]**0.5)**2
    // interim sum 
    let sum = 0

    // loop through votes array
    for (const ballot of ballots) {
        const index = ballots.indexOf(ballot)
        sum += Math.sqrt(
            ballot.votes[projectIndex].voteWeight * 
            votersCoefficients[index].coefficent
        )
    }

    // the result should be squared
    return Math.pow(sum, 2)
}

/**
 * Calculate the QF for each project
 * @param ballots <number[][]> The votes
 * @param projectIndex <number> The project index
 * @returns <number> The QF for the project
 */
export const calculateTraditionalQF = (
    ballots: number[][],
    projectIndex: number 
): number => {
    // =SUM([vote1User1,vote1User2,vote1User3]**0.5)**2
    let sum = 0
    // loop through ballots
    for (let i = 0; i < ballots.length; i++) {
        // add up to the sum the square root of the vote weight for x project
        sum += Math.sqrt(ballots[projectIndex][projectIndex])
    }
    // the result should be squared
    return Math.pow(sum, 2)
}

/**
 * Calculate all allocations for all projects using
 * the traditional QF calculation
 * @param ballots <number[][]> The votes
 * @param projectsLength <number> The number of projects
 * @returns <number[]> The QF for each project
 */
export const calculateTraditionalQFForAllProjects = (
    ballots: number[][],
    projectsLength: number
): number[] => {
    const qf: number[] = []
    // loop through projects
    for (let i = 0; i < projectsLength; i++) {
        // calculate the QF for each project
        qf.push(calculateTraditionalQF(ballots, i))
    }

    return qf
}

/**
 * Check whether the centroids have converged
 * @param oldCentroids <number[][]> The current centroids
 * @param newCentroids <number[][]> The new centroids 
 * @param tolerance <number> The tolerance
 * @returns <boolean> Whether we have converged or not
 */
export const checkConvergence = (
    oldCentroids: number[][], 
    newCentroids: number[][], 
    tolerance: number
    ): boolean => {
    // Check if the dimensions of the centroids match
    if (
        oldCentroids.length !== newCentroids.length || 
        oldCentroids[0].length !== newCentroids[0].length
    ) return false
  
    // Check if the centroids have converged
    for (let i = 0; i < oldCentroids.length; i++) {
        for (let j = 0; j < oldCentroids[i].length; j++) {
            const distance = Math.abs(oldCentroids[i][j] - newCentroids[i][j])
            if (distance > tolerance) return false
        }
    }

    return true
}

/**
 * Perform all calculations for the QF round
 * @param votes <number[][]> The votes
 * @param voters <number> The number of voters
 * @param projects <number> The number of projects
 * @param k <number> The number of clusters
 * @param iterations <number> The number of iterations
 * @param tolerance <number> The tolerance for convergence checks
 * @returns <KMeansQF> The results of the QF round
 */
export const kmeansQF = (
    ballots: UserBallot[], 
    voters: number, 
    projects: number, 
    k: number,
    iterations: number = MAX_ITERATIONS,
    tolerance: number = TOLERANCE
    ): KMeansQF => {

    // prepare the data
    addZeroVotesToBallots(ballots, projects)

    // calulate the centroids for the first time 
    let { centroids, indexes } = calculateCentroids(k, ballots)
    
    // store the assignments to the centroid for each vote
    let assignments: number[] = []

    // how many times have we actually iterated before the data converged
    // storing this to review the data later
    let actualIterations = 0

    // loop per max iterations
    for (let i = 0; i < iterations; i++) {
        actualIterations += 1
        // assign each vote to a cluster
        assignments = assignVotesToClusters(ballots, centroids)
        // update centroids 
        const newCentroids = updateCentroids(ballots.map((ballot) =>
            ballot.votes.map((vote) => vote.voteWeight)
        ), assignments, k, projects)

        // check if the centroids have converged
        if (checkConvergence(centroids, newCentroids, tolerance)) break 
        
        // if not, update the centroids variable and continue looping until max interations
        centroids = newCentroids
    }

    // now calculate the clusters size 
    const sizes = calculateClustersSize(assignments, k)

    // calculate the coefficents
    const coefficents = calculateCoefficents(sizes)

    // associate coefficients with voters
    const votersCoefficients = assignVotersCoefficient(assignments, coefficents)

    // QF calculations
    const qfs: number[] = []
    for (let i = 0; i < projects; i++) {
        qfs.push(calculateQFPerProject(votersCoefficients, ballots, i))
    }

    return {
        voters: voters,
        projects: projects,
        k: k,
        votes: ballots,
        centroids: centroids,
        clusters: sizes,
        coefficients: coefficents,
        votersCoefficients: votersCoefficients,
        assignments: assignments,
        qfs: qfs,
        iterations: actualIterations,
        initialCentroids: indexes
    }
}

/**
 * Perform all calculations for the QF round using fixed indexes as initial centroids
 * @param votes <number[][]> The votes
 * @param voters <number> The number of voters
 * @param projects <number> The number of projects
 * @param k <number> The number of clusters
 * @param indexes <number[]> The indexes of the projects to be used as centroids
 * @param iterations <number> The number of iterations
 * @param tolerance <number> The tolerance for the convergence check
 * @returns <KMeansQF> The results of the QF round
 */
export const kmeansQFFixedIndexes = (
    ballots: UserBallot[], 
    voters: number, 
    projects: number, 
    k: number,
    indexes: number[] = [],
    iterations: number = MAX_ITERATIONS,
    tolerance: number = TOLERANCE
    ): KMeansQF => {
    // prepare the data
    addZeroVotesToBallots(ballots, projects)

    // calulate the centroids for the first time 
    let centroids = calculateCentroidsWithIndexes(k, ballots, indexes)

    // store the assignments to the centroid for each vote
    let assignments: number[] = []

    // how many times have we actually iterated before the data converged
    // storing this to review the data later
    let actualIterations = 0

    // loop per max iterations
    for (let i = 0; i < iterations; i++) {
        actualIterations += 1
        // assign each vote to a cluster
        assignments = assignVotesToClusters(ballots, centroids)
        // update centroids 
        const newCentroids = updateCentroids(ballots.map((ballot) =>
            ballot.votes.map((vote) => vote.voteWeight)
        ), assignments, k, projects)

        // check if the centroids have converged
        if (checkConvergence(centroids, newCentroids, tolerance)) break 
        
        // if not, update the centroids variable and continue looping until max interations
        centroids = newCentroids
    }

    // now calculate the clusters size 
    const sizes = calculateClustersSize(assignments, k)

    // calculate the coefficents
    const coefficents = calculateCoefficents(sizes)

    // associate coefficients with voters
    const votersCoefficients = assignVotersCoefficient(assignments, coefficents)

    // QF calculations
    const qfs: number[] = []
    for (let i = 0; i < projects; i++) {
        qfs.push(calculateQFPerProject(votersCoefficients, ballots, i))
    }

    return {
        voters: voters,
        projects: projects,
        k: k,
        votes: ballots,
        centroids: centroids,
        clusters: sizes,
        coefficients: coefficents,
        votersCoefficients: votersCoefficients,
        assignments: assignments,
        qfs: qfs,
        iterations: actualIterations,
        initialCentroids: indexes
    }
}


/**
 * 
 * @param ballots <UserBallot[]> The ballots
 * @param voters <number> The number of voters
 * @param projects <number> The number of projects
 * @param k <number> The number of clusters
 * @param iterations <number> The number of iterations
 * @param tolerance <number> The tolerance for the convergence check
 * @returns <KMeansQF> The results of the QF round
 */
export const kmeansQFPlusPlus = (
    ballots: UserBallot[], 
    voters: number, 
    projects: number, 
    k: number,
    iterations: number = MAX_ITERATIONS,
    tolerance: number = TOLERANCE
    ): KMeansQF => {
    // prepare the data
    addZeroVotesToBallots(ballots, projects)

    // calulate the centroids for the first time 
    const weights = ballots.map((ballot) =>
    ballot.votes.map((vote) => vote.voteWeight))

    let { centroids, indexes } = calculateInitialCentroidsPlusPlus(weights, k)

    // store the assignments to the centroid for each vote
    let assignments: number[] = []

    // how many times have we actually iterated before the data converged
    // storing this to review the data later
    let actualIterations = 0

    // loop per max iterations
    for (let i = 0; i < iterations; i++) {
        actualIterations += 1
        // assign each vote to a cluster
        assignments = assignVotesToClusters(ballots, centroids)
        // update centroids 
        const newCentroids = updateCentroids(ballots.map((ballot) =>
            ballot.votes.map((vote) => vote.voteWeight)
        ), assignments, k, projects)

        // check if the centroids have converged
        if (checkConvergence(centroids, newCentroids, tolerance)) break 
        
        // if not, update the centroids variable and continue looping until max interations
        centroids = newCentroids
    }

    // now calculate the clusters size 
    const sizes = calculateClustersSize(assignments, k)

    // calculate the coefficents
    const coefficents = calculateCoefficents(sizes)

    // associate coefficients with voters
    const votersCoefficients = assignVotersCoefficient(assignments, coefficents)

    // QF calculations
    const qfs: number[] = []
    for (let i = 0; i < projects; i++) {
        qfs.push(calculateQFPerProject(votersCoefficients, ballots, i))
    }

    return {
        voters: voters,
        projects: projects,
        k: k,
        votes: ballots,
        centroids: centroids,
        clusters: sizes,
        coefficients: coefficents,
        votersCoefficients: votersCoefficients,
        assignments: assignments,
        qfs: qfs,
        iterations: actualIterations,
        initialCentroids: indexes
    }
    
}


/**
 * Export the results of the algorithm to a JSON file
 * @param data <KMeansQF> The data to export
 * @param path <string> The path to the file
 */
export const outputToJSON = (data: KMeansQF, path: string): void => {
    const json = {
        "k": data.k,
        "assignments": data.assignments,
        "coefficients": data.coefficients,
        "clusters": data.clusters,
        "voters": data.votersCoefficients.length,
        "initialCentroids": data.initialCentroids,
        "userCoefficients": data.votersCoefficients.map(coefficient => coefficient.coefficent)
    }

    fs.writeFileSync(path, JSON.stringify(json, null, 4))

}