class Camera extends Entity {
    constructor() {
        super();
        this.categories.push('camera');
        this.zoom = 1;
        this.affectedBySpeedRatio = false;

        this.minX = -CANVAS_WIDTH / 2;
    }

    get appliedZoom() {
        // I'm a lazy butt and refuse to update the entire game to have a bit more zoom.
        // So instead I do dis ¯\_(ツ)_/¯
        return interpolate(1.2, 3, (this.zoom - 1) / 3);
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        for (const player of this.scene.category('player')) {
            const targetRotation = normalize(player.rotation + Math.PI / 2);
            const rotationDiff = normalize(targetRotation - this.rotation);
            const appliedDiff = rotationDiff * elapsed * Math.PI / 2;
            this.rotation += appliedDiff;

            this.x = player.x + Math.cos(this.rotation - Math.PI / 2) * 200 / this.zoom;
            this.y = player.y + Math.sin(this.rotation - Math.PI / 2) * 200 / this.zoom;

            const targetZoom = 1 - (player.speed / player.maxSpeed) * 0.25;
            const zoomDiff = targetZoom - this.zoom;
            const appliedZoomDiff = zoomDiff * elapsed * 0.5;

            this.zoom += appliedZoomDiff;

            // this.x = player.x;
            // this.y = player.y;
            // this.rotation = 0;

            // this.zoom = 1 - (player.speed / player.maxSpeed) * 0.5;
        }
    }

    zoomTo(toValue) {
        if (this.previousInterpolator) {
            this.previousInterpolator.remove();
        }
        return this.scene.add(new Interpolator(this, 'zoom', this.zoom, toValue, 1)).await();
    }

    // render() {
    //     // console.log('rnd');
    //     ctx.translate(this.x, this.y);
    //     ctx.fillStyle = '#f00';
    //     ctx.fillRect(-25, -25, 50, 50);
    // }
}
