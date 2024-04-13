class Player extends Ship {
    constructor() {
        super();
        this.categories.push('player');
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        if (DOWN[37]) {
            this.rotation -= Math.PI * elapsed;
        } else if (DOWN[39]) {
            this.rotation += Math.PI * elapsed;
        }

        if (DOWN[38]) {
            this.x += Math.cos(this.rotation) * 200 * elapsed;
            this.y += Math.sin(this.rotation) * 200 * elapsed;
        }
    }
}
