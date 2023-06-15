import { calculateCentroids, calculateTraditionalQF, generateVector, generateVotes, kmeanQFWithVotes, kmeansQF } from "../src/kMeansRandomData"
import { randomIntegerIncluded } from "../src/utilities"
import { addZeroVotesToBallots, parseVoteData, voteOptionExists, expandNumberToArray, extractZeroVotes, findLargestVoteIndex, findNumberOfProjects, generateCentroidsWithRealData } from "../src/k-means"
import { UserBallot } from "../src/interfaces";

describe("k-means", () => {
    describe("generateVector", () => {
        const projects = 10
        it("should generate the correct vector for indexes [0, 4, 5, 6, 7, 8]", () => {
            const indexes = [0, 4, 5, 6, 7, 8]
            const vector = generateVector(indexes, projects)
            expect(vector.length).toBe(projects)
    
            expect(vector[0]).toBeGreaterThan(0)
            expect(vector[1]).toBe(0)
            expect(vector[2]).toBe(0)
            expect(vector[3]).toBe(0)
            expect(vector[4]).toBeGreaterThan(0)
            expect(vector[5]).toBeGreaterThan(0)
            expect(vector[6]).toBeGreaterThan(0)
            expect(vector[7]).toBeGreaterThan(0)
            expect(vector[8]).toBeGreaterThan(0)
        })
        it("should generate the correct vector for indexes [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]", () => {
            const indexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            const vector = generateVector(indexes, projects)
            expect(vector.length).toBe(projects)
    
            expect(vector[0]).toBeGreaterThan(0)
            expect(vector[1]).toBeGreaterThan(0)
            expect(vector[2]).toBeGreaterThan(0)
            expect(vector[3]).toBeGreaterThan(0)
            expect(vector[4]).toBeGreaterThan(0)
            expect(vector[5]).toBeGreaterThan(0)
            expect(vector[6]).toBeGreaterThan(0)
            expect(vector[7]).toBeGreaterThan(0)
            expect(vector[8]).toBeGreaterThan(0)
            expect(vector[9]).toBeGreaterThan(0)
        })
        it("should generate the correct vector for indexes [0, 1, 2, 3, 4, 5, 6, 7, 8]", () => {
            const indexes = [0, 1, 2, 3, 4, 5, 6, 7, 8]
            const vector = generateVector(indexes, projects)
            expect(vector.length).toBe(projects)
    
            expect(vector[0]).toBeGreaterThan(0)
            expect(vector[1]).toBeGreaterThan(0)
            expect(vector[2]).toBeGreaterThan(0)
            expect(vector[3]).toBeGreaterThan(0)
            expect(vector[4]).toBeGreaterThan(0)
            expect(vector[5]).toBeGreaterThan(0)
            expect(vector[6]).toBeGreaterThan(0)
            expect(vector[7]).toBeGreaterThan(0)
            expect(vector[8]).toBeGreaterThan(0)
            expect(vector[9]).toBe(0)
        })
        it("should generate the correct vector for indexes [0, 1, 2, 3, 4, 5, 6, 7]", () => {
            const indexes = [0, 1, 2, 3, 4, 5, 6, 7]
            const vector = generateVector(indexes, projects)
            expect(vector.length).toBe(projects)
    
            expect(vector[0]).toBeGreaterThan(0)
            expect(vector[1]).toBeGreaterThan(0)
            expect(vector[2]).toBeGreaterThan(0)
            expect(vector[3]).toBeGreaterThan(0)
            expect(vector[4]).toBeGreaterThan(0)
            expect(vector[5]).toBeGreaterThan(0)
            expect(vector[6]).toBeGreaterThan(0)
            expect(vector[7]).toBeGreaterThan(0)
            expect(vector[8]).toBe(0)
            expect(vector[9]).toBe(0)
        })
        it("should generate the correct vector for indexes [0, 1, 2, 3, 4, 5, 6]", () => {
            const indexes = [0, 1, 2, 3, 4, 5, 6]
            const vector = generateVector(indexes, projects)
            expect(vector.length).toBe(projects)
    
            expect(vector[0]).toBeGreaterThan(0)
            expect(vector[1]).toBeGreaterThan(0)
            expect(vector[2]).toBeGreaterThan(0)
            expect(vector[3]).toBeGreaterThan(0)
            expect(vector[4]).toBeGreaterThan(0)
            expect(vector[5]).toBeGreaterThan(0)
            expect(vector[6]).toBeGreaterThan(0)
            expect(vector[7]).toBe(0)
            expect(vector[8]).toBe(0)
            expect(vector[9]).toBe(0)
        })
        it("should generate the correct vector for indexes [0, 1, 2, 3, 4, 5]", () => {
            const indexes = [0, 1, 2, 3, 4, 5]
            const vector = generateVector(indexes, projects)
            expect(vector.length).toBe(projects)
    
            expect(vector[0]).toBeGreaterThan(0)
            expect(vector[1]).toBeGreaterThan(0)
            expect(vector[2]).toBeGreaterThan(0)
            expect(vector[3]).toBeGreaterThan(0)
            expect(vector[4]).toBeGreaterThan(0)
            expect(vector[5]).toBeGreaterThan(0)
            expect(vector[6]).toBe(0)
            expect(vector[7]).toBe(0)
            expect(vector[8]).toBe(0)
            expect(vector[9]).toBe(0)
        })
        it("should generate the correct vector for indexes [3, 4, 5, 6]", () => {
            const indexes = [3, 4, 5, 6]
            const vector = generateVector(indexes, projects)
            expect(vector.length).toBe(projects)
    
            console.log("Vector", vector)
    
            expect(vector[0]).toBe(0)
            expect(vector[1]).toBe(0)
            expect(vector[2]).toBe(0)
            expect(vector[3]).toBeGreaterThan(0)
            expect(vector[4]).toBeGreaterThan(0)
            expect(vector[5]).toBeGreaterThan(0)
            expect(vector[6]).toBeGreaterThan(0)
            expect(vector[7]).toBe(0)
            expect(vector[8]).toBe(0)
            expect(vector[9]).toBe(0)
        })
        it("should generate the correct vector for indexes [2, 3, 7, 8, 9]", () => {
            const indexes = [2, 3, 7, 8, 9]
            const vector = generateVector(indexes, projects)
            expect(vector.length).toBe(projects)
    
            expect(vector[0]).toBe(0)
            expect(vector[1]).toBe(0)
            expect(vector[2]).toBeGreaterThan(0)
            expect(vector[3]).toBeGreaterThan(0)
            expect(vector[4]).toBe(0)
            expect(vector[5]).toBe(0)
            expect(vector[6]).toBe(0)
            expect(vector[7]).toBeGreaterThan(0)
            expect(vector[8]).toBeGreaterThan(0)
            expect(vector[9]).toBeGreaterThan(0)
        })
    })

    describe("calculateCentroids", () => {
        const voters = 100
        const projects = 10
        const k = 5
        it("should create the correct number of centroids", () => {
            // generate random votes
            const votes = generateVotes(voters, projects)
            const centroids = calculateCentroids(k, votes)

            expect(centroids.length).toBe(k)
        })
    })

    describe("randomIntegerIncluded", () => {
        it("should generate a number between x and y", () => {
            const x = 0 
            const y = 10
            for (let i=0; i < 1000; i++) {
                const random = randomIntegerIncluded(x, y)
                expect(random).toBeGreaterThanOrEqual(x)
                expect(random).toBeLessThanOrEqual(y)
            }
        })
    })

    describe("comparisons", () => {
        it("k-means allocations should be smaller than traditional qf", () => {
            const projects = 10
            const voters = 100
            const k = 5
            const kMeans = kmeansQF(projects, voters, k)
            for (let i = 0; i < projects; i ++) {
                expect(
                    kMeans.qfs[i])
                    .toBeLessThanOrEqual(
                        calculateTraditionalQF(kMeans.votes, i
                    )
                )
            }
        })

        // @todo not always true
        it.skip("higher k should result in larger allocations", () => {
            const projects = 10
            const voters = 100
            const k1 = 5
            const k2 = 6
            const k3 = 10
            const votes = generateVotes(voters, projects)
            const kMeans1 = kmeanQFWithVotes(votes, voters, projects, k1)
            const kMeans2 = kmeanQFWithVotes(votes, voters, projects, k2)
            const kMeans3 = kmeanQFWithVotes(votes, voters, projects, k3)

            for (let i = 0; i < projects; i ++) {
                expect(kMeans1.qfs[i]).toBeLessThan(kMeans2.qfs[i])
                expect(kMeans2.qfs[i]).toBeLessThan(kMeans3.qfs[i])
            }
        })

        // @todo understand how iterations change the result
        // it("larger iterations and same k should result in larger allocations", () => {
        //     const projects = 10
        //     const voters = 100
        //     const k = 5
         
        //     const votes = generateVotes(voters, projects)
        //     const kMeans1 = kmeanQFWithVotes(votes, voters, projects, k, 100)
        //     const kMeans2 = kmeanQFWithVotes(votes, voters, projects, k, 200)
        //     const kMeans3 = kmeanQFWithVotes(votes, voters, projects, k, 300)

        //     for (let i = 0; i < projects; i ++) {
        //         expect(kMeans1.qfs[i]).toBeGreaterThan(kMeans2.qfs[i])
        //         expect(kMeans2.qfs[i]).toBeGreaterThan(kMeans3.qfs[i])
        //     }
        // })
    })

    describe("findLargestVoteIndex", () => {
        const jsonData = JSON.stringify([
            {
              "0": {
                "voteOption": "0",
                "voteWeight": "0"
              }
            },
            {
              "0": {
                "voteOption": "2",
                "voteWeight": "5"
              },
              "1": {
                "voteOption": "1",
                "voteWeight": "5"
              }
            }
        ])
        it("should find the largest vote index", () => {
            const formattedData = parseVoteData(jsonData)
            const largestVoteIndex = findLargestVoteIndex(formattedData)
            expect(largestVoteIndex).toBe(1)
        })
    })

    describe("findNumberOfProjects", () => {
        const jsonData = JSON.stringify([
            {
              "0": {
                "voteOption": "0",
                "voteWeight": "0"
              }
            },
            {
              "0": {
                "voteOption": "2",
                "voteWeight": "5"
              },
              "1": {
                "voteOption": "1",
                "voteWeight": "5"
              }
            }
        ])
        it("should find the number of projects", () => {
            const formattedData = parseVoteData(jsonData)
            const largestVoteIndex = findNumberOfProjects(formattedData)
            expect(largestVoteIndex).toBe(2)
        })
    })

    describe("parseVoteData", () => {
        const data = JSON.stringify([
            {
              "0": {
                "voteOption": "0",
                "voteWeight": "0"
              }
            },
            {
              "0": {
                "voteOption": "2",
                "voteWeight": "5"
              },
              "1": {
                "voteOption": "1",
                "voteWeight": "5"
              }
            }
        ])
        it("should correctly parse the data", () => {
            const parsed = parseVoteData(data)

            const expected: UserBallot[] = [
                {
                    votes: [
                        {
                            voteOption: 0,
                            voteWeight: 0
                        }
                    ]
                },
                {
                    votes: [
                        {
                            voteOption: 2,
                            voteWeight: 5
                        },
                        {
                            voteOption: 1,
                            voteWeight: 5
                        }
                    ]
                }
            ]
            expect(parsed).toEqual(expected)
        })
    })

    describe("voteOptionExists", () => {
        const data: UserBallot = {
            votes: [
                {
                    voteOption: 0,
                    voteWeight: 0
                }
            ]
        }

        it("should return true for a vote option that exists", () => {
            expect(voteOptionExists(data, 0)).toBe(true)
        })
        it("should return false for a vote option that does not exist", () => {
            expect(voteOptionExists(data, 1)).toBe(false)
        })
    })

    describe("expandNumberToArray", () => {
        it("should expand a number into an array of elements between 0 <= num", () => {
            expect(expandNumberToArray(5)).toEqual([0, 1, 2, 3, 4, 5])
        })
    })

    describe("voteOptionExists", () => {
        const data: UserBallot = {
            votes: [
                {
                    voteOption: 0,
                    voteWeight: 0
                },
                {
                    voteOption: 1,
                    voteWeight: 5
                },
                {
                    voteOption: 2,
                    voteWeight: 5
                },
                {
                    voteOption: 3,
                    voteWeight: 5
                }
            ]
        }

        it("should return true for a vote option that exists", () => {
            expect(voteOptionExists(data, 0)).toBe(true)
            expect(voteOptionExists(data, 3)).toBe(true)
        })
        it("should return false for a vote option that does not exist", () => {
            expect(voteOptionExists(data, 4)).toBe(false)
        })
    })

    describe("extractZeroVotes", () => {
        const data: UserBallot[] = [
            {
                votes: [
                    {
                        voteOption: 0,
                        voteWeight: 0
                    }
                ]
            },
            {
                votes: [
                    {
                        voteOption: 2,
                        voteWeight: 5
                    },
                    {
                        voteOption: 1,
                        voteWeight: 5
                    }
                ]
            }
        ]

        const projects = findNumberOfProjects(data)
        it("should return the correct UserBallot object", () => {
            const result = extractZeroVotes(data[1], projects)

            expect(result).toEqual({
                votes: [
                    {
                        voteOption: 0,
                        voteWeight: 0
                    },
                    {
                        voteOption: 1,
                        voteWeight: 5
                    },
                    {
                        voteOption: 2,
                        voteWeight: 5
                    }
                ]
            })
        })
    })

    describe("addZeroVotes", () => {
        const data: UserBallot[] = [
            {
                votes: [
                    {
                        voteOption: 0,
                        voteWeight: 0
                    }
                ]
            },
            {
                votes: [
                    {
                        voteOption: 2,
                        voteWeight: 5
                    },
                    {
                        voteOption: 1,
                        voteWeight: 5
                    }
                ]
            }
        ]

        const projects = findNumberOfProjects(data)

        it("should return an array of UserBallot with the correct number of projects", () => {
            addZeroVotesToBallots(data, projects)

            const expected: UserBallot[] = [
                {
                    votes: [
                        {
                            voteOption: 0,
                            voteWeight: 0
                        },
                        {
                            voteOption: 1,
                            voteWeight: 0
                        },
                        {
                            voteOption: 2,
                            voteWeight: 0
                        }
                    ]
                },
                {
                    votes: [
                        {
                            voteOption: 0,
                            voteWeight: 0
                        },
                        {
                            voteOption: 1,
                            voteWeight: 5
                        },
                        {
                            voteOption: 2,
                            voteWeight: 5
                        }
                    ]
                }
            ]

            expect(data).toEqual(expected)
        })
    })

    describe("generateCentroidsWithRealData", () => {
        const data: UserBallot[] = [
            {
                votes: [
                    {
                        voteOption: 0,
                        voteWeight: 0
                    }
                ]
            },
            {
                votes: [
                    {
                        voteOption: 2,
                        voteWeight: 5
                    },
                    {
                        voteOption: 1,
                        voteWeight: 5
                    }
                ]
            },
            {
                votes: [
                    {
                        voteOption: 2,
                        voteWeight: 5
                    },
                    {
                        voteOption: 3,
                        voteWeight: 5
                    }
                ]
            },
            {
                votes: [
                    {
                        voteOption: 4,
                        voteWeight: 5
                    },
                    {
                        voteOption: 1,
                        voteWeight: 10
                    }
                ]
            },
            {
                votes: [
                    {
                        voteOption: 0,
                        voteWeight: 5
                    },
                    {
                        voteOption: 3,
                        voteWeight: 5
                    }
                ]
            },
            {
                votes: [
                    {
                        voteOption: 3,
                        voteWeight: 1
                    },
                    {
                        voteOption: 4,
                        voteWeight: 1
                    }
                ]
            },
            {
                votes: [
                    {
                        voteOption: 3,
                        voteWeight: 5
                    },
                    {
                        voteOption: 3,
                        voteWeight: 5
                    }
                ]
            }
        ]

        const projects = findNumberOfProjects(data)

        addZeroVotesToBallots(data, projects)

        const k = 5

        it("should generate the correct number of centroids", () => {
            const centroids = generateCentroidsWithRealData(k, data)

            expect(centroids.length).toBe(k)
        })
    })
})