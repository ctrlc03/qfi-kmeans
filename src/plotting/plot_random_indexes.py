import matplotlib.pyplot as plt
import json 
import sys 

def read_data(): 
    k = sys.argv[1]
    with open(f"./tests/data/output_random_indexes_{k}.json") as in_file:
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
    userCoefficients = data['userCoefficients']

    return clusters, assignments, coefficients, voters, clusterSizes, sizes, userCoefficients

def plot_by_size_of_clusters(clusters, sizes):
    plt.bar(list(range(1, clusters+1)), sizes , color='g')

    # Add a title and labels to the axes
    plt.title(f'Ballots per cluster k = {clusters}')
    plt.xlabel('Clusters')
    plt.xticks(list(range(1, clusters+1)))
    plt.ylabel('Number of Ballots')

    # save
    plt.savefig('./tests/plots/random_indexes/plot_random_indexes_k_{k}.png'.format(k=clusters), dpi=300)


def plot_by_user_coefficient(coefficients, voters, k):

    fig, ax = plt.subplots()
    ax.bar(list(range(1, voters+1)), coefficients , color='g')

    # Add a title and labels to the axes
    plt.title(f'Coefficient per voter k = {k}')
    plt.xlabel('Voters')
    plt.xticks(list(range(1, voters+1)))
    plt.xticks(rotation=90)
    plt.tick_params(axis='x', labelsize=4)
    plt.ylabel('Coefficient')

    # save
    plt.savefig('./tests/plots/random_indexes/plot_random_indexes_coefficients_k_{k}.png'.format(k=clusters), dpi=300)


if __name__ == "__main__":
    clusters, assignments, coefficients, voters, clusterSizes, sizes, userCoefficients = parse_data()
    plot_by_size_of_clusters(clusters, sizes)
    plot_by_user_coefficient(userCoefficients, voters, clusters)