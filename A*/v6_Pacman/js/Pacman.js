class Pacman {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.obstacles = Obstacle.list;
        this.pellets = Pellet.list;
        this.size = Node.size;
        this.direction = 39; // Right
        this.nextDirection = null;
        this.stepsPerNode = 10;
    }
    draw() {
        if (this.sprite) {
            this.sprite.x = this.x;
            this.sprite.y = this.y;
            this.sprite.frames = this.spriteFrames[this.direction];
        } else {
            this.spriteFrames = {
                37: [
                    {
                        x: 2 * 680 / 3 + 2,
                        y: 16,
                        width: 15,
                        height: 15,
                        scaledWidth: this.size,
                        scaledHeight: this.size
                    },
                    {
                        x: 2 * 680 / 3 + 18,
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
                        x: 2 * 680 / 3 + 2,
                        y: 32,
                        width: 15,
                        height: 15,
                        scaledWidth: this.size,
                        scaledHeight: this.size
                    },
                    {
                        x: 2 * 680 / 3 + 18,
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
                        x: 2 * 680 / 3 + 2,
                        y: 0,
                        width: 15,
                        height: 15,
                        scaledWidth: this.size,
                        scaledHeight: this.size
                    },
                    {
                        x: 2 * 680 / 3 + 18,
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
                        x: 2 * 680 / 3 + 2,
                        y: 48,
                        width: 15,
                        height: 15,
                        scaledWidth: this.size,
                        scaledHeight: this.size
                    },
                    {
                        x: 2 * 680 / 3 + 18,
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
                image: "./images/sprites.png",
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
        if (this.nextDirection != null)
            this.changeDirection(this.nextDirection);
        this.move();
        this.eat();
        this.draw();
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
                break;
            }
        }
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