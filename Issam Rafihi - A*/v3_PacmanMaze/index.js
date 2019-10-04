Canvas.init("canvas", Node.width * PacmanMazeWidth, Node.height * PacmanMazeHeight);

let start = null;
let goal = null;
let openNodes = [];
let closedNodes = [];
let obstacles = [];

function initObstacles() {
    obstacles = [];
    for (let i = 0; i < PacmanMaze.length; i++)
        for (let j = 0; j < PacmanMaze[i].length; j++)
            if (PacmanMaze[i][j])
                obstacles.push(new Node(j, i, "gray"));
    Node.drawList(obstacles);
}

function findPath() {
    let node = start;
    let nodeIndex = 0;
    openNodes.push(node);
    while (true) {
        let neighbours = node.getNeighbours(start, goal, obstacles);
        // Node.drawList(neighbours);
        start.draw();
        goal.draw();
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
            let parent = node.parent;
            while (parent.parent != null) {
                parent.color = "yellow";
                parent.draw();
                parent = parent.parent;
            }
            setTimeout(() => {
                Canvas.draw();
                initObstacles();
                openNodes = [];
                closedNodes = [];
                start = null;
                goal = null;
            }, 2000);
            break;
        }
    }
}

initObstacles();

Canvas.onclick(event => {
    let x = Math.floor(event.offsetX / Node.width);
    let y = Math.floor(event.offsetY / Node.height);
    let isObstacle = false;
    for (let i = 0; i < obstacles.length; i++) {
        if (obstacles[i].x == x && obstacles[i].y == y) {
            isObstacle = true;
            break;
        }
    }
    if (!start && !isObstacle) {
        start = new Node(x, y, "red");
        start.draw();
    } else if (!goal && !isObstacle && (x != start.x || y != start.y)) {
        goal = new Node(x, y, "blue");
        goal.draw();
        findPath();
    }
})