import matplotlib.pyplot as plt
import json 
import sys 

def read_data(): 
    k = sys.argv[1]
    with open(f"./tests/data/output_k_means_elbow_k_{k}_1_minus_square_before.json") as one_minus_before:
        one_minus_before_data = json.load(one_minus_before)
    with open(f"./tests/data/output_k_means_elbow_k_{k}_1_minus_square_after.json") as one_minus_after:
        one_minus_after_data = json.load(one_minus_after)
    with open(f"./tests/data/output_k_means_elbow_k_{k}_square_before.json") as before:
        before_data = json.load(before)
    with open(f"./tests/data/output_k_means_elbow_k_{k}_square_after.json") as after:
        after_data = json.load(after)

    return one_minus_before_data,  one_minus_after_data, before_data, after_data

def parse_data():
    one_minus_before_data,  one_minus_after_data, before_data, after_data = read_data()
    clusters = one_minus_before_data['k']
    assignments = one_minus_before_data['assignments']
    voters = one_minus_before_data['voters']
    clusterSizes = one_minus_before_data['clusters']
    sizes = [x['size'] for x in clusterSizes]
    userCoefficients_one_minus = one_minus_before_data['userCoefficients']
    userCoefficients = before_data['userCoefficients']
    projects = one_minus_before_data['projects']
    qfs_minus_before = one_minus_before_data['qfs']
    qfs_minus_after = one_minus_after_data['qfs']
    qfs_before = before_data['qfs']
    qfs_after = after_data['qfs']
    trad_qf = one_minus_before_data['tradQF']
    wcss = one_minus_before_data['wcss']

    return clusters, assignments, userCoefficients_one_minus, userCoefficients, voters, clusterSizes, sizes, userCoefficients, projects, qfs_minus_before, qfs_minus_after, qfs_before, qfs_after, trad_qf, wcss

def plot_by_size_of_clusters(clusters, sizes):
    plt.bar(list(range(1, clusters+1)), sizes , color='g')

    # Add a title and labels to the axes
    plt.title(f'Size of cluster for k = {clusters}'.format(clusters))
    plt.xlabel('Clusters')
    plt.xticks(list(range(1, clusters+1)))
    plt.ylabel('Number of Ballots')

    # save
    plt.savefig('./tests/plots/random_indexes/plot_k_means_plus_plus_k_{k}_{iteration}_1_minus_sizes.png'.format(k=clusters, iteration=sys.argv[2]), dpi=300)


def plot_by_user_coefficient(coefficients, voters, path, title, color):

    fig, ax = plt.subplots()
    ax.bar(list(range(1, voters+1)), coefficients , color=color)

    # Add a title and labels to the axes
    plt.title(title)
    plt.xlabel('Voters')
    plt.xticks(list(range(1, voters+1)))
    plt.xticks(rotation=90)
    plt.tick_params(axis='x', labelsize=4)
    plt.ylabel('Coefficient')

    # save
    plt.savefig(path, dpi=300)

def plot_by_qf_distribution(qf, projects, path, title, color):
    fig, ax = plt.subplots()
    ax.bar(list(range(1, projects+1)), qf, color=color)

    # Add a title and labels to the axes
    plt.title(title)
    plt.xlabel('Projects')
    plt.xticks(list(range(1, projects+1)))
    plt.xticks(rotation=90)
    plt.tick_params(axis='x', labelsize=4)
    plt.ylabel('QF')

    # save
    plt.savefig(path, dpi=300)

def plot_by_trad_qf_distribution(trad_qf, projects, k):
    fig, ax = plt.subplots()
    ax.bar(list(range(1, projects+1)), trad_qf, color='g')

    # Add a title and labels to the axes
    plt.title(f'Traditional QF per project k = {k}')
    plt.xlabel('Projects')
    plt.xticks(list(range(1, projects+1)))
    plt.xticks(rotation=90)
    plt.tick_params(axis='x', labelsize=4)
    plt.ylabel('QF')

    # save
    plt.savefig('./tests/plots/random_indexes/plot_k_means_plus_plus_allocations_trad_qf_k_{k}_{iteration}_1_minus.png'.format(k=clusters, iteration=sys.argv[2]), dpi=300)


if __name__ == "__main__":
    clusters, assignments, coefficients_1_minus, coefficients, voters, clusterSizes, sizes, userCoefficients, projects, qfs_minus_before, qfs_minus_after, qfs_before, qfs_after, trad_qf = parse_data()
    plot_by_size_of_clusters(clusters, sizes)
    plot_by_user_coefficient(coefficients_1_minus, voters, f'./tests/plots/random_indexes/plot_k_means_plus_plus_k{sys.argv[1]}_{sys.argv[2]}_user_coefficients_1_minus.png', f'User coefficients (1 - clusterSize/ballots) for k = {clusters}', 'b')
    plot_by_user_coefficient(coefficients, voters, f'./tests/plots/random_indexes/plot_k_means_plus_plus_k{sys.argv[1]}_{sys.argv[2]}_user_coefficients_1_minus.png', f'User coefficients (clusterSize/ballots) for k = {clusters}', 'b')

    plot_by_qf_distribution(qfs_minus_before, projects, f'./tests/plots/random_indexes/plot_k_means_plus_plus_k_{sys.argv[1]}_{sys.argv[2]}_1_minus_square_before_coefficient.png', f'QF (1 - clusterSize/ballots and square root before coefficient) for k = {clusters}', 'b')
    plot_by_qf_distribution(qfs_minus_after, projects, f'./tests/plots/random_indexes/plot_k_means_plus_plus_k_{sys.argv[1]}_{sys.argv[2]}_1_minus_square_after_coefficient.png', f'QF (1 - clusterSize/ballots and square root after coefficient) for k = {clusters}', 'r')
    plot_by_qf_distribution(qfs_before, projects, f'./tests/plots/random_indexes/plot_k_means_plus_plus_k_{sys.argv[1]}_{sys.argv[2]}_before_coefficient.png', f'QF (clusterSize/ballots and square root before coefficient) for k = {clusters}' ,'g')
    plot_by_qf_distribution(qfs_after, projects, f'./tests/plots/random_indexes/plot_k_means_plus_plus_k_{sys.argv[1]}_{sys.argv[2]}_after_coefficient.png', f'QF (clusterSize/ballots and square root after coefficient) for k = {clusters}','m')

    plot_by_trad_qf_distribution(trad_qf, projects, clusters)

