class TrackBit {
    constructor() {
        this.x = this.y = 0;
    }
}

class Track extends Entity {

    constructor() {
        super();

        this.trackBits = [];
    }

    render() {
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 100, 100);
    }
}
