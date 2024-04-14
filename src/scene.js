
class Scene {
    constructor() {
        this.entities = new Set();
        this.categories = new Map();

        this.speedRatio = 1;
        this.onCycle = new Set();
    }

    add(entity) {
        if (this.entities.has(entity)) return;
        this.entities.add(entity);
        entity.scene = this;

        for (const category of entity.categories) {
            if (!this.categories.has(category)) {
                this.categories.set(category, new Set([entity]));
            } else {
                this.categories.get(category).add(entity);
            }
        }

        return entity;
    }

    category(category) {
        return this.categories.get(category) || [];
    }

    remove(entity) {
        this.entities.delete(entity);

        for (const category of entity.categories) {
            if (this.categories.has(category)) {
                this.categories.get(category).delete(entity);
            }
        }
    }

    cycle(elapsed) {
        if (DEBUG && DOWN[70]) elapsed *= 3;
        if (DEBUG && DOWN[71]) elapsed *= 0.1;
        if (GAME_PAUSED) return;

        for (const entity of this.entities) {
            entity.cycle(elapsed * (entity.affectedBySpeedRatio ? this.speedRatio : 1));
        }

        for (const onCycle of this.onCycle) {
            onCycle();
        }
    }

    pathCurve(x) {
        const main = sin(x * TWO_PI / 2000) * 200;
        const wiggle = sin(x * TWO_PI / 1000) * 100;
        return main + wiggle;
    }

    render() {
        const camera = firstItem(this.category('camera'));

        ctx.wrap(() => {
            ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
            ctx.rotate(-camera.rotation);
            ctx.scale(camera.zoom, camera.zoom);
            ctx.translate(-camera.x, -camera.y);

            for (const entity of this.entities) {
                ctx.wrap(() => entity.render());
            }
        });
    }

    async waitFor(condition) {
        return new Promise((resolve) => {
            const checker = () => {
                if (condition()) {
                    this.onCycle.delete(checker);
                    resolve();
                }
            };
            this.onCycle.add(checker);
        })
    }

    async delay(timeout) {
        const entity = this.add(new Entity());
        await this.waitFor(() => entity.age > timeout);
        entity.remove();
    }
}
