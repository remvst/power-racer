class Ship extends Entity {

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
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(40, 0);
        ctx.lineTo(-20, -20);
        ctx.lineTo(0, -0);
        ctx.lineTo(-20, 20);
        ctx.fill();
    }
}
