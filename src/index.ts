const maxContribution = 50

/**
 * Generate a random integer between min and max
 * @param min <number> The minimum value
 * @param max <number> The maximum value
 * @returns <number> A random integer between min and max
 */
const randomIntegerIncluded = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate the indexes for the projects which have votes
 * @param projects <number> The number of projects
 * @returns <number[]> The generated indexes
 */
export const generateIndexes = (projects: number): number[] => {
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
export const generateVector = (indexes: number[], projects: number): number[] => {
    // the vector to return
    const vector: number[] = []
    // a counter to help with our operations
    let indexCounter = 0
    // loop for projects length 
    for (let i = 0; i < projects; i++) {
        // if the counter is < the indexes length and is equal to the current index
        if (indexCounter < indexes.length && i === indexes[indexCounter]) {
            // add a random number
            vector.push(randomIntegerIncluded(1, maxContribution))
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
const generateVotes = (voters: number, projects: number): number[][] => {
    const votes: number[][] = []
    // first generate the indexes
    const indexes = generateIndexes(projects)
    for (let i = 0; i < voters; i++) {
        // generate the vector with the votes of each voter
        votes.push(generateVector(indexes, projects))
    }

    return votes 
}

/**
 * Calculate the centroids for the votes
 * @param k <number> The number of clusters
 * @param votes <number[][]> The votes
 * @returns <number[][]> The centroids
 */
export const calculateCentroids = (k: number, votes: number[][]): number[][] => {
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
export const calculateDistance = (votes1: number[], votes2: number[], numberOfProjects: number): number => {
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
const assignVotesToClusters = (votes: number[][], centroids: number[][]): number[] => {
    const assignments: number[] = []
    // loop through each vote
    for (const vote of votes) {
        let minDistance = Infinity
        let clusterIndex = -1
        // loop through the centroids
        for (let i = 0; i < centroids.length; i++) {
            // calculate the distance between the vote and the centeroid
            const distance = calculateDistance(vote, centroids[i], vote.length)
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
const updateCentroids = (votes: number[][], assignments: number[], k: number, projectsLength: number): number[][] => {
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

interface Cluster {
    index: number
    size: number
}

/**
 * Calculate how many votes are assigned to each cluster
 * @param assignments <number[]> The assignments
 * @returns <Cluster[]> The size of each cluster
 */
const calculateClustersSize = (assignments: number[]): Cluster[] => {
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

interface Coefficent {
    clusterIndex: number
    coefficent: number
}

/**
 * Calculate the coefficents for each cluster
 * @param clustersSize <Cluster[]> The object of clusters size
 * @returns <Coefficent[]> The coefficents
 */
const calculateCoefficents = (clustersSize: Cluster[]): Coefficent[] => {
    const coefficents: Coefficent[] = []
    // loop through all the clusters
    for (const clusterSize of clustersSize) {
        const coefficent = {
            clusterIndex: clusterSize.index,
            coefficent: 1/clusterSize.size
        }
        coefficents.push(coefficent)
    }

    return coefficents
}

interface UserCoefficient {
    userIndex: number
    coefficent: number
}

/**
 * Get the coefficents for each user
 * @param coefficients <Coefficent[]> The coefficents
 * @param voters <number> The number of voters
 * @returns <UserCoefficient[]> The coefficents for each user
 */
const getVoterCoefficient = (coefficients: Coefficent, voters: number): UserCoefficient[] =>{
    const UserCoefficients: UserCoefficient[] = []
    // loop through the voters
    for (let i = 0; i < voters; i++) {

    }
}

// interface VoteCoefficient {
//     voteIndex: number
//     coefficent: number
//     vote: number 
//     projectIndex: number 
// }

// const getVoteCoefficient = (coefficients: Coefficent, votes: number[][]): number[][] => {
    
// }

// run the program
const main = () => {
    const voters = 100
    const projects = 10
    const k = 5

    // generate random votes
    const votes = generateVotes(voters, projects)

    // calulate the centroids
    let centroids = calculateCentroids(k, votes)
    console.log(votes)
    console.log(centroids)

    let assignments: number[] = []

    // loop per max iterations
    for (let i = 0; i < 50; i++) {
        // assign each vote to a cluster
        assignments = assignVotesToClusters(votes, centroids)
        // update centroids 
        const newCentroids = updateCentroids(votes, assignments, k, projects)
        // check if the centroids have changed
        if (centroids === newCentroids) break 
        // if not, update the centroids variable and continue looping until max interations
        centroids = newCentroids
    }

    // results
    console.log("Centroids", centroids)
    console.log("Assignments", assignments)

    // now calculate the clusters size 
    const sizes = calculateClustersSize(assignments)
    console.log("Sizes", sizes)

    // calculate the coefficents
    const coefficents = calculateCoefficents(sizes)
    console.log("Coefficents", coefficents)

    // get the coefficent for each vector of votes

}

main()