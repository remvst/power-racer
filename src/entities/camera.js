class Camera extends Entity {
    constructor() {
        super();
        this.categories.push('camera');
        this.zoom = 1;
        this.affectedBySpeedRatio = false;

        this.minX = -CANVAS_WIDTH / 2;

        this.shakeEnd = 0;

        this.rotation = Math.PI / 2;
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

            const targetZoom = interpolate(
                player.power ? 1 : 2,
                0.5,
                (player.speed - 400) / 800,
            );
            const zoomDiff = targetZoom - this.zoom;
            const appliedZoomDiff = zoomDiff * elapsed * 0.5;
            this.zoom += appliedZoomDiff;
        }

        if (this.age < this.shakeEnd) {
            this.x += rnd(-20, 20);
            this.y += rnd(-20, 20);
        }
    }

    shake(duration) {
        this.shakeEnd = this.age + duration;
    }

    zoomTo(toValue) {
        if (this.previousInterpolator) {
            this.previousInterpolator.remove();
        }
        return this.scene.add(new Interpolator(this, 'zoom', this.zoom, toValue, 1)).await();
    }
}
