# run the k-means algo for k = [3..10]
contract_1="0x1b165fe4da6bc58ab8370ddc763d367d29f50ef0"
contract_2="0xd95a1969c41112cee9a2c931e849bcef36a16f4c"
contract_3="0xdf75054cd67217aee44b4f9e4ebc651c00330938"
contract_4="0xe575282b376e3c9886779a841a2510f1dd8c2ce4"

for i in {3..20}
do  
    # run the k-means algo 
    npx ts-node --esm src/prod/run-kmeans_gitcoin_data.ts $i
    # plot the number of ballots x cluster
    python3 src/prod/plot_cluster_size.py $i $contract_1
    python3 src/prod/plot_cluster_size.py $i $contract_2
    python3 src/prod/plot_cluster_size.py $i $contract_3
    python3 src/prod/plot_cluster_size.py $i $contract_4
done 