// The important information for a round
export interface Round {
    address: string 
    roundMetadata: string 
    applicationMetadata: string 
    projectsMetadata: string
    token: string 
    startTime: string 
    endTime: string 
    payoutStrategy: string
    votingStrategy: string
    deploymentBlock: number
    approvedProjects: string[]
    name: string 
    matchingFunds: MatchingFunds
    description: string 
    programAddress: string 
    support: string
    etherPrice: string
}

// How the matching funds are recorded
export interface MatchingFunds {
    matchingCap: boolean
    matchingFundsAvailable: string
    matchingCapAmount: string 
}

// The vote interface for the vote schema 
export interface Vote {
    token: string 
    amount: string 
    grantAddress: string
    projectId?: string
}

// What a user ballot looks like
export interface Ballot {
    user: string 
    votes: Vote[]
}

// A project registered on Gitcoin registry 
export interface Project {
    id: string 
    metadata: any
}

// A payout for a round
export interface Payout {
    merkleRoot: string
    metaPointer: string
}