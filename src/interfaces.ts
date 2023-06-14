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