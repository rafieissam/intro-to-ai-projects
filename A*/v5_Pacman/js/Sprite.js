class Sprite {
	static all = [];
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