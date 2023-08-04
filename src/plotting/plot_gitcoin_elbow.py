import matplotlib.pyplot as plt
import json 
import sys 

def read_data(): 
    with open(f'./tests/data/gitcoin/output/{sys.argv[1]}') as f:
        data = json.load(f)

    return data

def plot_wcss(wcss):
    plt.plot(list(range(1, len(wcss)+1)), wcss, color='g')

    # Add a title and labels to the axes
    plt.title(f'WCSS Elbow Method')
    plt.xlabel('k')
    plt.xticks(list(range(3, 11)))
    plt.xticks(rotation=90)
    plt.tick_params(axis='x', labelsize=6)
    plt.ylabel('WCSS score')

    # save
    plt.savefig(f'./tests/plots/gitcoin/elbow_method_{sys.argv[1]}.png', dpi=300)

if __name__ == "__main__":
    data = read_data()

    plot_wcss(data['wcss'])
