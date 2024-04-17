class HUD extends Entity {
    doRender(camera) {
        this.cancelCameraOffset(camera);

        const player = firstItem(this.scene.category('player'));
        if (!player) return;

        ctx.wrap(() => {
            const track = firstItem(this.scene.category('track'));
            ctx.globalAlpha = 0.5;

            ctx.translate(CANVAS_WIDTH / 2, 120);

            ctx.beginPath();
            ctx.rect(-200, -100, 400, 200);
            ctx.clip();

            ctx.translate(0, 80);
            ctx.scale(1 / 20, 1 / 20);
            ctx.rotate(-camera.rotation);
            ctx.translate(-camera.x, -camera.y);

            ctx.fillStyle = '#fff';
            ctx.beginPath();
            for (let i = 0 ; i < track.trackBits.length ; i++) {
                const bit = track.trackBits[i];
                ctx.lineTo(bit.pointAt(-1).x, bit.pointAt(-1).y);
            }
            for (let i = track.trackBits.length - 1 ; i >= 0 ; i--) {
                const bit = track.trackBits[i];
                ctx.lineTo(bit.pointAt(1).x, bit.pointAt(1).y);
            }
            ctx.fill();
        });

        ctx.shadowColor = '#000';
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;

        ctx.wrap(() => {
            ctx.translate(20, 40);

            for (const [label, value] of [
                // ['TIME', formatTime(player.age)],
                ['SCORE', Math.round(player.score).toLocaleString('en')],
                ['ZONE', player.level + 1],
            ]) {
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'right';
                ctx.fillStyle = '#fff';

                ctx.font = 'italic bold 12pt Impact';
                ctx.fillText(label, 40, 0);

                // const width = ctx.measureText(label).width + 20;
                ctx.textAlign = 'left';
                ctx.font = 'bold 48pt Impact';
                ctx.fillText(value, 60, 0);

                ctx.translate(0, 65);
            }
        })


        if (player.closestBit && Math.abs(normalize(player.rotation - player.closestBit.angle)) > Math.PI * 4 / 5) {
            ctx.font = 'bold 48pt Impact';
            ctx.textBaseline = 'center';
            ctx.textAlign = 'center';

            ctx.fillStyle = '#fff';
            ctx.fillText('WRONG WAY', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4);
        }

        ctx.wrap(() => {
            ctx.translate(CANVAS_WIDTH - 60, CANVAS_HEIGHT - 20);

            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, 40, -(CANVAS_HEIGHT - 40));

            ctx.fillStyle = player.power > 0.3 ? '#fff' : '#f00';
            ctx.fillRect(0, 0, 40, -(CANVAS_HEIGHT - 40) * player.power);

            ctx.translate(20, -10);
            ctx.rotate(-Math.PI / 2);
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 24pt Impact';
            ctx.fillText('POWER', 0, 0);
        });

        ctx.wrap(() => {
            ctx.translate(CANVAS_WIDTH - 200, CANVAS_HEIGHT - 140);

            const speed = distP(0, 0, player.inertia.x, player.inertia.y);
            const speedRatio = speed / player.maxSpeed;

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 48pt Impact';
            ctx.fillText(Math.round(speed).toString(), 0, 0);

            ctx.font = 'bold 18pt Impact';
            ctx.fillText('SPEED', 0, 40);

            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 20;
            ctx.beginPath();
            ctx.arc(0, 0, 100, Math.PI / 2, Math.PI / 2 + Math.PI * 2 * speedRatio);
            ctx.stroke();
        });

        for (const [x, y, down] of [
            [0, 0, player.controls.brake],
            [-1, 0, player.controls.left],
            [1, 0, player.controls.right],
            [0, -1, player.controls.accelerate],
        ]) {
            ctx.wrap(() => {
                ctx.translate(150, CANVAS_HEIGHT - 100);

                ctx.fillStyle = down ? '#f00' : '#fff';
                ctx.translate(x * 70, y * 70);
                ctx.fillRect(-20, -20, 60, 60);
            })
        }
    }
}
