# QFI k-means explorations

⚠️ WIP ⚠️

This repo contains experimental code that is used to understand how the popular k-means algorithm could be used in identifying collusion in a quadratic funding round.

## Usage

* clone the repo:  
    `git@github.com:ctrlc03/qfi-kmeans.git`
* install the dependencies:  
    `yarn`
* run tests for the typescript implementation:  
    `yarn test`
* run tests for the circom implementation:
    `yarn test`
* run the code to look at the results  
    `yarn start`

## Considerations

* When a ballot is at the same distance of two centroids, the first one is the one they are assigned to. 