class Entity {
    constructor() {
        this.x = this.y = this.rotation = this.age = 0;
        this.categories = [];

        this.renderPadding = Infinity;

        this.affectedBySpeedRatio = true;
    }

    get z() {
        return this.y;
    }

    get inWater() {
        if (this.scene)
        for (const water of this.scene.category('water')) {
            if (water.contains(this)) return true;
        }
    }

    cycle(elapsed) {
        this.age += elapsed;
    }

    render() {
        const camera = firstItem(this.scene.category('camera'));
        if (
            isBetween(camera.x - CANVAS_WIDTH / 2 - this.renderPadding, this.x, camera.x + CANVAS_WIDTH / 2 + this.renderPadding) &&
            isBetween(camera.y - CANVAS_HEIGHT / 2 - this.renderPadding, this.y, camera.y + CANVAS_HEIGHT / 2 + this.renderPadding)
        ) {
            this.doRender(camera);
        }
    }

    doRender(camera) {

    }

    remove() {
        this.scene.remove(this);
    }

    relativeXY(relativeX, relativeY) {
        const relativeAngle = Math.atan2(relativeY, relativeX);
        const relativeDistance = distP(0, 0, relativeX, relativeY);

        const x = this.x + Math.cos(this.rotation + relativeAngle) * relativeDistance;
        const y = this.y + Math.sin(this.rotation + relativeAngle) * relativeDistance;

        return { x, y };
    }

    cancelCameraOffset(camera) {
        ctx.translate(camera.x, camera.y);
        ctx.scale(1 / camera.zoom, 1 / camera.zoom);
        ctx.rotate(camera.rotation);
        ctx.translate(-CANVAS_WIDTH / 2, -CANVAS_HEIGHT / 2);

        // ctx.translate(-CANVAS_WIDTH / 2, -CANVAS_HEIGHT / 2)
        // ctx.rotate(camera.rotation);
        // ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);


        // ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
        // ctx.translate(
        //     -camera.x,
        //     -camera.y,
        // );
        // ctx.translate(-CANVAS_WIDTH / 2, -CANVAS_HEIGHT / 2)
        // ctx.rotate(-camera.rotation);
        // ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)


        // TODO zoom scale

    }
}
