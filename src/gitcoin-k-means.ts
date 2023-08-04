import { parseVoteData, KMeans, UserBallot } from "./ts/index.js"
import fs from "fs"

const main = () => {
    const files = fs.readdirSync('./tests/data/gitcoin')

    for (const file of files) {
        const data = fs.readFileSync(`./tests/data/gitcoin/${file}`).toString()
        const name = file.split('.')[0]
        const network = name.split('_')[0]
        const address = name.split('_')[3]
        const filename = network + '_' + address
        const iteration = process.argv[2]
    
        const ballots: UserBallot[] = parseVoteData(data)

        if (ballots.length < 10) continue 

        let wcss = []
    
        for (let i = 3; i <= 10; i++) {
            const kMeans = new KMeans(i, ballots, false)
            wcss.push(kMeans.wcss)
    
            // run kMeans calculations in different ways
            kMeans.runAlgorithm1MinusSquareAfter()
            kMeans.writeToFile(`./tests/data/gitcoin/output/${filename}_output_k_means_k_${i}_${iteration}_one_minus_square_after.json`)
            kMeans.runAlgorithm1MinusSquareBefore()
            kMeans.writeToFile(`./tests/data/gitcoin/output/${filename}_output_k_means_k_${i}_${iteration}_one_minus_square_before.json`)
            kMeans.runAlgorithmSquareAfter()
            kMeans.writeToFile(`./tests/data/gitcoin/output/${filename}_output_k_means_k_${i}_${iteration}_square_after.json`)
            kMeans.runAlgorithmSquareBefore()
            kMeans.writeToFile(`./tests/data/gitcoin/output/${filename}_output_k_means_k_${i}_${iteration}_square_before.json`)
        }
    
        fs.writeFileSync(`./tests/data/gitcoin/output/${filename}_wcss_${iteration}.json`, JSON.stringify({
            "wcss": wcss
        }, null, 4))
    }
}

main()