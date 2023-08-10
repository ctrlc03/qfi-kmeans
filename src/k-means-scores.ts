import { parseVoteData, KMeans, UserBallot } from "./ts/index.js"
import fs from "fs"

/// @note save all scores (wcss, silhoutte, db index, dunn index) for each iteration of k-means
/// k from 3 to 20 (not inclusive)
const main = () => {
    const data = fs.readFileSync("./tests/data/usersBallotState.json").toString()

    const ballots: UserBallot[] = parseVoteData(data)

    const iteration = process.argv[2]

    const scores: number[] = []
    const dbIndexes: number[] = []
    const elbows: number[] = []
    const dunnScores: number[] = []

    for (let i = 3; i < 11; i++) {
        const kMeans = new KMeans(i, ballots, true)
        scores.push(kMeans.silhoutteScore)
        dbIndexes.push(kMeans.daviesBouldingIndex)
        elbows.push(kMeans.wcss)
        dunnScores.push(kMeans.dunnScore)
    }

    fs.writeFileSync(`./tests/data/output/scores/scores_${iteration}.json`, JSON.stringify({
        "silhoutteScores": scores,
        "dbIndexes": dbIndexes,
        "elbows": elbows,
        "dunnScores": dunnScores
    }, null, 4))

}

main()