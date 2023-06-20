pragma circom 2.1.0;

include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib/circuits/mux1.circom";

// a template that can be used to calculate the distance between two vectors
template DistanceCalculator(projects) {
	// our input is a 2D array of project votes (1 is the ballot and the other is the centroid)
	signal input vectors[2][projects];
	// the output is the sum of the square distances
	signal output sumOfSquaredDistances;

	// we use this signal to hold the intermediate sum
	signal accumulator[projects + 1];
	// hold both vectors[0][i] - vectors[1][i] and vectors[1][i] - vectors[0][i]
	signal differences1[projects];
	signal differences2[projects];
	// hold the squared differences
	signal squaredDifferences[projects];

	// Initialize the accumulator to 0
	accumulator[0] <== 0;

	// we use these to compare the number of projects
	component lessThan[projects];
	component mutexesLess[projects];
	
	// Compute the sum of squared differences
	for (var i = 0; i < projects; i++) {
		// need to ensure that the result is always non negative 
		// (in this case it would wrap around and be larger e.g 3 - 5 != -2 -> largestNumber - 2)
		// we use 32 bits to represent up to 2^32 vote weight 
		// (but could use 16 as that would be 65535)
		lessThan[i] = LessThan(32);
		lessThan[i].in[0] <== vectors[0][i];
		lessThan[i].in[1] <== vectors[1][i];

		// calculate the difference between the two vectors
		differences1[i] <== vectors[0][i] - vectors[1][i];
		differences2[i] <== vectors[1][i] - vectors[0][i];

		// confirm the output of LessThan
		mutexesLess[i] = Mux1();
		mutexesLess[i].c[0] <== differences1[i];
		mutexesLess[i].c[1] <== differences2[i];
		mutexesLess[i].s <== lessThan[i].out;

		// if [0][i] < [1][i] -> output is 1 -> thus we want differences2[i] 
		// which is [1][i] - [0][i]
		// if [0][i] >= [1][i] -> output is 0 -> thus we want differences1[i]
		// which is [0][i] - [1][i]

		squaredDifferences[i] <== mutexesLess[i].out * mutexesLess[i].out;
		// add to the accumulator
		accumulator[i + 1] <== accumulator[i] + squaredDifferences[i];
	}

	// Output the final sum is the value held in the last index 
	sumOfSquaredDistances <== accumulator[projects];
}



