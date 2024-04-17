class TrackPerspective extends Entity {

    doRender(camera) {
        const track = firstItem(this.scene.category('track'));

        const background = firstItem(this.scene.category('background'));
        const backgroundColor = background.transitionedColor;

        ctx.strokeStyle = multiplyColor(backgroundColor, 1);
        ctx.lineWidth = 3;

        ctx.fillStyle = multiplyColor(backgroundColor, 0.6);

        const left = {};
        const nextLeft = {};

        for (const xOffset of [-1.05, 1.05]) {
            for (const bit of track.trackBits) {
                if (!bit.next) continue;

                ctx.beginPath();

                bit.pointAt(xOffset, left);
                bit.next.pointAt(xOffset, nextLeft);

                ctx.lineTo(left.x, left.y);
                ctx.lineTo(nextLeft.x, nextLeft.y);

                left.x += (left.x - camera.x) / 4;
                left.y += (left.y - camera.y) / 4;

                nextLeft.x += (nextLeft.x - camera.x) / 4;
                nextLeft.y += (nextLeft.y - camera.y) / 4;

                ctx.lineTo(nextLeft.x, nextLeft.y);
                ctx.lineTo(left.x, left.y);

                ctx.fill();
                ctx.stroke();
            }
        }

        ctx.fillStyle = backgroundColor;
        for (const xOffset of [-1.05, 1.05]) {
            for (const bit of track.trackBits) {

                if (!bit.next) continue;

                ctx.beginPath();

                bit.pointAt(xOffset, left);
                bit.next.pointAt(xOffset, nextLeft);

                nextLeft.x += (nextLeft.x - camera.x) / 4;
                nextLeft.y += (nextLeft.y - camera.y) / 4;

                left.x += (left.x - camera.x) / 4;
                left.y += (left.y - camera.y) / 4;

                ctx.lineTo(left.x, left.y);
                ctx.lineTo(nextLeft.x, nextLeft.y);

                bit.pointAt(xOffset * 1.2, left);
                bit.next.pointAt(xOffset * 1.2, nextLeft);

                ctx.lineTo(nextLeft.x, nextLeft.y);
                ctx.lineTo(left.x, left.y);

                ctx.fill();
            }
        }
    }
}
