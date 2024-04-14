class HUD extends Entity {
    doRender(camera) {
        this.cancelCameraOffset(camera);

        const player = firstItem(this.scene.category('player'));
        if (!player) return;

        if (player.closestBit && Math.abs(normalize(player.rotation - player.closestBit.angle)) > Math.PI * 4 / 5) {
            ctx.font = 'bold 48pt Impact';
            ctx.textBaseline = 'center';
            ctx.textAlign = 'center';

            ctx.fillStyle = '#000';
            ctx.fillText('WRONG WAY', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4 + 5);

            ctx.fillStyle = '#fff';
            ctx.fillText('WRONG WAY', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4);
        }

        ctx.wrap(() => {
            ctx.translate(CANVAS_WIDTH - 60, CANVAS_HEIGHT - 20);

            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, 40, -CANVAS_HEIGHT + 40);

            ctx.translate(4, -4);

            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, 40, -CANVAS_HEIGHT + 40);

            ctx.translate(20, -10);
            ctx.rotate(-Math.PI / 2);
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#000';
            ctx.font = 'bold 24pt Impact';
            ctx.fillText('POWER', 0, 0);
        });

        ctx.wrap(() => {
            ctx.translate(CANVAS_WIDTH - 200, CANVAS_HEIGHT - 200);

            const speed = distP(0, 0, player.inertia.x, player.inertia.y);
            const speedRatio = speed / player.maxSpeed;

            ctx.shadowColor = '#000';
            ctx.shadowOffsetX = 4;
            ctx.shadowOffsetY = 4;

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 48pt Impact';
            ctx.fillText(Math.round(speed).toString(), 0, 0);

            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 20;
            ctx.beginPath();
            ctx.arc(0, 0, 100, Math.PI / 2, Math.PI / 2 + Math.PI * 2 * speedRatio);
            ctx.stroke();
        });
    }
}
