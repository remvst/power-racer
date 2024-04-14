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

        this.maxSpeed = 800;

        this.inertia = {
            x: 0,
            y: 0,
        };

        this.lastBoost = -99;

        this.nextParticle = 0;
        this.trailLeft = [];
        this.trailRight = [];
    }

    get speed() {
        return distP(0, 0, this.inertia.x, this.inertia.y);
    }

    get isBoosted() {
        return this.age - this.lastBoost < 1;
    }

    get effectiveMaxSpeed() {
        return this.maxSpeed * (this.isBoosted ? 1.5 : 1);
    }

    get effectiveAcceleration() {
        return this.isBoosted ? 2000 : 1000;
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        if (this.controls.left) this.rotation -= Math.PI * elapsed;
        if (this.controls.right) this.rotation += Math.PI * elapsed;

        // Lose inertia over time
        const inertiaAngle = Math.atan2(this.inertia.y, this.inertia.x);
        const inertiaDistance = distP(0, 0, this.inertia.x, this.inertia.y);
        const newDistance = Math.max(0, inertiaDistance - elapsed * 400);
        this.inertia.x = Math.cos(inertiaAngle) * newDistance;
        this.inertia.y = Math.sin(inertiaAngle) * newDistance;

        const { speed, effectiveMaxSpeed, effectiveAcceleration } = this;
        if ((this.controls.accelerate || this.isBoosted) && speed < effectiveMaxSpeed) {
            this.inertia.x += this.effectiveAcceleration * elapsed * Math.cos(this.rotation);
            this.inertia.y += this.effectiveAcceleration * elapsed * Math.sin(this.rotation);

            this.inertia.x = between(-effectiveMaxSpeed, this.inertia.x, effectiveMaxSpeed);
            this.inertia.y = between(-effectiveMaxSpeed, this.inertia.y, effectiveMaxSpeed);

            const { speed } = this;
            if (speed > effectiveMaxSpeed) {
                const inertiaAngle = Math.atan2(this.inertia.y, this.inertia.x);
                this.inertia.x = Math.cos(inertiaAngle) * effectiveMaxSpeed;
                this.inertia.y = Math.sin(inertiaAngle) * effectiveMaxSpeed;
            }
        }

        if (this.controls.brake) {
            this.lastBoost = 0;

            const inertiaAngle = Math.atan2(this.inertia.y, this.inertia.x);
            const inertiaDistance = distP(0, 0, this.inertia.x, this.inertia.y);
            const newDistance = Math.max(0, inertiaDistance - elapsed * 200);
            this.inertia.x = Math.cos(inertiaAngle) * newDistance;
            this.inertia.y = Math.sin(inertiaAngle) * newDistance;
        }

        const angleDiff = normalize(normalize(this.rotation) - normalize(this.movementAngle));
        const speedRatio = this.speed / this.maxSpeed;
        const angleCatchUp = (1 - speedRatio) * Math.PI + Math.PI / 4;
        this.movementAngle += between(
            -elapsed * angleCatchUp,
            angleDiff,
            elapsed * angleCatchUp,
        );

        this.x += this.inertia.x * elapsed;
        this.y += this.inertia.y * elapsed;

        this.power = between(
            0,
            this.power + (this.isBoosted
                ? elapsed * 0.3
                : elapsed * -0.05),
            1,
        );

        const track = firstItem(this.scene.category('track'));
        if (!track) return;

        if (this.closestBit && !this.closestBit.contains(this.x, this.y)) {
            this.closestBit = null;
        }

        if (!this.closestBit) this.closestBit = track.closestTrackBit(this.x, this.y);
        if (!this.closestBit) return;

        if (!this.closestBit.contains(this.x, this.y)) {
            const adjustedLeft = this.closestBit.pointAt(-0.8);
            const adjustedRight = this.closestBit.pointAt(0.8);

            const best = dist(adjustedLeft, this) < dist(adjustedRight, this)
                ? adjustedLeft
                : adjustedRight;
            this.x = best.x;
            this.y = best.y;

            // const angle = angleBetween(closestBit, this);
            // this.x = closestBit.x + Math.cos(angle) * closestBit.width / 2;
            // this.y = closestBit.y + Math.sin(angle) * closestBit.width / 2;
        }
        firstItem(this.scene.category('track')).prune(this.closestBit.distance);

        // const impactX = victim.x + rnd(-20, 20);
        // const impactY = victim.y - 30 + rnd(-20, 20);

        // this.nextParticle -=
        this.nextParticle -= elapsed;

        while (this.nextParticle <= 0) {
            this.nextParticle += 1 / 240;

            if (this.isBoosted) {
                // this.addTrailParticle(-10 + rnd(-3, 3), -10 + rnd(-3, 3));
                // this.addTrailParticle(-10 + rnd(-3, 3), 10 + rnd(-3, 3));
                this.addTrailParticle(-10, 0);
            }
        }

        this.trailLeft.push({...this.relativeXY(-12, -12), age: this.age});
        if (this.trailLeft.length > 60) this.trailLeft.shift();

        this.trailRight.push({...this.relativeXY(-12, 12), age: this.age});
        if (this.trailRight.length > 60) this.trailRight.shift();
    }

    addTrailParticle(relativeX, relativeY) {
        const size = rnd(3, 6);

        const { x, y } = this.relativeXY(relativeX, relativeY);

        const angle = this.rotation + Math.PI;

        this.scene.add(new Particle(
            '#ccc',
            [size, size + rnd(20, 40)],
            [x, x + Math.cos(angle) * 20],
            [y, y + Math.sin(angle) * 20],
            rnd(0.5, 1),
            [1, 0],
        ));
    }

    render() {
        ctx.wrap(() => {
            return;
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
            ctx.lineWidth = 5;
            ctx.strokeStyle = '#08f';
            ctx.lineCap = 'round';
            for (let i = 0 ; i < this.trailLeft.length - 1 ; i++) {
                ctx.globalAlpha = 1 - between(0, (this.age - this.trailLeft[i].age) * 2, 1);
                ctx.beginPath();
                ctx.moveTo(this.trailLeft[i].x, this.trailLeft[i].y);
                ctx.lineTo(this.trailLeft[i + 1].x, this.trailLeft[i + 1].y);
                ctx.stroke();
            }

            for (let i = 0 ; i < this.trailRight.length - 1 ; i++) {
                ctx.globalAlpha = 1 - between(0, (this.age - this.trailRight[i].age) * 2, 1);
                ctx.beginPath();
                ctx.moveTo(this.trailRight[i].x, this.trailRight[i].y);
                ctx.lineTo(this.trailRight[i + 1].x, this.trailRight[i + 1].y);
                ctx.stroke();
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
            return;
            ctx.strokeStyle = '#f00';
            ctx.translate(this.x, this.y);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(this.inertia.x, this.inertia.y);
            ctx.stroke();
        });

        ctx.wrap(() => {
            return;
            if (!this.closestBit) return;

            ctx.strokeStyle = '#ff0';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.closestBit.x, this.closestBit.y);
            ctx.stroke();
        });
    }

    boost() {
        const { speed } = this;
        const newSpeed = Math.min(this.maxSpeed * 1.5, speed * 2);

        const inertiaAngle = Math.atan2(this.inertia.y, this.inertia.x);
        this.lastBoost = this.age;
    }
}
