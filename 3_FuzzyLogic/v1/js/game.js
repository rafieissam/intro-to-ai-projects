class Canvas {
    static init(id, width, height, color = "black") {
        Canvas.canvas = document.getElementById(id);
        Canvas.ctx = Canvas.canvas.getContext("2d");
        Canvas.width = width;
        Canvas.height = height;
        Canvas.color = color;
        Canvas.canvas.width = Canvas.width;
        Canvas.canvas.height = Canvas.height;
        Canvas.draw();
    }
    static update() {
        Canvas.sprite.update();
        Canvas.sprite.draw();
    }
    static draw() {
        Canvas.sprite = new Sprite({
            image: "./assets/sprites.png",
            x: 0,
            y: 0,
            ticksPerFrame: 0,
            frames: [
                {
                    x: 680 / 3,
                    y: 0,
                    width: 680 / 3,
                    height: 248,
                    scaledWidth: Canvas.width,
                    scaledHeight: Canvas.height
                }
            ]
        });
    }
    static onclick(fnctn) {
        Canvas.canvas.onclick = fnctn;
    }
    static onkeydown(fnctn) {
        let lastDownTarget;
        window.onload = () => {
            document.onmousedown = event => {
                lastDownTarget = event.target
            };
            document.onkeydown = event => {
                fnctn(event);
            };
        };
    }
}

class Node {
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
Node.size = 20;

const PacmanMazeWidth = 28;
const PacmanMazeHeight = 31;
const PacmanMaze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

class Obstacle extends Node {
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
Obstacle.list = [];

class Pellet extends Node {
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
Pellet.size = 5;
Pellet.list = [];

class Sprite {
	constructor(options) {
		this.frames = options.frames || [];
		this.x = options.x || 0;
		this.y = options.y || 0;
		this.pauseIndex = options.pauseIndex || 0;
		this.ticksPerFrame = options.ticksPerFrame || 0;
		
		this.imageSrc = options.image;
		this.image = new Image();
		this.image.src = this.imageSrc;
		let self = this;
		this.image.onload = function() {
			self.fullWidth = self.image.width;	
			self.fullHeight = self.image.height;
		}

		this.frameIndex = 0;
		this.tickCount = 0;
		this.pause = false;
		
		Sprite.all.push(this);
	}
	update() {
		if (this.pause && this.frameIndex == this.pauseIndex)
			return;
		this.tickCount++;
		if (this.tickCount > this.ticksPerFrame) {
			this.tickCount = 0;
			if (this.frameIndex < this.frames.length - 1) {
				this.frameIndex++;
			} else {
				this.frameIndex = 0;
			}
		}
	}
	draw() {
		let frame = this.frames[this.frameIndex];
		Canvas.ctx.drawImage(
			this.image,
			frame.x,
			frame.y,
			frame.width,
			frame.height,
			this.x,
			this.y,
			frame.scaledWidth,
			frame.scaledHeight
		);
	}
	stop() {
		this.pause = true;
	}
	resume() {
		this.pause = false;
	}
	delete() {
		let ind = -1;
		for (let i = 0; i < Sprite.all.length; i++)
			if (Sprite.all[i] == this) {
				ind = i;
				break;
			}
		if (ind != -1)
			Sprite.all.splice(ind, 1);
	}
	static drawAll() {
		for (var i in Sprite.all) {
			Sprite.all[i].update();
			Sprite.all[i].draw();
		}
	}
}
Sprite.all = [];

let ghostBhvrs = {
    red: null,
    pink: null,
    blue: null,
    orange: null,
};
function updateBhvrs() {
    for (let i in ghostBhvrs)
        document.getElementById(`${i}Bhvr`).innerHTML = ": " + ghostBhvrs[i];
}
function cAlert(msg) {
    document.getElementById("alert").innerHTML = msg;
}
function showRefresh() {
    document.getElementById("refreshBtn").style.display = "inline-block";
}

class Pacman {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.obstacles = Obstacle.list;
        this.pellets = Pellet.list;
        this.size = Node.size;
        this.direction = 39;
        this.nextDirection = null;
        this.stepsPerNode = 10;
        this.dieSound = new Audio("./assets/pac_death.wav");
        this.eatSound = new Audio("./assets/chomp.wav");
        this.eatSound.loop = true;
        this.chewCountDown = 10;
    }
    draw() {
        if (this.deathSprite) {
            if (this.deathSprite.frameIndex != 10) {
                this.deathSprite.update();
                this.deathSprite.draw();
            } else {
                this.dead = true;
            }
            return;
        }
        if (this.sprite) {
            this.sprite.x = this.x;
            this.sprite.y = this.y;
            this.sprite.frames = this.spriteFrames[this.direction];
        } else {
            this.spriteFrames = {
                37: [
                    {
                        x: 2 * 680 / 3 + 18,
                        y: 16,
                        width: 15,
                        height: 15,
                        scaledWidth: this.size,
                        scaledHeight: this.size
                    },
                    {
                        x: 2 * 680 / 3 + 2,
                        y: 16,
                        width: 15,
                        height: 15,
                        scaledWidth: this.size,
                        scaledHeight: this.size
                    },
                    {
                        x: 2 * 680 / 3 + 34,
                        y: 0,
                        width: 15,
                        height: 15,
                        scaledWidth: this.size,
                        scaledHeight: this.size
                    }
                ],
                38: [
                    {
                        x: 2 * 680 / 3 + 18,
                        y: 32,
                        width: 15,
                        height: 15,
                        scaledWidth: this.size,
                        scaledHeight: this.size
                    },
                    {
                        x: 2 * 680 / 3 + 2,
                        y: 32,
                        width: 15,
                        height: 15,
                        scaledWidth: this.size,
                        scaledHeight: this.size
                    },
                    {
                        x: 2 * 680 / 3 + 34,
                        y: 0,
                        width: 15,
                        height: 15,
                        scaledWidth: this.size,
                        scaledHeight: this.size
                    }
                ],
                39: [
                    {
                        x: 2 * 680 / 3 + 18,
                        y: 0,
                        width: 15,
                        height: 15,
                        scaledWidth: this.size,
                        scaledHeight: this.size
                    },
                    {
                        x: 2 * 680 / 3 + 2,
                        y: 0,
                        width: 15,
                        height: 15,
                        scaledWidth: this.size,
                        scaledHeight: this.size
                    },
                    {
                        x: 2 * 680 / 3 + 34,
                        y: 0,
                        width: 15,
                        height: 15,
                        scaledWidth: this.size,
                        scaledHeight: this.size
                    }
                ],
                40: [
                    {
                        x: 2 * 680 / 3 + 18,
                        y: 48,
                        width: 15,
                        height: 15,
                        scaledWidth: this.size,
                        scaledHeight: this.size
                    },
                    {
                        x: 2 * 680 / 3 + 2,
                        y: 48,
                        width: 15,
                        height: 15,
                        scaledWidth: this.size,
                        scaledHeight: this.size
                    },
                    {
                        x: 2 * 680 / 3 + 34,
                        y: 0,
                        width: 15,
                        height: 15,
                        scaledWidth: this.size,
                        scaledHeight: this.size
                    }
                ]
            };
            this.sprite = new Sprite({
                image: "./assets/sprites.png",
                x: this.x,
                y: this.y,
                ticksPerFrame: 3,
                frames: this.spriteFrames[this.direction],
                pauseIndex: 1
            });
        }
        this.sprite.update();
        this.sprite.draw();
    }
    update() {
        if (this.dying) {
            this.draw();
            return;
        }
        if (this.chewCountDown)
            this.chewCountDown--;
        if (this.nextDirection != null)
            this.changeDirection(this.nextDirection);
        this.move();
        this.eat();
        this.win();
        this.draw();
    }
    win() {
        if (!this.pellets.length && !this.chewCountDown) {
            this.won = true;
            cAlert("You Won!");
            showRefresh();
        }
    }
    die() {
        if (this.dying)
            return;
        this.dying = true;
        let frames = [
            {
                x: 2 * 680 / 3 + 34,
                y: 0,
                width: 15,
                height: 15,
                scaledWidth: this.size,
                scaledHeight: this.size
            }
        ];
        for (let i = 0; i < 10; i++) {
            let f = frames[i];
            frames.push({
                x: f.x + 16,
                y: i == 10 ? 20 : 0,
                width: 15,
                height: 15,
                scaledWidth: this.size,
                scaledHeight: this.size
            });
        }
        this.ffff = frames;
        this.deathSprite = new Sprite({
            image: "./assets/sprites.png",
            x: this.x,
            y: this.y,
            ticksPerFrame: 3,
            frames
        });
        setTimeout(() => {
            this.eatSound.pause();
            this.dieSound.play();
        }, 10);
        cAlert("You Lost :(");
        showRefresh();
    }
    eat() {
        for (let i = 0; i < this.pellets.length; i++) {
            let pellet = this.pellets[i];
            let ax = this.x + this.size / 2;
            let ay = this.y + this.size / 2;
            let ex = (pellet.x + 1 / 2) * Node.size;
            let ey = (pellet.y + 1 / 2) * Node.size;
            let d = Math.sqrt(Math.pow(ax - ex, 2) + Math.pow(ay - ey, 2));
            if (d < 5) {
                this.pellets[i].delete();
                pacmanAte();
                setTimeout(() => {
                    this.eatSound.play();
                }, 10);
                this.chewCountDown = 10;
                return;
            }
        }
        if (!this.chewCountDown)
            this.eatSound.pause();
    }
    move() {
        let newX = this.x;
        let newY = this.y;
        let stepSize = Node.size / this.stepsPerNode;
        switch (this.direction) {
            case 37:
                newX = this.x - stepSize;
                if (newX <  0)
                    newX = Canvas.width - this.size;
                break;
            case 38:
                newY = this.y - stepSize;
                if (newY < 0)
                    newY = Canvas.height - this.size;
                break;
            case 39:
                newX = this.x + stepSize;
                if (newX + this.size > Canvas.width)
                    newX = 0;
                break;
            case 40:
                newY = this.y + stepSize;
                if (newY + this.size > Canvas.height)
                    newY = 0;
                break;
        }
        if (!this.inObstacle(newX, newY)) {
            this.x = newX;
            this.y = newY;
            if (this.sprite)
                this.sprite.resume();
        } else {
            if (this.sprite)
                this.sprite.stop();
        }
    }
    pointInObstacle(x, y, obstacle) {
        let inX, inY;
        x /= Node.size;
        y /= Node.size;
        inX = obstacle.x <= x && x < obstacle.x + 1;
        inY = obstacle.y <= y && y < obstacle.y + 1;
        return inX && inY;
    }
    inObstacle(x, y) {
        for (let i = 0; i < this.obstacles.length; i++) {
            if (this.pointInObstacle(x, y, this.obstacles[i]))
                return true;
            if (this.pointInObstacle(x + this.size - 1, y, this.obstacles[i]))
                return true;
            if (this.pointInObstacle(x, y + this.size - 1, this.obstacles[i]))
                return true;
            if (this.pointInObstacle(x + this.size - 1, y + this.size - 1, this.obstacles[i]))
                return true;
        }
        return false;
    }
    changeDirection(newD) {
        let o = false;
        switch (newD) {
            case 37:
                o = this.inObstacle(this.x - 1, this.y);
                break;
            case 38:
                o = this.inObstacle(this.x, this.y - 1);
                break;
            case 39:
                o = this.inObstacle(this.x + 1, this.y);
                break;
            case 40:
                o = this.inObstacle(this.x, this.y + 1);
                break;
        }
        if (o) {
            this.nextDirection = newD;
        } else {
            this.direction = newD;
            this.nextDirection = null;
        }
    }
    onkeydown(event) {
        let options = [37, 38, 39, 40];
        if (options.indexOf(event.which) != -1)
            this.changeDirection(event.which);
    }
}

class Ghost {
    constructor(x, y, pacman, color = "red") {
        this.x = x;
        this.y = y;
        this.initObstacles();
        this.size = Node.size;
        this.direction = 38;
        this.nextDirection = null;
        this.path = [];
        this.stepsPerNode = 16;
        this.pacman = pacman;
        this.color = color;
        this.inSpawn = true;
        if (!Ghost.dests.length)
            this.initDestinations();
    }
    static inSpawnArea(node) {
        return (node.y == 12 && (node.x == 13 || node.x == 14)) || (node.x < 17 && node.x > 10 && node.y < 16 && node.y > 12);
    }
    initObstacles() {
        let obs = Obstacle.list;
        let newObs = [];
        for (let i = 0; i < obs.length; i++)
            if (!Ghost.inSpawnArea(obs[i]))
                newObs.push(obs[i]);
        this.obstacles = newObs;
    }
    drawPath() {
        if (this.path.length) {
            for (let i = 0; i < this.path.length; i++) {
                let n = this.path[i];
                let s = 5;
                let nx = n.x * Node.size - (s - Node.size) / 2;
                let ny = n.y * Node.size - (s - Node.size) / 2;
                Canvas.ctx.fillStyle = this.color;
                Canvas.ctx.fillRect(nx, ny, s, s);
            }
        }
    }
    draw() {
        if (this.sprite) {
            this.sprite.x = this.x;
            this.sprite.y = this.y;
            this.sprite.frames = this.spriteFrames[this.direction];
        } else {
            this.spriteFrames = {
                red: {
                    37: [
                        {
                            x: 2 * 680 / 3 + 34,
                            y: 64,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        },
                        {
                            x: 2 * 680 / 3 + 50,
                            y: 64,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        }
                    ],
                    38: [
                        {
                            x: 2 * 680 / 3 + 66,
                            y: 64,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        },
                        {
                            x: 2 * 680 / 3 + 82,
                            y: 64,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        }
                    ],
                    39: [
                        {
                            x: 2 * 680 / 3 + 2,
                            y: 64,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        },
                        {
                            x: 2 * 680 / 3 + 18,
                            y: 64,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        }
                    ],
                    40: [
                        {
                            x: 2 * 680 / 3 + 98,
                            y: 64,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        },
                        {
                            x: 2 * 680 / 3 + 114,
                            y: 64,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        }
                    ]
                },
                pink: {
                    37: [
                        {
                            x: 2 * 680 / 3 + 34,
                            y: 80,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        },
                        {
                            x: 2 * 680 / 3 + 50,
                            y: 80,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        }
                    ],
                    38: [
                        {
                            x: 2 * 680 / 3 + 66,
                            y: 80,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        },
                        {
                            x: 2 * 680 / 3 + 82,
                            y: 80,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        }
                    ],
                    39: [
                        {
                            x: 2 * 680 / 3 + 2,
                            y: 80,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        },
                        {
                            x: 2 * 680 / 3 + 18,
                            y: 80,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        }
                    ],
                    40: [
                        {
                            x: 2 * 680 / 3 + 98,
                            y: 80,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        },
                        {
                            x: 2 * 680 / 3 + 114,
                            y: 80,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        }
                    ]
                },
                blue: {
                    37: [
                        {
                            x: 2 * 680 / 3 + 34,
                            y: 96,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        },
                        {
                            x: 2 * 680 / 3 + 50,
                            y: 96,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        }
                    ],
                    38: [
                        {
                            x: 2 * 680 / 3 + 66,
                            y: 96,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        },
                        {
                            x: 2 * 680 / 3 + 82,
                            y: 96,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        }
                    ],
                    39: [
                        {
                            x: 2 * 680 / 3 + 2,
                            y: 96,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        },
                        {
                            x: 2 * 680 / 3 + 18,
                            y: 96,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        }
                    ],
                    40: [
                        {
                            x: 2 * 680 / 3 + 98,
                            y: 96,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        },
                        {
                            x: 2 * 680 / 3 + 114,
                            y: 96,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        }
                    ]
                },
                orange: {
                    37: [
                        {
                            x: 2 * 680 / 3 + 34,
                            y: 112,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        },
                        {
                            x: 2 * 680 / 3 + 50,
                            y: 112,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        }
                    ],
                    38: [
                        {
                            x: 2 * 680 / 3 + 66,
                            y: 112,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        },
                        {
                            x: 2 * 680 / 3 + 82,
                            y: 112,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        }
                    ],
                    39: [
                        {
                            x: 2 * 680 / 3 + 2,
                            y: 112,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        },
                        {
                            x: 2 * 680 / 3 + 18,
                            y: 112,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        }
                    ],
                    40: [
                        {
                            x: 2 * 680 / 3 + 98,
                            y: 112,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        },
                        {
                            x: 2 * 680 / 3 + 114,
                            y: 112,
                            width: 15,
                            height: 15,
                            scaledWidth: this.size,
                            scaledHeight: this.size
                        }
                    ]
                }
            };
            this.spriteFrames = this.spriteFrames[this.color];
            this.sprite = new Sprite({
                image: "./assets/sprites.png",
                x: this.x,
                y: this.y,
                ticksPerFrame: 3,
                frames: this.spriteFrames[this.direction],
                pauseIndex: 1
            });
        }
        this.sprite.update();
        this.sprite.draw();
    }
    goToPacman() {
        let goal = new Node(Math.floor(this.pacman.x / Node.size), Math.floor(this.pacman.y / Node.size));
        this.goTo(goal);
    }
    initDestinations() {
        Ghost.dests = [];
        for (let i = 0; i < PacmanMaze.length; i++)
            for (let j = 0; j < PacmanMaze[i].length; j++)
                if (!PacmanMaze[i][j])
                    Ghost.dests.push(new Node(j, i));
    }
    goToRandom() {
        let goal = Ghost.dests[Math.floor(Math.random() * (Ghost.dests.length - 1))];
        this.goTo(goal);
    }
    setBehavior(bhvr) {
        ghostBhvrs[this.color] = bhvr;
        this.behavior = bhvr;
        updateBhvrs();
    }
    chooseDestination() {
        let pacmanCoords = {
            x: this.pacman.x,
            y: this.pacman.y
        };
        let ghostsCoords = {};
        for (let i in ghosts) {
            let ghost = ghosts[i]
            if (ghost.color == this.color)
                continue;
            ghostsCoords[ghost.color] = {
                x: ghost.x,
                y: ghost.y
            };
        }
        this.setBehavior(chooseBehavior(this, pacmanCoords, ghostsCoords));
        switch (this.behavior) {
            case "Hunting":
                this.behaveHunting();
                break;
            case "Defense":
                this.behaveDefense();
                break;
            case "Shy":
                this.behaveShy();
                break;
            default:
                this.behaveRandom();
        }
    }
    behaveHunting() {
        if (customHunting)
            behaveHunting(this, pacman);
        else
            this.goToPacman();
    }
    behaveDefense() {
        if (customDefense)
            behaveDefense(this, Pellet.list, Node.size);
        else
            this.goToRandom();
    }
    behaveShy() {
        if (customShy)
            behaveShy(this, ghosts);
        else
            this.goToRandom();
    }
    behaveRandom() {
        if (customRandom)
            behaveRandom(this, Ghost.dests);
        else
            this.goToRandom();
    }
    update() {
        if (this.nextDirection != null)
            this.changeDirection(this.nextDirection);
        if (this.path.length) {
            this.followPath();
        }
        let aligned = this.x % Node.size == 0;
        aligned = aligned && this.y % Node.size == 0;
        if (this.inSpawn) {
            this.spawnMove();
        } else if (aligned) {
            this.chooseDestination();
        }
        this.move();
        this.kill();
        this.draw();
    }
    spawnMove() {
        if (this.y == 13 * Node.size && this.direction == 38)
            if (this.spawning)
                this.inSpawn = false;
            else
                this.direction = 40;
        else if (this.y == 15 * Node.size && this.direction == 40)
            this.direction = 38;
    }
    spawn() {
        this.spawning = true;
    }
    move() {
        let newX = this.x;
        let newY = this.y;
        let stepSize = Node.size / this.stepsPerNode;
        switch (this.direction) {
            case 37:
                newX = this.x - stepSize;
                if (newX <  0)
                    newX = Canvas.width - this.size;
                break;
            case 38:
                newY = this.y - stepSize;
                if (newY < 0)
                    newY = Canvas.height - this.size;
                break;
            case 39:
                newX = this.x + stepSize;
                if (newX + this.size > Canvas.width)
                    newX = 0;
                break;
            case 40:
                newY = this.y + stepSize;
                if (newY + this.size > Canvas.height)
                    newY = 0;
                break;
        }
        if (!this.inObstacle(newX, newY)) {
            this.x = newX;
            this.y = newY;
            if (this.sprite)
                this.sprite.resume();
        } else {
            if (this.sprite)
                this.sprite.stop();
        }
    }
    kill() {
        let ax = this.x + this.size / 2;
        let ay = this.y + this.size / 2;
        let ex = this.pacman.x + this.pacman.size / 2;
        let ey = this.pacman.y + this.pacman.size / 2;
        let d = Math.sqrt(Math.pow(ax - ex, 2) + Math.pow(ay - ey, 2));
        if (d < 10) {
            this.pacman.die();
        }
    }
    pointInObstacle(x, y, obstacle) {
        let inX, inY;
        x /= Node.size;
        y /= Node.size;
        inX = obstacle.x <= x && x < obstacle.x + 1;
        inY = obstacle.y <= y && y < obstacle.y + 1;
        return inX && inY;
    }
    inObstacle(x, y) {
        for (let i = 0; i < this.obstacles.length; i++) {
            if (this.pointInObstacle(x, y, this.obstacles[i]))
                return true;
            if (this.pointInObstacle(x + this.size - 1, y, this.obstacles[i]))
                return true;
            if (this.pointInObstacle(x, y + this.size - 1, this.obstacles[i]))
                return true;
            if (this.pointInObstacle(x + this.size - 1, y + this.size - 1, this.obstacles[i]))
                return true;
        }
        return false;
    }
    changeDirection(newD) {
        let o = false;
        switch (newD) {
            case 37:
                o = this.inObstacle(this.x - 1, this.y);
                break;
            case 38:
                o = this.inObstacle(this.x, this.y - 1);
                break;
            case 39:
                o = this.inObstacle(this.x + 1, this.y);
                break;
            case 40:
                o = this.inObstacle(this.x, this.y + 1);
                break;
        }
        if (o) {
            this.nextDirection = newD;
        } else {
            this.direction = newD;
            this.nextDirection = null;
        }
    }
    followPath(path = this.path) {
        let node, nx, ny;
        node = path[0];
        nx = node.x * Node.size;
        ny = node.y * Node.size;
        if (nx == this.x && ny == this.y) {
            path.shift();
            if (!path.length)
                return;
            node = path[0];
        }
        nx = node.x * Node.size;
        ny = node.y * Node.size;
        let left = nx < this.x && ny == this.y;
        let top = nx == this.x && ny < this.y;
        let right = nx > this.x && ny == this.y;
        let bottom = nx == this.x && ny > this.y;
        let teleportLeft = nx == Canvas.width - Node.size && this.x == 0 && ny == this.y;
        let teleportTop = ny == Canvas.height - Node.size && this.y == 0 && nx == this.x;
        let teleportRight = nx == 0 && this.x == Canvas.width - this.size && ny == this.y;
        let teleportBottom = ny == 0 && this.y == Canvas.height - this.size && nx == this.x;
        if ((left && !teleportRight) || teleportLeft)
            this.changeDirection(37);
        else if ((top && !teleportBottom) || teleportTop)
            this.changeDirection(38);
        else if (right || teleportRight)
            this.changeDirection(39);
        else if (bottom || teleportBottom)
            this.changeDirection(40);
        this.path = path;
    }
    goTo(goal) {
        let x = Math.floor(this.x / Node.size);
        let y = Math.floor(this.y / Node.size);
        let start = new Node(x, y);
        let path = Node.findPath(start, goal, this.obstacles);
        this.followPath(path);
    }
}
Ghost.dests = [];

Canvas.init("canvas", Node.size * PacmanMazeWidth, Node.size * PacmanMazeHeight);
Obstacle.init();
Pellet.init();

let pacman = new Pacman(13 * Node.size, 17 * Node.size);
let ghosts = [];
ghosts.push(new Ghost(12 * Node.size, 14 * Node.size, pacman, "red"));
ghosts.push(new Ghost(13 * Node.size, 14 * Node.size, pacman, "pink"));
ghosts.push(new Ghost(14 * Node.size, 14 * Node.size, pacman, "blue"));
ghosts.push(new Ghost(15 * Node.size, 14 * Node.size, pacman, "orange"));

Canvas.onkeydown(event => {
    pacman.onkeydown(event);
});

const dontPlayIntro = skipIntro || false;

function audioDoneAction(gameLoop) {
    window.requestAnimationFrame(gameLoop);
    for (let i = 0; i < ghosts.length; i++) {
        setTimeout(() => {
            ghosts[i].spawn();
        }, i * 5000);
    }
}

let c = 0;
function gameLoop() {
    if (pacman.won || pacman.dead)
        return;
    Canvas.update();
    Pellet.drawAll();
    for (let i = 0; i < ghosts.length; i++)
        ghosts[i].update();
    pacman.update();
    if (c < 2 || c == 3) {
        if (c < 2)
            c++;
        window.requestAnimationFrame(gameLoop);
    } else if (c == 2) {
        c++;
        if (dontPlayIntro) {
            audioDoneAction(gameLoop);
            return;
        }
        pacman.eatSound.pause();
        let audio = new Audio("./assets/beginning.wav");
        setTimeout(() => {
            pacman.eatSound.pause();
            audio.play();
        }, 100);
        audio.onended = () => {
            audioDoneAction(gameLoop);
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