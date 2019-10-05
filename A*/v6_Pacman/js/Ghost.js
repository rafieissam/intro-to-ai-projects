class Ghost {
    static dests = [];
    constructor(x, y, pacman, color = "red") {
        this.x = x;
        this.y = y;
        this.obstacles = Obstacle.list;
        this.size = Node.size;
        this.direction = 39; // Right
        this.nextDirection = null;
        this.path = [];
        this.stepsPerNode = 16;
        this.pacman = pacman;
        this.color = color;
        if (!Ghost.dests.length)
            this.initDestinations();
    }
    drawPath() {
        if (this.path.length) {
            for (let i = 0; i < this.path.length; i++) {
                let n = this.path[i];
                let s = 5;
                let nx = n.x * Node.size - (s - Node.size) / 2;
                let ny = n.y * Node.size - (s - Node.size) / 2;
                Canvas.ctx.fillStyle = "red";
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
                yellow: {
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
                image: "./images/sprites.png",
                x: this.x,
                y: this.y,
                ticksPerFrame: 3,
                frames: this.spriteFrames[this.direction],
                pauseIndex: 1
            });
        }
        // this.drawPath();
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
    chooseDestination() {
        let r = Math.random();
        if (r < 0.5)
            this.goToPacman();
        else
            this.goToRandom();
    }
    update() {
        if (this.nextDirection != null)
            this.changeDirection(this.nextDirection);
        if (!this.cantChange || !this.path.length) {
            this.cantChange = true;
            setTimeout(() => {
                this.cantChange = false;
            }, 3000);
            this.chooseDestination();
        } else if (this.path.length) {
            this.followPath();
        }
        this.move();
        this.draw();
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