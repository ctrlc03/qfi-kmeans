#!/bin/bash 

# run the k-means algo for k = [3..10]
# with random indexes
for i in {3..10}
do
    # run the k-means algo 
    yarn start:plusplus $i
    # plot the number of ballots x cluster
    python3 src/plotting/plot_k_means_plus_plus.py $i 
done 



