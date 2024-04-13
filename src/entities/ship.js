class Ship extends Entity {

    cycle(elapsed) {
        super.cycle(elapsed);

        const track = firstItem(this.scene.category('track'));
        if (!track) return;

        const closestBit = track.closestTrackBit(this.x, this.y);
        if (!closestBit) return;

        if (dist(this, closestBit) > closestBit.width / 2) {
            // console.log('OUT!');
            const adjustedLeft = closestBit.pointAt(-0.8);
            const adjustedRight = closestBit.pointAt(0.8);

            const best = dist(adjustedLeft, this) < dist(adjustedRight, this)
                ? adjustedLeft
                : adjustedRight;
            this.x = best.x;
            this.y = best.y;
        }
    }

    render() {
        ctx.wrap(() => {
            const track = firstItem(this.scene.category('track'));
            if (!track) return;

            for (let x = this.x - 400 ; x < this.x + 400 ; x += 10) {
                for (let y = this.y - 400 ; y < this.y + 400 ; y += 10) {
                    ctx.fillStyle = track.contains(x, y) ? 'green' : 'red';
                    ctx.fillRect(x - 2, y - 2, 4, 4);
                }
            }
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
