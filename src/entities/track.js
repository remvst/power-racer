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
        this.width = 400;
        this.next = null;
        this.previous = null;
    }

    get angle() {
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
        const polygon = [];

        if (this.previous) {
            const previousLeft = this.previous.pointAt(-1);
            polygon.push([previousLeft.x, previousLeft.y]);
        }

        const thisLeft = this.pointAt(-1);
        polygon.push([thisLeft.x, thisLeft.y]);

        if (this.next) {
            const nextLeft = this.next?.pointAt(-1);
            const nextRight = this.next?.pointAt(1);
            polygon.push([nextLeft.x, nextLeft.y]);
            polygon.push([nextRight.x, nextRight.y]);
        }

        const thisRight = this.pointAt(1);
        polygon.push([thisRight.x, thisRight.y]);

        if (this.previous) {
            const previousRight = this.previous?.pointAt(1);
            polygon.push([previousRight.x, previousRight.y]);
        }

        return polygon;
    }
}

class Track extends Entity {

    constructor() {
        super();

        this.categories.push('track');
        this.trackBits = [];

        // for (let y = -500 ; y < 500 ; y += 50) {
        //     this.addTrackBit(new TrackBit(Math.sin(y * Math.PI * 2 / 1000) * 200, -y));
        // }

        this.addTrackBit(new TrackBit(0, 0));
        this.addTrackBit(new TrackBit(100, 50));
        this.addTrackBit(new TrackBit(200, 50));
        this.extendTrack();
        this.extendTrack();
        this.extendTrack();
        this.extendTrack();
        this.extendTrack();
        this.extendTrack();
        this.extendTrack();
        this.extendTrack();
        this.extendTrack();
    }

    extendTrack() {
        const lastBit = this.trackBits[this.trackBits.length - 1]
        const baseAngle = this.trackBits[this.trackBits.length - 1].angle;

        // const length = rnd(200, 400);
        const length = 400;

        const finalX = length;
        const finalY = length * pick([-1, 1]);

        const bits = length / 50;

        const curve = (x) => Math.pow(x, 2);

        for (let i = 1 ; i <= bits ; i++) {
            const progress = i / (bits - 1);
            const x = progress * finalX;
            const y = curve(progress) * finalY;
            const angleFromOrigin = Math.atan2(y, x);
            const distFromOrigin = distP(0, 0, x, y);

            const adjustedX = lastBit.x + Math.cos(baseAngle + angleFromOrigin) * distFromOrigin;
            const adjustedY = lastBit.y + Math.sin(baseAngle + angleFromOrigin) * distFromOrigin;
            this.addTrackBit(new TrackBit(adjustedX, adjustedY));
        }
        // console.log('last index', this.trackBits.length - 1);
    }

    addTrackBit(trackBit) {
        const currentLast = this.trackBits[this.trackBits.length - 1];
        if (currentLast) {
            currentLast.next = trackBit;
            trackBit.previous = currentLast;
        }
        this.trackBits.push(trackBit);
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

    render() {
        ctx.fillStyle = 'red';

        ctx.strokeStyle = 'white';
        // ctx.lineCap = 'round';
        // ctx.lineJoin = 'round';

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

        ctx.lineWidth = 30;
        for (const xOffset of [-1, 1]) {
            ctx.beginPath();
            for (const bit of this.trackBits) {
                ctx.lineTo(bit.pointAt(xOffset).x, bit.pointAt(xOffset).y);
            }
            ctx.stroke();
        }

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

            ctx.fillText(`${i++}`, bit.x, bit.y);

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
