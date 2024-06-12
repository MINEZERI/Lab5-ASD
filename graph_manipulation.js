'use strict';
export default class GraphManipulation {
	constructor(nodesNum) {
		this.nodesNum = nodesNum;
		this.isDirected = false;
		this.adjacencyMatrix = [];
		for (let i = 0; i < this.nodesNum; i++) {
			this.adjacencyMatrix[i] = [];
		}
	}

	randm = generator => {
	randm(generator) {
		for (let i = 0; i < this.adjacencyMatrix.length; i++) {
			for (let j = 0; j < this.adjacencyMatrix.length; j++) {
				this.adjacencyMatrix[i][j] = generator() * 2;
			}
		}
	}

	mulmr = k => {
	mulmr(k) {
		for (let arr of this.adjacencyMatrix) {
			for (let j = 0; j < arr.length; j++) {
				arr[j] = arr[j] * k >= 1 ? 1 : 0;
			}
		}
	}

	undirectMatrix = () => {
	undirectMatrix() {
		for (let i = 0; i < this.adjacencyMatrix.length; i++) {
			for (let j = 0; j < this.adjacencyMatrix.length; j++) {
				if (this.adjacencyMatrix[i][j] === 1) this.adjacencyMatrix[j][i] = 1;
			}
		}
	}

	calcNodesDegrees = () => {
	calcNodesDegrees() {
		let degreesList = [];

		for (let i = 0; i < this.adjacencyMatrix.length; i++) {
			let degreesIn = 0;
			let degreesOut = 0;
			
			for (let j = 0; j < this.adjacencyMatrix.length; j++) {
				if (this.adjacencyMatrix[i][j] === 1) degreesOut++;
				if (this.adjacencyMatrix[j][i] === 1) degreesIn++;
			}
			
			degreesList.push({
				node: i + 1,
				degreesSum: degreesOut
			});
			if (this.isDirected) {
				degreesList[i].degreesOut = degreesOut;
				degreesList[i].degreesIn = degreesIn;
				degreesList[i].degreesSum += degreesIn;
			}
		}
		
		return degreesList;
	}

	isRegular = () => {
	isRegular() {
		const degreesList = this.calcNodesDegrees();

		for (let i = 1; i < degreesList.length; i++) {
			if (degreesList[i].degreesSum !== degreesList[i - 1].degreesSum) return false;
		}
		
		return degreesList.degreesSum[0];
	}

	isolatedNodes = () => {
	isolatedNodes() {
		const degreesList = this.calcNodesDegrees();
		let isolatedList = [];

		for (let i = 0; i < degreesList.length; i++) {
			if (degreesList[i].degreesSum === 0) isolatedList.push(i + 1);
		}
		
		return isolatedList;
	}

	pendantNodes = () => {
	pendantNodes() {
		const degreesList = this.calcNodesDegrees();
		let pendantList = [];

		for (let i = 0; i < degreesList.length; i++) {
			if (degreesList[i].degreesSum === 1) pendantList.push(i + 1);
		}
		
		return pendantList;
	}

	multiplyMatrix = (matrix1, matrix2) => {
	multiplyMatrix(matrix1, matrix2) {
		const rows1 = matrix1.length;
		const cols1 = matrix1[0].length;
		const rows2 = matrix2.length;
		const cols2 = matrix2[0].length;
		const multipliedMatrix = new Array(rows1);
		
		if (rows2 !== cols1) return null;
		
		for (let i = 0; i < rows1; i++) {
			multipliedMatrix[i] = new Array(cols2).fill(0);
			for (let j = 0; j < cols2; j++) {
				for (let k = 0; k < cols1; k++) {
					multipliedMatrix[i][j] += matrix1[i][k] * matrix2[k][j];
				}
			}
		}
		
		return multipliedMatrix;
	}

	matrixPow = (matrix, n) => {
	matrixPow(matrix, n) {
		let poweredMatrix = matrix.map(row => [...row]);

		for (let i = 1; i < n; i++) {
			poweredMatrix = this.multiplyMatrix(poweredMatrix, matrix);
		}
		
		return poweredMatrix;
	}

	getTransposedMatrix = (matrix) => {
	getTransposedMatrix(matrix) {
		const rows = matrix.length;
		const cols = matrix[0].length;
		const transposedMatrix = new Array(cols);
		
		for (let i = 0; i < rows; i++) {
			transposedMatrix[i] = new Array(rows).fill(0);
			for (let j = 0; j < cols; j++) {
				transposedMatrix[i][j] = matrix[j][i];
			}
		}

		return transposedMatrix;
	}
	getNextPaths = (paths) => {     // if needed A^length can check if there are paths from i to j

	getNextPaths(paths) {     // if needed A^length can check if there are paths from i to j
		const newPaths = [];

		for (let path of paths) {
			const lastNode = path[path.length - 1];
			for (let i = 0; i < this.adjacencyMatrix.length; i++) {
				if (this.adjacencyMatrix[lastNode][i] === 1) newPaths.push([...path, i])
			}
		}
		
		return newPaths;
	}

	getAllPaths = (pathLength) => {
	getAllPaths(pathLength) {
		const allPaths = [];

		for (let i = 0; i < this.adjacencyMatrix.length; i++) {
			let currentPaths = [[i]];
			for (let n = 1; n <= pathLength; n++) {
				currentPaths = this.getNextPaths(currentPaths);
			}
			allPaths.push(...currentPaths);
		}
		
		return allPaths;
	}

	getReachabilityMatrix = (maxLength) => {
	getReachabilityMatrix(maxLength) {
		length = this.adjacencyMatrix.length;

		const reachabilityMatrix = new Array(length);
		for (let i = 0; i < length; i++) {                          //starts with identity matrix for paths of length 0
			reachabilityMatrix[i] = new Array(length).fill(0);
			//reachabilityMatrix[i][i] = 1
		}
		
		for (let i = 1; i <= maxLength; i++) {
			let poweredMatrix = this.matrixPow(this.adjacencyMatrix, i);
			for (let j = 0; j < length; j++) {
				for (let k = 0; k < length; k++) {
					reachabilityMatrix[j][k] = reachabilityMatrix[j][k] || poweredMatrix[j][k] ? 1 : 0;
				}
			}
		}
		
		return reachabilityMatrix;
	}

	getMatrixOfStrongConnection = (maxLength) => {
	getMatrixOfStrongConnection(maxLength) {
		const reachabilityMatrix = this.getReachabilityMatrix(maxLength);
		const transposedReachabilityMatrix = this.getTransposedMatrix(reachabilityMatrix);

		for (let i = 0; i < reachabilityMatrix.length; i++) {
			for (let j = 0; j < reachabilityMatrix[0].length; j++) {
				reachabilityMatrix[i][j] *= transposedReachabilityMatrix[i][j];
			}
		}
		
		return reachabilityMatrix;
	}

	makeAdjList = () => {
	makeAdjList() {
		const matrix = this.adjacencyMatrix;
		const length = matrix.length;
		const adjList = [];
		for (let i = 0; i < length; i++) {
			adjList[i] = [];
		}
		for (let i = 0; i < length; i++) {
			for (let j = 0; j < length; j++) {
				if (matrix[i][j] === 1) {
					adjList[i].push(j);
				}
			}
		}
		return adjList;
	}

	isReachable = (begin, target) => {
	isReachable(begin, target) {
		const adjacencyList = this.makeAdjList();
		const visited = Array(adjacencyList.length).fill(0);
		const stack = [];
		stack.push(begin);
		
		while (stack.length) {
			const currentVertex = stack.pop();
			if (currentVertex === target) return true;
			
			if (!visited[currentVertex]) {
				visited[currentVertex] = true;
				
				for (let neighbor of adjacencyList[currentVertex]) {
					if (!visited[neighbor]) {
						stack.push(neighbor);
					}
				}
			}
		}
		
		return false;
	}

	getSCCs = () => {
	getSCCs() {
		const length = this.adjacencyMatrix.length;
		const result = [];
		const visited = new Array(length).fill(false);
		
		for (let i = 0; i < length; i++) {
			if (!visited[i]) {
				
				const scc = [];
				for (let j = 0; j < length; j++) {
					if (!visited[j] && this.isReachable(i, j) && this.isReachable(j, i)) {
						visited[j] = true;
						scc.push(j);
					}
				}
				
				result.push(scc);
			}
		}
		return result;
	}

	getCondensationMatrix = () => {
	getCondensationMatrix() {
		const sccs = this.getSCCs();
		const length = sccs.length;
		const condensationMatrix = new Array(length);
		for (let i = 0; i < length; i++) {
			condensationMatrix[i] = new Array(length).fill(0);
		}
		
		for (let i = 0; i < length; i++) {
			for (let j = 0; j < length; j++) {
				// Якщо корені обох SCCs відмінні і існує шлях між ними, встановлюємо в матриці значення 1
				if (i !== j && this.isReachable(sccs[i][0], sccs[j][0])) {
					condensationMatrix[i][j] = 1;
				}
			}
		}
		
		return condensationMatrix;
	}

	dfs = (vertex) => {
	dfs(vertex) {
		const adjacencyList = this.makeAdjList();
		const visited = new Array(adjacencyList.length).fill(false);
		const stack = [vertex];
		const result = [];
		
		while (stack.length) {
			const currentVertex = stack.pop();
			if (!visited[currentVertex]) {
				visited[currentVertex] = true;
				result.push(currentVertex);
				
				for (let neighbor of adjacencyList[currentVertex]) {
					if (!visited[neighbor]) {
						stack.push(neighbor);
					}
				}
			}
		}
		
		return result;
	}

	bfs = (vertex) => {
	bfs(vertex) {
		const adjacencyList = this.makeAdjList();
		const visited = new Array(adjacencyList.length).fill(false);
		const queue = [vertex];
		const result = [];
		
		while (queue.length) {
			const currentVertex = queue.shift();
			if (!visited[currentVertex]) {
				visited[currentVertex] = true;
				result.push(currentVertex);
				
				for (let neighbor of adjacencyList[currentVertex]) {
					if (!visited[neighbor]) {
						queue.push(neighbor);
					}
				}
			}
		}

		return result;
	}
}
