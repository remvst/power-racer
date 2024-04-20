class Menu extends Entity {
    constructor(score) {
        super();
        this.categories.push('menu');
        this.score = score;
    }

    doRender(camera) {
        this.cancelCameraOffset(camera);

        ctx.wrap(() => {
            ctx.fillStyle = '#000';
            ctx.globalAlpha = 0.5;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        });

        ctx.shadowColor = '#000';
        ctx.shadowOffsetY = 10;

        ctx.fillStyle = '#fff';

        ctx.wrap(() => {
            ctx.font = '144pt Impact';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4);
            let k = 0;
            for (const line of ['POWER', 'RACER']) {
                let i = 0;
                for (const char of line.split('')) {
                    ctx.wrap(() => {
                        ctx.translate((i / (line.length - 1) - 0.5) * 700, 0);

                        const scale = interpolate(0, 1, this.age - k * 0.05, easeOutBack);
                        ctx.scale(scale, scale);

                        ctx.fillText(char, 0, 0);
                        i++;
                        k++;
                    })
                }
                ctx.translate(0, 170);
            }
        });

        ctx.wrap(() => {
            if ((this.age % 1) / 1 < 0.5) {
                ctx.font = '24pt Impact';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('[CLICK TO START]', CANVAS_WIDTH / 2, CANVAS_HEIGHT * 5 / 6);
            }
        });

        ctx.wrap(() => {
            if (this.score) {
                ctx.font = '48pt Impact';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('SCORE: ' + this.score.toLocaleString('en'), CANVAS_WIDTH / 2, CANVAS_HEIGHT * 2 / 3);
            }
        });
    }
}
