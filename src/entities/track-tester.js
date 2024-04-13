class TrackTester extends Entity {

    addTrackBit(trackBit) {
        const currentLast = this.trackBits[this.trackBits.length - 1];
        if (currentLast) {
            currentLast.next = trackBit;
            trackBit.previous = currentLast;
        }
        this.trackBits.push(trackBit);
    }

    render() {
        ctx.fillStyle = 'red';

        const track = firstItem(this.scene.category('track'));
        if (!track) return;

        for (let x = -400 ; x < 400 ; x += 10) {
            for (let y = -400 ; y < 200 ; y += 10) {
                ctx.fillStyle = track.contains(x, y) ? 'green' : 'red';
                ctx.fillRect(x - 2, y - 2, 4, 4);
            }
        }
    }
}
