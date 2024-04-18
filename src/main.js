onload = () => {
    can = document.querySelector('canvas');
    can.width = CANVAS_WIDTH;
    can.height = CANVAS_HEIGHT;

    ctx = can.getContext('2d');
    onresize();
    frame();
};

let lastFrame = performance.now();

level = new Level();

frame = () => {
    const current = performance.now();
    const elapsed = (current - lastFrame) / 1000;
    lastFrame = current;

    // Game update
    level.scene.cycle(elapsed)

    // Rendering
    ctx.wrap(() => level.scene.render());

    if (DEBUG) {
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.font = '14pt Courier';
        ctx.lineWidth = 3;

        let y = CANVAS_HEIGHT - 10;
        for (const line of [
            'FPS: ' + ~~(1 / elapsed),
            'Entities: ' + level.scene.entities.size,
            'Track bits: ' + firstItem(level.scene.category('track'))?.trackBits?.length,
        ].reverse()) {
            ctx.strokeText(line, 10, y);
            ctx.fillText(line, 10, y);
            y -= 20;
        }
    }

    requestAnimationFrame(frame);
}

onclick = () => {
    playSong();

    const menu = firstItem(level.scene.category('menu'));
    if (menu) {
        if (!firstItem(level.scene.category('player'))) {
            level = new Level();
            firstItem(level.scene.category('menu')).remove();
        } else {
            menu.remove();
        }
    }
};
