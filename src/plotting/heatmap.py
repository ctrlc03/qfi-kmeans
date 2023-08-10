import json 
import seaborn as sns 
import matplotlib.pyplot as plt

if __name__ == "__main__":
    with open("./tests/data/weights.json") as infile:
        data = json.load(infile)

    sns.heatmap(data, cmap='viridis', vmin=0)  # You can set other parameters as needed
    plt.savefig("./tests/data/heatmap.png", dpi=300, bbox_inches='tight')
    