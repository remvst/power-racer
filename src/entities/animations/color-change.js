class ColorChange extends Entity {

    constructor(color) {
        super();
        this.color = color;
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        if (this.age > 4) {
            this.remove();
        }
    }

    doRender(camera) {
        this.cancelCameraOffset(camera);

        ctx.fillStyle = this.color;
        ctx.fillRect(0, CANVAS_HEIGHT * (this.age % 4) / 4, CANVAS_WIDTH, 20)
    }
}
