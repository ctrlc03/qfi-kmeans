import { Cluster, Coefficent, VotersCoefficients } from "./interfaces"
import { MAX_CONTRIBUTION_AMOUNT, MAX_ITERATIONS, TOLERANCE, randomIntegerIncluded } from "./utilities"

interface KMeansQF {
    voters: number 
    projects: number
    votes: number[][]
    k: number
    centroids: number[][]
    clusters: Cluster[]
    coefficients: Coefficent[]
    votersCoefficients: VotersCoefficients[]
    assignmnets: number[]
    qfs: number[]
    iterations: number 
}

/**
 * Generate the indexes for the projects which have votes
 * @param projects <number> The number of projects
 * @returns <number[]> The generated indexes
 */
export const testGenerateIndexes = (projects: number): number[] => {
    // generate the amount of actual funds contributed to each project
    const unsortedIndexes: number[] = []
    for (let i = 0; i < projects; i++) {
        unsortedIndexes.push(randomIntegerIncluded(0, projects-1))
    }

    // sort them in order and remove duplicates
    unsortedIndexes.sort((a, b) => a - b)
    const indexes = [... new Set(unsortedIndexes)]

    return indexes
}


/**
 * Generate the random vector with a user's votes
 * @notice it expects the indexes to be sorted in ascending order and unique
 * @param projects <number> The number of projects
 * @returns <number[]> The generated vector
 */
export const testGenerateVector = (indexes: number[], projects: number): number[] => {
    // the vector to return
    const vector: number[] = []
    // a counter to help with our operations
    let indexCounter = 0

    // loop for projects length 
    for (let i = 0; i < projects; i++) {
        // if the counter is < the indexes length and is equal to the current index
        if (indexCounter < indexes.length && i === indexes[indexCounter]) {
            // add a random number
            vector.push(randomIntegerIncluded(1, MAX_CONTRIBUTION_AMOUNT))
            // increase counter
            indexCounter++
        } else {
            // otherwise add a zero
            vector.push(0)
        }
    }
    return vector
}


/**
 * Generate a nested array with the votes for each participant
 * @param voters <number> The number of voters
 * @param projects <number> The number of projects
 * @returns <number[][]> The generated votes
 */
export const testGenerateVotes = (voters: number, projects: number): number[][] => {
    const votes: number[][] = []
    // first generate the indexes
    for (let i = 0; i < voters; i++) {
        const indexes = testGenerateIndexes(projects)

        // generate the vector with the votes of each voter
        votes.push(testGenerateVector(indexes, projects))
    }

    return votes 
}

/**
 * Calculate the centroids for the votes
 * @param k <number> The number of clusters
 * @param votes <number[][]> The votes
 * @returns <number[][]> The centroids
 */
// @todo wrong using randomInegerIncluded(0, votes.length - 1)
// it should be using the amount of voters
export const testCalculateCentroids = (k: number, votes: number[][]): number[][] => {
    const centroids: number[][] = []
    const selectedIndexes: number[] = []
    for (let i = 0; i < k; i++) {
        // create a temp random index
        let randomIndex = randomIntegerIncluded(0, votes.length-1)
        // check that the index is not already in the array
        while(selectedIndexes.includes(randomIndex)) {
            randomIndex = randomIntegerIncluded(0, votes.length-1)
        }
        // store it in the selected indexes array
        selectedIndexes.push(randomIndex)
        centroids.push(votes[randomIndex])
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
export const testCalculateDistance = (votes1: number[], votes2: number[], numberOfProjects: number): number => {
    // hold tmp result
    let tmpDistance = 0
    // loop through the projects that we have 
    for (let i=0; i<numberOfProjects; i++) {
        // votes2[index] - votes1[index] * votes2[index] - votes1[index]
        tmpDistance += (votes2[i] - votes1[i]) * (votes2[i] - votes1[i])
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
export const testAssignVotesToClusters = (votes: number[][], centroids: number[][]): number[] => {
    const assignments: number[] = []
    // loop through each vote
    for (const vote of votes) {
        let minDistance = Infinity
        let clusterIndex = -1
        // loop through the centroids
        for (let i = 0; i < centroids.length; i++) {
            // calculate the distance between the vote and the centeroid
            const distance = testCalculateDistance(vote, centroids[i], vote.length)
            if (distance < minDistance) {
                minDistance = distance
                clusterIndex = i
            }
        }
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
export const testUpdateCentroids = (votes: number[][], assignments: number[], k: number, projectsLength: number): number[][] => {
    const newCentroids: number[][] = []
    // loop through the clusters
    for (let i = 0; i < k; i++) {
        // get the votes assigned to the cluster
        const assignedVotes = votes.filter((_, index) => assignments[index] === i)

        // store tmp sums 
        const tmpSum: number[] = []
        // loop through the projects
        for (let i = 0; i < projectsLength; i++) {
            // calculate the sum of the votes for each project
            const sum = assignedVotes.reduce((sum, vote) => sum + vote[i], 0) / assignedVotes.length
            // store it in the tmp sum array 
            tmpSum.push(sum)
        }
        // store it in the new centroids array 
        newCentroids.push(tmpSum)
    }

    return newCentroids
}

/**
 * Calculate how many votes are assigned to each cluster
 * @param assignments <number[]> The assignments
 * @returns <Cluster[]> The size of each cluster
 */
export const testCalculateClustersSize = (assignments: number[]): Cluster[] => {
    const clustersSize: Cluster[] = []
    // loop through the assignments
    for (const assignment of assignments) {
        const cluster = clustersSize.find(cluster => cluster.index === assignment)
        // if there is no match, it means that there is no cluster with this index
        if (!cluster) {
            // create a cluster of size one and push it to the array
            clustersSize.push({ index: assignment, size: 1 })
        } else {
            const index = clustersSize.indexOf(cluster)
            clustersSize[index].size += 1
        }  
    }

    return clustersSize
}

/**
 * Calculate the coefficents for each cluster
 * @param clustersSize <Cluster[]> The object of clusters size
 * @returns <Coefficent[]> The coefficents
 */
export const testCalculateCoefficents = (clustersSize: Cluster[]): Coefficent[] => {
    const coefficents: Coefficent[] = []
    // loop through all the clusters
    for (const clusterSize of clustersSize) {
        const coefficent = {
            clusterIndex: clusterSize.index,
            coefficient: 1/clusterSize.size
        }
        coefficents.push(coefficent)
    }

    return coefficents
}

/**
 * Assign each voter to its coefficient and cluster number
 * @param assignments <number[]> The assignments
 * @param coefficents <Coefficent[]> The coefficents
 * @returns <VotersCoefficents[]> The voters coefficents
 */
export const testAssignVotersCoefficient = (assignments: number[], coefficents: Coefficent[]): VotersCoefficients[] => {
    const votersCoefficients: VotersCoefficients[] = []
    for (let i=0; i < assignments.length; i++) {
        const voterCoefficient = {
            voterIndex: i,
            clusterIndex: assignments[i],
            coefficent: coefficents.find(coefficent => coefficent.clusterIndex === assignments[i])?.coefficient || 0
        }
        votersCoefficients.push(voterCoefficient)
    }

    return votersCoefficients
}

/**
 * Calculate the matching amount per project based on the votes
 * and the coefficients
 * @param votersCoefficients <VotersCoefficients[]> The voters coefficents
 * @param votes <number[][]> The votes
 * @param projectIndex <number> The project index
 * @returns <number> The matching amount per project
 */
const testCalculateQFPerProject = (
    votersCoefficients: VotersCoefficients[], 
    votes: number[][], 
    projectIndex: number
    ): number => {
    // =SUM([vote1User1*s,vote1User2*r,vote1User3*t]**0.5)**2
    let sum = 0

    // loop through votes array
    for (let i = 0; i < votes.length; i++) {
        sum += Math.sqrt(votes[i][projectIndex] * votersCoefficients[i].coefficent)
    }

    return Math.pow(sum, 2)
}

/**
 * Calculate the QF for each project
 * @param votes <number[][]> The votes
 * @param projectIndex <number> The project index
 * @returns <number> The QF for the project
 */
export const testCalculateTraditionalQF = (
    votes: number[][],
    projectIndex: number 
): number => {
    let sum = 0
    for (let i = 0; i < votes.length; i++) {
        sum += Math.sqrt(votes[i][projectIndex])
    }

    return Math.pow(sum, 2)
}


/**
 * Check whether the centroids have converged
 * @param oldCentroids <number[][]> The current centroids
 * @param newCentroids <number[][]> The new centroids 
 * @param tolerance <number> The tolerance
 * @returns <boolean> Whether we have converged or not
 */
export const testCheckConvergence = (oldCentroids: number[][], newCentroids: number[][], tolerance: number): boolean => {
    // Check if the dimensions of the centroids match
    if (oldCentroids.length !== newCentroids.length || oldCentroids[0].length !== newCentroids[0].length)
        return false
  
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
 * Perform all calculations for the QF round using set votes 
 * rather than generating them inside the function
 * @param votes <number[][]> The votes
 * @param voters <number> The number of voters
 * @param projects <number> The number of projects
 * @param k <number> The number of clusters
 * @param iterations <number> The number of iterations
 * @returns <KMeansQF> The results of the QF round
 */
export const testKmeanQFWithVotes = (
    votes: number[][], 
    voters: number, 
    projects: number, 
    k: number,
    iterations: number = MAX_ITERATIONS,
    tolerance: number = TOLERANCE
    ): KMeansQF => {
    // calulate the centroids
    let centroids = testCalculateCentroids(k, votes)
    // store the assignments to the centroid for each vote
    let assignments: number[] = []

    // how many times have we actually iterated before the data converged
    let actualIterations = 0

    // loop per max iterations
    for (let i = 0; i < iterations; i++) {
        // assign each vote to a cluster
        assignments = testAssignVotesToClusters(votes, centroids)
        // update centroids 
        const newCentroids = testUpdateCentroids(votes, assignments, k, projects)
        // check if the centroids have converged
        if (testCheckConvergence(centroids, newCentroids, tolerance)) {
            actualIterations = i
            break 
        }
        // if not, update the centroids variable and continue looping until max interations
        centroids = newCentroids
    }

    // now calculate the clusters size 
    const sizes = testCalculateClustersSize(assignments)

    // calculate the coefficents
    const coefficents = testCalculateCoefficents(sizes)

    // associate coefficients with voters
    const votersCoefficients = testAssignVotersCoefficient(assignments, coefficents)

    // QF calculations
    const qfs: number[] = []
    for (let i = 0; i < projects; i++) {
        qfs.push(testCalculateQFPerProject(votersCoefficients, votes, i))
    }

    return {
        voters: voters,
        projects: projects,
        k: k,
        votes: votes,
        centroids: centroids,
        clusters: sizes,
        coefficients: coefficents,
        votersCoefficients: votersCoefficients,
        assignmnets: assignments,
        qfs: qfs,
        iterations: actualIterations
    }
}

/**
 * Perform all the calculations for the QF round 
 * @param voters <number> The number of voters
 * @param projects <number> The number of projects
 * @param k <number> The number of clusters
 * @param iterations <number> The number of iterations to run the algorithm for
 * @returns <KMeansQF> The results of the QF round
 */
export const testKmeansQF = (
    voters: number, 
    projects: number, 
    k: number, 
    iterations: number = MAX_ITERATIONS,
    tolerance: number = TOLERANCE
    ): KMeansQF => {
    // generate random votes
    const votes = testGenerateVotes(voters, projects)

    // calulate the centroids
    let centroids = testCalculateCentroids(k, votes)
    // store the assignments to the centroid for each vote
    let assignments: number[] = []

    // how many times have we iterated
    let actualIterations = 0

    // loop per max iterations
    for (let i = 0; i < iterations; i++) {
        // assign each vote to a cluster
        assignments = testAssignVotesToClusters(votes, centroids)
        // update centroids 
        const newCentroids = testUpdateCentroids(votes, assignments, k, projects)
        // check if the centroids have changed
        if (testCheckConvergence(centroids, newCentroids, tolerance)) {
            actualIterations = i
            break
        }
        // if not, update the centroids variable and continue looping until max interations
        centroids = newCentroids
    }

    // now calculate the clusters size 
    const sizes = testCalculateClustersSize(assignments)

    // calculate the coefficents
    const coefficents = testCalculateCoefficents(sizes)

    // associate coefficients with voters
    const votersCoefficients = testAssignVotersCoefficient(assignments, coefficents)

    // QF calculations
    const qfs: number[] = []
    for (let i = 0; i < projects; i++) {
        qfs.push(testCalculateQFPerProject(votersCoefficients, votes, i))
    }

    return {
        voters: voters,
        projects: projects,
        k: k,
        votes: votes,
        centroids: centroids,
        clusters: sizes,
        coefficients: coefficents,
        votersCoefficients: votersCoefficients,
        assignmnets: assignments,
        qfs: qfs,
        iterations: actualIterations
    }
}

/**
 * Run the QF algorithm multiple times and return the time it took to run
 * @param votes <number[][]> The votes
 * @param voters <number> The number of voters
 * @param projects <number> The number of projects
 * @param k <number> The number of clusters
 * @param repetitions <number> The number of times to run the algorithm
 * @returns <number> The time it took to run the algorithm
 */
export const testRunQFWithVotesMultipleTimes = (votes: number[][], voters: number, projects: number, k: number, repetitions: number) => {
    const start = performance.now()

    for (let i = 0; i < repetitions; i++) {
        testKmeanQFWithVotes(votes, voters, projects, k)
    }

    const end = performance.now()

    console.log(`It took ${end-start} milliseconds to run the algo ${repetitions} times`)
    return end - start
}

// run the program
const main = () => {
    const voters = 100
    const projects = 10
    const k = 5

    const data = testKmeansQF(voters, projects, k)

    console.log("Voters", data.voters)
    console.log("Projects", data.projects)
    console.log("K", data.k)
    console.log("Centroids", data.centroids)
    console.log("Clusters size", data.clusters)
    console.log("Assignments", data.assignmnets)
    console.log("Coefficients", data.coefficients)
    console.log("Voters Coefficients", data.votersCoefficients)
    console.log("k-means QF allocations", data.qfs)
    console.log(`We have iterated ${data.iterations} times until converged with a tolerance of ${TOLERANCE} and MAX_ITERATIONS of ${MAX_ITERATIONS}`)

    // print out the allocation using the traditional QF method
    for (let i = 0; i < projects; i++) {
        console.log("Traditional QF allocation", testCalculateTraditionalQF(data.votes, i))
    }

    // sum up all the votes (contributions)
    let votesSum = 0
    for (const sum of data.votes) votesSum += sum.reduce((a, b) => a + b, 0)
    console.log("Total contributed", votesSum)

    // total contribution for each project 
    for (let i = 0; i < projects; i++) {
        let sum = 0
        for (let j = 0; j < voters; j++) {
            sum += data.votes[j][i]
        }
        console.log(`Total contributed for project ${i}`, sum)
    }

    // run it multiple times
    testRunQFWithVotesMultipleTimes(data.votes, voters, projects, k, 100)
}


// main()