let game = {
    board: null,
    canvas: null,
    ctx: null,
    height: 360,
    sprites: {
        background: null,
        body: null,
        cell: null,
    },
    width: 640,
    init() {
        this.canvas = document.getElementById("mycanvas");
        this.ctx = this.canvas.getContext("2d");
    },
    start() {
        this.init();
        this.preload(() => {
            this.run();
        });
    },
    preload(callback) {
        let loaded = 0;
        let required = Object.keys(this.sprites).length;

        let onAssetLoad = () => {
            ++loaded;

            if (loaded >= required) {
                // when all sprites will be upload
                callback();
            }
        };

        for (let key in this.sprites) {
            this.sprites[key] = new Image();
            this.sprites[key].src = "img/" + key + ".png"; 
            this.sprites[key].addEventListener("load", onAssetLoad);
        }


    },
    run() {
        this.board.create();
        this.snake.create();

        window.requestAnimationFrame(() => {
            this.ctx.drawImage(this.sprites.background, 0, 0);
            this.board.render();
            this.snake.render();
        });
    },
};

game.start();