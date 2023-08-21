import { parseVoteData, KMeans, UserBallot } from "../ts/index.js"
import fs from "fs"

const main = () => {
    const iteration = process.argv[2]

    const data_0x1b165fe4da6bc58ab8370ddc763d367d29f50ef0 = fs.readFileSync(
        "./tests/data/gitcoin/mainnet_votes_parsed_0x1b165fe4da6bc58ab8370ddc763d367d29f50ef0.json"
    ).toString()

    const data_0xd95a1969c41112cee9a2c931e849bcef36a16f4c = fs.readFileSync(
        "./tests/data/gitcoin/mainnet_votes_parsed_0xd95a1969c41112cee9a2c931e849bcef36a16f4c.json"
    ).toString()

    const data_0xdf75054cd67217aee44b4f9e4ebc651c00330938 = fs.readFileSync(
        "./tests/data/gitcoin/mainnet_votes_parsed_0xdf75054cd67217aee44b4f9e4ebc651c00330938.json"
    ).toString()

    const data_0xe575282b376e3c9886779a841a2510f1dd8c2ce4 = fs.readFileSync(
        "./tests/data/gitcoin/mainnet_votes_parsed_0xe575282b376e3c9886779a841a2510f1dd8c2ce4.json"
    ).toString()

    const ballots_1: UserBallot[] = parseVoteData(data_0x1b165fe4da6bc58ab8370ddc763d367d29f50ef0)
    const ballots_2: UserBallot[] = parseVoteData(data_0xd95a1969c41112cee9a2c931e849bcef36a16f4c)
    const ballots_3: UserBallot[] = parseVoteData(data_0xdf75054cd67217aee44b4f9e4ebc651c00330938)
    const ballots_4: UserBallot[] = parseVoteData(data_0xe575282b376e3c9886779a841a2510f1dd8c2ce4)

    const scores: number[] = []
    const dbIndexes: number[] = []
    const elbows: number[] = []
    const dunnScores: number[] = []

    const scores_1: number[] = []
    const dbIndexes_1: number[] = []
    const elbows_1: number[] = []
    const dunnScores_1: number[] = []

    const scores_2: number[] = []
    const dbIndexes_2: number[] = []
    const elbows_2: number[] = []
    const dunnScores_2: number[] = []

    const scores_3: number[] = []
    const dbIndexes_3: number[] = []
    const elbows_3: number[] = []
    const dunnScores_3: number[] = []

    const scoresCosine: number[] = []
    const dbIndexesCosine: number[] = []
    const elbowsCosine: number[] = []
    const dunnScoresCosine: number[] = []

    const scoresCosine_1: number[] = []
    const dbIndexesCosine_1: number[] = []
    const elbowsCosine_1: number[] = []
    const dunnScoresCosine_1: number[] = []

    const scoresCosine_2: number[] = []
    const dbIndexesCosine_2: number[] = []
    const elbowsCosine_2: number[] = []
    const dunnScoresCosine_2: number[] = []

    const scoresCosine_3: number[] = []
    const dbIndexesCosine_3: number[] = []
    const elbowsCosine_3: number[] = []
    const dunnScoresCosine_3: number[] = []

    for (let k = 3; k < 21; k++) {
        const kMeans_1 = new KMeans(k, ballots_1, false, "eucledian")
        scores.push(kMeans_1.silhoutteScore)
        dbIndexes.push(kMeans_1.daviesBouldingIndex)
        elbows.push(kMeans_1.wcss)
        dunnScores.push(kMeans_1.dunnScore)

        const kMeans_2 = new KMeans(k, ballots_2, false, "eucledian")
        scores_1.push(kMeans_2.silhoutteScore)
        dbIndexes_1.push(kMeans_2.daviesBouldingIndex)
        elbows_1.push(kMeans_2.wcss)
        dunnScores_1.push(kMeans_2.dunnScore)

        const kMeans_3 = new KMeans(k, ballots_3, false, "eucledian")
        scores_2.push(kMeans_3.silhoutteScore)
        dbIndexes_2.push(kMeans_3.daviesBouldingIndex)
        elbows_2.push(kMeans_3.wcss)
        dunnScores_2.push(kMeans_3.dunnScore)

        const kMeans_4 = new KMeans(k, ballots_4, false, "eucledian")
        scores_3.push(kMeans_4.silhoutteScore)
        dbIndexes_3.push(kMeans_4.daviesBouldingIndex)
        elbows_3.push(kMeans_4.wcss)
        dunnScores_3.push(kMeans_4.dunnScore)

        const kMeans1 = new KMeans(k, ballots_1, false)
        scoresCosine.push(kMeans1.silhoutteScore)
        dbIndexesCosine.push(kMeans1.daviesBouldingIndex)
        elbowsCosine.push(kMeans1.wcss)
        dunnScoresCosine.push(kMeans1.dunnScore)

        const kMeans2 = new KMeans(k, ballots_2, false)
        scoresCosine_1.push(kMeans2.silhoutteScore)
        dbIndexesCosine_1.push(kMeans2.daviesBouldingIndex)
        elbowsCosine_1.push(kMeans2.wcss)
        dunnScoresCosine_1.push(kMeans2.dunnScore)

        const kMeans3 = new KMeans(k, ballots_3, false)
        scoresCosine_2.push(kMeans3.silhoutteScore)
        dbIndexesCosine_2.push(kMeans3.daviesBouldingIndex)
        elbowsCosine_2.push(kMeans3.wcss)
        dunnScoresCosine_2.push(kMeans3.dunnScore)

        const kMeans4 = new KMeans(k, ballots_4, false)
        scoresCosine_3.push(kMeans4.silhoutteScore)
        dbIndexesCosine_3.push(kMeans4.daviesBouldingIndex)
        elbowsCosine_3.push(kMeans4.wcss)
        dunnScoresCosine_3.push(kMeans4.dunnScore)
    }

    fs.writeFileSync(`./src/prod/gitcoin/cosine/scores/data_0x1b165fe4da6bc58ab8370ddc763d367d29f50ef0_${iteration}.json`, JSON.stringify({
        "silhoutteScores": scoresCosine,
        "dbIndexes": dbIndexesCosine,
        "elbows": elbowsCosine,
        "dunnScores": dunnScoresCosine
    }, null, 4))

    fs.writeFileSync(`./src/prod/gitcoin/cosine/scores/data_0xd95a1969c41112cee9a2c931e849bcef36a16f4c_${iteration}.json`, JSON.stringify({
        "silhoutteScores": scoresCosine_1,
        "dbIndexes": dbIndexesCosine_1,
        "elbows": elbowsCosine_1,
        "dunnScores": dunnScoresCosine_1
    }, null, 4))

    fs.writeFileSync(`./src/prod/gitcoin/cosine/scores/data_0xdf75054cd67217aee44b4f9e4ebc651c00330938_${iteration}.json`, JSON.stringify({
        "silhoutteScores": scoresCosine_2,
        "dbIndexes": dbIndexesCosine_2,
        "elbows": elbowsCosine_2,
        "dunnScores": dunnScoresCosine_2
    }, null, 4))

    fs.writeFileSync(`./src/prod/gitcoin/cosine/scores/data_0xe575282b376e3c9886779a841a2510f1dd8c2ce4_${iteration}.json`, JSON.stringify({
        "silhoutteScores": scoresCosine_3,
        "dbIndexes": dbIndexesCosine_3,
        "elbows": elbowsCosine_3,
        "dunnScores": dunnScoresCosine_3
    }, null, 4))
    
    fs.writeFileSync(`./src/prod/gitcoin/eucledian/scores/data_0x1b165fe4da6bc58ab8370ddc763d367d29f50ef0_${iteration}.json`, JSON.stringify({
        "silhoutteScores": scores,
        "dbIndexes": dbIndexes,
        "elbows": elbows,
        "dunnScores": dunnScores
    }, null, 4))

    fs.writeFileSync(`./src/prod/gitcoin/eucledian/scores/data_0xd95a1969c41112cee9a2c931e849bcef36a16f4c_${iteration}.json`, JSON.stringify({
        "silhoutteScores": scores_2,
        "dbIndexes": dbIndexes_2,
        "elbows": elbows_2,
        "dunnScores": dunnScores_2
    }, null, 4))

    fs.writeFileSync(`./src/prod/gitcoin/eucledian/scores/data_0xdf75054cd67217aee44b4f9e4ebc651c00330938_${iteration}.json`, JSON.stringify({
        "silhoutteScores": scores_3,
        "dbIndexes": dbIndexes_3,
        "elbows": elbows_3,
        "dunnScores": dunnScores_3
    }, null, 4))

    fs.writeFileSync(`./src/prod/gitcoin/eucledian/scores/data_0xe575282b376e3c9886779a841a2510f1dd8c2ce4_${iteration}.json`, JSON.stringify({
        "silhoutteScores": scores_3,
        "dbIndexes": dbIndexes_3,
        "elbows": elbows_3,
        "dunnScores": dunnScores_3
    }, null, 4))

}

main()