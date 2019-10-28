class Pellet extends Node {
    static size = 5;
    static list = [];
    constructor(x, y, color = "yellow") {
        super();
        this.x = x;
        this.y = y;
        this.color = color;
    }
    static init() {
        for (let i = 0; i < PacmanMaze.length; i++)
            for (let j = 0; j < PacmanMaze[i].length; j++)
                if (PacmanMaze[i][j] == 0)
                    this.list.push(new Pellet(j, i));
    }
    draw() {
        Canvas.ctx.fillStyle = this.color;
        Canvas.ctx.fillRect((this.x * Node.size) + (Node.size - Pellet.size) / 2, (this.y * Node.size) + (Node.size - Pellet.size) / 2, Pellet.size, Pellet.size);
    }
    static drawAll() {
        for (let i = 0; i < this.list.length; i++)
            this.list[i].draw();
    }
	delete() {
		let ind = -1;
		for (let i = 0; i < Pellet.list.length; i++)
			if (Pellet.list[i] == this) {
				ind = i;
				break;
			}
		if (ind != -1)
			Pellet.list.splice(ind, 1);
	}
}