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
        it("should create a new object with the correct properties", () => {
            const kMeans = new KMeans(k, ballots, true)
            expect(kMeans).toBeInstanceOf(KMeans)
            expect(kMeans.k).toBe(k)
            expect(kMeans.projects).toBeGreaterThan(0)
            expect(kMeans.projects).toBe(22)
        })
    })
})