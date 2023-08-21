contract_1="data_0x1b165fe4da6bc58ab8370ddc763d367d29f50ef0"
contract_2="data_0xd95a1969c41112cee9a2c931e849bcef36a16f4c"
contract_3="data_0xdf75054cd67217aee44b4f9e4ebc651c00330938"
contract_4="data_0xe575282b376e3c9886779a841a2510f1dd8c2ce4"

eucledian="eucledian"
cosine="cosine"

for i in {1..100}
do  
    # run the k-means algo 
    npx ts-node --esm src/prod/run-kmeans-scores_gitcoin.ts $i
    # plot the scores
    python3 src/prod/plot_scores.py "$eucledian/scores/$contract_1" $eucledian $i
    python3 src/prod/plot_scores.py "$eucledian/scores/$contract_2" $eucledian $i
    python3 src/prod/plot_scores.py "$eucledian/scores/$contract_2" $eucledian $i
    python3 src/prod/plot_scores.py "$eucledian/scores/$contract_2" $eucledian $i
    python3 src/prod/plot_scores.py "$cosine/scores/$contract_1" $cosine $i
    python3 src/prod/plot_scores.py "$cosine/scores/$contract_2" $cosine $i
    python3 src/prod/plot_scores.py "$cosine/scores/$contract_2" $cosine $i
    python3 src/prod/plot_scores.py "$cosine/scores/$contract_2" $cosine $i
done 