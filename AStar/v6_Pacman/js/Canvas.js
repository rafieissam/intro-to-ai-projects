class Canvas {
    static canvas;
    static ctx;
    static width;
    static height;
    static color;
    static init(id, width, height, color = "black") {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext("2d");
        this.width = width;
        this.height = height;
        this.color = color;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.draw();
    }
    static update() {
        this.sprite.update();
        this.sprite.draw();
    }
    static draw() {
        this.sprite = new Sprite({
            image: "./images/sprites.png",
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
        this.canvas.onclick = fnctn;
    }
    static onkeydown(fnctn) {
        let lastDownTarget;
        window.onload = () => {
            document.onmousedown = event => {
                lastDownTarget = event.target
            };
            document.onkeydown = event => {
                // if (lastDownTarget == Canvas.canvas)
                    fnctn(event);
            };
        };
    }
}