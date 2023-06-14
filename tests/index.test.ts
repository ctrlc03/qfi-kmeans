import { generateVector } from "../src";

describe("index", () => {
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
    it.only("should generate the correct vector for indexes [3, 4, 5, 6]", () => {
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