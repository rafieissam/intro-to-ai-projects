class Canvas {
    static canvas;
    static ctx;
    static width;
    static height;
    static color;
    static init(id, width, height, color = "green") {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext("2d");
        this.width = width;
        this.height = height;
        this.color = color;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.onclick = this.onclick;
        this.draw();
    }
    static clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    static draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    static onclick(fnctn) {
        this.canvas.onclick = fnctn;
    }
}