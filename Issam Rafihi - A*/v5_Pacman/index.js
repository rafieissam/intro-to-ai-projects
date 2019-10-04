Canvas.init("canvas", Node.size * PacmanMazeWidth, Node.size * PacmanMazeHeight);
Obstacle.init();
Pellet.init();

let pac = new Pacman(13 * Node.size, 17 * Node.size);

Canvas.onclick(event => {
    let x = Math.floor(event.offsetX / Node.size);
    let y = Math.floor(event.offsetY / Node.size);
    let isObstacle = false;
    for (let i = 0; i < Obstacle.list.length; i++) {
        if (Obstacle.list[i].x == x && Obstacle.list[i].y == y) {
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

function gameLoop() {
    pac.update();
    Sprite.drawAll();
    Pellet.drawAll();
    pac.drawPath();
    window.requestAnimationFrame(gameLoop);
}

gameLoop();