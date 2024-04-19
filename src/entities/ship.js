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

        this.inertia = {
            x: 0,
            y: 0,
        };

        this.lastBoost = this.lastLevelUp = -99;

        this.nextParticle = 0;
        this.trailLeft = [];
        this.trailRight = [];

        this.boostCount = 0;
        this.score = 0;

        this.setLevel(0);
    }

    get speed() {
        return distP(0, 0, this.inertia.x, this.inertia.y);
    }

    get isBoosted() {
        return this.age - this.lastBoost < 1;
    }

    get effectiveMaxSpeed() {
        if (!this.power) return 0;
        return this.maxSpeed * (this.isBoosted ? 1.5 : 1);
    }

    get effectiveAcceleration() {
        return this.isBoosted ? 3000 : 1000;
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        if (firstItem(this.scene.category('menu'))) return;

        if (this.controls.left) this.rotation -= Math.PI * elapsed;
        if (this.controls.right) this.rotation += Math.PI * elapsed;

        // Lose inertia over time
        const inertiaAngle = normalize(Math.atan2(this.inertia.y, this.inertia.x));
        let resistance = Math.abs(normalize(this.rotation - inertiaAngle)) / (Math.PI / 2);

        if (this.closestBit) {
            const addedResistance = dist(this, this.closestBit) / (this.closestBit.width / 2);
            resistance += addedResistance * 0.8;
        }

        const actualResistance = interpolate(100, 800, resistance)

        const inertiaDistance = distP(0, 0, this.inertia.x, this.inertia.y);
        const newDistance = Math.max(0, inertiaDistance - elapsed * actualResistance);
        this.inertia.x = Math.cos(inertiaAngle) * newDistance;
        this.inertia.y = Math.sin(inertiaAngle) * newDistance;

        const { speed, effectiveMaxSpeed, effectiveAcceleration } = this;
        if ((this.controls.accelerate || this.isBoosted) && speed < effectiveMaxSpeed) {
            this.inertia.x += effectiveAcceleration * elapsed * Math.cos(this.rotation);
            this.inertia.y += effectiveAcceleration * elapsed * Math.sin(this.rotation);

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
            const newDistance = Math.max(0, inertiaDistance - elapsed * 800);
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
            this.closestBit = this.closestBit.next;
        }

        if (this.closestBit && !this.closestBit.contains(this.x, this.y)) {
            this.closestBit = null;
        }

        if (!this.closestBit) this.closestBit = track.closestTrackBit(this.x, this.y);
        if (!this.closestBit) return;

        if (!this.closestBit.contains(this.x, this.y)) {
            const angleToCenter = angleBetween(this, this.closestBit);
            if (Math.abs(normalize(angleToCenter - this.rotation)) > Math.PI / 2) {
                this.rotation = this.closestBit.angle;
            }

            const angle = angleBetween(this.closestBit, this);
            this.x = this.closestBit.x + Math.cos(angle) * this.closestBit.width / 2;
            this.y = this.closestBit.y + Math.sin(angle) * this.closestBit.width / 2;

            const speed = this.speed;
            this.inertia.x = Math.cos(angleToCenter) * speed / 4;
            this.inertia.y = Math.sin(angleToCenter) * speed / 4;

            this.power -= 0.1;
            this.lastBoost = 0;

            hitSound();

            firstItem(this.scene.category('camera')).shake(0.3);

            for (let i = 0 ; i < 50 ; i++) {
                const size = rnd(2, 4);
                const x = this.x + rnd(-20, 20);
                const y = this.y + rnd(-20, 20);
                const particleAngle = Math.random() * Math.PI * 2;

                this.scene.add(new Particle(
                    '#ff0',
                    [size, size + rnd(4, 8)],
                    [x, x + Math.cos(particleAngle) * 100],
                    [y, y + Math.sin(particleAngle) * 100],
                    rnd(0.2, 0.4),
                    [1, 1],
                ));
            }
        }
        firstItem(this.scene.category('track')).prune(this.closestBit.distance);

        this.nextParticle -= elapsed;
        while (this.nextParticle <= 0) {
            this.nextParticle += 1 / 240;

            if (this.isBoosted) {
                this.addTrailParticle(-10, 0);
            }
        }

        const color = this.isBoosted ? '#0f0' : '#08f';
        this.trailLeft.push({...this.relativeXY(-12, -12), age: this.age, color});
        if (this.trailLeft.length > 60) this.trailLeft.shift();

        this.trailRight.push({...this.relativeXY(-12, 12), age: this.age, color});
        if (this.trailRight.length > 60) this.trailRight.shift();

        if (this.power <= 0 && this.speed <= 0) {
            this.explode();
        }

        this.score = this.closestBit.index * 10 * (this.level + 1);
    }

    addTrailParticle(relativeX, relativeY) {
        const size = rnd(2, 4);

        const { x, y } = this.relativeXY(relativeX, relativeY);

        const angle = Math.random() * Math.PI * 2;

        this.scene.add(new Particle(
            '#ccc',
            [size, size + rnd(15, 20)],
            [x, x + Math.cos(angle) * 50],
            [y, y + Math.sin(angle) * 50],
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
                ctx.strokeStyle = this.trailLeft[i].color;
                ctx.globalAlpha = 1 - between(0, (this.age - this.trailLeft[i].age) * 2, 1);
                ctx.beginPath();
                ctx.moveTo(this.trailLeft[i].x, this.trailLeft[i].y);
                ctx.lineTo(this.trailLeft[i + 1].x, this.trailLeft[i + 1].y);
                ctx.stroke();
            }

            for (let i = 0 ; i < this.trailRight.length - 1 ; i++) {
                ctx.strokeStyle = this.trailRight[i].color;
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

            ctx.fillStyle = '#fff';;
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

        ctx.wrap(() => {
            ctx.translate(this.x, this.y);
            const progress = min(1, (this.age - this.lastBoost) / 0.5);

            ctx.fillStyle = '#fff';
            ctx.globalAlpha = interpolate(0.5, 0, progress);
            ctx.beginPath();
            ctx.arc(0, 0, progress * 500, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    boost() {
        this.lastBoost = this.age;

        for (let i = 0 ; i < 50 ; i++) {
            const size = rnd(4, 8);
            const x = this.x + rnd(-20, 20);
            const y = this.y + rnd(-20, 20);
            const particleAngle = Math.random() * Math.PI * 2;

            this.scene.add(new Particle(
                '#0f0',
                [size, size + rnd(4, 8)],
                [x, x + Math.cos(particleAngle) * 100],
                [y, y + Math.sin(particleAngle) * 100],
                rnd(0.3, 0.6),
                [1, 0],
            ));
        }

        this.boostCount++;

        const oldLevel = this.level;
        this.setLevel(Math.floor(this.boostCount / 5));

        if (oldLevel < this.level) {
            this.lastLevelUp = this.age;
            levelUpSound();
        } else {
            boostSound();
        }
    }

    setLevel(level) {
        if (level === this.level) return;
        this.level = level;

        const COLORS = [
            '#94d',
            '#0bb',
            '#f39',
            '#f61',
            '#0c0',
            '#6df',
        ];
        if (this.scene) {
            firstItem(this.scene.category('background')).changeColor(COLORS[level % COLORS.length]);
        }

        this.maxSpeed = 500 + level * 100;
    }

    explode() {
        for (let i = 0 ; i < 100 ; i++) {
            const size = rnd(5, 10);
            const x = this.x + rnd(-20, 20);
            const y = this.y + rnd(-20, 20);
            const particleAngle = Math.random() * Math.PI * 2;

            const dist = rnd(50, 100);

            this.scene.add(new Particle(
                pick(['#ff0', '#f00', '#f80']),
                [size, size + rnd(5, 10)],
                [x, x + Math.cos(particleAngle) * dist],
                [y, y + Math.sin(particleAngle) * dist],
                rnd(0.1, 0.5),
                [1, 1],
            ));
        }

        firstItem(this.scene.category('camera')).shake(0.3);
        this.remove();

        setTimeout(() => level.scene.add(new Menu(this.score)), 1000);

        explosionSound();
    }
}
