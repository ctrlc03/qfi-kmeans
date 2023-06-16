export interface Cluster {
    index: number
    size: number
}

export interface Coefficent {
    clusterIndex: number
    coefficent: number
}

export interface VotersCoefficients {
    voterIndex: number 
    clusterIndex: number 
    coefficent: number
}

export interface KMeansQF {
    voters: number 
    projects: number
    votes: UserBallot[]
    k: number
    centroids: number[][]
    clusters: Cluster[]
    coefficients: Coefficent[]
    votersCoefficients: VotersCoefficients[]
    assignmnets: number[]
    qfs: number[]
    iterations: number 
}


export interface Vote {
    voteOption: number 
    voteWeight: number 
}

export interface UserBallot {
    votes: Vote[]
}