class Level {
    constructor() {
        this.scene = new Scene();

        this.scene.add(new Camera());

        DOWN = {};
    }

    cycle(elapsed) {
        this.scene.cycle(elapsed);
    }
}
