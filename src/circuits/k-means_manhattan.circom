pragma circom 2.1.0;

include "./distance_manhattan.circom";

// template to verify k-means clustering
template KmeansManhattan(k, projects) {
    // there should be at least two clusters
    assert(k > 1);
    // we should have more than one project
    assert(projects > 1);
    // projects should be more than clusters
    assert(projects > k);

    // the centroids of each cluster
    signal input centroids[k][projects];
    // the user's vote ballot
    signal input ballot[projects];
    // which cluster the ballot is supposed to be in
    signal input clusterIndex;

    // our output
    signal output match;

    var index = 0;
    // large number 2^64 = 18446744073709551616
    var previousDistance = 18446744073709551616;

    // our distance calculators
    component calculateDistance[k];

    // loop through each cluster
    for (var i = 0; i < k; i++) {
        calculateDistance[i] = DistanceCalculatorManhattan(projects);
        // calculate the distance between the ballot and the centroid
        calculateDistance[i].vectors[0] <-- ballot;
        calculateDistance[i].vectors[1] <-- centroids[i];
        // if the calculated distance is less than the previous distance, 
        // then store the index and the distance
        if (calculateDistance[i].sumOfDistances < previousDistance) {
            previousDistance = calculateDistance[i].sumOfDistances;
            index = i;
        }
    }

    // constrain that the provided index is equal to the calculated index
    match <-- index;
    clusterIndex === match;
}