Canvas.init("canvas", Node.size * PacmanMazeWidth, Node.size * PacmanMazeHeight);
Obstacle.init();
Pellet.init();

let pac = new Pacman(13 * Node.size, 17 * Node.size);
let ghosts = [];
ghosts.push(new Ghost(1 * Node.size, 1 * Node.size, pac, "red"));
ghosts.push(new Ghost(1 * Node.size, 29 * Node.size, pac, "pink"));
ghosts.push(new Ghost(26 * Node.size, 1 * Node.size, pac, "blue"));
ghosts.push(new Ghost(26 * Node.size, 29 * Node.size, pac, "yellow"));

Canvas.onkeydown(event => {
    pac.onkeydown(event);
});

function gameLoop() {
    Canvas.update();
    Pellet.drawAll();
    for (let i = 0; i < ghosts.length; i++)
        ghosts[i].update();
    pac.update();
    window.requestAnimationFrame(gameLoop);
}

gameLoop();