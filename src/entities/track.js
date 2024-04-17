function inside(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

class TrackBit {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 600;
        this.next = null;
        this.previous = null;
        this.distance = 0;
        this.index = 0;
    }

    get angle() {
        if (this.next && this.previous) {
            return normalize(angleBetween(this.previous, this.next));
        }
        if (this.next) return angleBetween(this, this.next);
        if (this.previous) return angleBetween(this.previous, this);
        return 0;
    }

    pointAt(xOffset) {
        return {
            x: this.x + Math.cos(this.angle + Math.PI / 2) * xOffset * this.width / 2,
            y: this.y + Math.sin(this.angle + Math.PI / 2) * xOffset * this.width / 2,
        };
    }

    contains(x, y) {
        const { polygon } = this;

        return inside([x, y], polygon);
    }

    get polygon() {
        if (!this.cachedPolygon) {
            this.cachedPolygon = [];

            if (this.previous) {
                const previousLeft = this.previous.pointAt(-1);
                this.cachedPolygon.push([previousLeft.x, previousLeft.y]);
            }

            const thisLeft = this.pointAt(-1);
            this.cachedPolygon.push([thisLeft.x, thisLeft.y]);

            if (this.next) {
                const nextLeft = this.next?.pointAt(-1);
                const nextRight = this.next?.pointAt(1);
                this.cachedPolygon.push([nextLeft.x, nextLeft.y]);
                this.cachedPolygon.push([nextRight.x, nextRight.y]);
            }

            const thisRight = this.pointAt(1);
            this.cachedPolygon.push([thisRight.x, thisRight.y]);

            if (this.previous) {
                const previousRight = this.previous?.pointAt(1);
                this.cachedPolygon.push([previousRight.x, previousRight.y]);
            }
        }
        return this.cachedPolygon;
    }
}

class Track extends Entity {

    constructor() {
        super();

        this.categories.push('track');
        this.trackBits = [];

        for (let distance = -500 ; distance < 2000 ; distance += 200) {
            this.addTrackBit(new TrackBit(distance, 0));
        }
        this.lastBoost = 0;
    }

    extend(generateBits) {
        const lastBit = this.trackBits[this.trackBits.length - 1];
        const baseAngle = lastBit.angle;

        const player = firstItem(this.scene.category('player'));

        const width = Math.random() < 0.2
            ? pick([0.8, 1, 1.2]) * player.maxSpeed * 0.8
            : lastBit.width;

        const doAdd = (x, y) => {
            const angleFromOrigin = Math.atan2(y, x);
            const distFromOrigin = distP(0, 0, x, y);
            const adjustedX = lastBit.x + Math.cos(baseAngle + angleFromOrigin) * distFromOrigin;
            const adjustedY = lastBit.y + Math.sin(baseAngle + angleFromOrigin) * distFromOrigin;
            const bit = new TrackBit(adjustedX, adjustedY);
            bit.width = width;
            return this.addTrackBit(bit);
        }

        generateBits(doAdd, lastBit);
    }

    addStraightLine() {
        const player = firstItem(this.scene.category('player'));

        const length = rnd(0.3, 2) * player.maxSpeed * 0.8;
        const bitCount = Math.ceil(length / 100);

        this.extend((add) => {
            for (let i = 1 ; i <= bitCount ; i++) {
                add(
                    length * i / bitCount,
                    0,
                );
            }
        });
    }

    addCurve() {
        const player = firstItem(this.scene.category('player'));

        this.extend((add, lastBit) => {
            const baseAngle = lastBit.angle;

            const minFinalAngle = -Math.PI / 2;
            const maxFinalAngle = Math.PI / 2;

            const finalCurveAngle = rnd(minFinalAngle, maxFinalAngle); // TODO random

            const startRelativeAngle = 0;
            const endRelativeAngle = normalize(finalCurveAngle - baseAngle);

            const curveRadius = rnd(1, 3) * player.maxSpeed * 0.8;

            const curveCenterX = 0;
            const curveCenterY = Math.sin(endRelativeAngle) > 0 ? curveRadius : -curveRadius;

            const totalCurveAngle = normalize(Math.abs(endRelativeAngle - startRelativeAngle));
            const totalCurveDistance = (totalCurveAngle / (Math.PI * 2)) * (curveRadius * Math.PI * 2);
            const bitCount = Math.ceil(totalCurveDistance / 100);

            for (let i = 1 ; i <= bitCount ; i++) {
                const progress = i / bitCount;

                const angle = -Math.atan2(curveCenterY, 0) + progress * (endRelativeAngle - startRelativeAngle) + startRelativeAngle;

                add(
                    curveCenterX + Math.cos(angle) * curveRadius,
                    curveCenterY + Math.sin(angle) * curveRadius,
                );
            }
        });
    }

    addTrackBit(trackBit) {
        const currentLast = this.trackBits[this.trackBits.length - 1];
        if (currentLast) {
            currentLast.next = trackBit;
            trackBit.previous = currentLast;
            trackBit.distance = currentLast.distance + dist(trackBit, trackBit.previous);
            trackBit.index = currentLast.index + 1;
        }
        this.trackBits.push(trackBit);

        if (this.scene) {
            const player = firstItem(this.scene.category('player'));
            if (player && trackBit.distance - this.lastBoost > player.maxSpeed * 2) {
                this.lastBoost = trackBit.distance;

                const booster = pick([
                    new Booster(),
                    // new Drain(),
                ]);
                const position = trackBit.pointAt(pick([0, 0.6, -0.6]));
                booster.x = position.x;
                booster.y = position.y;
                booster.rotation = trackBit.angle;
                this.scene.add(booster);
            }
        }

        return trackBit;
    }

    contains(x, y) {
        return !!this.closeTrackBit(x, y);
    }

    closeTrackBit(x, y) {
        // TODO cache this
        for (const bit of this.trackBits) {
            if (distP(bit.x, bit.y, x, y) < bit.width / 2)  {
                return bit;
            }
        }

        return null;
    }

    closestTrackBit(x, y) {
        let closest = null;
        let closestDistance =  Number.MAX_VALUE;

        // TODO cache this
        for (const bit of this.trackBits) {
            const dist = distP(bit.x, bit.y, x, y);
            if (dist < closestDistance)  {
                closest = bit;
                closestDistance = dist;
            }
        }

        return closest;
    }

    prune(currentDistance) {
        // Get rid of now-irrelevant bits
        while (this.trackBits[0].distance < currentDistance - CANVAS_WIDTH * 2) {
            this.trackBits.shift();
        }

        // Extend
        const lastBit = this.trackBits[this.trackBits.length - 1];
        if (lastBit.distance < currentDistance + CANVAS_WIDTH * 4) {
            const curveCount = rnd(1, 4);
            for (let i = 0 ; i < curveCount ; i++) {
                this.addCurve();
            }
            this.addStraightLine();
        }
    }

    doRender(camera) {
        ctx.fillStyle = '#000';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        for (let i = 0 ; i < this.trackBits.length ; i++) {
            const bit = this.trackBits[i];
            ctx.lineTo(bit.pointAt(-1).x, bit.pointAt(-1).y);
        }
        for (let i = this.trackBits.length - 1 ; i >= 0 ; i--) {
            const bit = this.trackBits[i];
            ctx.lineTo(bit.pointAt(1).x, bit.pointAt(1).y);
        }
        ctx.fill();
        ctx.globalAlpha = 1;

        const backgroundColor = firstItem(this.scene.category('background')).transitionedColor;

        const trackColor1 = multiplyColor(backgroundColor, 0.1);
        const trackColor2 = multiplyColor(backgroundColor, 0.2);
        for (const bit of this.trackBits) {
            if (!bit.next) continue;
            ctx.fillStyle = ((bit.distance % 400) / 400) < 0.5 ? trackColor1 : trackColor2;
            ctx.beginPath();
            ctx.lineTo(bit.pointAt(-1).x, bit.pointAt(-1).y);
            ctx.lineTo(bit.pointAt(1).x, bit.pointAt(1).y);
            ctx.lineTo(bit.next.pointAt(1).x, bit.next.pointAt(1).y);
            ctx.lineTo(bit.next.pointAt(-1).x, bit.next.pointAt(-1).y);
            ctx.fill();
        }

        ctx.strokeStyle = multiplyColor(backgroundColor, 0.8);
        ctx.lineWidth = 30;
        for (const xOffset of [-1, 1]) {
            ctx.beginPath();
            for (const bit of this.trackBits) {
                ctx.lineTo(bit.pointAt(xOffset).x, bit.pointAt(xOffset).y);
            }
            ctx.stroke();
        }

        ctx.strokeStyle = multiplyColor(backgroundColor, 0.4);
        ctx.lineWidth = 2;
        for (const xOffset of [-0.33, 0.33]) {
            ctx.beginPath();
            for (const bit of this.trackBits) {
                ctx.lineTo(bit.pointAt(xOffset).x, bit.pointAt(xOffset).y);
            }
            ctx.stroke();
        }

        return;

        let i = 0;
        for (const bit of this.trackBits) {
            ctx.fillStyle = '#f00';
            ctx.lineWidth = 1;
            ctx.fillRect(bit.pointAt(1).x - 5, bit.pointAt(1).y - 5, 10, 10);

            // ctx.fillText(`${i++}`, bit.x, bit.y);
            ctx.fillText(`${Math.round(bit.distance)}`, bit.x, bit.y);

            ctx.beginPath();
            ctx.moveTo(bit.x, bit.y);
            ctx.lineTo(bit.x + Math.cos(bit.angle) * 20, bit.y + Math.sin(bit.angle) * 20);
            ctx.stroke();

            ctx.beginPath();
            for (const xOffset of [-1, 1]) {
                ctx.lineTo(bit.pointAt(xOffset).x, bit.pointAt(xOffset).y);
            }
            ctx.stroke();
        }
    }
}
