import { KMeans, expandNumberToArray, parseVoteData, randomIntegerIncluded } from "../src/ts";
import fs from "fs"

describe("KMeans", () => {
    
    const data = fs.readFileSync("./tests/data/usersBallotState.json").toString()
    const ballots = parseVoteData(data)

    describe("utils", () => {
        describe("randomIntegerIncluded", () => {
            it("should generate a random integer between x and y", () => {
                const x = 5
                const y = 10
                const randomInteger = randomIntegerIncluded(x, y)
                expect(randomInteger).toBeGreaterThanOrEqual(x)
                expect(randomInteger).toBeLessThanOrEqual(y)
            })
        })
        describe("expandNumberToArray", () => {
            it("should expan a number to an array of 1 to num", () => {
                const num = 5
                const expanded = expandNumberToArray(num)
                expect(expanded).toEqual([1,2,3,4,5])
            })
        })
        describe("parseVoteData", () => {
            it("should parse the JSON data into an object", () => {
                const parsed = parseVoteData(data)
                expect(typeof(parsed)).toBe("object")
                expect(parsed.length).toBeGreaterThan(0)
            })
        })
    })


    describe("constructor", () => {
        const k = 5
        const kMeans = new KMeans(k, ballots, true)
        const projects = 22

        it("should create a new object with the correct properties", () => {
            expect(kMeans).toBeInstanceOf(KMeans)
            expect(kMeans.k).toBe(k)
            expect(kMeans.projects).toBeGreaterThan(0)
            expect(kMeans.projects).toBe(projects)
            expect(kMeans.ballots.length).toBe(ballots.length)
            expect(kMeans.wcss).toBeGreaterThan(0)
            expect(kMeans.initialCentroids.length).toBe(k)
            expect(kMeans.converged).toBe(true)
            expect(kMeans.actualIterations).toBeGreaterThanOrEqual(1)
            expect(kMeans.clustersSizes.length).toBe(k)
        })

        it("should calculate the traditional qf allocations", () => {
            expect(kMeans.traditionalQFs.length).toBe(projects)
            expect(kMeans.traditionalQFs.reduce((a, b) => a + b, 0)).toBeGreaterThan(0)
        })

        it("should calculate the allocations after k means coefficients", () => {
            kMeans.runAlgorithm1MinusSquareAfter()
            expect(kMeans.kMeansQFs.length).toBe(projects)
            expect(kMeans.kMeansQFs.reduce((a, b) => a + b, 0)).toBeGreaterThan(0)
            expect(kMeans.kMeansQFs).not.toBe(kMeans.traditionalQFs)
            expect(kMeans.kMeansQFs.reduce((a, b) => a + b, 0)).toBeLessThan(kMeans.traditionalQFs.reduce((a, b) => a + b, 0))
        })

        it("should write to a file the results", () => {
            kMeans.runAlgorithm1MinusSquareAfter()
            kMeans.writeToFile("/tmp/k-means-test.json")
            expect(fs.existsSync("/tmp/k-means-test.json")).toBe(true)
            fs.unlinkSync("/tmp/k-means-test.json")
        })

        it("should store the correct values (1 minus square after)", () => {
            kMeans.runAlgorithm1MinusSquareAfter()
            expect(kMeans.kMeansQFs.length).toBe(projects)
            expect(kMeans.votersCoefficients.length).toBe(ballots.length)
            expect(kMeans.coefficients.length).toBe(k)
            expect(kMeans.penalties.length).toBe(projects)
            expect(kMeans.penalties.reduce((a, b) => a + b, 0)).toBeGreaterThan(0)
        })
        it("should store the correct values (1 minus square before)", () => {
            kMeans.runAlgorithm1MinusSquareBefore()
            expect(kMeans.kMeansQFs.length).toBe(projects)
            expect(kMeans.votersCoefficients.length).toBe(ballots.length)
            expect(kMeans.coefficients.length).toBe(k)
            expect(kMeans.penalties.length).toBe(projects)
            expect(kMeans.penalties.reduce((a, b) => a + b, 0)).toBeGreaterThan(0)
        })
        it("should store the correct values (square after)", () => {
            kMeans.runAlgorithmSquareAfter()
            expect(kMeans.kMeansQFs.length).toBe(projects)
            expect(kMeans.votersCoefficients.length).toBe(ballots.length)
            expect(kMeans.coefficients.length).toBe(k)
            expect(kMeans.penalties.length).toBe(projects)
            expect(kMeans.penalties.reduce((a, b) => a + b, 0)).toBeGreaterThan(0)
        })
        it("should store the correct values (square before)", () => {
            kMeans.runAlgorithmSquareBefore()
            expect(kMeans.kMeansQFs.length).toBe(projects)
            expect(kMeans.votersCoefficients.length).toBe(ballots.length)
            expect(kMeans.coefficients.length).toBe(k)
            expect(kMeans.penalties.length).toBe(projects)
            expect(kMeans.penalties.reduce((a, b) => a + b, 0)).toBeGreaterThan(0)
        })
    })
})