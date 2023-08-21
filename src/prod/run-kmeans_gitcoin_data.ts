import { parseVoteData, KMeans, UserBallot } from "../ts/index.js"
import fs from "fs"

const main = () => {
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

    const k = process.argv[2]
    const kMeans_1 = new KMeans(parseInt(k), ballots_1, false)
    const kMeans_2 = new KMeans(parseInt(k), ballots_2, false)
    const kMeans_3 = new KMeans(parseInt(k), ballots_3, false)
    const kMeans_4 = new KMeans(parseInt(k), ballots_4, false)

    fs.writeFileSync(`./src/prod/gitcoin/cosine/outputs/data_0x1b165fe4da6bc58ab8370ddc763d367d29f50ef0_k_${k}-means.json`, JSON.stringify({ "sizes": kMeans_1.clustersSizes }, null, 4))
    fs.writeFileSync(`./src/prod/gitcoin/cosine/outputs/data_0xd95a1969c41112cee9a2c931e849bcef36a16f4c_k_${k}-means.json`, JSON.stringify({ "sizes": kMeans_2.clustersSizes }, null, 4))
    fs.writeFileSync(`./src/prod/gitcoin/cosine/outputs/data_0xdf75054cd67217aee44b4f9e4ebc651c00330938_k_${k}-means.json`, JSON.stringify({ "sizes": kMeans_3.clustersSizes }, null, 4))
    fs.writeFileSync(`./src/prod/gitcoin/cosine/outputs/data_0xe575282b376e3c9886779a841a2510f1dd8c2ce4_k_${k}-means.json`, JSON.stringify({ "sizes": kMeans_4.clustersSizes }, null, 4))

    const kMeans1 = new KMeans(parseInt(k), ballots_1, false, "eucledian")
    const kMeans2 = new KMeans(parseInt(k), ballots_2, false, "eucledian")
    const kMeans3 = new KMeans(parseInt(k), ballots_3, false, "eucledian")
    const kMeans4 = new KMeans(parseInt(k), ballots_4, false, "eucledian")

    fs.writeFileSync(`./src/prod/gitcoin/eucledian/outputs/data_0x1b165fe4da6bc58ab8370ddc763d367d29f50ef0_k_${k}-means.json`, JSON.stringify({ "sizes": kMeans1.clustersSizes }, null, 4))
    fs.writeFileSync(`./src/prod/gitcoin/eucledian/outputs/data_0xd95a1969c41112cee9a2c931e849bcef36a16f4c_k_${k}-means.json`, JSON.stringify({ "sizes": kMeans2.clustersSizes }, null, 4))
    fs.writeFileSync(`./src/prod/gitcoin/eucledian/outputs/data_0xdf75054cd67217aee44b4f9e4ebc651c00330938_k_${k}-means.json`, JSON.stringify({ "sizes": kMeans3.clustersSizes }, null, 4))
    fs.writeFileSync(`./src/prod/gitcoin/eucledian/outputs/data_0xe575282b376e3c9886779a841a2510f1dd8c2ce4_k_${k}-means.json`, JSON.stringify({ "sizes": kMeans4.clustersSizes }, null, 4))
}

main()