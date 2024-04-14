class Drain extends Entity {
    cycle(elapsed) {
        super.cycle(elapsed);
    }

    doRender() {
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation + Math.PI);

        ctx.globalAlpha = Math.sin(this.age * Math.PI * 2) * 0.25 + 0.5;
        ctx.strokeStyle = '#f00';
        ctx.lineWidth = 10;

        for (let i = 0 ; i < 3 ; i++) {
            ctx.translate(-20, 0)
            ctx.beginPath();
            ctx.lineTo(-20, -20);
            ctx.lineTo(0, 0);
            ctx.lineTo(-20, 20);
            ctx.stroke();
        }
    }
}
