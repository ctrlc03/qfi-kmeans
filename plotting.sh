#!/bin/bash 

# run the k-means algo for k = [3..10]
# with random indexes
# for i in {1..10}
# do  
#     # run the k-means algo 
#     yarn start:elbow $i 
#     # plot the number of ballots x cluster
#     python3 src/plotting/plot_elbow.py $i

#     for x in {3..10}
#     do
#         # plot the full algo output
#         python3 src/plotting/plot_k_means.py $x $i
#     done 
# done 


# python3 src/plotting/plot_traditional_qf.py 1

# for i in {1..10}
# do  
#     # run the k-means algo 
#     yarn start:gitcoin $i 
#     # plot the number of ballots x cluster

#     for filen in "./tests/data/gitcoin/output/*_wcss*"; do 
#         name=$(basename -- "$filen")
#         python3 src/plotting/plot_gitcoin_elbow.py $name 
#     done 

#     for x in {3..10}
#     do
#         # plot the full algo output
#         # get the filanemes 
#         for full_filename in "./tests/data/gitcoin/output"/*output*; do
#             # Strip the directory path 
#             filename=$(basename -- "$full_filename")
#             # Split filename by underscore and take the first two parts
#             IFS='_'
#             set -- $filename
#             first_two_parts="$1_$2"

#             python3 src/plotting/plot_gitcoin_k_means.py $x $i "$first_two_parts"
#         done

#     done 
# done 

for full_filename in "./tests/data/gitcoin/output"/*output*; do
    # Strip the directory path 
    filename=$(basename -- "$full_filename")
    echo "$filename"
    python3 src/plotting/plot_gitcoin_traditional_qf.py $filename 
done
