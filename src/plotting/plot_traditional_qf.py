import matplotlib.pyplot as plt
import json 
import sys 

def read_data(): 
    k = sys.argv[1]
    with open(f"./tests/data/output_k_means_k_{k}_1_one_minus_square_before.json") as one_minus_before:
        one_minus_before_data = json.load(one_minus_before)

    return one_minus_before_data

def parse_data():
    one_minus_before_data = read_data()

    trad_qf = one_minus_before_data['tradQFs']
    projects = one_minus_before_data['projects']
    
    return trad_qf, projects


def plot_by_trad_qf_distribution(trad_qf, projects):
    fig, ax = plt.subplots()
    ax.bar(list(range(1, projects+1)), trad_qf, color='g')

    # Add a title and labels to the axes
    plt.title(f'Traditional QF per project')
    plt.xlabel('Projects')
    plt.xticks(list(range(1, projects+1)))
    plt.xticks(rotation=90)
    plt.tick_params(axis='x', labelsize=4)
    plt.ylabel('QF')

    # save
    plt.savefig(
        './tests/plots/plot_k_means_plus_plus_allocations_trad_qf.png', dpi=300
    )

if __name__ == "__main__":
    trad_qf, projects = parse_data()
   
    plot_by_trad_qf_distribution(trad_qf, projects)

