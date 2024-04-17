class TrackPerspective extends Entity {

    doRender(camera) {
        const track = firstItem(this.scene.category('track'));

        const background = firstItem(this.scene.category('background'));
        const backgroundColor = background.transitionedColor;

        ctx.strokeStyle = multiplyColor(backgroundColor, 1);
        ctx.lineWidth = 3;

        ctx.fillStyle = multiplyColor(backgroundColor, 0.6);
        for (const xOffset of [-1.05, 1.05]) {
            for (const bit of track.trackBits) {
                if (!bit.next) continue;

                ctx.beginPath();

                const left = bit.pointAt(xOffset);
                const nextLeft = bit.next.pointAt(xOffset);

                ctx.lineTo(left.x, left.y);
                ctx.lineTo(nextLeft.x, nextLeft.y);

                const leftExtended = bit.pointAt(xOffset);
                const nextLeftExtended = bit.next.pointAt(xOffset);

                leftExtended.x += (leftExtended.x - camera.x) / 4;
                leftExtended.y += (leftExtended.y - camera.y) / 4;

                nextLeftExtended.x += (nextLeftExtended.x - camera.x) / 4;
                nextLeftExtended.y += (nextLeftExtended.y - camera.y) / 4;

                ctx.lineTo(nextLeftExtended.x, nextLeftExtended.y);
                ctx.lineTo(leftExtended.x, leftExtended.y);

                ctx.fill();
                ctx.stroke();
            }
        }

        ctx.fillStyle = backgroundColor;
        for (const xOffset of [-1.05, 1.05]) {
            for (const bit of track.trackBits) {

                if (!bit.next) continue;

                ctx.beginPath();

                const left = bit.pointAt(xOffset);
                const nextLeft = bit.next.pointAt(xOffset);

                nextLeft.x += (nextLeft.x - camera.x) / 4;
                nextLeft.y += (nextLeft.y - camera.y) / 4;

                left.x += (left.x - camera.x) / 4;
                left.y += (left.y - camera.y) / 4;

                ctx.lineTo(left.x, left.y);
                ctx.lineTo(nextLeft.x, nextLeft.y);

                const leftExtended = bit.pointAt(xOffset * 1.2);
                const nextLeftExtended = bit.next.pointAt(xOffset * 1.2);

                ctx.lineTo(nextLeftExtended.x, nextLeftExtended.y);
                ctx.lineTo(leftExtended.x, leftExtended.y);

                ctx.fill();
            }
        }
    }
}
