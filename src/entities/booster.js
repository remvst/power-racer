class Booster extends Entity {
    cycle(elapsed) {
        super.cycle(elapsed);

        const player = firstItem(this.scene.category('player'));
        if (!player) return;

        if (dist(player, this) < 50) {
            this.scene.remove(this);

            const { speed } = player;
            const newSpeed = Math.min(player.maxSpeed * 1.5, speed * 2);

            player.power = 1;
            player.inertia.x = Math.cos(this.rotation) * newSpeed;
            player.inertia.y = Math.sin(this.rotation) * newSpeed;
        }
    }

    doRender() {
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.globalAlpha = Math.sin(this.age * Math.PI * 2) * 0.25 + 0.5;
        ctx.strokeStyle = '#0f0';
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
