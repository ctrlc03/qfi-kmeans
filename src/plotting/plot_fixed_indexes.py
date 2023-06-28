import matplotlib.pyplot as plt
import json 
import sys 

k = sys.argv[1]
indexes = sys.argv[2]

print(indexes)
def read_data():     
    with open(f"./tests/data/output_fixed_indexes_k_{k}_indexes_{indexes.replace(',', '_')}.json") as in_file:
        data = json.load(in_file)

    return data 

def parse_data():
    data = read_data()
    clusters = data['k']
    assignments = data['assignments']
    coefficients = data['coefficients']
    voters = data['voters']
    clusterSizes = data['clusters']
    sizes = [x['size'] for x in clusterSizes]

    return clusters, assignments, coefficients, voters, clusterSizes, sizes

def plot_by_size_of_clusters(clusters, sizes):
    plt.bar(list(range(1, clusters+1)), sizes , color='g')

    # Add a title and labels to the axes
    plt.title('Ballots per cluster')
    plt.xlabel('Clusters')
    plt.xticks(list(range(1, clusters)))
    plt.ylabel('Number of Ballots')

    # save
    plt.savefig(f"./tests/plots/fixed_indexes/plot_fixed_indexes_k_{k}_{indexes.replace(',', '_')}.png".format(k=clusters), dpi=300)

if __name__ == "__main__":
    clusters, assignments, coefficients, voters, clusterSizes, sizes = parse_data()
    plot_by_size_of_clusters(clusters, sizes)