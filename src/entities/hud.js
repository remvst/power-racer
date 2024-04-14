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
    }
}
