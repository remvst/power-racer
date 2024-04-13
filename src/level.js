class Level {
    constructor() {
        this.scene = new Scene();

        this.scene.add(new Camera());
        this.scene.add(new Track());
        this.scene.add(new TrackTester());

        DOWN = {};
    }

    cycle(elapsed) {
        this.scene.cycle(elapsed);
    }
}
