class Ship extends Entity {

    constructor() {
        super();

        this.power = 1;
        this.controls = {
            left: 0,
            right: 0,
            brake: 0,
            accelerate: 0,
        };

        this.movementAngle = 0;
        this.speed = 0;
        this.maxSpeed = 600;
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        if (this.controls.left) this.rotation -= Math.PI * elapsed;
        if (this.controls.right) this.rotation += Math.PI * elapsed;

        const targetSpeed = this.controls.accelerate
            ? this.maxSpeed
            : 0;
        this.speed += between(
            -elapsed * (this.controls.brake ? 200 : 100),
            targetSpeed - this.speed,
            elapsed * 100,
        );

        const angleDiff = normalize(normalize(this.rotation) - normalize(this.movementAngle));
        const speedRatio = this.speed / this.maxSpeed;
        const angleCatchUp = (1 - speedRatio) * Math.PI + Math.PI / 2;
        this.movementAngle += between(
            -elapsed * angleCatchUp,
            angleDiff,
            elapsed * angleCatchUp,
        );

        this.x += Math.cos(this.movementAngle) * this.speed * elapsed;
        this.y += Math.sin(this.movementAngle) * this.speed * elapsed;

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
            // this.x = best.x;
            // this.y = best.y;

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
            ctx.strokeStyle = '#f00';
            ctx.translate(this.x, this.y);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(this.movementAngle) * (this.speed - 10), Math.sin(this.movementAngle) * (this.speed - 10))
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(Math.cos(this.movementAngle) * this.speed, Math.sin(this.movementAngle) * this.speed, 10, 0, Math.PI * 2);
            ctx.stroke();
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
