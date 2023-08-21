import matplotlib.pyplot as plt
import json 
import sys 

# read data
def read_data(): 
    k = sys.argv[1]
    
    with open(f"./src/prod/qfi/cosine/outputs/k_{k}-means.json") as sizes:
        _sizesCosine = json.load(sizes)

    with open(f"./src/prod/qfi/eucledian/outputs/k_{k}-means.json") as sizes:
        _sizesEuclidean = json.load(sizes)

    return _sizesCosine, _sizesEuclidean

# parse the data and return k and sizes
def parse_data():
    dataCosine, dataEucledian = read_data()
    sizesCosine = dataCosine['sizes']
    valuesCosine =  [x['size'] for x in sizesCosine]

    sizesEuclidean = dataEucledian['sizes']
    valuesEuclidean =  [x['size'] for x in sizesEuclidean]
    return (
        valuesCosine, 
        valuesEuclidean
    )

# plot the data
def plot_by_size_of_clusters(k, sizes, cosine):
    plt.bar(list(range(1, k+1)), sizes , color='g')

    # Add a title and labels to the axes
    plt.title(f'Size of cluster for k = {k}'.format(k))
    plt.xlabel('Clusters')
    plt.xticks(list(range(1, k+1)))
    plt.ylabel('Number of Ballots')

    # save
    if cosine == True:
        output = "cosine"
    else: output = "eucledian"
    plt.savefig(
        f'./src/prod/qfi/{output}/plots/k_{k}_sizes.png', dpi=300
    )

if __name__ == "__main__":
    sizesCosine, sizesEucledian = parse_data()
    plot_by_size_of_clusters(int(sys.argv[1]), sizesCosine, True)
    plot_by_size_of_clusters(int(sys.argv[1]), sizesEucledian, False)
