const KEYS = {
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32
};

let game = {
    ball: null,
    blocks: [],
    rows: 4,
    columns: 8,
    width: 640,
    height: 360,
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
            if (e.keyCode === KEYS.SPACE) {
                this.platform.fire();
            }

            else if (e.keyCode === KEYS.LEFT || e.keyCode === KEYS.RIGHT) {
                this.platform.start(e.keyCode);
            }
        });

        window.addEventListener("keyup", e => {
            this.platform.stop();
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
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.drawImage(this.sprites.background, 0, 0);
        this.ctx.drawImage(this.sprites.ball, 0, 0, this.ball.width, this.ball.height, this.ball.x,
            this.ball.y, this.ball.width, this.ball.height);
        this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
        this.renderBlocks();
    },
    renderBlocks() {
        for (const block of this.blocks) {
            if (block.active) {
                this.ctx.drawImage(this.sprites.block, block.x, block.y);
            }
        }
    },
    create() {
        for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column < this.columns; column++) {
                this.blocks = [...this.blocks,
                {
                    active: true,
                    x: (64 * column) + 65,
                    y: (24 * row) + 35,
                    height: 20,
                    width: 60
                }
                ];
                // this.blocks.push({ x: 60 * column, y: 20 * row });
            }
        }
    },
    collideBlocks() {
        for (const block of this.blocks) {
            if (block.active && this.ball.collide(block)) {
                this.ball.bumpBlock(block);
            }
        }
    },
    collidePlatform() {
        if (this.ball.collide(this.platform)) {
            this.ball.bumpPlatform(this.platform);
        }

    },
    update() {
        this.platform.move();
        this.ball.move();
        this.collideBlocks();
        this.collidePlatform();
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
    },
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
};

game.ball = {
    dy: 0,
    velocity: 3,
    x: 320,
    y: 280,
    width: 20,
    height: 20,
    bumpBlock(block) {
        this.dy *= -1;
        block.active = false;
    },
    bumpPlatform(platform) {
        this.dy *= -1;
        let touchX = this.x + this.width / 2;
        this.dx = this.velocity * platform.getTouchOffset(touchX);
    },
    collide(element) {
        let x = this.x + this.dx;
        let y = this.y + this.dy;

        if (x + this.width > element.x && x < element.x + element.width &&
            y + this.height > element.y && y < element.y + element.height) {
            return true;
        } else {
            return false;
        }
    },
    move() {
        if (this.dy) {
            this.y += this.dy;
        }
        if (this.dx) {
            this.x += this.dx;
        }
    },
    start() {
        this.dx = game.random(-this.velocity, this.velocity);
        this.dy = -this.velocity;
    }
};

game.platform = {
    ball: game.ball,
    velocity: 6,
    dx: 0,
    x: 280,
    y: 300,
    height: 14,
    width: 100,
    fire() {
        if (this.ball) {
            this.ball.start();
            this.ball = null;
        }
    },
    getTouchOffset(xArg) {
        let diff = (this.x + this.width) - xArg;
        let offset = this.width - diff;
        let result = 2 * offset / this.width;
        return result - 1;
    },
    move() {
        if (this.dx) {
            this.x += this.dx;

            if (this.ball) {
                game.ball.x += this.dx;
            }
        }
    },
    start(direction) {
        if (direction === KEYS.LEFT) {
            this.dx = -this.velocity;
        }
        else if (direction === KEYS.RIGHT) {
            this.dx = this.velocity;
        }
    },
    stop() {
        this.dx = 0;
    }
};

window.addEventListener('load', () => {
    game.start();
});