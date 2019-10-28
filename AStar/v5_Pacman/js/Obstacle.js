class Obstacle extends Node {
    static list = [];
    constructor(x, y, color = "gray") {
        super();
        this.x = x;
        this.y = y;
        this.color = color;
    }
    static init() {
        for (let i = 0; i < PacmanMaze.length; i++)
            for (let j = 0; j < PacmanMaze[i].length; j++)
                if (PacmanMaze[i][j])
                    this.list.push(new Obstacle(j, i));
    }
    draw() {
        Canvas.ctx.fillStyle = this.color;
        Canvas.ctx.fillRect(this.x * super.size, this.y * super.size, super.size, super.size);
    }
    static drawAll() {
        super.drawList(this.list);
    }
}