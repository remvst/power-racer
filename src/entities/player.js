class Player extends Ship {
    constructor() {
        super();
        this.categories.push('player');
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        if (firstItem(this.scene.category('menu'))) return;

        this.controls.left = DOWN[37];
        this.controls.right = DOWN[39];
        this.controls.brake = DOWN[40];
        this.controls.accelerate = DOWN[38];
    }
}
