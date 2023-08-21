import { parseVoteData, KMeans, UserBallot } from "./ts/index.js"
import fs from "fs"

const main = () => {
    const data = fs.readFileSync("./tests/data/gitcoin/mainnet_votes_parsed_0xe575282b376e3c9886779a841a2510f1dd8c2ce4.json").toString()

    const ballots: UserBallot[] = parseVoteData(data)

    const k = process.argv[2]
    const kMeans = new KMeans(15, ballots, false)

    console.log("Before converging", kMeans.actualIterations)
    // run kMeans calculations in different ways
    kMeans.runAlgorithm1MinusSquareAfter()
    kMeans.writeToFile(`./tests/data/gitcoin/output/cosine/sizes.json`)

}

main()