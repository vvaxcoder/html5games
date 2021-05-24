let game = {
    ball: null,
    blocks: [],
    rows: 4,
    columns: 8,
    ctx: null,
    platform: null,
    sprites: {
        background: null,
        ball: null,
        platform: null,
        block: null,
    },
    init: function () {
        this.ctx = document.querySelector("#myCanvas").getContext("2d");
        this.setEvents();
    },
    setEvents() {
        window.addEventListener("keydown", e => {
            // move to the left
            if (e.keyCode === 37) {
                this.platform.dx = -this.platform.velocity;
            }
            // move to the right
            else if (e.keyCode === 39) {
                this.platform.dx = this.platform.velocity;
            }
        });

        window.addEventListener("keyup", e => {
            this.platform.dx = 0;
        });
    },
    preload(callback) {
        let loaded = 0;
        let required = Object.keys(this.sprites).length;
        const onImageLoad = () => {
            loaded++;
            if (loaded >= required) {
                callback();
            }
        };

        for (let key in this.sprites) {
            this.sprites[key] = new Image();
            this.sprites[key].src = `img/${key}.png`;
            this.sprites[key].addEventListener("load", onImageLoad);
        }
    },
    render() {
        this.ctx.drawImage(this.sprites.background, 0, 0);
        this.ctx.drawImage(this.sprites.ball, 0, 0, this.ball.width, this.ball.height, this.ball.x,
                           this.ball.y, this.ball.width, this.ball.height);
        this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
        this.renderBlocks();
    },
    renderBlocks() {
        for (const block of this.blocks) {
            this.ctx.drawImage(this.sprites.block, block.x, block.y);
        }
    },
    create() {
        for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column < this.columns; column++) {
                this.blocks = [...this.blocks, { x: (64 * column) + 65, y: (24 * row) + 35 }];
                // this.blocks.push({ x: 60 * column, y: 20 * row });
            }
        }
    },
    update() {
        this.platform.move();
    },
    run() {
        window.requestAnimationFrame(() => {
            this.update();
            this.render();
            this.run();
        });
    },
    start: function () {
        this.init();
        this.preload(() => {
            this.create();
            this.run();
        });
        this.render();
    }
};

game.ball = {
    x: 320,
    y: 280,
    width: 20,
    height: 20
};

game.platform = {
    velocity: 6,
    dx: 0,
    x: 280,
    y: 300,
    move() {
        if (this.dx) {
            this.x += this.dx;
        }
    }
};

window.addEventListener('load', () => {
    game.start();
});