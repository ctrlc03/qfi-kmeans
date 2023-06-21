import { parseVoteData, findNumberOfProjects, addZeroVotesToBallots, calculateCentroidsWithIndexes } from "../src/ts/index.js"
import chai, { expect } from "chai"
import chaiAsPromised from "chai-as-promised"
import { wasm as wasm_tester } from "circom_tester"

chai.use(chaiAsPromised)

describe("Circuits", () => {
    let kMeansCircuit: any
    let kMeansManhattanCircuit: any
    let distanceCircuit: any
    let distanceManhattanCircuit: any

    beforeAll(async () => {
        distanceCircuit = await wasm_tester(`${process.cwd()}/tests/circuits/distance_test.circom`, {
            output: `${process.cwd()}/tests/artifacts`
        })
        await distanceCircuit.loadSymbols()
        await distanceCircuit.loadConstraints()
        kMeansCircuit = await wasm_tester(`${process.cwd()}/tests/circuits/k-means_test.circom`, {
            output: `${process.cwd()}/tests/artifacts`
        })
        await kMeansCircuit.loadConstraints()
        await kMeansCircuit.loadSymbols()

        distanceManhattanCircuit = await wasm_tester(`${process.cwd()}/tests/circuits/distance_manhattan_test.circom`, {
            output: `${process.cwd()}/tests/artifacts`
        })
        await distanceManhattanCircuit.loadConstraints()
        await distanceManhattanCircuit.loadSymbols()

        kMeansManhattanCircuit = await wasm_tester(`${process.cwd()}/tests/circuits/k-means_manhattan_test.circom`, {
            output: `${process.cwd()}/tests/artifacts`
        })
        await kMeansManhattanCircuit.loadConstraints()
        await kMeansManhattanCircuit.loadSymbols()
    })

    describe("Distance eucledian no square root template", () => {
        it("should calculate the distance between a ballot and a centroid", async () => {
            const witness = await distanceCircuit.calculateWitness({
                "vectors": [
                    [1, 2, 3, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [1, 2, 3, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ]
            })
            await expect(distanceCircuit.checkConstraints(witness)).to.be.fulfilled

            await distanceCircuit.assertOut(witness, { "sumOfSquaredDistances": 0 }, true)
        })
        it("should return a non zero output", async () => {
            const witness = await distanceCircuit.calculateWitness({
                "vectors": [
                    [1, 2, 3, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [2, 2, 5, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ]
            })
            await expect(distanceCircuit.checkConstraints(witness)).to.be.fulfilled

            await distanceCircuit.assertOut(witness, { "sumOfSquaredDistances": 5 }, true)
        })
        it("should return the correct distances", async () => {
            const ballot = [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

            const centroid1 = [5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

            const centroid2 = [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

            expect(JSON.stringify(ballot)).to.eq(JSON.stringify(centroid2))

            const witness1 = await distanceCircuit.calculateWitness({
                "vectors": [
                    ballot, centroid1
                ]
            })
            await expect(distanceCircuit.checkConstraints(witness1)).to.be.fulfilled

            // 16+25 = 41
            await distanceCircuit.assertOut(witness1, { "sumOfSquaredDistances": 41 }, true)

            const witness2 = await distanceCircuit.calculateWitness({
                "vectors": [
                    ballot, centroid2
                ]
            })

            await expect(distanceCircuit.checkConstraints(witness2)).to.be.fulfilled

            await distanceCircuit.assertOut(witness2, { "sumOfSquaredDistances": 0 }, true)
        })
    })

    describe("Distance manhattan template", () => {
        it("should calculate the distance between a ballot and a centroid", async () => {
            const witness = await distanceManhattanCircuit.calculateWitness({
                "vectors": [
                    [1, 2, 3, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [1, 2, 3, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ]
            })
            await expect(distanceManhattanCircuit.checkConstraints(witness)).to.be.fulfilled

            await distanceManhattanCircuit.assertOut(witness, { "sumOfDistances": 0 }, true)
        })
        it("should return the correct distances", async () => {
            const ballot = [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

            const centroid1 = [5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

            const centroid2 = [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

            expect(JSON.stringify(ballot)).to.eq(JSON.stringify(centroid2))

            const witness1 = await distanceManhattanCircuit.calculateWitness({
                "vectors": [
                    ballot, centroid1
                ]
            })
            await expect(distanceManhattanCircuit.checkConstraints(witness1)).to.be.fulfilled

            // 4+5 = 9
            await distanceManhattanCircuit.assertOut(witness1, { "sumOfDistances": 9 }, true)

            const witness2 = await distanceManhattanCircuit.calculateWitness({
                "vectors": [
                    ballot, centroid2
                ]
            })

            await expect(distanceManhattanCircuit.checkConstraints(witness2)).to.be.fulfilled

            await distanceManhattanCircuit.assertOut(witness2, { "sumOfDistances": 0 }, true)
        })
    })

    describe("K-Means template", () => {
        const data = [
            {
                0: {
                    voteOption: "1",
                    voteWeight: 5
                },
                1: {
                    voteOption: "2",
                    voteWeight: 5
                },
            },
            {
                0: {
                    voteOption: "1",
                    voteWeight: 9
                }
            },
            {
                0: {
                    voteOption: "20",
                    voteWeight: 9
                },
                1: {
                    voteOption: "6",
                    voteWeight: 3
                },
                2: {
                    voteOption: "7",
                    voteWeight: 2
                },
                3: {
                    voteOption: "3",
                    voteWeight: 1
                },
                4: {
                    voteOption: "2",
                    voteWeight: 1
                },
                5: {
                    voteOption: "5",
                    voteWeight: 1
                },
                6: {
                    voteOption: "8",
                    voteWeight: 1
                },
                7: {
                    voteOption: "12",
                    voteWeight: 1
                }
            }]
        const ballots = parseVoteData(JSON.stringify(data))
        const projects = findNumberOfProjects(ballots)
        addZeroVotesToBallots(ballots, projects)
        const k = 2
        const indexes = [0, 1]
        const centroids = calculateCentroidsWithIndexes(k, ballots, indexes)
        const weights = ballots.map((ballot) =>
            ballot.votes.map((vote: any) => vote.voteWeight)
        )
        /*  ballots = [
                [
                    5, 5, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0
                ],
                [
                    9, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0
                ],
                [
                    0, 1, 1, 0, 1, 3, 2,
                    1, 0, 0, 0, 1, 0, 0,
                    0, 0, 0, 0, 0, 9
                ]
        ] 
         centroids = [ [
                    5, 5, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0
                ],
                [
                    9, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0
                ]
            ]

         allocations: ballots[0] -> c[0]
         allocations: ballots[1] -> c[1]
         allocations: ballots[2] -> c[0]
         sqrt(25+16+1+9+4+1+1+81) = 11.74734012447073
         sqrt(81+1+1+1+9+4+1+1+81) = 13.416407864998739
        */
        it("should verify that the ballot 0 is closer to cluster at index 0", async () => {
            expect(centroids[0].length).to.be.eq(20)
            const witness = await kMeansCircuit.calculateWitness({
                "centroids": [centroids[0], centroids[1]],
                "ballot": weights[0],
                "clusterIndex": "0"
            })

            await expect(kMeansCircuit.checkConstraints(witness)).to.be.fulfilled
        })
        it("should verify that the ballot 1 is closer to cluster at index 1", async () => {
            const witness = await kMeansCircuit.calculateWitness({
                "centroids": [centroids[0], centroids[1]],
                "ballot": weights[1],
                "clusterIndex": "1"
            })

            await expect(kMeansCircuit.checkConstraints(witness)).to.be.fulfilled
        })
        it("should verify that the ballot 2 is closer to cluster at index 0", async () => {
            const witness = await kMeansCircuit.calculateWitness({
                "centroids": [centroids[0], centroids[1]],
                "ballot": weights[2],
                "clusterIndex": "0"
            })
            await expect(kMeansCircuit.checkConstraints(witness)).to.be.fulfilled
        })
        it("should throw when given the wrong cluster index for a ballot", async () => {
            await expect(kMeansCircuit.calculateWitness({
                "centroids": [centroids[0], centroids[1]],
                "ballot": weights[0],
                "clusterIndex": "1"
            })).to.be.rejected
        })
    })

    describe("K-means manhattan template", () => {
        const data = [
            {
                0: {
                    voteOption: "1",
                    voteWeight: 5
                },
                1: {
                    voteOption: "2",
                    voteWeight: 5
                },
            },
            {
                0: {
                    voteOption: "1",
                    voteWeight: 9
                }
            },
            {
                0: {
                    voteOption: "20",
                    voteWeight: 9
                },
                1: {
                    voteOption: "6",
                    voteWeight: 3
                },
                2: {
                    voteOption: "7",
                    voteWeight: 2
                },
                3: {
                    voteOption: "3",
                    voteWeight: 1
                },
                4: {
                    voteOption: "2",
                    voteWeight: 1
                },
                5: {
                    voteOption: "5",
                    voteWeight: 1
                },
                6: {
                    voteOption: "8",
                    voteWeight: 1
                },
                7: {
                    voteOption: "12",
                    voteWeight: 1
                }
            }]
        const ballots = parseVoteData(JSON.stringify(data))
        const projects = findNumberOfProjects(ballots)
        addZeroVotesToBallots(ballots, projects)
        const k = 2
        const indexes = [0, 1]
        const centroids = calculateCentroidsWithIndexes(k, ballots, indexes)
        const weights = ballots.map((ballot) =>
            ballot.votes.map((vote: any) => vote.voteWeight)
        )
        /*  ballots = [
                [
                    5, 5, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0
                ],
                [
                    9, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0
                ],
                [
                    0, 1, 1, 0, 1, 3, 2,
                    1, 0, 0, 0, 1, 0, 0,
                    0, 0, 0, 0, 0, 9
                ]
        ] 
         centroids = [ [
                    5, 5, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0
                ],
                [
                    9, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0
                ]
            ]
 
         allocations: ballots[0] -> c[0]
         allocations: ballots[1] -> c[1]
         allocations: ballots[2] -> c[0]
         sqrt(25+16+1+9+4+1+1+81) = 11.74734012447073
         sqrt(81+1+1+1+9+4+1+1+81) = 13.416407864998739

        manhattan = (5+4+1+3+2+1+1+9) = 26
        manhattan = (9+1+1+1+3+2+1+1+9) = 28
        */
        it("should verify that the ballot 0 is closer to cluster at index 0", async () => {
            expect(centroids[0].length).to.be.eq(20)
            const witness = await kMeansManhattanCircuit.calculateWitness({
                "centroids": [centroids[0], centroids[1]],
                "ballot": weights[0],
                "clusterIndex": "0"
            })

            await expect(kMeansManhattanCircuit.checkConstraints(witness)).to.be.fulfilled
        })

        it("should verify that the ballot 1 is closer to cluster at index 1", async () => {
            const witness = await kMeansManhattanCircuit.calculateWitness({
                "centroids": [centroids[0], centroids[1]],
                "ballot": weights[1],
                "clusterIndex": "1"
            })

            await expect(kMeansManhattanCircuit.checkConstraints(witness)).to.be.fulfilled
        })

        it("should verify that the ballot 2 is closer to cluster at index 0", async () => {
            const witness = await kMeansManhattanCircuit.calculateWitness({
                "centroids": [centroids[0], centroids[1]],
                "ballot": weights[2],
                "clusterIndex": "0"
            })
            await expect(kMeansManhattanCircuit.checkConstraints(witness)).to.be.fulfilled
        })

        it("should throw when given the wrong cluster index for a ballot", async () => {
            await expect(kMeansManhattanCircuit.calculateWitness({
                "centroids": [centroids[0], centroids[1]],
                "ballot": weights[0],
                "clusterIndex": "1"
            })).to.be.rejected
        })
    })
})