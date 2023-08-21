import matplotlib.pyplot as plt
import json 
import sys 

filename = sys.argv[1]
output = sys.argv[2]
iteration = sys.argv[3]

# read data
def read_data(): 
    with open(f"./src/prod/gitcoin/{filename}_{iteration}.json") as one_minus_before:
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
    plt.bar(list(range(3, 21)), db_scores, color='g')

    # Add a title and labels to the axes
    plt.title(f'Davies Boul scores {iteration}')
    plt.xlabel('Clusters')
    plt.xticks(list(range(3, 21)))
    plt.ylabel('Score')

    # save
    plt.savefig(
        f'./src/prod/gitcoin/{output}/plots/scores/daviesb_plot_{iteration}.png'
        , dpi=300
    )

    plt.clf()

# plot the data
def plot_by_silhoutteScore(scores):
    plt.bar(list(range(3, 21)), scores, color='g')

    # Add a title and labels to the axes
    plt.title(f'Silhoutte {iteration}')
    plt.xlabel('Clusters')
    plt.xticks(list(range(3, 21)))
    plt.ylabel('Score')

    # save
    plt.savefig(
        f'./src/prod/gitcoin/{output}/plots/scores/silhoutte_plot_{iteration}.png'
        , dpi=300
    )

    plt.clf()


def plot_wcss(wcss):
    plt.plot(list(range(3, 21)), wcss, color='g')

    # Add a title and labels to the axes
    plt.title(f'WCSS Elbow Method {iteration}')
    plt.xlabel('k')
    plt.xticks(list(range(3, 21)))
    plt.xticks(rotation=90)
    plt.tick_params(axis='x', labelsize=6)
    plt.ylabel('WCSS score')

    # save
    plt.savefig(
        f'./src/prod/gitcoin/{output}/plots/scores/elbow_plot_{iteration}.png'
        , dpi=300
    )

    plt.clf()

def plot_dunn(dunn):
    plt.bar(list(range(3, 21)), dunn, color='g')

    # Add a title and labels to the axes
    plt.title(f'Dunn scores {iteration}')
    plt.xlabel('k')
    plt.xticks(list(range(3, 21)))
    plt.xticks(rotation=90)
    plt.tick_params(axis='x', labelsize=6)
    plt.ylabel('Dunn score')

    # save
    plt.savefig(
        f'./src/prod/gitcoin/{output}/plots/scores/dunn_plot_{iteration}.png'
        , dpi=300
    )

    plt.clf()

if __name__ == "__main__":
    sil_scores, db_scores, wcss, dunn_scores  = parse_data()
    plot_by_silhoutteScore(sil_scores)
    plot_by_dbScore(db_scores)
    plot_wcss(wcss)
    plot_dunn(dunn_scores)
