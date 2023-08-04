import fs from "fs"

type UserVoteType = {
    user: string
    votes: {
        token: string
        amount: string
        grantAddress: string
    }[]
}

const mainnetPath = "./tests/data/mainnet"
const opPath = "./tests/data/optimism"
const filesMainnet = fs.readdirSync(mainnetPath)
const filesOP = fs.readdirSync(opPath)

// @note pass network as to avoid contracts with the same address across chains
// they don't use create2 but still better to be safe
const doStuff = (file: string, network: string, path: string) => {
    try {
        const data = JSON.parse(fs.readFileSync(`${path}/${file}`).toString())

        const approvedProjects = data.approvedProjects
        const votes: UserVoteType[] = data.ballots 
        
        const output = votes.map(userVote => {
            const voteObject: {[key: string]: {voteOption: string, voteWeight: string}} = {}
        
            userVote.votes.forEach(vote => {
                // we add one as we start counting vote options from 1 not zero
                const voteOption = (approvedProjects.indexOf(vote.grantAddress) + 1).toString()
                // not found index would be -1 + 1 -> 0
                if (voteOption !== "0")  
                    if (voteObject.hasOwnProperty(voteOption)) {
                        const prevWeight = parseFloat(voteObject[voteOption].voteWeight)
                        const currentWeight = parseFloat(vote.amount)
                        voteObject[voteOption].voteWeight = (prevWeight + currentWeight).toString()
                    } else 
                        voteObject[voteOption] = {
                            voteOption: voteOption,
                            voteWeight: vote.amount
                    }
            })
        
            return voteObject
        })
        
        fs.writeFileSync(`./tests/data/gitcoin/${network}_votes_parsed_${file}`, JSON.stringify(output, null, 4))
    } catch (error) { }
}

for (const file of filesMainnet) doStuff(file, "mainnet", mainnetPath)
for (const file of filesOP) doStuff(file, "optimism", opPath)


