import { Cluster, Coefficent, UserBallot, VotersCoefficients } from "./interfaces.js"
import { MAX_ITERATIONS, TOLERANCE, expandNumberToArray, randomIntegerIncluded } from "./utilities.js"
import fs from "fs"

/**
 * A class to represent a k-means object
 * @note you can use this class to calculate the k-means
 * coefficients in various ways:
 * 1. coefficient = 1 - numberOfItemsInCentroids/totalVoters
 * 2. coefficient = numberOfItemsInCentroids/totalVoters
 * 3. 1 but perform the square root after applying coefficient
 * 4. 2 but perform the square root after applying coefficient
 */
export class KMeans {
    // the number of clusters
    public k: number 
    // the ballots to be clustered
    public ballots: UserBallot[]
    // the centroids of the k-means object
    public centroids: number[][] = []
    // the assignments of each ballot to a centroid
    public assignments: number[] = []
    // the allocations per project based on traditional QF
    public traditionalQFs: number[] = []
    // the actual contribution to be allocated (after k-means coefficients)
    public kMeansQFs: number[] = []
    // the number of projects
    public projects: number = 0
    // the tolerance for the k-means algorithm
    public tolerance: number
    // the weights extracted from the ballots
    public weights: number[][] = []
    // the indexes of the centroids
    public indexes: number[] = []
    // the final distances between each ballot and the centroids
    public finalDistances: number[][] = []
    // the previous centroids (stored for convergence check)
    public previousCentroids: number[][] = []
    // the clusters sizes
    public clustersSizes: Cluster[] = []
    // the coefficients per cluster
    public coefficients: Coefficent[] = []
    // the voters' coefficients
    public votersCoefficients: VotersCoefficients[] = []
    // store whether the algorithm has converged
    public converged: boolean = false
    // the max number of iterations
    public maxIterations: number
    // the actual number of iterations
    public actualIterations: number = 0
    // the first selection of centroids
    public initialCentroids: number[][] = []
    // within cluster sum of squares
    public wcss: number = 0
    // penalties per project
    public penalties: number[] = []
    // the silhoutte score
    public silhoutteScore: number = 0
    // davies boulding index
    public daviesBouldingIndex: number = 0
    // intra cluster distance 
    public intraClusterDistance: number = 0
    // inter cluster distance
    public interClusterDistance: number = 0
    // dunn score
    public dunnScore: number = 0

    // initialize the k-means object with k and ballots
    constructor(
        public _k: number, 
        public _ballots: UserBallot[],
        public _votesNeedSquaring: boolean = false,
        public _projects: number = 0,
        public _tolerance: number = TOLERANCE,
        public _maxIterations: number = MAX_ITERATIONS
    ) {
        if (_k > _ballots.length) throw new Error("The number of clusters cannot be greater than the number of ballots")
        if (_maxIterations < 1) throw new Error("The maximum number of iterations cannot be less than 1")
        
        // set our class variables
        this.k = _k 
        this.ballots = _ballots 
        this.tolerance = _tolerance
        this.maxIterations = _maxIterations

        // votes may be passed in as squared, but if not, square them
        if (_votesNeedSquaring) this.squareVotes()

        // if no projects are passed in, find the number of projects
        if (!!_projects) this.projects = _projects
        else this.findNumberOfProjects()

        // add zero votes to the ballots
        this.addZeroVotesToBallots()

        // store the weights in a seperate array so we do not 
        // have to extract them everytime we need them
        this.weights = this.ballots.map(ballot => ballot.votes.map(vote => vote.voteWeight))

        // streamline the data - do the square root
        // @todo if we square root the weights for normalizing the data, we need
        // to ensure that QF calculations are done on the squared weights
        this.weights = this.weights.map(row => row.map(weight => Math.sqrt(weight)))

        // calculate the initial centroids
        this.calculateInitialCentroidsPlusPlus()

        // calculate the traditional QF 
        this.calculateTraditionalQF()

        for (let i = 0; i < this.maxIterations; i++) {
            // assign each voter to a cluster
            this.assignVotesToClustersCosine()
            // update the centroids
            this.updateCentroids()
            // check if the centroids have converged
            this.checkConvergenceCosine()
            if (this.converged) {
                this.actualIterations = i
                break 
            }
        }

        // if we haven't converged after max iterations
        if (!this.converged) this.actualIterations = this.maxIterations

        // calculate cluster sizes
        this.calculateClustersSize()

        // calculate wcss
        this.calculateWCSS()

        // calculate silhoutte score
        this.calculateSilhouetteScore()

        // calculate davies boulding index
        this.calculateDaviesBouldinIndex()

        // calculate dunn score
        this.calculateDunnIndex()

        // we need to square the weights again as before we square rooted them
        this.weights = this.weights.map(row => row.map(weight => Math.pow(weight, 2)))

        // @todo add calculation of tolerance (1/1000 * highest vote weight)
    }

    /**
     * A helper method to square votes
     * @note to be run on initialization if the votes are not already squared
     */
    public squareVotes = () => {
        this.ballots = this.ballots.map(userBallot => {
            const newVotes = userBallot.votes.map(vote => {
                return { ...vote, voteWeight: vote.voteWeight * vote.voteWeight };
            })
            return { ...userBallot, votes: newVotes };
        })
    } 

    /**
     * A helper method to find the number of projects
     * @note to be run if no projects are passed in the constructor
     */
    public findNumberOfProjects = () => {
        let largestVoteIndex = 0 
        for (const ballot of this.ballots) {
            for (const vote of ballot.votes) {
                if (vote.voteOption > largestVoteIndex) largestVoteIndex = vote.voteOption
            }
        }
    
        this.projects = largestVoteIndex 
    }

    /**
     * Check if a voteOption already exists in a UserBallot
     * @param ballot <UserBallot> The ballot to check
     * @param voteOption <number> The vote option to check
     * @returns <boolean> True if the vote option exists, false otherwise
     */
    public static voteOptionExists = (ballot: UserBallot, voteOption: number): boolean => {
        return ballot.votes.some(vote => vote.voteOption === voteOption)
    }

    /**
     * Method to identify and add zero votes to a ballot
     * @param ballot <UserBallot> The ballot to add the zero votes to
     * @param projects <number> The number of projects
     * @returns <UserBallot> The ballot with the zero votes 
     */ 
    public static extractZeroVotes = (ballot: UserBallot, projects: number): UserBallot => {
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
    public addZeroVotesToBallots = () => {
        // modify the array passed as reference
        this.ballots.forEach((ballot, index) => {
            const missingVotes = KMeans.extractZeroVotes(ballot, this.projects);
            
            this.ballots[index] = {
                votes: [...missingVotes.votes]
            }
        })  
    }

    /**
     * Calculate the Cosine Similarity between two ballots
     */
    public static calculateCosineSimilarity = (
        votes1: number[],
        votes2: number[]
    ): number => {
        if (votes1.length !== votes2.length) throw new Error("The two arrays of votes should have the same length")

        let dotProduct = 0, magnitude1 = 0, magnitude2 = 0
        for (let i = 0; i < votes1.length; i++) {
            dotProduct += votes1[i] * votes2[i]
            magnitude1 += Math.pow(votes1[i], 2)
            magnitude2 += Math.pow(votes2[i], 2)
        }

        return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2))
    }

    /**
     * Calculate the euclidean distance (minus the square root) between two votes
     * @notice in a simple k-means algo we would have two points
     * @notice point1 = {x: vote1, y: vote2} and point2 = {x: vote1, y: vote2}
     * @notice but in our case we have x votes (contributions) for each project
     * @param vote1 <number[]> The first array of votes
     * @param vote2 <number[]> The second array of votes
     * @returns <number> The distance between the two votes
    */
    public static calculateDistanceSquared  = (
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
        for (let i = 0; i < votes1.length; i++) {
            // need to calculate the tmp distance between the two votes 
            // (they should be for the same project)
            // add to the tmp distance
            tmpDistance += Math.pow(votes2[i] - votes1[i], 2) 
        }

        return tmpDistance
    }

    /**
     * Calculate the eucledian distance
     * @param votes1 {number[]} 
     * @param votes2 {number[]}
     * @returns {number}
     */
    public static calculateDistanceEucledian  = (
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
        for (let i = 0; i < votes1.length; i++) {
            // need to calculate the tmp distance between the two votes 
            // (they should be for the same project)
            // add to the tmp distance
            tmpDistance += Math.sqrt(Math.pow(votes2[i] - votes1[i], 2))
        }

        return tmpDistance
    }

    /**
     * Take the ballot weights and the centroids and 
     * return an array of distances between the weights and
     * their nearest centroid
     * @param weights <number[][]> The weights
     * @param centroids <number[][]> The centroids
     * @returns <number[]> The distances
     */
    public static calculateDistancePlusPlus = (weights: number[][], centroids: number[][]): number[] => {
        return weights.map(weight => Math.max(...centroids.map(centroid => KMeans.calculateCosineSimilarity(weight, centroid))))
    }

    /**
     * Take the ballot weights and the centroids and 
     * return an array of distances between the weights and
     * their nearest centroid (uses Eucledian distance)
     * @param weights <number[][]> The weights
     * @param centroids <number[][]> The centroids
     * @returns <number[]> The distances
     */
    public static calculateDistancePlusPlusEucledian = (weights: number[][], centroids: number[][]): number[] => {
        return weights.map(weight => Math.min(...centroids.map(centroid => KMeans.calculateDistanceEucledian(weight, centroid))))
    }

    /**
     * Selects the next centroid based on the k-means++ initialization
     * 
     * @param weights <number[][]> The weights
     * @param distancesOrSimilarities <number[]> The distances
     * @returns <number[]> The next centroid
     */
    public static selectNextCentroid = (weights: number[][], distancesOrSimilarities: number[]): number[] => {
        // sum all of the distances 
        const sum = distancesOrSimilarities.reduce((a, b) => a + b, 0)
        // probabilities are the relative distance of a weight to the 
        // nearest centroid
        const probabilities = distancesOrSimilarities.map(distance => distance / sum)
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
        // @note this should not hit
        return weights[weights.length-1]
    }

    /**
     * Calculate the initial centroids based on the k-means++ algo
     */
    public calculateInitialCentroidsPlusPlus = () => {
        // select the first centroid randomly
        this.centroids = [this.weights[randomIntegerIncluded(0, this.weights.length-1)]]
        
        // select the other centroids based on the distance from this centroid
        while (this.centroids.length < this.k) {
            const distances = KMeans.calculateDistancePlusPlus(this.weights, this.centroids)
            // cache so we can use it to store the indexes
            const centroid = KMeans.selectNextCentroid(this.weights, distances)
            this.centroids.push(centroid)
            // store the index of the centroid (in which position it is in the weights array)
            this.indexes.push(this.weights.indexOf(centroid))
        }

        // store the initial centroids
        this.initialCentroids = this.centroids
    }

    /**
     * Check if two arrays are equal
     * @param {number[]} a - the first array
     * @param {number[]} b - the second array
     * @returns {boolean} - true if the arrays are equal, false otherwise
     */
    static arraysEqual(a: number[], b: number[]): boolean {
        if (a.length !== b.length) return false

        for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false
        
        return true
    }

    /**
     * Assign the votes to the nearest cluster
     * using eucledian distance
     */
    public assignVotesToClustersEucledian = () => {
        // we store the assignments in this array of numbers
        const assignments: number[] = []
        // loop through each vote
        for (const ballot of this.ballots) {
            let minDistance = Infinity
            let clusterIndex = -1
            const weights = ballot.votes.map(vote => vote.voteWeight)
            // loop through the centroids
            for (let i = 0; i < this.centroids.length; i++) {
                // break out early if the vote is the same as the centroid
                if (KMeans.arraysEqual(weights, this.centroids[i])) {
                    clusterIndex = i
                    break 
                }

                // calculate the distance between the vote array (for each user) and the centeroids
                const distance = KMeans.calculateDistanceEucledian(weights, this.centroids[i])

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
        this.assignments = assignments
    }

    /**
     * Assign the votes to the nearest cluster
     * using cosine similarity
     */
    public assignVotesToClustersCosine = () => {
        // we store the assignments in this array of numbers
        const assignments: number[] = []
        // loop through each vote
        for (const ballot of this.ballots) {
            let minSimilarity = Infinity
            let clusterIndex = -1
            const weights = ballot.votes.map(vote => vote.voteWeight)
            // loop through the centroids
            for (let i = 0; i < this.centroids.length; i++) {
                // break out early if the vote is the same as the centroid
                if (KMeans.arraysEqual(weights, this.centroids[i])) {
                    clusterIndex = i
                    break 
                }

                // calculate the similarity between the vote array (for each user) and the centeroids
                const similarity = KMeans.calculateCosineSimilarity(weights, this.centroids[i])

                // check if we have a new minimum distance 
                if (similarity < minSimilarity) {
                    minSimilarity = similarity
                    // once we found it - we assign the vote array to the nearest cluster
                    clusterIndex = i
                }
            }
            // store the cluster index in the assignments array
            assignments.push(clusterIndex)
        }

        // each array of votes (of a contributor) is assigned to a cluster
        this.assignments = assignments
    }

    /**
     * Update the centroids
     */
    public updateCentroids = () => {
        // store the new centroids 
        const newCentroids: number[][] = []
        // loop through the clusters
        for (let i = 0; i < this.k; i++) {
            // get the votes assigned to the cluster
            const assignedVotes = this.weights.filter((_, index) => this.assignments[index] === i)

            // store tmp mean 
            const tmpMean: number[] = []
            // loop through the projects
            for (let i = 0; i < this.projects; i++) {
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
        
        // cache the previous centroids
        this.previousCentroids = this.centroids 
        // update the centroids
        this.centroids = newCentroids 
    }

    /**
     * Calculate how many votes are assigned to each cluster
     */
    public calculateClustersSize = () => {
        const clustersSizes: Cluster[] = Array.from({length: this.k}, (_, index) => ({index: index, size: 0}));
        
        for (const assignment of this.assignments) clustersSizes[assignment].size++;
    
        this.clustersSizes = clustersSizes
    }

    /**
     * Calculate the coefficents for each cluster
     * @note formula: clusterSize / number of ballots
     * @note rewarding larger groups 
     */
    public calculateCoefficents = () => {
        const coefficents: Coefficent[] = []
        // loop through all the clusters
        for (const clusterSize of this.clustersSizes) 
            // store the cluster index and the coefficient (1/cluster size)
            coefficents.push({
                clusterIndex: clusterSize.index,
                // if the size is zero then the coefficient is 1 (or zero)
                // this means no users will have this coefficient
                // 1/clusterSize
                // coefficient: clusterSize.size !== 0 ?  1/clusterSize.size : 1
                // clusterSize / ballots 
                coefficient: clusterSize.size !== 0 ? 
                    clusterSize.size/this.weights.length : 
                    1
            })
        
        this.coefficients = coefficents
    }

    /**
     * Calculate the coefficents for each cluster
     * @note formula: 1 - clusterSize / number of ballots
     * @note rewards smaller groups 
     */
    public calculateCoefficentsOneMinus = () => {
        const coefficents: Coefficent[] = []
        // loop through all the clusters
        for (const clusterSize of this.clustersSizes) 
            // store the cluster index and the coefficient (1/cluster size)
            coefficents.push({
                clusterIndex: clusterSize.index,
                // if the size is zero then the coefficient is 1 (or zero)
                // this means no users will have this coefficient
                // 1 - clusterSize / ballots 
                coefficient: clusterSize.size !== 0 ?  
                    1 - clusterSize.size/this.weights.length : 
                    1
            })
        
        this.coefficients = coefficents
    } 

    /**
     * Assign each voter to its coefficient and cluster number
     */
    public assignVotersCoefficient = () => {
        const votersCoefficients: VotersCoefficients[] = []
        // loop through all assignments
        for (let i = 0; i < this.assignments.length; i++) {
            // create and store a new object with the voter index, 
            // cluster index and coefficient
            votersCoefficients.push({
                voterIndex: i,
                clusterIndex: this.assignments[i],
                coefficent: this.coefficients.find(
                    coefficient => coefficient.clusterIndex === this.assignments[i]
                    )?.coefficient || 1
            })
        }
        this.votersCoefficients = votersCoefficients
    }

    /**
     * Calculate the matching amount per project based on the votes
     * and the coefficients
     */
    public calculateQFPerProjectSquareAfterCoefficient = () => {
        // reset the array
        this.kMeansQFs = []
    
        // loop through the projects
        for (let i = 0; i < this.projects; i++) {
            // interim sum 
            let sum = 0
            // loop through votes array
            for (const ballot of this.ballots) {
                const index = this.ballots.indexOf(ballot)
                sum += 
                    Math.sqrt(ballot.votes[i].voteWeight * 
                    this.votersCoefficients[index].coefficent)
                
            }
            this.kMeansQFs.push(Math.pow(sum, 2))
        }
    }

    /**
     * Calculate the matching amount per project based on the votes
     * and the coefficients. The coefficients are applied after sqrt(weight)
     */
    public calculateQFPerProjectSquareBeforeCoefficient = () => {
        // reset
        this.kMeansQFs = []

        // =SUM([vote1User1*s,vote1User2*r,vote1User3*t]**0.5)**2

        // loop through the projects
        for (let i = 0; i < this.projects; i++) {
            // interim sum 
            let sum = 0
            // loop through votes array
            for (const ballot of this.ballots) {
                const index = this.ballots.indexOf(ballot)
                sum += 
                    Math.sqrt(ballot.votes[i].voteWeight) * 
                    this.votersCoefficients[index].coefficent
                
            }
            this.kMeansQFs.push(Math.pow(sum, 2))
        }
    }

    /**
     * Calculate the QF allocation for the projects
     */
    public calculateTraditionalQF = () => {
        // =SUM([vote1User1,vote1User2,vote1User3]**0.5)**2
        const traditionalQFs: number[] = []
        // loop through the projects
        for (let x = 0; x < this.projects; x++) {
            let sum = 0
            // loop through ballots
            for (let i = 0; i < this.weights.length; i++) {
                // add up to the sum the square root of the vote weight for x project
                // sum += Math.sqrt(ballots[i][x])
                sum += Math.sqrt(this.weights[i][x])
            }
            traditionalQFs.push(Math.pow(sum, 2))
        }

        this.traditionalQFs = traditionalQFs 
    }

    /**
     * Check whether the centroids have converged
     */
    public checkConvergence = () => {
        // default is that it converged
        this.converged = true 

        // Check if the dimensions of the centroids match
        if (
            this.previousCentroids.length !== this.centroids.length || 
            this.previousCentroids[0].length !== this.centroids[0].length
        ) {
            this.converged = false
        } else {
            // Check if the centroids have converged
            outerloop: 
            for (let i = 0; i < this.previousCentroids.length; i++) {
                for (let j = 0; j < this.previousCentroids[i].length; j++) {
                    const distance = Math.abs(this.previousCentroids[i][j] - this.centroids[i][j])
                    if (distance > this.tolerance) {
                        this.converged = false
                        // break out
                        break outerloop 
                    }
                }
            }
        }      
    }

    /**
     * Check if the centroids have converged
     * using Cosine similarity
     */
    public checkConvergenceCosine = () => {
        // default is that it converged
        this.converged = true 

        // Check if the dimensions of the centroids match
        if (
            this.previousCentroids.length !== this.centroids.length ||
            this.previousCentroids[0].length !== this.centroids[0].length
        ) {
            this.converged = false
            return
        }

        // Helper function to calculate dot product of two vectors
        const dotProduct = (a: number[], b: number[]) => {
            return a.reduce((sum, value, index) => sum + value * b[index], 0)
        }

        // Helper function to calculate magnitude of a vector
        const magnitude = (a: number[]) => {
            return Math.sqrt(a.reduce((sum, value) => sum + value * value, 0))
        }

        // Helper function to calculate cosine similarity of two vectors
        const cosineSimilarity = (a: number[], b: number[]) => {
            return dotProduct(a, b) / (magnitude(a) * magnitude(b))
        }

        // Check if the centroids have converged based on cosine similarity
        for (let i = 0; i < this.previousCentroids.length; i++) {
            const similarity = cosineSimilarity(this.previousCentroids[i], this.centroids[i])
            if (Math.abs(1 - similarity) > this.tolerance) {
                this.converged = false
                return
            }
        }
    }

    /**
     * Run the full algorithm 
     * @note coefficient is applied after sqrt(weight)
     * @note coefficient formula: 1 - clusterSize / number of ballots
     */
    public runAlgorithm1MinusSquareBefore = () => {
        // calculate the coefficients
        this.calculateCoefficentsOneMinus()

        // assign each voter to its coefficient and cluster number
        this.assignVotersCoefficient()

        // calculate the QF for each project
        this.calculateQFPerProjectSquareBeforeCoefficient()

        // calculate the penalties
        this.calculateDifferenceBetweenKMeansAndtraditional()
    }

    /**
     * Run the full algorithm 
     * @note coefficient is applied after sqrt(weight)
     * @note coefficient formula: clusterSize / number of ballots
     */
    public runAlgorithmSquareBefore = () => {
        // calculate the coefficients
        this.calculateCoefficents()

        // assign each voter to its coefficient and cluster number
        this.assignVotersCoefficient()

        // calculate the QF for each project
        this.calculateQFPerProjectSquareBeforeCoefficient()

        // calculate the penalties
        this.calculateDifferenceBetweenKMeansAndtraditional()         
    }


    /**
     * Run the full algorithm 
     * @note coefficient is applied before sqrt(weight)
     * @note coefficient formula: 1 - clusterSize / number of ballots
     */
    public runAlgorithm1MinusSquareAfter = () => {
        // calculate the coefficients
        this.calculateCoefficentsOneMinus()

        // assign each voter to its coefficient and cluster number
        this.assignVotersCoefficient()

        // calculate the QF for each project
        this.calculateQFPerProjectSquareAfterCoefficient()

        // calculate the penalties
        this.calculateDifferenceBetweenKMeansAndtraditional()
    }

    /**
     * Run the full algorithm 
     * @note coefficient is applied before sqrt(weight)
     * @note coefficient formula: clusterSize / number of ballots
     */
    public runAlgorithmSquareAfter = () => {
        // calculate the coefficients
        this.calculateCoefficents()

        // assign each voter to its coefficient and cluster number
        this.assignVotersCoefficient()

        // calculate the QF for each project
        this.calculateQFPerProjectSquareAfterCoefficient()

        // calculate the penalties
        this.calculateDifferenceBetweenKMeansAndtraditional()
    }

    /**
     * Calculate the WCSS
     */
    public calculateWCSS = () => {
        // reset the wcss
        this.wcss = 0
        // make sure this is only run after the ballots have been assigned to a cluster
        if (this.assignments.length === 0) 
            throw new Error("This function must be run after the ballots have been assigned to a cluster")

        // loop through the weights
        for (let i = 0; i < this.weights.length; i++) {
            // get the closest centroid from the assignments 
            const closestCentroid = this.assignments[i]
            // now get the distance from this centroid
            this.wcss += KMeans.calculateDistanceEucledian(this.weights[i], this.centroids[closestCentroid])
        }
    }

    /**
     * Calculate the silhouette score
     * s(i)= 
        max{a(i),b(i)}
        b(i)−a(i)
     */
    public calculateSilhouetteScore = (): void => {
        const numDataPoints = this.weights.length
    
        // 1. Precompute pairwise distances
        const distanceMatrix: number[][] = Array.from({ length: numDataPoints }, () => new Array<number>(numDataPoints).fill(0))
    
        for (let i = 0; i < numDataPoints; i++) {
            for (let j = i + 1; j < numDataPoints; j++) {
                const distance = KMeans.calculateDistanceEucledian(this.weights[i], this.weights[j])
                distanceMatrix[i][j] = distance
                distanceMatrix[j][i] = distance // Symmetry in distance
            }
        }
    
        // 2. Organize data points by cluster
        const clusters: number[][] = Array.from({ length: this.k }, () => [])
    
        this.assignments.forEach((clusterIdx, weightIdx) => {
            clusters[clusterIdx].push(weightIdx)
        });
    
        // 3. Calculate silhouette scores
        const silhouetteValues: number[] = []
    
        for (let i = 0; i < numDataPoints; i++) {
            const ownClusterIdx = this.assignments[i]
            const ownCluster = clusters[ownClusterIdx].filter(idx => idx !== i) // Exclude the current data point
    
            // Calculate a (average distance to points in the same cluster)
            const a = ownCluster.length ? ownCluster.reduce((sum, idx) => sum + distanceMatrix[i][idx], 0) / ownCluster.length : 0;
    
            // Calculate b (smallest average distance to points in another cluster)
            let b = Infinity
            for (let j = 0; j < this.k; j++) {
                if (j !== ownClusterIdx) {
                    const otherClusterAvg = clusters[j].reduce((sum, idx) => sum + distanceMatrix[i][idx], 0) / clusters[j].length
                    b = Math.min(b, otherClusterAvg)
                }
            }
    
            silhouetteValues.push((b - a) / Math.max(a, b))
        }
    
        this.silhoutteScore = silhouetteValues.reduce((sum, val) => sum + val, 0) / silhouetteValues.length

        if (isNaN(this.silhoutteScore)) this.silhoutteScore = 0
    }

    // Function to calculate the average distance of points in a cluster to its centroid
    private calculateSi(clusterPoints: number[][], centroid: number[]): number {
        const sumOfDistances = clusterPoints.reduce(
            (sum, point) => sum + KMeans.calculateDistanceEucledian(point, centroid),
            0
        )

        return sumOfDistances / clusterPoints.length
    }

    // Function to calculate Davies-Bouldin Index
    public calculateDaviesBouldinIndex = () => {
        const R: number[] = []
        
        for (let i = 0; i < this.k; i++) {
            const clusterIPoints = this.weights.filter((_, index) => this.assignments[index] === i)
            const centroidI = this.centroids[i]
            const Si = this.calculateSi(clusterIPoints, centroidI)

            let maxRij = -Infinity

            for (let j = 0; j < this.k; j++) {
                if (i !== j) {
                    const clusterJPoints = this.weights.filter((_, index) => this.assignments[index] === j)
                    const centroidJ = this.centroids[j]
                    const Sj = this.calculateSi(clusterJPoints, centroidJ)
                    const Mij = Math.sqrt(KMeans.calculateDistanceEucledian(centroidI, centroidJ))

                    const Rij = (Si + Sj) / Mij
                    if (Rij > maxRij) {
                        maxRij = Rij
                    }
                }
            }

            R.push(maxRij)
        }

        // Calculate the Davies-Bouldin Index as the average of the R values
        this.daviesBouldingIndex = R.reduce((sum, val) => sum + val, 0) / this.k
    }

    /**
     * Calculate how much a project has been penalized
     */
    public calculateDifferenceBetweenKMeansAndtraditional = () => {
        // reset penalties
        this.penalties = []
        // loop through the projects
        for (let i = 0; i < this.projects; i++) {
            // calculate the difference between the two QFs
            this.penalties.push(this.traditionalQFs[i] - this.kMeansQFs[i])
        }
    }

    /**
     * Calculate the average intra-cluster distance
     */
    public calculateIntraClusterDistance = () => {
        let sumDistances = 0
        let numDistances = 0
        
        for (let i = 0; i < this.k; i++) {
            const clusterPoints = this.weights.filter((_, index) => this.assignments[index] === i)
            
            for (let j = 0; j < clusterPoints.length; j++) {
                for (let k = j + 1; k < clusterPoints.length; k++) {
                    const distance = KMeans.calculateDistanceEucledian(clusterPoints[j], clusterPoints[k])
                    sumDistances += distance
                    numDistances++
                }
            }
        }
        
        this.intraClusterDistance = sumDistances / numDistances
    }

    /**
     * Calculate the maximum inter-cluster distance
     */
    public calculateInterClusterDistance = () => {
        let maxDistance = 0

        for (let i = 0; i < this.k; i++) {
            for (let j = i + 1; j < this.k; j++) {
                const distance = KMeans.calculateDistanceEucledian(this.centroids[i], this.centroids[j])
                if (distance > maxDistance) {
                    maxDistance = distance
                }
            }
        }

        this.interClusterDistance = maxDistance
    }

    /**
     * Calculate the Dunn Index
     */
    public calculateDunnIndex = () => {
        this.calculateIntraClusterDistance()
        this.calculateInterClusterDistance()

        this.dunnScore = this.intraClusterDistance / this.interClusterDistance
    }

    /**
     * Write the output to a file
     * @param filePath <string> the path to the file
     */
    public writeToFile = (filePath: string) => {
        const output = {
            k: this.k,
            coefficients: this.coefficients,
            qfs: this.kMeansQFs,
            tradQFs: this.traditionalQFs,
            assignments: this.assignments, // in which clusters are the users?
            centroids: this.centroids, // which ballots became centroids
            votersCoefficients: this.votersCoefficients.map((coeff) => coeff.coefficent),
            projects: this.projects,
            initialCentroids: this.initialCentroids,
            voters: this.weights.length, 
            wcss: this.wcss,
            penalties: this.penalties,
            clustersSizes: this.clustersSizes,
            silhouetteScore: this.silhoutteScore
        }
    
        fs.writeFileSync(filePath, JSON.stringify(output, null, 4))
    }
}