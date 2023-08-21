import { parseVoteData, KMeans, UserBallot } from "../ts/index.js"
import fs from "fs"

const main = () => {
    const data = fs.readFileSync("./tests/data/usersBallotState.json").toString()

    const ballots: UserBallot[] = parseVoteData(data)

    const k = process.argv[2]
    const kMeans = new KMeans(parseInt(k), ballots, true)

    fs.writeFileSync(`./src/prod/qfi/cosine/outputs/k_${k}-means.json`, JSON.stringify({ "sizes": kMeans.clustersSizes }, null, 4))

    const kMeans2 = new KMeans(parseInt(k), ballots, true, "eucledian")
    fs.writeFileSync(`./src/prod/qfi/eucledian/outputs/k_${k}-means.json`, JSON.stringify({ "sizes": kMeans2.clustersSizes }, null, 4))
}

main()