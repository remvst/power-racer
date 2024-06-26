class Level {
    constructor() {
        this.scene = new Scene();

        this.scene.add(new Background());
        this.scene.add(new Track());
        // this.scene.add(new TrackTester());
        this.scene.add(new Player());
        this.scene.add(new Camera());
        this.scene.add(new TrackPerspective());
        this.scene.add(new HUD());
        this.scene.add(new Menu());

        DOWN = {};
    }

    cycle(elapsed) {
        this.scene.cycle(elapsed);
    }
}
