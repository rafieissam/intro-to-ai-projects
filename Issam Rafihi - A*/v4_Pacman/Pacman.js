class Pacman {
    constructor(x, y, obstacles = []) {
        this.x = x;
        this.y = y;
        this.obstacles = obstacles;
        this.size = Node.size;
        this.direction = 39; // Right
        this.nextDirection = null;
        this.path = [];
        this.stepsPerNode = 10;
    }
    draw() {
        if (this.path.length) {
            for (let i = 0; i < this.path.length; i++) {
                let n = this.path[i];
                let s = 5;
                let nx = n.x * Node.size - (s - Node.size) / 2;
                let ny = n.y * Node.size - (s - Node.size) / 2;
                Canvas.ctx.fillStyle = "yellow";
                Canvas.ctx.fillRect(nx, ny, s, s);
            }
        }
        Canvas.ctx.fillStyle = "yellow";
        Canvas.ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    update() {
        if (this.nextDirection != null)
            this.changeDirection(this.nextDirection);
        if (this.path.length)
            this.followPath();
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
    onkeydown(event) {
        let options = [37, 38, 39, 40];
        if (options.indexOf(event.which) != -1)
            this.changeDirection(event.which);
    }
}