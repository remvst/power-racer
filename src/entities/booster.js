class Booster extends Entity {
    cycle(elapsed) {
        super.cycle(elapsed);

        const player = firstItem(this.scene.category('player'));
        if (!player) return;

        if (dist(player, this) < 50) {
            this.scene.remove(this);
            player.boost();
        }

        const track = firstItem(this.scene.category('track'));
        if (this.distance < track.trackBits[0].distance) {
            this.remove();
        }
    }

    doRender() {
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.lineWidth = 15;

        for (let i = 0 ; i < 3 ; i++) {
            ctx.wrap(() => {
                ctx.globalAlpha = Math.sin((this.age + i * 0.2) * Math.PI * 2) * 0.25 + 0.5;
                ctx.strokeStyle = '#0f0';

                ctx.translate(45 - i * 30, 0);
                ctx.beginPath();
                ctx.lineTo(-30, -30);
                ctx.lineTo(0, 0);
                ctx.lineTo(-30, 30);
                ctx.stroke();
            });
        }

        // ctx.strokeStyle = '#0f0';
        // ctx.beginPath();
        // ctx.arc(0, 0, 50, 0, Math.PI * 2);
        // ctx.stroke();
    }
}
