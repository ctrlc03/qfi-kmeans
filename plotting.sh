#!/bin/bash 

# run the k-means algo for k = [3..10]
# with random indexes
for i in {3..10}
do
    # run the k-means algo 
    yarn start:random $i
    # plot the number of ballots x cluster
    python3 src/plotting/plot_random_indexes.py $i 
done 



