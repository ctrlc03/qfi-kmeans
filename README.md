# QFI k-means explorations

⚠️ WIP ⚠️

This repo contains experimental code that is used to understand how the popular k-means algorithm could be used in identifying collusion in a quadratic funding round.

## Usage

* clone the repo:  
    `git@github.com:ctrlc03/qfi-kmeans.git`
* install the dependencies:  
    `yarn`
* run tests for the typescript implementation:  
    `yarn test:ts`
* run tests for the circom implementation:
    `yarn test:circom`
* run the code to look at the results (this uses random indexes)
    `yarn start:random $k` - $k stands for the amount of clusters
* if you want to run the algo and specify the indexes of the initial centroids run the following:
    `yarn start:indexes $k $indexes` - $indexes should be comma separated i.e. 1,5,4 for a k=3
* to plot the data you can use this Python script (random indexes):
    `python3 src/plotting/plot_random_indexes.py $k`
* to plot the data generated with your fixed indexes you can use (not that you should have run `yarn start:indexes $k $indexes` first):
    `python3 src/plotting/plot_fixed_indexes.py $k $indexes` $indexes should be comma separated i.e. 1,5,4 for a k=3
* to run the algo and plot directly you can run:
    `./plotting.sh`

To run everything, you can just run:

* `make all` 

You can also run the above using make:
* `make install` 
* `make build` 
* `make test_ts` 
* `make test_circom` 
* `make plot` 

## Considerations

* When a ballot is at the same distance of two centroids, the first one is the one they are assigned to. 

## Examples

Let's run the algorithm on some test data (/test/data/userBallots.json) with a k of 4:

`yarn start:random 4`

Now let's plot it using python:

`python3 src/plotting/plot_random_indexes.py 4`

In test/data/ we will have the output of the algo, and on test/plots/random_indexes we will have the plots.