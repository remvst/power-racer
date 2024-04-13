class Level {
    constructor() {
        this.scene = new Scene();

        this.scene.add(new Camera());
        this.scene.add(new Track());

        DOWN = {};
    }

    cycle(elapsed) {
        this.scene.cycle(elapsed);
    }
}
