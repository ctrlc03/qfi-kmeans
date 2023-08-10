import matplotlib.pyplot as plt
import json 
import sys 

# read data
def read_data(): 
    iteration = sys.argv[1]
    with open(f"./tests/data/output/scores/scores_{iteration}.json") as one_minus_before:
        data = json.load(one_minus_before)

    return data

# parse the data and return k and sizes
def parse_data():
    data = read_data()
    sil_scores = data['silhoutteScores']
    db_scores = data['dbIndexes']
    wcss = data['elbows']
    dunn_scores = data['dunnScores']

    return (
        sil_scores,
        db_scores,
        wcss,
        dunn_scores
    )


# plot the data
def plot_by_dbScore(db_scores):
    plt.bar(list(range(3, 11)), db_scores, color='g')

    # Add a title and labels to the axes
    plt.title(f'Davies Boul scores {sys.argv[1]}')
    plt.xlabel('Clusters')
    plt.xticks(list(range(3, 11)))
    plt.ylabel('Score')

    # save
    plt.savefig(
        f'./tests/plots/scores/daviesb_plot_{sys.argv[1]}.png'
        , dpi=300
    )

    plt.clf()

# plot the data
def plot_by_silhoutteScore(scores):
    plt.bar(list(range(3, 11)), scores, color='g')

    # Add a title and labels to the axes
    plt.title(f'Silhoutte {sys.argv[1]}')
    plt.xlabel('Clusters')
    plt.xticks(list(range(3, 11)))
    plt.ylabel('Score')

    # save
    plt.savefig(
        f'./tests/plots/scores/silhoutte_plot_{sys.argv[1]}.png'
        , dpi=300
    )

    plt.clf()


def plot_wcss(wcss):
    plt.plot(list(range(3, 11)), wcss, color='g')

    # Add a title and labels to the axes
    plt.title(f'WCSS Elbow Method')
    plt.xlabel('k')
    plt.xticks(list(range(3, 11)))
    plt.xticks(rotation=90)
    plt.tick_params(axis='x', labelsize=6)
    plt.ylabel('WCSS score')

    # save
    plt.savefig(
        f'./tests/plots/scores/elbow_plot_{sys.argv[1]}.png'
        , dpi=300
    )

    plt.clf()

def plot_dunn(dunn):
    plt.bar(list(range(3, 11)), dunn, color='g')

    # Add a title and labels to the axes
    plt.title(f'Dunn scores')
    plt.xlabel('k')
    plt.xticks(list(range(3, 11)))
    plt.xticks(rotation=90)
    plt.tick_params(axis='x', labelsize=6)
    plt.ylabel('Dunn score')

    # save
    plt.savefig(
        f'./tests/plots/scores/dunn_plot_{sys.argv[1]}.png'
        , dpi=300
    )

    plt.clf()

if __name__ == "__main__":
    sil_scores, db_scores, wcss, dunn_scores  = parse_data()
    plot_by_silhoutteScore(sil_scores)
    plot_by_dbScore(db_scores)
    plot_wcss(wcss)
    plot_dunn(dunn_scores)
