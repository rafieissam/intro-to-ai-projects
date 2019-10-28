Canvas.init("canvas", Node.size * PacmanMazeWidth, Node.size * PacmanMazeHeight);
Obstacle.init();
Pellet.init();

let pac = new Pacman(13 * Node.size, 17 * Node.size);
let ghosts = [];
ghosts.push(new Ghost(12 * Node.size, 14 * Node.size, pac, "red"));
ghosts.push(new Ghost(13 * Node.size, 14 * Node.size, pac, "pink"));
ghosts.push(new Ghost(14 * Node.size, 14 * Node.size, pac, "blue"));
ghosts.push(new Ghost(15 * Node.size, 14 * Node.size, pac, "orange"));

Canvas.onkeydown(event => {
    pac.onkeydown(event);
});

const dontPlayIntro = false;

let c = 0;
function gameLoop() {
    if (pac.won || pac.dead)
        return;
    Canvas.update();
    Pellet.drawAll();
    for (let i = 0; i < ghosts.length; i++)
        ghosts[i].update();
    pac.update();
    if (c < 2 || c == 3) {
        if (c < 2)
            c++;
        window.requestAnimationFrame(gameLoop);
    } else if (c == 2) {
        c++;
        if (dontPlayIntro) {
            window.requestAnimationFrame(gameLoop);
            return;
        }
        pac.eatSound.pause();
        let audio = new Audio("./assets/beginning.wav");
        setTimeout(() => {
            pac.eatSound.pause();
            audio.play();
        }, 100);
        audio.onended = () => {
            window.requestAnimationFrame(gameLoop);
            for (let i = 0; i < ghosts.length; i++) {
                setTimeout(() => {
                    ghosts[i].spawn();
                }, i * 5000);
            }
        }
    }
}

Canvas.ctx.fillStyle = "#000";
Canvas.ctx.font = "30px Arial";
Canvas.ctx.fillText("Click To Begin", (Canvas.width - 185) / 2, Canvas.height / 2);

let started = false;
Canvas.canvas.onclick = () => {
    if (!started) {
        started = true;
        gameLoop();
    }
}