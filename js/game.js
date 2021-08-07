let game = {
    board: null,
    bombInterval: 0,
    canvas: null,
    ctx: null,
    dimensions: {
        max: {
            height: 360,
            width: 640
        },
        min: {
            height: 300,
            width: 300
        },
    },
    fitHeight(data) {
        this.width = Math.floor((data.realWidth * data.maxHeight) / data.realHeight);
        this.width = Math.min(this.width, data.maxWidth);
        this.width = Math.max(this.width, data.minWidth);
        this.height = Math.floor((this.width * data.realHeight) / data.realWidth);
        this.canvas.style.height = '100%';
    },
    fitWidth(data) {
        this.height = Math.floor((this.width * data.realHeight)/data.realWidth);
        this.height = Math.min(this.height, data.maxHeight);
        this.height = Math.max(this.height, data.minHeight);
        this.width = Math.floor((data.realWidth * this.height) / data.realHeight);
        this.canvas.style.width = '100%';
    },
    gameInterval: 0,
    height: 0,
    initDimensions() {
        let data = {
            maxWidth: this.dimensions.max.width,
            maxHeight: this.dimensions.max.height,
            minWidth: this.dimensions.min.width,
            minHeight: this.dimensions.min.height,
            realWidth: window.innerWidth,
            realHeight: window.innerHeight,
        };

        if ((data.realWidth/data.realHeight) > (data.maxWidth/data.maxHeight)) {
            this.fitWidth(data);
        } else {
            this.fitHeight(data);
        }

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
    },
    sounds: {
        bomb: null,
        food: null,
        theme: null,
    },
    sprites: {
        background: null,
        body: null,
        bomb: null,
        cell: null,
        food: null,
        head: null,
    },
    width: 0,
    init() {
        this.canvas = document.getElementById("mycanvas");
        this.ctx = this.canvas.getContext("2d");
        this.initDimensions();
    },
    start() {
        this.init();
        this.preload(() => {
            this.run();
        });
    },
    stop() {
        clearInterval(this.gameInterval);
        clearInterval(this.bombInterval);
        alert('Game over');
        window.location.reload();
    },
    preload(callback) {
        let loaded = 0;
        let required = Object.keys(this.sprites).length + Object.keys(this.sounds).length;

        let onAssetLoad = () => {
            ++loaded;

            if (loaded >= required) {
                // when all sprites will be upload
                callback();
            }
        };

        this.preloadSprites(onAssetLoad);
        this.preloadSounds(onAssetLoad);
    },
    preloadSprites(onAssetLoad) {
        for (let key in this.sprites) {
            this.sprites[key] = new Image();
            this.sprites[key].src = "img/" + key + ".png"; 
            this.sprites[key].addEventListener("load", onAssetLoad);
        }
    },
    preloadSounds(onAssetLoad) {
        for (let key in this.sounds) {
            this.sounds[key] = new Audio();
            this.sounds[key].src = "sounds/" + key + ".mp3"; 
            this.sounds[key].addEventListener("canplaythrough", onAssetLoad, { once: true });
        }
    },
    create() {
        // create game objects
        this.board.create();
        this.snake.create();
        this.board.createFood();
        this.board.createBomb();
        // set game events
        window.addEventListener('keydown', (e) => {
            this.snake.start(e.keyCode);
        });
    },
    random(min, max) {
        return Math.floor(Math.random() * (max + 1 - min) + min);
    },
    render() {
        // render game objects
        window.requestAnimationFrame(() => {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctx.drawImage(this.sprites.background, (this.width - this.sprites.background.width)/2, (this.height - this.sprites.background.height)/2);
            this.board.render();
            this.snake.render();
        });
    },
    update() {
        this.snake.move();
        this.render();
    },
    run() {
        this.create();
        // move snake every 100ms and render new frame
        this.gameInterval = setInterval(() => {
            this.update();
        }, 150);

        this.bombInterval = setInterval(() => {
            if (this.snake.moving) {
                this.board.createBomb();
            }
        }, 3000);
    },
};

game.start();