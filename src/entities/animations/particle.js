class Particle extends Entity {

    constructor(
        color,
        valuesSize,
        valuesX,
        valuesY,
        duration,
        alpha,
    ) {
        super();
        this.color = color;
        this.valuesSize = valuesSize;
        this.valuesX = valuesX;
        this.valuesY = valuesY;
        this.duration = duration;
        this.alpha = alpha;
    }

    get z() {
        return LAYER_PARTICLE;
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        if (this.age > this.duration) {
            this.remove();
        }
    }

    interp(property) {
        const progress = this.age / this.duration;
        return property[0] + progress * (property[1] - property[0]);
    }

    doRender() {
        const size = this.interp(this.valuesSize);
        ctx.translate(this.interp(this.valuesX), this.interp(this.valuesY));

        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.interp(this.alpha || [1, 0]);

        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}
