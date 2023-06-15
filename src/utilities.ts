/**
 * Generate a random integer between min and max
 * @param min <number> The minimum value
 * @param max <number> The maximum value
 * @returns <number> A random integer between min and max
 */
export const randomIntegerIncluded = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// the maximum amount that a user can contribute to a project
export const MAX_CONTRIBUTION_AMOUNT = 50
// how many times should we run the algorithm
export const MAX_ITERATIONS = 100
// @todo calculate tolerance based on the number of projects, voters, vote amounts
export const TOLERANCE = 0.001