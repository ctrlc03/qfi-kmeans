import json
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans, AgglomerativeClustering, SpectralClustering, DBSCAN
from sklearn.mixture import GaussianMixture
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

def plot_cluster_sizes(cluster_sizes, title, filename):
    n_clusters = len(cluster_sizes)
    plt.bar(range(n_clusters), cluster_sizes, color='skyblue')
    plt.title(title)
    plt.xlabel('Cluster ID')
    plt.xticks(list(range(n_clusters)))
    plt.ylabel('Number of Points')
    plt.savefig(filename)
    plt.clf()


if __name__ == "__main__":
    with open("./tests/data/gitcoin/weights.json") as infile:
        data = json.load(infile)

    counter = 0
    for x in data:
        for y in x:
            if y > 0:
                counter += 1
        if counter == 1:
            print(x)

    
        
    # Standardize the data
    scaler = StandardScaler()
    standardized_data = scaler.fit_transform(data)

    # KMeans clustering
    wcss = []
    max_clusters = 20

    bic_scores = []
    aic_scores = []
    
    for n in range(3, max_clusters+1):
        kmeans = KMeans(n_clusters=n, init='k-means++')
        kmeans.fit(standardized_data)
        wcss.append(kmeans.inertia_)

        # Agglomerative Clustering
        agglomerative = AgglomerativeClustering(n_clusters=n)
        agglomerative_labels = agglomerative.fit_predict(standardized_data)
        # plot_clusters(standardized_data, agglomerative_labels, f'Agglomerative Clustering (n_clusters={n})', f'./tests/plots/python/agglomerative_{n}.png')
        kmeans_cluster_sizes = [np.sum(kmeans.labels_ == i) for i in range(n)]
        plot_cluster_sizes(kmeans_cluster_sizes, f'KMeans Cluster Sizes (n_clusters={n})', f'./tests/plots/python/kmeans_sizes_{n}.png')

        # Spectral Clustering
        spectral = SpectralClustering(n_clusters=n)
        spectral_labels = spectral.fit_predict(standardized_data)
        # plot_clusters(standardized_data, spectral_labels, f'Spectral Clustering (n_clusters={n})', f'./tests/plots/python/spectral_{n}.png')
        plot_cluster_sizes(spectral_labels, f'Spectral Clustering Sizes (n_clusters={n})', f'./tests/plots/python/spectral_sizes_{n}.png')

        # Gaussian Mixture Model
        gmm = GaussianMixture(n_components=n)
        gmm_labels = gmm.fit_predict(standardized_data)
        bic_scores.append(gmm.bic(standardized_data))
        aic_scores.append(gmm.aic(standardized_data))
        # plot_clusters(standardized_data, gmm_labels, f'GMM (n_components={n})', f'./tests/plots/python/gmm_{n}.png')
        plot_cluster_sizes(gmm_labels, f'GMM Sizes (n_components={n})', f'./tests/plots/python/gmm_sizes_{n}.png')

    best_k = find_elbow(wcss)
    print(f"The optimal number of clusters based on the elbow method is: {best_k}")

    # Save the Elbow method graph
    plt.figure(figsize=(10,5))
    plt.plot(range(1, max_clusters+1), wcss, marker='o', linestyle='--')
    plt.title('Elbow Method')
    plt.xlabel('Number of clusters')
    plt.ylabel('WCSS')
    plt.savefig('./tests/plots/python/elbow_method.png')
    plt.clf()  # Clear the current figure for the next plot

    # DBSCAN clustering with iteration over different eps values
    for eps_value in np.linspace(0.1, 1.0, 10):
        dbscan = DBSCAN(eps=eps_value, min_samples=5)
        dbscan_labels = dbscan.fit_predict(data)
        # plot_clusters(data, dbscan_labels, f'DBSCAN Clustering (eps={eps_value:.2f})', f'./tests/plots/python/dbscan_eps_{eps_value:.2f}.png')

    # HDBSCAN clustering (Make sure to install hdbscan library)
    for min_cluster_size in range(2, 12):
        hdbscan_cluster = HDBSCAN(min_samples=5, min_cluster_size=min_cluster_size)
        hdbscan_labels = hdbscan_cluster.fit_predict(data)
        # plot_clusters(data, hdbscan_labels, f'HDBSCAN Clustering (min_cluster_size={min_cluster_size})', f'./tests/plots/python/hdbscan_min_cluster_{min_cluster_size}.png')


    # Save GMM BIC and AIC scores as plots
    x = range(2, 11)
    plt.plot(x, bic_scores, '-o', label='BIC')
    plt.plot(x, aic_scores, '-o', label='AIC')
    plt.xlabel('Number of Components')
    plt.ylabel('Scores')
    plt.title('GMM BIC and AIC scores per number of components')
    plt.legend()
    plt.savefig('./tests/plots/python/gmm_scores.png')
    plt.clf()