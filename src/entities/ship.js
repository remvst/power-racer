class Ship extends Entity {

    cycle(elapsed) {
        super.cycle(elapsed);

        const track = firstItem(this.scene.category('track'));
        if (!track) return;

        const closestBit = track.closestTrackBit(this.x, this.y);
        if (!closestBit) return;

        if (!closestBit.contains(this.x, this.y)) {
            const adjustedLeft = closestBit.pointAt(-0.8);
            const adjustedRight = closestBit.pointAt(0.8);

            const best = dist(adjustedLeft, this) < dist(adjustedRight, this)
                ? adjustedLeft
                : adjustedRight;
            this.x = best.x;
            this.y = best.y;

            // const angle = angleBetween(closestBit, this);
            // this.x = closestBit.x + Math.cos(angle) * closestBit.width / 2;
            // this.y = closestBit.y + Math.sin(angle) * closestBit.width / 2;
        }
    }

    render() {
        ctx.wrap(() => {
            const track = firstItem(this.scene.category('track'));
            if (!track) return;

            const closestBit = track.closestTrackBit(this.x, this.y);
            if (!closestBit) return;

            const { polygon } = closestBit;

            ctx.fillStyle = closestBit.contains(this.x, this.y) ? '#0f0' : '#f00';
            ctx.beginPath();
            for (const pt of polygon) {
                ctx.lineTo(pt[0], pt[1]);
            }
            ctx.fill();
        });

        ctx.wrap(() => {
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);

            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.moveTo(40, 0);
            ctx.lineTo(-20, -20);
            ctx.lineTo(0, -0);
            ctx.lineTo(-20, 20);
            ctx.fill();
        });

        ctx.wrap(() => {
            const track = firstItem(this.scene.category('track'));
            if (!track) return;

            const closestBit = track.closestTrackBit(this.x, this.y);
            if (!closestBit) return;

            ctx.strokeStyle = '#ff0';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(closestBit.x, closestBit.y);
            ctx.stroke();
        });
    }
}
