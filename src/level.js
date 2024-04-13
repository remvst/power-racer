class Level {
    constructor() {
        this.scene = new Scene();

        this.scene.add(new Track());
        // this.scene.add(new TrackTester());
        this.scene.add(new Player());
        this.scene.add(new Camera());

        DOWN = {};
    }

    cycle(elapsed) {
        this.scene.cycle(elapsed);
    }
}
