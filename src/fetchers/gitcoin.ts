import { Contract, JsonRpcProvider, AbiCoder, stripZerosLeft, isAddress, formatEther, getAddress, ZeroAddress } from "ethers"
import { Round, Project, Vote, Ballot, Payout, MatchingFunds } from "./interfaces"
import axios from "axios"
import dotenv from "dotenv" 
import fs from "fs"
dotenv.config()

/// Constants

// IPFS
const ipfsURL = "https://ipfs.io/ipfs/"

// Addresses
const mainnetRoundFactoryAddress = "0xE2Bf906f7d10F059cE65769F53fe50D8E0cC7cBe"
const optimismRoundFactoryAddress = "0x0f0A4961274A578443089D06AfB9d1fC231A5a4D"
const roundImplementationAddress = "0x1b165fE4DA6bC58AB8370DDC763d367D29F50Ef0"
const projectRegistryMainnetAddress = "0x03506eD3f57892C85DB20C36846e9c808aFe9ef4"
const projectRegistryOPAddress = "0x8e1bD5Da87C14dd8e08F7ecc2aBf9D1d558ea174"

// ABIs
const merklePayoutAbi = JSON.parse(fs.readFileSync('./src/fetchers/abis/payoutStrategyMerkle.json').toString())
const roundImplementationAbi = JSON.parse(fs.readFileSync('./src/fetchers/abis/roundImplementation.json').toString())
const projectRegistryAbi = JSON.parse(fs.readFileSync('./src/fetchers/abis/mainnetProjectRegistry.json').toString())

// Providers for talking with the blockchain
const providerURL = String(process.env.RPC_URL_MAINNET)
const providerURLOP = String(process.env.RPC_URL_OP)
const apiKey = String(process.env.ETHERSCAN_KEY)
const apiKeyOP = String(process.env.OPSCAN_KEY)
const minApiKey = String(process.env.MIN_API_KEY)

const provider = new JsonRpcProvider(providerURL)
const providerOP = new JsonRpcProvider(providerURLOP)

// The vote function abi
const functionAbi = ['function vote(bytes[])']
// The vote schema for the encoded votes
const voteSchema = ["address","uint256","address","uint256"]
const voteSchema2 = ["address", "uint256", "address"]

// Which blocks to start fetching data from 
const startBlockMainnet = 16000000
const startBlockOptimism = 37890311

const mainnetContract = new Contract(roundImplementationAddress, functionAbi, provider)
const abiCoder = new AbiCoder()

//// Functions

/**
 * Get all projects registered on Gitcoin
 * @param {Contract} contract - The contract to fetch from
 * @returns {Project[]} - the projects array
 */
const getAllProjects = async (contract: Contract): Promise<Project[]> => {
    const projects: Project[] = []
    const totalProjects = await contract.projectsCount()
    
    console.log(`Fetching ${totalProjects.toString()} projects`)

    for (let i = 0; i < totalProjects; i++) {
        const proj = await contract.projects(i)
        projects.push({
            id: proj.id.toString(),
            metadata: proj.metadata[1]
        })

        console.log(`Fetched project ${i} = `, proj)
    }

    return projects
}

/**
 * Get the Ether price at a certain point in time
 * @param startDate {number} the start date in the format of unix timestamp
 * @returns {string} the ether price in USD
 */
const getEtherPrice = async (startDate: number): Promise<string> => {
    try {
        const resp = await axios.get(
            `https://min-api.cryptocompare.com/data/v2/histoday?fsym=ETH&tsym=USD&toTs=${startDate}&limit=1&api_key=${minApiKey}`
        )
        if (resp.status !== 200) throw new Error("Could not get the ether price")
        
        const price = resp.data.Data.Data[0].open
        return price.toString()
    } catch (error: any) { return "1800.00" }
}

/**
 * Get all approved projects of a round
 * @param pin {string} the ipfs pin
 * @returns {string[]} the projects payout addresses
 */
const fetchRegisteredProjectsPerRound = async (pin: string): Promise<string[]> => {
    const resp = await axios.get(`${ipfsURL}${pin}`)

    if (resp.status !== 200) throw new Error("Could not get the registered projects")

    const approved = resp.data.filter((project: any) => project.status === "APPROVED").map((project: any) => getAddress(project.payoutAddress))
    return approved
}

/**
 * Get the round details
 * @param pin {string} the ipfs pin
 * @returns {any} the round details
 */
const getRoundOrganizersDetails = async (pin: string): Promise<any> => {
    const resp = await axios.get(`${ipfsURL}${pin}`)

    if (resp.status !== 200) throw new Error("Could not get the round details")

    const matchingFunds: MatchingFunds = resp.data.matchingFunds
    const name = resp.data.name
    const description = resp.data.eligibility.description
    const programAddress = resp.data.programContractAddress
    const support = resp.data.support.info 

    return {
        name,
        description,
        programAddress,
        support,
        matchingFunds
    }
}

/**
 * Decode all Vote transactions (using schema 1)
 * @param {string} address - The address of the user
 * @param {string} startBlock - The block to start fetching from
 * @param {string} domain - The domain to fetch from
 * @param {string} apiKey - The API key to use
 * @param {string} etherPrice - The ether price at the time of the round
 * @returns {Ballot[]} - Returns an array of ballots
 */
const decodeVotes = async (
    address: string, 
    startBlock: string, 
    domain: string, 
    apiKey: string,
    etherPrice: string
): Promise<Ballot[]> => {
    const ballots: Ballot[] = []
    const url = `https://${domain}/api?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=latest&sort=asc&apikey=${apiKey}`;
    const response = await axios.get(url)
    const transactions = response.data.result
    for (const transaction of transactions) {
        if (transaction.methodId !== '0x7aa54b68') continue 
        try {
            // can decode using any contract as we just need the interface
            const votes = mainnetContract.interface.decodeFunctionData('vote', transaction.input)
            const arr = votes[0]
            for (let i = 0; i < arr.length; i++) {
                const vote = arr[i]
                try {
                    const decodedVote = abiCoder.decode(voteSchema, vote.toString())
                    // if the token is the zero address, it's ether and calculate the value based on the price
                    // at the time of the round start
                    const amount = decodedVote[0] === ZeroAddress ? 
                        (parseFloat(formatEther(decodedVote[1].toString())) * parseFloat(etherPrice)).toString() :
                        formatEther(decodedVote[1].toString()).toString()
                    const userVote: Vote = {
                        // parse with 18 decimals (DAI or Ether)
                        token: decodedVote[0],
                        amount: amount,
                        grantAddress: getAddress(decodedVote[2]),
                        projectId: decodedVote[3].toString()
                    }
                    const ballot = ballots.find(b => b.user === transaction.from);
                    if (ballot) ballot.votes.push(userVote)
                    else ballots.push({
                            user: transaction.from,
                            votes: [userVote]
                        })
                } catch (error: any) {
                    // if we failed, it's possible that the votes were encoded in a second way (both seems to be used)
                    try {
                        const decodedVote = abiCoder.decode(voteSchema2, vote.toString())
                        // if the token is the zero address, it's ether and calculate the value based on the price
                        // at the time of the round start
                        const amount = decodedVote[0] === ZeroAddress ? 
                        (parseFloat(formatEther(decodedVote[1].toString())) * parseFloat(etherPrice)).toString() :
                        formatEther(decodedVote[1].toString()).toString()
                        const userVote: Vote = {
                            token: decodedVote[0],
                            amount: amount,
                            grantAddress: getAddress(decodedVote[2]),
                        }
                        const ballot = ballots.find(b => b.user === transaction.from);
                        if (ballot) ballot.votes.push(userVote)
                        else ballots.push({
                                user: transaction.from,
                                votes: [userVote]
                        })
                    } catch (error: any) {}
                }
            }
        } catch (error: any) {
            continue
        }
    }
    return ballots
}


/**
 * Get the payout details for a round
 * @param {String payoutAddress} - The address of the payout strategy
 * @returns {Payout} - Returns the payout details for a round
 */
const getPayout = async (payoutAddress: string, provider: JsonRpcProvider): Promise<Payout> => {
    const contract = new Contract(payoutAddress, merklePayoutAbi, provider)

    const merkleRoot = await contract.merkleRoot()
    const metaPointer = await contract.distributionMetaPtr()

    return {
        merkleRoot: merkleRoot,
        metaPointer: metaPointer[1]
    }
}

/**
 * Get all rounds created by a factory
 * @returns {string[]} - Returns all rounds created by the round factory
 */
const getRoundsCreated = async (address: string, provider: JsonRpcProvider): Promise<string[]> => {
    const roundAddresses: string[] = []
    const logs = await provider.getLogs({
        fromBlock: 0,
        toBlock: "latest",
        address: address
    })

    for (const log of logs) {
        try {
            const addr = stripZerosLeft(log.topics[1])
            if (isAddress(addr)) roundAddresses.push(addr)
        } catch (error: any) { continue }
    }

    console.log(`There are ${roundAddresses.length} rounds created by the round factory`)
    for (const addr of roundAddresses) console.log(`Address: ${addr}`)
    return roundAddresses
}

/**
 * Fetch the data of each deployed round contract
 * @returns {Round[]} - Returns all rounds created by the round factory
 */
const enumerateRounds = async (address: string, provider: JsonRpcProvider, startBlock: number): Promise<Round[]> => {
    const rounds: Round[] = []
    const addresses = await getRoundsCreated(address, provider)
    for (const address of addresses) {
        try {
            // Get all data needed
            const roundContract = new Contract(address, roundImplementationAbi, provider)
            const votingStrategy = await roundContract.votingStrategy()
            const payoutStrategy = await roundContract.payoutStrategy()
            const startTime = await roundContract.roundStartTime()
            const endTime = await roundContract.roundEndTime()
            const token = await roundContract.token()
            const roundMetaPtr = await roundContract.roundMetaPtr()
            const applicationMetaPtr = await roundContract.applicationMetaPtr()
            const projectsMetadataPtr = await roundContract.projectsMetaPtr()
            const approvedProjects = await fetchRegisteredProjectsPerRound(projectsMetadataPtr[1])
            const {   
                name,
                description,
                programAddress,
                support,
                matchingFunds
            } = await getRoundOrganizersDetails(roundMetaPtr[1])

            // store the data
            const round: Round = {
                address: address,
                roundMetadata: roundMetaPtr[1],
                applicationMetadata: applicationMetaPtr[1],
                token: token,
                startTime: startTime,
                endTime: endTime,
                payoutStrategy: payoutStrategy,
                votingStrategy: votingStrategy,
                deploymentBlock: startBlock,
                projectsMetadata: projectsMetadataPtr[1],
                approvedProjects: approvedProjects,
                name: name,
                description: description,
                programAddress: programAddress,
                support: support,
                matchingFunds: matchingFunds,
                etherPrice: await getEtherPrice(parseInt(startTime))
            }
            rounds.push(round)
        } catch (error: any) {continue }  
    }
    console.log(`Finished enumerating ${rounds.length} rounds`)
    return rounds
}

/**
 * Save the data to a JSON file
 * @param {string} path - The path to save the JSON file
 * @param {string} roundAddress - The address of the round
 * @param {Ballot[]} ballots - The ballots of the round
 * @param {Payout} payout - The payout details of the round
 * @param {string} startTime - The start time of the round
 * @param {string} endTime - The end time of the round
 * @param {string} metadata - The metadata of the round
 * @param {string} token - The token of the round
 * @param {string} applicationMetadata - The application metadata of the round
 * @param {string} projectsMetadata - The projects metadata of the round
 * @param {string[]} approvedProjects - The approved projects of the round
 * @param {string} name - The name of the round
 * @param {string} description - The description of the round
 * @param {string} programAddress - The program address of the round
 * @param {string} support - The support of the round
 * @param {MatchingFunds} matchingFunds - The matching funds of the round
 * @param {string} etherPrice - The ether price at the start time of the round
 */
const saveToJSON = (
    path: string, 
    roundAddress: string, 
    ballots: Ballot[], 
    payout: Payout,
    startTime: string,
    endTime: string,
    metadata: string,
    token: string,
    applicationMetadata: string,
    projectsMetadata: string,
    approvedProjects: string[],
    name: string,
    description: string,
    programAddress: string,
    support: string,
    matchingFunds: MatchingFunds,
    etherPrice: string
    ) => {
    const json = {
        "name": name,
        "description": description,
        "programAddress": programAddress,
        "support": support,
        "matchingFunds": matchingFunds,
        "roundAddress": roundAddress,
        "token": token,
        "startTime": new Date(parseInt(startTime)*1000).toString(),
        "endTime": new Date(parseInt(endTime)).toString(),
        "totalProjects": approvedProjects.length,
        "totalBallots": ballots.length,
        "roundMetadata": metadata,
        "applicationMetadata": applicationMetadata,
        "projectsMetadata": projectsMetadata,
        "approvedProjects": approvedProjects,
        "payout": payout,
        "etherPrice": `$${etherPrice}`,
        "ballots": ballots
    }

    fs.writeFileSync(path, JSON.stringify(json, null, 4))
}

/**
 * Fetch the data for each registered project
 */
const fetchAndSaveProjects = async () => {
    const mainnetProjectRegistry = new Contract(projectRegistryMainnetAddress, projectRegistryAbi, provider)
    const optimismProjectRegistry = new Contract(projectRegistryOPAddress, projectRegistryAbi, providerOP)

    const mainnetProjects = await getAllProjects(mainnetProjectRegistry)
    const optimismProjects = await getAllProjects(optimismProjectRegistry)

    fs.writeFileSync("./tests/data/mainnet/projects.json", JSON.stringify(mainnetProjects, null, 4))
    fs.writeFileSync("./tests/data/optimism/projects.json", JSON.stringify(optimismProjects, null, 4))
}

/**
 * Fetch the data of each deployed round contract
 */
const main = async () => {
    console.log(`Ethereum mainnet\n`)
    const rounds = await enumerateRounds(mainnetRoundFactoryAddress, provider, startBlockMainnet)
    for (const round of rounds) {
        const ballots = await decodeVotes(
            round.address, 
            round.deploymentBlock.toString(), 
            "api.etherscan.io", 
            apiKey,
            round.etherPrice
        )
        console.log(`Round ${round.address}`)
        console.log(`Number of Votes: ${ballots.length}`)
        
        const payout = await getPayout(round.payoutStrategy, provider)

        saveToJSON(
            `./tests/data/mainnet/${round.address}.json`, 
            round.address, 
            ballots, 
            payout, 
            round.startTime.toString(), 
            round.endTime.toString(), 
            round.roundMetadata, 
            round.token, 
            round.applicationMetadata,
            round.projectsMetadata,
            round.approvedProjects,
            round.name,
            round.description,
            round.programAddress,
            round.support,
            round.matchingFunds,
            round.etherPrice
        )
    }

    console.log(`\n\nOptimism`)
    const roundsOP = await enumerateRounds(optimismRoundFactoryAddress, providerOP, startBlockOptimism) 
    for (const round of roundsOP) {
        const ballots = await decodeVotes(
            round.address, 
            round.deploymentBlock.toString(), 
            "api-optimistic.etherscan.io", 
            apiKeyOP,
            round.etherPrice
        )
        console.log(`Round ${round.address}`)
        console.log(`Number of Votes: ${ballots.length}`)

        const payout = await getPayout(round.payoutStrategy, providerOP)

        saveToJSON(
            `./tests/data/optimism/${round.address}.json`, 
            round.address, 
            ballots, 
            payout, 
            round.startTime.toString(), 
            round.endTime.toString(), 
            round.roundMetadata, 
            round.token, 
            round.applicationMetadata,
            round.projectsMetadata,
            round.approvedProjects,
            round.name,
            round.description,
            round.programAddress,
            round.support,
            round.matchingFunds,
            round.etherPrice
        )
    }

    // @note this will take a long time (probably not needed. Uncomment at your own risk)
    // await fetchAndSaveProjects()
}

await main()
