let game = {
    start: () => {
        console.log('method start has been called');
        this.ctx = document.querySelector("#myCanvas").getContext("2d");
        let background = new Image();
        background.src = "img/background.png";
        window.requestAnimationFrame(() => {
            this.ctx.drawImage(background, 0, 0);
        });

        console.log(background);
    }
};

window.addEventListener('load', () => {
    game.start();
});