class Node {
    static size = 20;
    constructor(x, y, color = "green") {
        this.x = x;
        this.y = y;
        this.color = color;
        this.heuristic = null;
        this.costSoFar = 0;
        this.totalCost = null;
        this.parent = null;
    }
    draw() {
        Canvas.ctx.fillStyle = this.color;
        Canvas.ctx.fillRect(this.x * Node.size, this.y * Node.size, Node.size, Node.size);
    }
    static drawList(nodes) {
        for (let i = 0; i < nodes.length; i++)
            nodes[i].draw();
    }
    getDistance(node) {
        return Math.round(100 * Math.sqrt(Math.pow(this.x - node.x, 2) + Math.pow(this.y - node.y, 2))) / 100;
    }
    getNeighbours(goal, excludedNodes = []) {
        let neighbours = []
        let left = this.x <= 0;
        let right = this.x >= Math.floor(Canvas.width / Node.size) - 1;
        let top = this.y <= 0;
        let bottom = this.y >= Math.floor(Canvas.height / Node.size) - 1;
        if (!left)
            neighbours.push(new Node(this.x - 1, this.y))
        if (!right)
            neighbours.push(new Node(this.x + 1, this.y))
        if (!top)
            neighbours.push(new Node(this.x, this.y - 1))
        if (!bottom)
            neighbours.push(new Node(this.x, this.y + 1))
        if (right)
            neighbours.push(new Node(0, this.y))
        if (left)
            neighbours.push(new Node(Canvas.width / Node.size - 1, this.y))
        let filteredNeighbours = [];
        for (let i = 0; i < neighbours.length; i++) {
            let n = neighbours[i];
            let excluded = false;
            for (let j = 0; j < excludedNodes.length; j++) {
                let e = excludedNodes[j];
                if (e.x == n.x && e.y == n.y) {
                    excluded = true;
                    break;
                }
            }
            if (excluded)
                continue;
            n.parent = this;
            n.color = "orange";
            let a, b, c;
            a = n.getDistance(goal);
            b = n.getDistance(new Node(goal.x + (Canvas.width / Node.size), goal.y));
            c = n.getDistance(new Node(goal.x - (Canvas.width / Node.size), goal.y));
            n.heuristic = n.heuristic || Math.min(a, Math.min(b, c));
            a = n.getDistance(this);
            b = n.getDistance(new Node(this.x + (Canvas.width / Node.size), this.y));
            c = n.getDistance(new Node(this.x - (Canvas.width / Node.size), this.y));
            n.costSoFar = this.costSoFar + Math.min(a, Math.min(b, c));
            n.totalCost = n.heuristic + n.costSoFar;
            filteredNeighbours.push(n);
        }
        return filteredNeighbours;
    }
    static findPath(start, goal, obstacles = []) {
        let openNodes = [];
        let closedNodes = [];
        let node = start;
        let nodeIndex = 0;
        openNodes.push(node);
        while (true) {
            let neighbours = node.getNeighbours(goal, obstacles);
            closedNodes.push(openNodes.splice(nodeIndex, 1)[0]);
            for (let i = 0; i < neighbours.length; i++) {
                let n = neighbours[i];
                let unique = true;
                for (let j = 0; j < openNodes.length; j++) {
                    let o = openNodes[j];
                    if (n.x == o.x && n.y == o.y) {
                        if (n.totalCost < o.totalCost) {
                            openNodes[j] = n;
                        } else {
                            unique = false;
                        }
                    }
                }
                if (unique)
                    openNodes.push(n);
            }
            let min = 0;
            for (let i = 1; i < openNodes.length; i++)
                if (openNodes[i].totalCost < openNodes[min].totalCost)
                    min = i;
            nodeIndex = min;
            node = openNodes[nodeIndex];
            if (node.heuristic == 0) {
                let path = [];
                while (node.parent != null) {
                    path.push(node);
                    node = node.parent;
                }
                return path.reverse();
            }
        }
    }
}