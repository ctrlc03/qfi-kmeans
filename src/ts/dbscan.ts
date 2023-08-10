/**
 * An implementation of the DBSCAN clustering algorithm
 */
export class DBSCAN {
    private dataset: number[][]
    private eps: number
    private minPts: number
    private visited: boolean[]
    private clusters: number[][]
    private noise: number[]

    constructor(dataset: number[][], eps: number, minPts: number) {
        this.dataset = dataset
        this.eps = eps
        this.minPts = minPts
        this.visited = Array(dataset.length).fill(false)
        this.clusters = []
        this.noise = []

        this.fit()
    }

    private euclideanDistance(pointA: number[], pointB: number[]): number {
        return Math.sqrt(pointA.reduce((sum, _, idx) => sum + (pointA[idx] - pointB[idx]) ** 2, 0))
    }

    private regionQuery(pointIdx: number): number[] {
        const neighbors = []
        for (let i = 0; i < this.dataset.length; i++) {
            if (this.euclideanDistance(this.dataset[pointIdx], this.dataset[i]) < this.eps) {
                neighbors.push(i)
            }
        }
        return neighbors
    }

    private expandCluster(pointIdx: number, neighbors: number[], clusterIdx: number): void {
        this.clusters[clusterIdx].push(pointIdx)
        let i = 0
        while (i < neighbors.length) {
            const currentNeighbor = neighbors[i]
            if (!this.visited[currentNeighbor]) {
                this.visited[currentNeighbor] = true
                const currentNeighborNeighbors = this.regionQuery(currentNeighbor)
                if (currentNeighborNeighbors.length >= this.minPts) {
                    neighbors = neighbors.concat(currentNeighborNeighbors)
                }
            }

            if (!this.clusters.some(cluster => cluster.includes(currentNeighbor))) {
                this.clusters[clusterIdx].push(currentNeighbor)
            }
            i++
        }
    }

    public fit(): void {
        this.dataset.forEach((_, idx) => {
            if (!this.visited[idx]) {
                this.visited[idx] = true
                const neighbors = this.regionQuery(idx)
                if (neighbors.length < this.minPts) {
                    this.noise.push(idx)
                } else {
                    this.clusters.push([])
                    const clusterIdx = this.clusters.length - 1
                    this.expandCluster(idx, neighbors, clusterIdx)
                }
            }
        })
    }

    private intraClusterDistance(pointIdx: number, clusterIdx: number): number {
        if (clusterIdx === -1) return Infinity
        const point = this.dataset[pointIdx]
        const cluster = this.clusters[clusterIdx]

        const distances = cluster.map(idx => this.euclideanDistance(point, this.dataset[idx]))
        return distances.reduce((acc, curr) => acc + curr, 0) / cluster.length
    }

    private nearestClusterDistance(pointIdx: number): number {
        const point = this.dataset[pointIdx]
        const minDistances = this.clusters.map((_, idx) => 
            Math.min(...this.clusters[idx].map(i => this.euclideanDistance(point, this.dataset[i])))
        )
        return Math.min(...minDistances.filter((_, idx) => !this.clusters[idx].includes(pointIdx)))
    }

    public silhouetteScore(): number {
        const scores = this.dataset.map((_, idx) => {
            const a = this.intraClusterDistance(idx, this.clusters.findIndex(cluster => cluster.includes(idx)))
            const b = this.nearestClusterDistance(idx)
            return (b - a) / Math.max(a, b)
        })
        return scores.reduce((acc, curr) => acc + curr, 0) / this.dataset.length
    }

    public dunnIndex(): number {
        const intraClusterDiameters = this.clusters.map(cluster => 
            Math.max(...cluster.map(i => 
                Math.max(...cluster.map(j => 
                    this.euclideanDistance(this.dataset[i], this.dataset[j])
                ))
            ))
        )

        let minInterClusterDistance = Infinity
        for (let i = 0; i < this.clusters.length; i++) {
            for (let j = i + 1; j < this.clusters.length; j++) {
                const distance = Math.min(...this.clusters[i].map(a => 
                    Math.min(...this.clusters[j].map(b => 
                        this.euclideanDistance(this.dataset[a], this.dataset[b])
                    ))
                ))
                if (distance < minInterClusterDistance) {
                    minInterClusterDistance = distance
                }
            }
        }

        return minInterClusterDistance / Math.max(...intraClusterDiameters)
    }

    public daviesBouldinIndex(): number {
        const centroids = this.clusters.map(cluster => {
            const sum = Array(this.dataset[0].length).fill(0)
            cluster.forEach(idx => {
                this.dataset[idx].forEach((val, j) => {
                    sum[j] += val
                })
            })
            return sum.map(val => val / cluster.length)
        })

        const s = this.clusters.map((cluster, i) => 
            cluster.reduce((acc, idx) => acc + this.euclideanDistance(this.dataset[idx], centroids[i]), 0) / cluster.length
        )

        let maxRatios = []
        for (let i = 0; i < this.clusters.length; i++) {
            let maxR = 0
            for (let j = 0; j < this.clusters.length; j++) {
                if (i !== j) {
                    const R = (s[i] + s[j]) / this.euclideanDistance(centroids[i], centroids[j])
                    if (R > maxR) {
                        maxR = R
                    }
                }
            }
            maxRatios.push(maxR)
        }

        return maxRatios.reduce((acc, curr) => acc + curr, 0) / this.clusters.length
    }

    public getClusters(): number[][] {
        return this.clusters
    }

    public getNoise(): number[] {
        return this.noise
    }
}

// Example usage:
// const dataset = [[1, 2], [2, 2], [2, 3], [8, 8], [8, 9], [25, 80]]
// const dbscan = new DBSCAN(dataset, 1, 2)
// dbscan.fit()
// console.log(dbscan.getClusters()) // Ex: [[0, 1, 2], [3, 4]]
// console.log(dbscan.getNoise())    // Ex: [5]
