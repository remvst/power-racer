class TrackBit {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 200;
        this.next = null;
        this.previous = null;
    }

    get angle() {
        const previousPosition = this.previous || {'x': this.x, 'y': this.y + 1};

        const anglePreviousToMe = normalize(angleBetween(previousPosition, this));
        if (!this.next) return anglePreviousToMe;

        const angleMeToNext = normalize(angleBetween(this, this.next));

        return (angleMeToNext + anglePreviousToMe) / 2;
    }

    pointAt(xOffset) {
        return {
            x: this.x + Math.cos(this.angle + Math.PI / 2) * xOffset * this.width / 2,
            y: this.y + Math.sin(this.angle + Math.PI / 2) * xOffset * this.width / 2,
        };
    }
}

class Track extends Entity {

    constructor() {
        super();

        this.categories.push('track');
        this.trackBits = [];

        for (let y = -500 ; y < 500 ; y += 20) {
            this.addTrackBit(new TrackBit(Math.sin(y * Math.PI * 2 / 1000) * 200, -y));
        }
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

    render() {
        ctx.fillStyle = 'red';

        ctx.strokeStyle = 'white';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.fillStyle = '#000';
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

        ctx.lineWidth = 20;
        for (const xOffset of [-1, 1]) {
            ctx.beginPath();
            for (const bit of this.trackBits) {
                if (!bit.next) continue;
                ctx.lineTo(bit.pointAt(xOffset).x, bit.pointAt(xOffset).y);
            }
            ctx.stroke();
        }

        ctx.lineWidth = 2;
        for (const xOffset of [-0.33, 0.33]) {
            ctx.beginPath();
            for (const bit of this.trackBits) {
                if (!bit.next) continue;
                ctx.lineTo(bit.pointAt(xOffset).x, bit.pointAt(xOffset).y);
            }
            ctx.stroke();
        }

        return;

        for (const bit of this.trackBits) {
            ctx.fillRect(bit.x - 2, bit.y - 2, 4, 4);

            if (bit.next) {
                ctx.lineWidth = 20;
                for (const xOffset of [-1, 1]) {
                    ctx.beginPath();
                    ctx.moveTo(bit.pointAt(xOffset).x, bit.pointAt(xOffset).y);
                    ctx.lineTo(bit.next.pointAt(xOffset).x, bit.next.pointAt(xOffset).y);
                    ctx.stroke();
                }

                ctx.lineWidth = 2;
                for (const xOffset of [-0.33, 0.33]) {
                    ctx.beginPath();
                    ctx.moveTo(bit.pointAt(xOffset).x, bit.pointAt(xOffset).y);
                    ctx.lineTo(bit.next.pointAt(xOffset).x, bit.next.pointAt(xOffset).y);
                    ctx.stroke();
                }
            }
        }
    }
}
