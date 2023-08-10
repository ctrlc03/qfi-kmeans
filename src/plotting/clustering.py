import json
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.cluster import DBSCAN
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from hdbscan import HDBSCAN
import numpy as np

def find_elbow(wcss):
    # Calculate the differences between consecutive WCSS values
    differences = np.diff(wcss)
    
    # The "elbow" is the point where the rate of decrease sharply changes
    # Thus, the largest drop in WCSS can be considered as a heuristic
    elbow = np.argmin(differences) + 1  # +1 since diff has one element less than original list

    return elbow

def plot_clusters(data, labels, title, filename):
    # Use PCA to reduce the data to 2D for visualization
    pca = PCA(n_components=2)
    reduced_data = pca.fit_transform(data)
    x_coords, y_coords = zip(*reduced_data)  # unpack x and y coordinates after reduction
    plt.scatter(x_coords, y_coords, c=labels, cmap='rainbow')
    plt.title(title)
    plt.savefig(filename)
    plt.clf()  # Clear the current figure for the next plot

if __name__ == "__main__":
    with open("./tests/data/gitcoin/weights.json") as infile:
        data = json.load(infile)
        
    # Standardize the data
    scaler = StandardScaler()
    standardized_data = scaler.fit_transform(data)

    # KMeans clustering
    wcss = []
    max_clusters = 10
    for i in range(1, max_clusters+1):
        kmeans = KMeans(n_clusters=i, init='k-means++')
        kmeans.fit(standardized_data)
        wcss.append(kmeans.inertia_)

    best_k = find_elbow(wcss)
    print(f"The optimal number of clusters based on the elbow method is: {best_k}")

    # # Save the Elbow method graph
    # plt.figure(figsize=(10,5))
    # plt.plot(range(1, max_clusters+1), wcss, marker='o', linestyle='--')
    # plt.title('Elbow Method')
    # plt.xlabel('Number of clusters')
    # plt.ylabel('WCSS')
    # plt.savefig('./tests/plots/python/elbow_method.png')
    # plt.clf()  # Clear the current figure for the next plot

    # # DBSCAN clustering with iteration over different eps values
    # for eps_value in np.linspace(0.1, 1.0, 10):
    #     dbscan = DBSCAN(eps=eps_value, min_samples=5)
    #     dbscan_labels = dbscan.fit_predict(data)
    #     plot_clusters(data, dbscan_labels, f'DBSCAN Clustering (eps={eps_value:.2f})', f'./tests/plots/python/dbscan_eps_{eps_value:.2f}.png')

    # # HDBSCAN clustering (Make sure to install hdbscan library)
    # for min_cluster_size in range(2, 12):
    #     hdbscan_cluster = HDBSCAN(min_samples=5, min_cluster_size=min_cluster_size)
    #     hdbscan_labels = hdbscan_cluster.fit_predict(data)
    #     plot_clusters(data, hdbscan_labels, f'HDBSCAN Clustering (min_cluster_size={min_cluster_size})', f'./tests/plots/python/hdbscan_min_cluster_{min_cluster_size}.png')
