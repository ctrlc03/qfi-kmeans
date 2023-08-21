# run the k-means algo for k = [3..10]
for i in {3..10}
do  
    # run the k-means algo 
    npx ts-node --esm src/prod/run-kmeans_qfi_data.ts $i
    # plot the number of ballots x cluster
    python3 src/prod/plot_sizes.py $i
done 