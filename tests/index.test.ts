import {
    testCalculateCentroids,
    testCalculateTraditionalQF,
    testGenerateVector,
    testGenerateVotes,
    testKmeanQFWithVotes,
    testKmeansQF,
    MAX_ITERATIONS, TOLERANCE, randomIntegerIncluded,
    addZeroVotesToBallots, parseVoteData, voteOptionExists, expandNumberToArray, extractZeroVotes, findNumberOfProjects,
    calculateCentroids, calculateCentroidsWithIndexes, calculateDistance, assignVotesToClusters, checkConvergence,
    calculateCoefficents, calculateClustersSize, updateCentroids, assignVotersCoefficient, calculateQFPerProject,
    Cluster, UserBallot
} from "../src/ts/index"

describe("test k-means with random data", () => {
    describe("testGenerateVector", () => {
        const projects = 10
        it("should generate the correct vector for indexes [0, 4, 5, 6, 7, 8]", () => {
            const indexes = [0, 4, 5, 6, 7, 8]
            const vector = testGenerateVector(indexes, projects)
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
            const vector = testGenerateVector(indexes, projects)
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
            const vector = testGenerateVector(indexes, projects)
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
            const vector = testGenerateVector(indexes, projects)
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
            const vector = testGenerateVector(indexes, projects)
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
            const vector = testGenerateVector(indexes, projects)
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
            const vector = testGenerateVector(indexes, projects)
            expect(vector.length).toBe(projects)

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
            const vector = testGenerateVector(indexes, projects)
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

    describe("testCalculateCentroids", () => {
        const voters = 100
        const projects = 10
        const k = 5
        it("should create the correct number of centroids", () => {
            // generate random votes
            const votes = testGenerateVotes(voters, projects)
            const centroids = testCalculateCentroids(k, votes)

            expect(centroids.length).toBe(k)
        })
    })

    describe("randomIntegerIncluded", () => {
        it("should generate a number between x and y", () => {
            const x = 0
            const y = 10
            for (let i = 0; i < 1000; i++) {
                const random = randomIntegerIncluded(x, y)
                expect(random).toBeGreaterThanOrEqual(x)
                expect(random).toBeLessThanOrEqual(y)
            }
        })
    })

    describe("test comparisons", () => {
        it("k-means allocations should be smaller than traditional qf", () => {
            const projects = 10
            const voters = 100
            const k = 5
            const kMeans = testKmeansQF(projects, voters, k)
            for (let i = 0; i < projects; i++) {
                expect(
                    kMeans.qfs[i])
                    .toBeLessThanOrEqual(
                        testCalculateTraditionalQF(kMeans.votes, i
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
            const votes = testGenerateVotes(voters, projects)
            const kMeans1 = testKmeanQFWithVotes(votes, voters, projects, k1)
            const kMeans2 = testKmeanQFWithVotes(votes, voters, projects, k2)
            const kMeans3 = testKmeanQFWithVotes(votes, voters, projects, k3)

            for (let i = 0; i < projects; i++) {
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
})

describe("k-means with actual data", () => {
    const data: UserBallot[] = [
        {
            votes: [
                {
                    voteOption: 1,
                    voteWeight: 3
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
                    voteOption: 1,
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
                },
                {
                    voteOption: 6,
                    voteWeight: 7
                }
            ]
        }
    ]

    const projects = findNumberOfProjects(data)

    addZeroVotesToBallots(data, projects)

    describe("findNumberOfProjects", () => {
        const jsonData = JSON.stringify([
            {
                "0": {
                    "voteOption": "1",
                    "voteWeight": "3"
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
                    "voteOption": "1",
                    "voteWeight": "5"
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
        it("should expand a number into an array of elements between 1 <= num", () => {
            expect(expandNumberToArray(5)).toEqual([1, 2, 3, 4, 5])
        })
    })

    describe("voteOptionExists", () => {
        const data: UserBallot = {
            votes: [
                {
                    voteOption: 1,
                    voteWeight: 3
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
            expect(voteOptionExists(data, 1)).toBe(true)
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
                        voteOption: 1,
                        voteWeight: 2
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
        it("should return the correct UserBallot object (when not missing any zero votes)", () => {
            const result = extractZeroVotes(data[1], projects)
            // should not change
            expect(result).toEqual({
                votes: [
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
        it("should return the correct UserBallot object (when missing zero votes)", () => {
            data.push({
                votes: [
                    {
                        voteOption: 1,
                        voteWeight: 2
                    }
                ]
            })

            const result = extractZeroVotes(data[2], projects)

            expect(result).toEqual({
                votes: [
                    {
                        voteOption: 1,
                        voteWeight: 2
                    },
                    {
                        voteOption: 2,
                        voteWeight: 0
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
                        voteOption: 1,
                        voteWeight: 2
                    },
                    {
                        voteOption: 3,
                        voteWeight: 2
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
                            voteOption: 1,
                            voteWeight: 2
                        },
                        {
                            voteOption: 2,
                            voteWeight: 0
                        },
                        {
                            voteOption: 3,
                            voteWeight: 2
                        }
                    ]
                },
                {
                    votes: [
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
                            voteWeight: 0
                        }
                    ]
                }
            ]

            expect(data).toEqual(expected)
        })
    })

    describe("calculateCentroids", () => {
        const k = 5

        it("should select the correct number of centroids", () => {
            const centroids = calculateCentroids(k, data)

            expect(centroids.length).toBe(k)
        })

        it("should select the expected centroids given the indexes", () => {
            const indexes = [0, 3, 4]
            const k = 3

            const centroids = calculateCentroidsWithIndexes(k, data, indexes)

            expect(centroids).toEqual(
                [
                    data[0].votes.map((vote) => vote.voteWeight),
                    data[3].votes.map((vote) => vote.voteWeight),
                    data[4].votes.map((vote) => vote.voteWeight)
                ]
            )

            expect(centroids[0]).toEqual([3, 0, 0, 0, 0, 0])
            expect(centroids[1]).toEqual([10, 0, 0, 5, 0, 0])
            expect(centroids[2]).toEqual([5, 0, 5, 0, 0, 0])
        })
    })

    describe("calculateDistance", () => {
        const indexes = [0, 3, 4]
        const k = 3

        const centroids = calculateCentroidsWithIndexes(k, data, indexes)

        expect(centroids).toEqual(
            [
                data[0].votes.map((vote) => vote.voteWeight),
                data[3].votes.map((vote) => vote.voteWeight),
                data[4].votes.map((vote) => vote.voteWeight)
            ]
        )
        expect(centroids[0]).toEqual([3, 0, 0, 0, 0, 0])
        expect(centroids[1]).toEqual([10, 0, 0, 5, 0, 0])
        expect(centroids[2]).toEqual([5, 0, 5, 0, 0, 0])

        it("should return the correct distance between a user ballot and a centroid", () => {
            const weights = data[0].votes.map((vote) => vote.voteWeight)

            const distance = calculateDistance(weights, centroids[1], projects)

            // 8.602 calculate by hand
            expect(distance).toBeCloseTo(8.602, 3)
        })

    })

    describe("assignVotesToClusters", () => {
        const data: UserBallot[] = [
            {
                votes: [
                    {
                        voteOption: 1,
                        voteWeight: 3
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
                        voteOption: 1,
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
                        voteOption: 3,
                        voteWeight: 1
                    },
                    {
                        voteOption: 4,
                        voteWeight: 1
                    },
                    {
                        voteOption: 6,
                        voteWeight: 7
                    }
                ]
            }
        ]

        const projects = findNumberOfProjects(data)

        addZeroVotesToBallots(data, projects)

        const indexes = [0, 3, 4]
        const k = 3

        const centroids = calculateCentroidsWithIndexes(k, data, indexes)

        expect(centroids).toEqual(
            [
                data[0].votes.map((vote) => vote.voteWeight),
                data[3].votes.map((vote) => vote.voteWeight),
                data[4].votes.map((vote) => vote.voteWeight)
            ]
        )

        expect(centroids[0]).toEqual([3, 0, 0, 0, 0, 0])
        expect(centroids[1]).toEqual([10, 0, 0, 5, 0, 0])
        expect(centroids[2]).toEqual([5, 0, 5, 0, 0, 0])

        it("should assign the votes to the correct cluster (1 ballot)", () => {
            const ballot = data[1]

            expect(ballot.votes.map((vote) => vote.voteWeight)).toEqual([5, 5, 0, 0, 0, 0])

            const assignment = assignVotesToClusters([ballot], centroids)

            const distanceFromCluster0 = calculateDistance(ballot.votes.map((vote) => vote.voteWeight), centroids[0], projects)
            const distanceFromCluster1 = calculateDistance(ballot.votes.map((vote) => vote.voteWeight), centroids[1], projects)
            const distanceFromCluster2 = calculateDistance(ballot.votes.map((vote) => vote.voteWeight), centroids[2], projects)

            // calculations
            // ballot cluster 1 = sqrt(4+25) = sqrt(29)
            // ballot cluster 2 = sqrt(25+25+25) = sqrt(75)
            // ballot cluster 3 = sqrt(25+25) = sqrt(50)

            // calculated by hand
            expect(distanceFromCluster0).toBeCloseTo(5.385, 3)
            expect(distanceFromCluster1).toBeCloseTo(8.660, 3)
            expect(distanceFromCluster2).toBeCloseTo(7.071, 3)

            // the closest is cluster[0] as 5.385 > 7.071 > 8.660
            expect(assignment).toEqual([0])
        })

        it("should assign the votes to the same cluster (2 ballots with same votes)", () => {
            const ballots = [data[1], data[6]]

            expect(ballots[0].votes.map((vote) => vote.voteWeight)).toEqual([5, 5, 0, 0, 0, 0])
            expect(ballots[1].votes.map((vote) => vote.voteWeight)).toEqual([5, 5, 0, 0, 0, 0])
            expect(ballots[0]).toEqual(ballots[1])

            const assignment = assignVotesToClusters(ballots, centroids)

            const distanceFromCluster0 = calculateDistance(ballots[0].votes.map((vote) => vote.voteWeight), centroids[0], projects)
            const distanceFromCluster1 = calculateDistance(ballots[0].votes.map((vote) => vote.voteWeight), centroids[1], projects)
            const distanceFromCluster2 = calculateDistance(ballots[0].votes.map((vote) => vote.voteWeight), centroids[2], projects)

            // calculations 
            // ballot cluster 1 = sqrt(4+25) = sqrt(29) = 5.385
            // ballot cluster 2 = sqrt(25+25+25) = sqrt(75) = 8.660
            // ballot cluster 3 = sqrt(25+25) = sqrt(50) = 7.071

            // calculated by hand
            expect(distanceFromCluster0).toBeCloseTo(5.385, 3)
            expect(distanceFromCluster1).toBeCloseTo(8.660, 3)
            expect(distanceFromCluster2).toBeCloseTo(7.071, 3)

            // the closest is cluster[0] 
            expect(assignment).toEqual([0, 0])
        })

        it("should assign the votes to the correct clusters (3 ballots)", () => {
            const ballots = [data[1], data[3], data[6]]

            expect(ballots[0].votes.map((vote) => vote.voteWeight)).toEqual([5, 5, 0, 0, 0, 0])
            expect(ballots[1].votes.map((vote) => vote.voteWeight)).toEqual([10, 0, 0, 5, 0, 0])
            expect(ballots[2].votes.map((vote) => vote.voteWeight)).toEqual([5, 5, 0, 0, 0, 0])

            const assignment = assignVotesToClusters(ballots, centroids)

            const distanceFromCluster0 = calculateDistance(ballots[0].votes.map((vote) => vote.voteWeight), centroids[0], projects)
            const distanceFromCluster1 = calculateDistance(ballots[0].votes.map((vote) => vote.voteWeight), centroids[1], projects)
            const distanceFromCluster2 = calculateDistance(ballots[0].votes.map((vote) => vote.voteWeight), centroids[2], projects)

            const distanceFromCluster0Ballot1 = calculateDistance(ballots[1].votes.map((vote) => vote.voteWeight), centroids[0], projects)
            const distanceFromCluster1Ballot1 = calculateDistance(ballots[1].votes.map((vote) => vote.voteWeight), centroids[1], projects)
            const distanceFromCluster2Ballot1 = calculateDistance(ballots[1].votes.map((vote) => vote.voteWeight), centroids[2], projects)

            const distanceFromCluster0Ballot2 = calculateDistance(ballots[2].votes.map((vote) => vote.voteWeight), centroids[0], projects)
            const distanceFromCluster1Ballot2 = calculateDistance(ballots[2].votes.map((vote) => vote.voteWeight), centroids[1], projects)
            const distanceFromCluster2Ballot2 = calculateDistance(ballots[2].votes.map((vote) => vote.voteWeight), centroids[2], projects)

            expect(distanceFromCluster0).toEqual(distanceFromCluster0Ballot2)
            expect(distanceFromCluster1).toEqual(distanceFromCluster1Ballot2)
            expect(distanceFromCluster2).toEqual(distanceFromCluster2Ballot2)

            // calculate
            // ballot 1 cluster 1 = sqrt(25+25) = sqrt(50) = 7.071
            // ballot 1 cluster 2 = sqrt(25+25+25) = sqrt(75) = 8.660
            // ballot 1 cluster 3 = sqrt(25+25) = sqrt(50) = 7.071

            // ballot 2 cluster 1 = sqrt(49+25) = sqrt(74) = 8.602
            // ballot 2 cluster 2 = sqrt(25+25) = sqrt(50) = 0
            // ballot 2 cluster 3 = sqrt(25+25+25) = sqrt(75) = 8.660

            // ballot 3 cluster 1 = sqrt(25+25) = sqrt(50) = 7.071
            // ballot 3 cluster 2 = sqrt(25+25+25) = sqrt(75) = 8.660
            // ballot 3 cluster 3 = sqrt(25+25) = sqrt(50) = 7.071

            // calculated by hand distance for ballots[1]
            expect(distanceFromCluster0Ballot1).toBeCloseTo(8.602, 3)
            expect(distanceFromCluster1Ballot1).toBeCloseTo(0, 3)
            // rounded up to 3 decimals -> 13.2287
            expect(distanceFromCluster2Ballot1).toBeCloseTo(8.660, 3)

            expect(assignment).toEqual([0, 1, 0])

        })
    })

    describe("updateCentroids", () => {
        const data: UserBallot[] = [
            {
                votes: [
                    {
                        voteOption: 1,
                        voteWeight: 3
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
                        voteOption: 1,
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
                        voteOption: 3,
                        voteWeight: 1
                    },
                    {
                        voteOption: 4,
                        voteWeight: 1
                    },
                    {
                        voteOption: 6,
                        voteWeight: 7
                    }
                ]
            }
        ]

        const projects = findNumberOfProjects(data)

        addZeroVotesToBallots(data, projects)

        const indexes = [0, 3, 4]
        const k = 3

        const centroids = calculateCentroidsWithIndexes(k, data, indexes)

        expect(centroids).toEqual(
            [
                data[0].votes.map((vote) => vote.voteWeight),
                data[3].votes.map((vote) => vote.voteWeight),
                data[4].votes.map((vote) => vote.voteWeight)
            ]
        )
        expect(centroids[0]).toEqual([3, 0, 0, 0, 0, 0])
        expect(centroids[1]).toEqual([10, 0, 0, 5, 0, 0])
        expect(centroids[2]).toEqual([5, 0, 5, 0, 0, 0])

        it("should update the centroids correctly", () => {

        })
    })

    describe("calculateClustersSize", () => {
        const data: UserBallot[] = [
            {
                votes: [
                    {
                        voteOption: 1,
                        voteWeight: 3
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
                        voteOption: 1,
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
                        voteOption: 3,
                        voteWeight: 1
                    },
                    {
                        voteOption: 4,
                        voteWeight: 1
                    },
                    {
                        voteOption: 6,
                        voteWeight: 7
                    }
                ]
            }
        ]

        const projects = findNumberOfProjects(data)

        addZeroVotesToBallots(data, projects)

        const indexes = [0, 3, 4]
        const k = 3

        const centroids = calculateCentroidsWithIndexes(k, data, indexes)

        expect(centroids).toEqual(
            [
                data[0].votes.map((vote) => vote.voteWeight),
                data[3].votes.map((vote) => vote.voteWeight),
                data[4].votes.map((vote) => vote.voteWeight)
            ]
        )
        expect(centroids[0]).toEqual([3, 0, 0, 0, 0, 0])
        expect(centroids[1]).toEqual([10, 0, 0, 5, 0, 0])
        expect(centroids[2]).toEqual([5, 0, 5, 0, 0, 0])

        const ballots = [data[1], data[3], data[6]]
        const assignment = assignVotesToClusters(ballots, centroids)

        it("should return the correct cluster sizes", () => {
            expect(calculateClustersSize(assignment)).toEqual(
                [
                    {
                        index: 0,
                        size: 2
                    },
                    {
                        index: 1,
                        size: 1
                    }
                ]
            )
        })
    })

    describe("calculateCoefficents", () => {
        const clustersSize: Cluster[] = [{
            index: 0,
            size: 2
        }, {
            index: 1,
            size: 3
        }, {
            index: 2,
            size: 10
        }]
        it("should return the correct coefficients (1/clusterSize)", () => {
            expect(calculateCoefficents(clustersSize)).toEqual(
                [
                    {
                        clusterIndex: 0,
                        coefficient: 0.5
                    },
                    {
                        clusterIndex: 1,
                        coefficient: 0.3333333333333333
                    },
                    {
                        clusterIndex: 2,
                        coefficient: 0.1
                    }
                ]
            )
        })
        it("should return a coefficient of Infinity (1/0) if the cluster size is 0", () => {
            expect(calculateCoefficents([{ index: 0, size: 0 }])).toEqual([{ clusterIndex: 0, coefficient: Infinity }])
        })
    })

    describe("assignVotersCoefficient", () => {
        it("should assign the correct coefficients to each voter", () => {
            const k = 3
            const centroids = calculateCentroidsWithIndexes(k, data, [0, 2, 1])

            expect(centroids).toEqual([
                [3, 0, 0, 0, 0, 0],
                [0, 5, 5, 0, 0, 0],
                [5, 5, 0, 0, 0, 0]
            ])

            const assignments = assignVotesToClusters(data, centroids)
            expect(assignments.length).toBe(8)

            // ballot 4 cluster 1 = sqrt(49+0+0+25) = sqrt(74) = 8.602325267042627
            // ballot 4 cluster 2 = sqrt(100+25+25+25) = sqrt(175) = 13.228756555322953
            // ballot 4 cluster 3 = sqrt(25+25+25) = sqrt(75) = 8.660254037844387

            // ballot 5 cluster 1 = sqrt(4+25) = sqrt(29) = 5.385164807134504
            // ballot 5 cluster 2 = sqrt(25+25) = sqrt(50) = 7.0710678118654755
            // ballot 5 cluster 3 = sqrt(25+25) = sqrt(50) = 7.0710678118654755

            // ballot 6 cluster 1 = sqrt(9+1) = sqrt(10) = 3.1622776601683795
            // ballot 6 cluster 2 = sqrt(25+16+1) = sqrt(42) = 6.48074069840786
            // ballot 6 cluster 3 = sqrt(25+25+1+1) = sqrt(52) = 7.211102550927978

            // ballot 7 cluster 1 = sqrt(9+25) = sqrt(34) = 5.830951894845301
            // ballot 7 cluster 2 = sqrt(25) = sqrt(25) = 5
            // ballot 7 cluster 3 = sqrt(25+25+25) = sqrt(75) = 8.660254037844387

            // ballot 8 cluster 1 = sqrt(9+1+1+49) = sqrt(60) = 7.745966692414834
            // ballot 8 cluster 2 = sqrt(25+16+16+49) = sqrt(106) = 10.295630140987
            // ballot 8 cluster 3 = sqrt(25+25+1+1+49) = sqrt(101) = 10.04987562112089

            // ballot 1 -> cluster 0 
            // ballot 2 -> cluster 2
            // ballot 3 -> cluster 1
            // ballot 4 -> cluster 0 
            // ballot 5 -> cluster 0
            // ballot 6 -> cluster 0
            // ballot 7 -> cluster 1
            // ballot 8 -> cluster 0

            expect(assignments).toEqual([
                0, 2, 1, 0, 0, 0, 1, 0
            ])

        })
    })

    describe("calculateQFPerProject", () => {
        it("should calculate the correct QF for each project", () => { })
    })

    describe("checkConvergence", () => {
        const centroids = [[5, 0, 5], [1, 3, 3]]
        const newCentroids = [[5, 0, 5], [1, 6, 3]]
        it("should return false for clusters that have not converged", () => {
            expect(checkConvergence(centroids, newCentroids, 0)).toEqual(false)
        })
        it("should return true for clusters that have converged", () => {
            expect(checkConvergence(centroids, centroids, 0.001)).toEqual(true)
        })
    })

    describe("full example k-means (article example by hand)", () => {
        const sampleData = [
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
            },
            {
                0: {
                    voteOption: "1",
                    voteWeight: 3
                },
                1: {
                    voteOption: "5",
                    voteWeight: 2
                },
                2: {
                    voteOption: "6",
                    voteWeight: 8
                },
                3: {
                    voteOption: "20",
                    voteWeight: 3
                },
                4: {
                    voteOption: "11",
                    voteWeight: 1
                },
                5: {
                    voteOption: "7",
                    voteWeight: 2
                },
                6: {
                    voteOption: "3",
                    voteWeight: 2
                },
                7: {
                    voteOption: "13",
                    voteWeight: 2
                }
            },
            {
                0: {
                    voteOption: "3",
                    voteWeight: 9
                }
            },
            {
                0: {
                    voteOption: "7",
                    voteWeight: 7
                },
                1: {
                    voteOption: "9",
                    voteWeight: 7
                }
            },
            {
                0: {
                    voteOption: "7",
                    voteWeight: 9
                }
            },
            {
                0: {
                    voteOption: "7",
                    voteWeight: 9
                },
                1: {
                    voteOption: "14",
                    voteWeight: 4
                }
            },
            {
                0: {
                    voteOption: "9",
                    voteWeight: 9
                },
                1: {
                    voteOption: "6",
                    voteWeight: 2
                },
                2: {
                    voteOption: "13",
                    voteWeight: 2
                }
            },
            {
                0: {
                    voteOption: "9",
                    voteWeight: 9
                }
            },
            {
                0: {
                    voteOption: "4",
                    voteWeight: 3
                },
                1: {
                    voteOption: "14",
                    voteWeight: 4
                },
                2: {
                    voteOption: "7",
                    voteWeight: 8
                },
                3: {
                    voteOption: "6",
                    voteWeight: 3
                }
            },
            {
                0: {
                    voteOption: "10",
                    voteWeight: 9
                },
            },
            {
                0: {
                    voteOption: "9",
                    voteWeight: 9
                }
            },
            {
                0: {
                    voteOption: "7",
                    voteWeight: 9
                },
                1: {
                    voteOption: "3",
                    voteWeight: 4
                }
            },
            {
                0: {
                    voteOption: "5",
                    voteWeight: 7
                },
                1: {
                    voteOption: "6",
                    voteWeight: 7
                }
            }
        ]

        const ballots = parseVoteData(JSON.stringify(sampleData))
        const projects = findNumberOfProjects(ballots)
        expect(projects).toBe(20)
        addZeroVotesToBallots(ballots, projects)

        const k = 3
        const indexes = [2, 5, 9]

        it("should calculate the correct centroids", () => {
            const centroids = calculateCentroidsWithIndexes(k, ballots, indexes)
            expect(centroids).toEqual([
                [0, 1, 1, 0, 1, 3, 2, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 9],
                [0, 0, 0, 0, 0, 0, 7, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ])
        })
        it("should assign the ballots to the correct clusters", () => {
            const centroids = calculateCentroidsWithIndexes(k, ballots, indexes)
            const assignments = assignVotesToClusters(ballots, centroids)

            // calculations
            // [2, 2, 0, 0, 0, 1, 1, 1, 2, 2, 1, 2, 2, 1, 0]
            // Ballot 1 C1 -> sqrt(25+16+1+1+9+4+1+1+81) = 11.789826122551595
            // Ballot 1 C2 -> sqrt(25+25+49+49) = 12.165525060596439
            // Ballot 1 C3 -> sqrt(25+25+81) = 11.445523142259598
            // Ballot 2 C1 -> sqrt(81+1+1+1+9+4+1+1+81) = 13.416407864998739
            // Ballot 2 C2 -> sqrt(81+49+49) = 13.379088160259652
            // Ballot 2 C3 -> sqrt(81+81) = 12.727922061357855
            // Ballot 3 C1 -> sqrt(0)
            // Ballot 4 C1 -> sqrt(9+1+1+0+1+25+0+1+0+0+1+1+4+0+0+0+0+0+36) = 8.94427190999916
            // Ballot 4 C2 -> sqrt(9+0+4+0+4+64+25+0+49+0+1+0+4+9) = 13.0
            // Ballot 4 C3 -> sqrt(9+0+4+0+64+4+81+1+4+9) = 13.2664991614216
            // Ballot 5 C1 -> sqrt(0+1+64+0+1+9+4+1+1+81) = 12.727922061357855
            // Ballot 5 C2 -> sqrt(81+49+49) = 13.379088160259652
            // Ballot 5 C3 -> sqrt(81+81) = 12.727922061357855
            // Ballot 6 C1 ->
            // Ballot 6 C2 -> sqrt(0)
            // Ballot 6 C3 ->
            // Ballot 7 C1 -> sqrt(1+1+1+9+49+1+1+81) = 12.0
            // Ballot 7 C2 -> sqrt(4+49) = 7.280109889280518
            // Ballot 7 C3 -> sqrt(81+81) = 12.727922061357855
            // Ballot 8 C1 -> sqrt(1+1+1+9+49+1+1+16+81) = 12.649110640673518
            // Ballot 8 C2 -> sqrt(4+49+16) = 8.306623862918075
            // Ballot 8 C3 -> sqrt(81+81+16) = 13.341664064126334
            // Ballot 9 C1 -> sqrt(1+1+1+1+4+1+81+1+4) = 9.746794344808963
            // Ballot 9 C2 -> sqrt(4+49+4+4) = 7.810249675906654
            // Ballot 9 C3 -> sqrt(4+4) = 2.8284271247461903
            // Ballot 10 C1 -> sqrt()
            // Ballot 10 C2 -> sqrt()
            // Ballot 10 C3 -> sqrt(0)
            // Ballot 11 C1 -> sqrt(1+1+9+1+36+1+1+16+81) = 12.12435565298214
            // Ballot 11 C2 -> sqrt(9+9+1+49+16) = 9.16515138991168
            // Ballot 11 C3 -> sqrt(9+9+64+81+16) = 13.379088160259652
            // Ballot 12 C1 -> sqrt(1+1+1+9+4+1+81+1+81) = 13.416407864998739
            // Ballot 12 C2 -> sqrt(49+49+81) = 13.379088160259652
            // Ballot 12 C3 -> sqrt(81+81) = 12.727922061357855
            // Ballot 13 C1 -> sqrt(1+1+1+9+4+1+81+1+81) = 13.416407864998739
            // Ballot 13 C2 -> sqrt(49+4) = 7.280109889280518
            // Ballot 13 C3 -> sqrt(0) = 0
            // Ballot 14 C1 -> sqrt(1+9+1+9+49+1+1+81) = 12.328828005937952
            // Ballot 14 C2 -> sqrt(16+4+49) = 8.306623862918075
            // Ballot 14 C3 -> sqrt(16+81+81) = 13.341664064126334
            // Ballot 15 C1 -> sqrt(1+1+36+16+4+1+1+81) = 11.874342087037917
            // Ballot 15 C2 -> sqrt(49+49+49+49) = 14.0
            // Ballot 15 C3 -> sqrt(49+49+81) = 13.379088160259652

            // (hand example index - 1)  [3, 3, 1, 1, 1, 2, 2, 2, 3, 3, 2, 3, 3, 2, 1] 
            // [2, 2, 0, 0, 0, 1, 1, 1, 2, 2, 1, 2, 2, 1, 0]

            const assignementsExpected = [2, 2, 0, 0, 0, 1, 1, 1, 2, 2, 1, 2, 2, 1, 0]

            expect(assignments).toEqual(assignementsExpected)
        })

        it("should update the centroids", () => {
            const centroids = calculateCentroidsWithIndexes(k, ballots, indexes)
            const assignments = assignVotesToClusters(ballots, centroids)
            const votes = ballots.map((ballot) =>
                ballot.votes.map((vote) => vote.voteWeight)
            )
            const updatedCentroids = updateCentroids(votes, assignments, k, projects)

            expect(centroids).not.toEqual(updatedCentroids)
            expect(centroids.length).toBe(updatedCentroids.length)
        })

        it("should return false when calling checkConvergence", () => {
            const centroids = calculateCentroidsWithIndexes(k, ballots, indexes)
            const assignments = assignVotesToClusters(ballots, centroids)
            const votes = ballots.map((ballot) =>
                ballot.votes.map((vote) => vote.voteWeight)
            )

            const updatedCentroids = updateCentroids(votes, assignments, k, projects)
            const convergence = checkConvergence(centroids, updatedCentroids, TOLERANCE)

            expect(convergence).toBe(false)
        })

        it("should count the qf allocation using k-means coefficients", () => {
            const centroids = calculateCentroidsWithIndexes(k, ballots, indexes)
            const votes = ballots.map((ballot) =>
                ballot.votes.map((vote) => vote.voteWeight)
            )

            let assignments: number[] = []

            expect(ballots.length).toBe(votes.length)
            let iterations = 0
            for (let i = 0; i < MAX_ITERATIONS; i++) {
                iterations++
                assignments = assignVotesToClusters(ballots, centroids)
                const newCentroids = updateCentroids(votes, assignments, k, projects)

                if (checkConvergence(centroids, newCentroids, TOLERANCE)) break
            }

            expect(iterations).toBeGreaterThan(1)
            const sizes = calculateClustersSize(assignments)
            const coefficients = calculateCoefficents(sizes)
            const userCoefficients = assignVotersCoefficient(assignments, coefficients)

            for (const coefficient of coefficients) {
                expect(coefficient.coefficient).toBeGreaterThanOrEqual(0)
                expect(coefficient.coefficient).toBeLessThanOrEqual(1)
            }

            // calculate qf
            const qfs: number[] = []
            for (let i = 0; i < projects; i++) qfs.push(calculateQFPerProject(userCoefficients, ballots, i))

            expect(qfs.length).toBe(projects)

            // check that the projects with 0 votes have 0 qf
            const zeroProjects: number[] = []
            for (let i = 0; i < projects; i++) {
                let sum = 0
                for (const ballot of ballots) {
                    if (ballot.votes[i].voteWeight > 0) sum += ballot.votes[i].voteWeight
                }
                if (sum === 0) zeroProjects.push(i)
            }

            for (const zeroProject of zeroProjects) {
                expect(qfs[zeroProject]).toBe(0)
            }

            // check that the projects with votes have a qf greater than 0
            for (let i = 0; i < projects; i++) {
                if (!zeroProjects.includes(i)) expect(qfs[i]).toBeGreaterThan(0)
            }
        })
    })
})
