import { parseVoteData, KMeans, UserBallot } from "./ts/index.js"
import fs from "fs"

const main = () => {
    const data = fs.readFileSync('./tests/data/usersBallotState.json').toString()
    const iteration = process.argv[2]

    const ballots: UserBallot[] = parseVoteData(data)

    let wcss = []

    for (let i = 1; i <= 10; i++) {
        const kMeans = new KMeans(i, ballots, true)
        wcss.push(kMeans.wcss)
    }

    fs.writeFileSync(`./tests/data/wcss_${iteration}.json`, JSON.stringify({
        "wcss": wcss
    }))
}

main()