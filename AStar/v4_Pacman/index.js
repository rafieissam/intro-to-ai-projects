Canvas.init("canvas", Node.size * PacmanMazeWidth, Node.size * PacmanMazeHeight);

let obstacles = [];

function initObstacles() {
    obstacles = [];
    for (let i = 0; i < PacmanMaze.length; i++)
        for (let j = 0; j < PacmanMaze[i].length; j++)
            if (PacmanMaze[i][j])
                obstacles.push(new Node(j, i, "gray"));
}

function drawObstacles() {
    Node.drawList(obstacles);
}

initObstacles();

let pac = new Pacman(Node.size, Node.size, obstacles);

Canvas.onclick(event => {
    let x = Math.floor(event.offsetX / Node.size);
    let y = Math.floor(event.offsetY / Node.size);
    let isObstacle = false;
    for (let i = 0; i < obstacles.length; i++) {
        if (obstacles[i].x == x && obstacles[i].y == y) {
            isObstacle = true;
            break;
        }
    }
    if (!isObstacle) {
        pac.goTo(new Node(x, y));
    }
})

Canvas.onkeydown(event => {
    pac.onkeydown(event);
});

function draw() {
    Canvas.draw();
    drawObstacles();
    pac.update();
    window.requestAnimationFrame(draw);
}

draw();