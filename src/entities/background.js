class Background extends Entity {

    constructor() {
        super();
        this.color = this.oldColor = '#94d';
        this.lastColorChange = -99;
        this.categories.push('background');
    }

    get colorChangeRatio() {
        return (this.age - this.lastColorChange) / 0.5;
    }

    get transitionedColor() {
        const { colorChangeRatio } = this;
        if (colorChangeRatio < 1) {
            return addColors(
                multiplyColor(this.color, colorChangeRatio),
                multiplyColor(this.oldColor, 1 - colorChangeRatio),
            )
        }

        return this.color;
    }

    doRender(camera) {
        this.cancelCameraOffset(camera);

        // Background
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const { colorChangeRatio } = this;
        if (colorChangeRatio < 1) {
            ctx.wrap(() => {
                ctx.translate(0, CANVAS_HEIGHT * (1 - colorChangeRatio));
                ctx.fillStyle = this.transitionGradient;
                ctx.fillRect(0, -CANVAS_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT * 2);
            })
        }
    }

    changeColor(color) {
        this.lastColorChange = this.age;
        this.oldColor = this.color;
        this.color = color;

        this.transitionGradient = ctx.createLinearGradient(0, 0, 0, 300);
        this.transitionGradient.addColorStop(0, this.oldColor);
        this.transitionGradient.addColorStop(1, this.color);
    }
}
