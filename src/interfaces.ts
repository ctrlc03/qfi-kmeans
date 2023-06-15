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
    votes: number[][]
    k: number
    centroids: number[][]
    clusters: Cluster[]
    coefficients: Coefficent[]
    votersCoefficients: VotersCoefficients[]
    assignmnets: number[]
    qfs: number[]
}