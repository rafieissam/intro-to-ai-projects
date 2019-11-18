const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasSize = 500;
const tileSize = 20;
const obstacleChance = 8;

canvas.width = canvasSize;
canvas.height = canvasSize;
const tileCount = canvasSize / tileSize;

let start = null;
let goal = null;

let tiles = [];

function findTile(x, y) {
    for (let i = 0; i < tiles.length; i++)
        if (tiles[i].x == x && tiles[i].y == y)
            return i;
}

function isObstacle(x, y) {
    return tiles[findTile(x, y)].obstacle;
}

function isClosed(x, y) {
    return !tiles[findTile(x, y)].open;
}

function drawTile(x, y, color = "green") {
    ctx.fillStyle = color;
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
}

function drawBackground() {
    for (let i = 0; i < tiles.length; i++)
            if (tiles[i].obstacle)
                drawTile(tiles[i].x, tiles[i].y, "gray");
            else
                drawTile(tiles[i].x, tiles[i].y);
}

function initTiles() {
    for (let x = 0; x < tileCount; x++)
        for (let y = 0; y < tileCount; y++) {
            let rand = Math.random() < obstacleChance / 100;
            tiles.push({ x, y, obstacle: rand, open: true });
        }
    drawBackground();
}

function resetTiles() {
    start = null;
    goal = null;
    tiles = [];
    initTiles();
}

function getNeighbors(x, y) {
    let neighbors = [];
    if (x < tileCount - 1) {
        let xi = x + 1;
        let yi = y;
        if (!isClosed(xi, yi) && !isObstacle(xi, yi))
            neighbors.push({ x: xi, y: yi });
    }
    if (y < tileCount - 1) {
        let xi = x;
        let yi = y + 1;
        if (!isClosed(xi, yi) && !isObstacle(xi, yi))
            neighbors.push({ x: xi, y: yi });
    }
    if (x > 0) {
        let xi = x - 1;
        let yi = y;
        if (!isClosed(xi, yi) && !isObstacle(xi, yi))
            neighbors.push({ x: xi, y: yi });
    }
    if (y > 0) {
        let xi = x;
        let yi = y - 1;
        if (!isClosed(xi, yi) && !isObstacle(xi, yi))
            neighbors.push({ x: xi, y: yi });
    }
    if (x < tileCount - 1 && y < tileCount - 1) {
        let xi = x + 1;
        let yi = y + 1;
        if (!isClosed(xi, yi) && !isObstacle(xi, yi))
            neighbors.push({ x: xi, y: yi });
    }
    if (x > 0 && y > 0) {
        let xi = x - 1;
        let yi = y - 1;
        if (!isClosed(xi, yi) && !isObstacle(xi, yi))
            neighbors.push({ x: xi, y: yi });
    }
    if (x < tileCount - 1 && y > 0) {
        let xi = x + 1;
        let yi = y - 1;
        if (!isClosed(xi, yi) && !isObstacle(xi, yi))
            neighbors.push({ x: xi, y: yi });
    }
    if (x > 0 && y < tileCount - 1) {
        let xi = x - 1;
        let yi = y + 1;
        if (!isClosed(xi, yi) && !isObstacle(xi, yi))
            neighbors.push({ x: xi, y: yi });
    }
    return neighbors;
}

function drawPath(last) {
    let st = findTile(start.x, start.y);
    let tile = last.parent;
    let path = [];
    while (tile != st) {
        path.push(tile);
        tile = tiles[tile].parent;
    }
    for (let i = 0; i < path.length; i++)
        drawTile(tiles[path[i]].x, tiles[path[i]].y, "red");
}

function appendCost(curr, neighbors) {
    for (let i = 0; i < neighbors.length; i++) {
        let n = findTile(neighbors[i].x, neighbors[i].y);
        let weight = Math.round(100 * Math.sqrt(Math.pow(curr.x - tiles[n].x, 2) + Math.pow(curr.y - tiles[n].y, 2))) / 100;
        let heuristic = tiles[n].heuristic || Math.round(100 * Math.sqrt(Math.pow(goal.x - tiles[n].x, 2) + Math.pow(goal.y - tiles[n].y, 2))) / 100;
        let costSoFarOld = tiles[n].costSoFar || null;
        let costSoFar = (curr.costSoFar || 0) + weight;
        if (costSoFarOld == null || costSoFarOld > costSoFar) {
            tiles[n].weight = weight;
            tiles[n].heuristic = heuristic;
            tiles[n].costSoFar = costSoFar;
            tiles[n].parent = findTile(curr.x, curr.y);
        }
        if (n != findTile(goal.x, goal.y))
            drawTile(tiles[n].x, tiles[n].y, "orange");
    }
}

function selectNextTile() {
    let min = -1;
    let g = findTile(goal.x, goal.y);
    if (tiles[g].hasOwnProperty("heuristic"))
        return g;
    for (let i = 0; i < tiles.length; i++) {
        let t = tiles[i];
        if (min == -1 && t.hasOwnProperty("costSoFar"))
            min = i;
        else if (min != -1 && t.open && !t.obstacle && t.costSoFar + t.heuristic < tiles[min].costSoFar + tiles[min].heuristic)
            min = i;
    }
    return min;
}

function findPath() {
    let curr = tiles[findTile(start.x, start.y)];
    let neighbors = [];
    let int = setInterval(() => {
        neighbors = getNeighbors(curr.x, curr.y);
        appendCost(curr, neighbors);
        tiles[findTile(curr.x, curr.y)].open = false;
        curr = tiles[selectNextTile()];
        if (curr.x == goal.x && curr.y == goal.y) {
            clearInterval(int);
            int = null;
            drawPath(curr);
            setTimeout(resetTiles, 2000);
        }
    }, 10);
}

canvas.onclick = function(event) {
    let x = Math.floor(event.offsetX / tileSize);
    let y = Math.floor(event.offsetY / tileSize);
    if (!start && !isObstacle(x, y)) {
        start = {x, y};
        drawTile(x, y, "yellow");
    } else if (!goal && !isObstacle(x, y)) {
        goal = {x, y};
        drawTile(x, y, "blue");
        findPath();
    }
}

initTiles();