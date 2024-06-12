'use strict';
export default class GraphDrawing {
	
	constructor(canvas, graph, nodeRadius) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d')
		this.graph = graph;
		this.nodeRadius = nodeRadius;
		this.nodesList = [];
	}
	
	drawNode = (x, y, text = '') => {
		this.ctx.textAlign = 'center';
		this.ctx.textBaseline = 'middle';
		this.ctx.font = '20px Arial';
		
		this.ctx.beginPath();
		this.ctx.arc(x, y, this.nodeRadius, 0, 2 * Math.PI, false)
		this.ctx.fillText(text, x, y);
		this.ctx.stroke();
		this.ctx.closePath();
		this.nodesList.push({x: x, y: y});
	}
	
	drawFigure = (nodesNum) => {
		const length = Math.round((nodesNum + 1) / 4);
		const distance = this.canvas.height / (length + 1);
		const path = distance * length;
		let modDistance = distance;
		if (length !== 1) modDistance = path / (length - 1);
		let startLength = distance * length / 2;
		let currentX = this.canvas.width / 2 + startLength;
		let currentY = this.canvas.height / 2 - startLength;
		let coefficient = 1;
		let num = 1;
		let biggerSidesNum = (nodesNum - 1) % 4;	//отримаємо кількість сторін більших за інші
		let index;
		let tempDistance;
		for (let i = 0; i < 4; i++) {
			if (biggerSidesNum > 0) {
				tempDistance = distance * coefficient;
				index = length;
			} else {
				tempDistance = modDistance * coefficient;
				index = length - 1;
			}
			for (let j = 0; j < index; j++) {
				this.drawNode(currentX, currentY, num);
				i % 2 === 0 ? currentX -= tempDistance : currentY += tempDistance;
				num++;
			}
			biggerSidesNum--;
			if (i % 2 === 1) coefficient *= -1;
		}
		this.drawNode(this.canvas.width / 2, this.canvas.height / 2, num);
	}
	
	drawArrow = (x, y, angle, length) => {
		this.ctx.moveTo(x, y);
		const angle1 = angle - Math.PI / 4;
		const angle2 = angle + Math.PI / 4;
		this.ctx.lineTo(x - Math.cos(angle1) * length, y - Math.sin(angle1) * length);
		this.ctx.moveTo(x, y);
		this.ctx.lineTo(x - Math.cos(angle2) * length, y - Math.sin(angle2) * length);
	}
	
	isCordBetween(cord1, cord2, check) {
		const minCord = Math.min(cord1, cord2);
		const maxCord = Math.max(cord1, cord2);
		return minCord <= check && check <= maxCord;
	}
	
	isNodeBetween(point1, point2, checkPoint) {
		if (this.isCordBetween(point1.x, point2.x, checkPoint.x)) {
			if (this.isCordBetween(point1.y, point2.y, checkPoint.y)) {
				const vector1 = {x: checkPoint.x - point1.x, y: checkPoint.y - point1.y};
				const vector2 = {x: point2.x - checkPoint.x, y: point2.y - checkPoint.y};
				return vector1.x / vector1.y === vector2.x / vector2.y;
			}
		}
		return false;
	}
	
	drawLine = (startNode, endNode, i, j) => {
		const vectorX = endNode.x - startNode.x;
		const vectorY = endNode.y - startNode.y;
		const angle = Math.atan2(vectorY, vectorX);
		const radiusOffsetX = Math.cos(angle) * this.nodeRadius;
		const radiusOffsetY = Math.sin(angle) * this.nodeRadius;
		let startX = startNode.x + radiusOffsetX;
		let startY = startNode.y + radiusOffsetY;
		let endX = endNode.x - radiusOffsetX;
		let endY = endNode.y - radiusOffsetY;
		const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
		const middleX = (startX + endX) / 2;
		const middleY = (startY + endY) / 2;
		const sideLength = length / 4;
		const offsetAngle = angle + Math.PI / 2;
		const offsetX = sideLength * Math.cos(offsetAngle);
		const offsetY = sideLength * Math.sin(offsetAngle);
		const intermediateX = middleX + offsetX;
		const intermediateY = middleY + offsetY;
		
		let isNodeBetween = false;
		let hasTwoEdges = false;
		if (this.graph.isDirected) hasTwoEdges = this.graph.adjacencyMatrix[i][j] === this.graph.adjacencyMatrix[j][i];
		for (let i = 0; i < this.nodesList.length; i++) {
			isNodeBetween = this.isNodeBetween(startNode, endNode, this.nodesList[i]);
			if (isNodeBetween) break;
		}
		
		const halfRadius = this.nodeRadius / 2;
		this.ctx.beginPath();
		if (!isNodeBetween && !hasTwoEdges) {
			this.ctx.moveTo(startX, startY);
			this.ctx.lineTo(endX, endY);
			if (this.graph.isDirected) this.drawArrow(endX, endY, angle, halfRadius);
		} else if (isNodeBetween) {
			this.ctx.moveTo(startX, startY);
			this.ctx.arcTo(intermediateX, intermediateY, endX, endY, length);
			this.ctx.lineTo(endX, endY);
			if (this.graph.isDirected) this.drawArrow(endX, endY, angle - Math.PI / 6, halfRadius);
		} else {
			const startEdgeAngle = angle + Math.PI / 16;
			const endEdgeAngle = angle - Math.PI / 16;
			startX = startNode.x + Math.cos(startEdgeAngle) * this.nodeRadius;
			startY = startNode.y + Math.sin(startEdgeAngle) * this.nodeRadius;
			endX = endNode.x - Math.cos(endEdgeAngle) * this.nodeRadius;
			endY = endNode.y - Math.sin(endEdgeAngle) * this.nodeRadius;
			this.ctx.moveTo(startX, startY);
			this.ctx.lineTo(endX, endY);
			if (this.graph.isDirected) this.drawArrow(endX, endY, angle, halfRadius);
		}
		this.ctx.stroke();
		this.ctx.closePath();
	}
	
	drawLineBack = (node) => {
		const vectorX = node.x - window.innerWidth / 2;
		const vectorY = node.y - window.innerHeight / 2;
		const angle = Math.atan2(vectorY, vectorX);
		const counterclockwise = false;
		const startX = node.x + Math.cos(angle) * this.nodeRadius;
		const startY = node.y + Math.sin(angle) * this.nodeRadius;
		let arrowX;
		let arrowY;
		const angleOffset = angle - Math.PI / 6;
		if (counterclockwise) {
			arrowX = node.x + Math.cos(angleOffset) * this.nodeRadius;
			arrowY = node.y + Math.sin(angleOffset) * this.nodeRadius;
		} else {
			arrowX = node.x + Math.cos(angleOffset) * this.nodeRadius;
			arrowY = node.y + Math.sin(angleOffset) * this.nodeRadius;
		}
		
		const arcOffset = Math.PI * 9 / 16;
		this.ctx.beginPath();
		this.ctx.arc(startX, startY, this.nodeRadius / 2, angle - arcOffset, angle + arcOffset, counterclockwise);
		if (this.graph.isDirected) this.drawArrow(arrowX, arrowY, angle + Math.PI, this.nodeRadius / 2);
		this.ctx.stroke();
		this.ctx.closePath();
	}
	
	decisionLine = (i, j) => {
		if (i === j) this.drawLineBack(this.nodesList[i]);
		else this.drawLine(this.nodesList[i], this.nodesList[j], i, j);
	}
	
	drawGraph = (nodesNum) => {
		this.drawFigure(nodesNum);
		for (let i = 0; i < nodesNum; i++) {
			let index = this.graph.isDirected ? nodesNum : i;
			for (let j = 0; j <= index; j++) {
				if (this.graph.adjacencyMatrix[i][j] === 1) {
					this.decisionLine(i, j);
				}
			}
		}
	}
	
	drawStep = (node1, node2) => {
		const x1 = this.nodesList[node1].x;
		const y1 = this.nodesList[node1].y;
		const x2 = this.nodesList[node2].x;
		const y2 = this.nodesList[node2].y;
		this.drawNode(x1, y1);
		this.drawNode(x2, y2);
		this.drawLine(this.nodesList[node1], this.nodesList[node2], node1, node2);
	}
}
