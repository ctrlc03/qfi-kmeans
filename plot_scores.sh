#!/bin/bash 

# run the algo 100 times and plot clustering scores
for i in {1..100}
do  
    # run the k-means algo 
    npx ts-node --esm src/k-means-scores.ts $i
    # plot the scores
    python3 src/plotting/plot_scores.py $i

done 