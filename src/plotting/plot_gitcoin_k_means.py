import matplotlib.pyplot as plt
import json 
import sys 

def read_data(): 
    k = sys.argv[1]
    iteration = sys.argv[2]
    filename = sys.argv[3]
    with open(f"./tests/data/gitcoin/output/{filename}_output_k_means_k_{k}_{iteration}_one_minus_square_before.json") as one_minus_before:
        one_minus_before_data = json.load(one_minus_before)
    with open(f"./tests/data/gitcoin/output/{filename}_output_k_means_k_{k}_{iteration}_one_minus_square_after.json") as one_minus_after:
        one_minus_after_data = json.load(one_minus_after)
    with open(f"./tests/data/gitcoin/output/{filename}_output_k_means_k_{k}_{iteration}_square_before.json") as before:
        before_data = json.load(before)
    with open(f"./tests/data/gitcoin/output/{filename}_output_k_means_k_{k}_{iteration}_square_after.json") as after:
        after_data = json.load(after)

    return one_minus_before_data,  one_minus_after_data, before_data, after_data

def parse_data():
    one_minus_before_data,  one_minus_after_data, before_data, after_data = read_data()
    k = one_minus_before_data['k']
    assignments = one_minus_before_data['assignments']
    voters = one_minus_before_data['voters']
    clusterSizes = one_minus_before_data['clustersSizes']
    sizes = [x['size'] for x in clusterSizes]
    userCoefficients_one_minus = one_minus_before_data['votersCoefficients']
    userCoefficients = before_data['votersCoefficients']
    projects = one_minus_before_data['projects']
    qfs_minus_before = one_minus_before_data['qfs']
    qfs_minus_after = one_minus_after_data['qfs']
    qfs_before = before_data['qfs']
    qfs_after = after_data['qfs']
    penalties_minus_before = one_minus_before_data['penalties']
    penalties_minus_after = one_minus_after_data['penalties']
    penalties_before = before_data['penalties']
    penalties_after = after_data['penalties']

    return (
        k, 
        assignments, 
        userCoefficients_one_minus, 
        userCoefficients, 
        voters, 
        clusterSizes, 
        sizes, 
        projects, 
        qfs_minus_before, 
        qfs_minus_after, 
        qfs_before, 
        qfs_after,
        penalties_minus_before,
        penalties_minus_after,
        penalties_before,
        penalties_after
    )

def plot_by_size_of_clusters(k, sizes):
    plt.bar(list(range(1, k+1)), sizes , color='g')

    # Add a title and labels to the axes
    plt.title(f'Size of cluster for k = {k}'.format(k))
    plt.xlabel('Clusters')
    plt.xticks(list(range(1, k+1)))
    plt.ylabel('Number of Ballots')

    # save
    plt.savefig(
        './tests/plots/gitcoin/{filename}_plot_k_means_plus_plus_k_{k}_{iteration}_1_minus_sizes.png'
        .format(filename=sys.argv[3], k=k, iteration=sys.argv[2]), dpi=300
    )


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

def plot_by_penalties(penalties, projects, path, title, color):
    fig, ax = plt.subplots()
    ax.bar(list(range(1, projects+1)), penalties, color=color)

    # Add a title and labels to the axes
    plt.title(title)
    plt.xlabel('Projects')
    plt.xticks(list(range(1, projects+1)))
    plt.xticks(rotation=90)
    plt.tick_params(axis='x', labelsize=4)
    plt.ylabel('Penalties')

    # save
    plt.savefig(path, dpi=300)

if __name__ == "__main__":
    ( 
       k, 
        assignments, 
        userCoefficients_one_minus, 
        userCoefficients, 
        voters, 
        clusterSizes, 
        sizes, 
        projects, 
        qfs_minus_before, 
        qfs_minus_after, 
        qfs_before, 
        qfs_after,
        penalties_minus_before,
        penalties_minus_after,
        penalties_before,
        penalties_after
    ) = parse_data()

    plot_by_size_of_clusters(k, sizes)
    plot_by_user_coefficient(userCoefficients_one_minus, voters, f'./tests/plots/gitcoin/{sys.argv[3]}_plot_k_means_plus_plus_k_{sys.argv[1]}_{sys.argv[2]}_user_coefficients_1_minus.png', f'User coefficients (1 - clusterSize/ballots) for k = {k}', 'b')
    plot_by_user_coefficient(userCoefficients, voters, f'./tests/plots/gitcoin/{sys.argv[3]}_plot_k_means_plus_plus_k_{sys.argv[1]}_{sys.argv[2]}_user_coefficients.png', f'User coefficients (clusterSize/ballots) for k = {k}', 'b')

    plot_by_qf_distribution(qfs_minus_before, projects, f'./tests/plots/gitcoin/{sys.argv[3]}_plot_k_means_plus_plus_k_{sys.argv[1]}_{sys.argv[2]}_1_minus_square_before_coefficient.png', f'QF (1 - clusterSize/ballots and square root before coefficient) for k = {k}', 'b')
    plot_by_qf_distribution(qfs_minus_after, projects, f'./tests/plots/gitcoin/{sys.argv[3]}_plot_k_means_plus_plus_k_{sys.argv[1]}_{sys.argv[2]}_1_minus_square_after_coefficient.png', f'QF (1 - clusterSize/ballots and square root after coefficient) for k = {k}', 'r')
    plot_by_qf_distribution(qfs_before, projects, f'./tests/plots/gitcoin/{sys.argv[3]}_plot_k_means_plus_plus_k_{sys.argv[1]}_{sys.argv[2]}_before_coefficient.png', f'QF (clusterSize/ballots and square root before coefficient) for k = {k}' ,'g')
    plot_by_qf_distribution(qfs_after, projects, f'./tests/plots/gitcoin/{sys.argv[3]}_plot_k_means_plus_plus_k_{sys.argv[1]}_{sys.argv[2]}_after_coefficient.png', f'QF (clusterSize/ballots and square root after coefficient) for k = {k}','m')

    plot_by_penalties(penalties_minus_before, projects, f'./tests/plots/gitcoin/{sys.argv[3]}_plot_k_means_plus_plus_k_{sys.argv[1]}_{sys.argv[2]}_1_minus_square_before_coefficient_penalties.png', f'Penalties (1 - clusterSize/ballots and square root before coefficient) for k = {k}', 'b')
    plot_by_penalties(penalties_minus_after, projects, f'./tests/plots/gitcoin/{sys.argv[3]}_plot_k_means_plus_plus_k_{sys.argv[1]}_{sys.argv[2]}_1_minus_square_after_coefficient_penalties.png', f'Penalties (1 - clusterSize/ballots and square root after coefficient) for k = {k}', 'r')
    plot_by_penalties(penalties_before, projects, f'./tests/plots/gitcoin/{sys.argv[3]}_plot_k_means_plus_plus_k_{sys.argv[1]}_{sys.argv[2]}_before_coefficient_penalties.png', f'Penalties (clusterSize/ballots and square root before coefficient) for k = {k}' ,'g')
    plot_by_penalties(penalties_after, projects, f'./tests/plots/gitcoin/{sys.argv[3]}_plot_k_means_plus_plus_k_{sys.argv[1]}_{sys.argv[2]}_after_coefficient_penalties.png', f'Penalties (clusterSize/ballots and square root after coefficient) for k = {k}','m')
