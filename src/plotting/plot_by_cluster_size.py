import matplotlib.pyplot as plt
import json 
import sys 

# read data
def read_data(): 
    filename = sys.argv[1]
    with open(f"./tests/data/gitcoin/output/k-6/{filename}_one_minus_square_before.json") as one_minus_before:
        one_minus_before_data = json.load(one_minus_before)

    return one_minus_before_data

# parse the data and return k and sizes
def parse_data():
    one_minus_before_data = read_data()
    k = one_minus_before_data['k']
    clusterSizes = one_minus_before_data['clustersSizes']
    sizes = [x['size'] for x in clusterSizes]

    return (
        k,  
        sizes, 
    )

# plot the data
def plot_by_size_of_clusters(k, sizes):
    plt.bar(list(range(1, k+1)), sizes , color='g')

    # Add a title and labels to the axes
    plt.title(f'Size of cluster for k = {k}'.format(k))
    plt.xlabel('Clusters')
    plt.xticks(list(range(1, k+1)))
    plt.ylabel('Number of Ballots')

    # save
    plt.savefig(
        './tests/plots/gitcoin/k-6/{filename}_1_minus_sizes.png'
        .format(filename=sys.argv[1], k=k), dpi=300
    )

if __name__ == "__main__":
    k, sizes = parse_data()
    plot_by_size_of_clusters(k, sizes)