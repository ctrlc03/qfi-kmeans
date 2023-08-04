# QFI k-means explorations

⚠️ WIP ⚠️

This repo contains experimental code that is used to understand how the popular k-means algorithm could be used in identifying collusion in a quadratic funding round.

## Considerations

* When a ballot is at the same distance of two centroids, the first one is the one they are assigned to. 

### Coefficient Calculation

Coefficients can be calculated in two ways:

1. $1- clusterSize/totalVoters$
2. $clusterSize/totalVoters$

## Allocation Calculation

Funds allocation can be calculated in two ways:

1. squaring before applying the coefficient
2. squaring after applying the coefficient

## Usage

* clone the repo:  
    `git@github.com:ctrlc03/qfi-kmeans.git`
* install the dependencies:  
    `yarn`
* run tests for the typescript implementation:  
    `yarn test:ts` and `yarn test:class`
* run tests for the circom implementation:
    `yarn test:circom`
* to run all possible combinations of calculations and the elbow method (which can be used to identify the optimal value for k) use:
    `./plotting.sh` (needs execute permissions first)
> Please note that this stores a very large amount of files on disk (json and png files)
* to plot the data of a single run of the algorithm you can use the Python scripts inside src/plotting:
    `python3 src/plotting/x.py $k`
* Fetch GitCoin round data (you need to fill the .env file first - copy .env.template):
    `yarn gitcoin`
    `yarn parse:gitcoin`
* Run k-means on Gitcoin round data
    `yarn start:gitcoin`