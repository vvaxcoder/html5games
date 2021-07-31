game.snake = {
    cells: [],
    create() {
        let startCells = [
            { row: 7, col: 7 },
            { row: 8, col: 7 },
        ];

        this.direction = this.directions.up;

        for (let startCell of startCells) {
            this.cells.push(this.game.board.getCell(startCell.row, startCell.col));
        }
    },
    direction: false,
    directions: {
        up: {
            row: -1,
            col: 0,
            angle: 0,
        },
        down: {
            row: 1,
            col: 0,
            angle: 180,

        },
        right: {
            row: 0,
            col: 1,
            angle: 90,
        },
        left: {
            row: 0,
            col: -1,
            angle: 270,
        },
    },
    game: game,
    getNextCell() {
        let head = this.cells[0];

        let row = head.row + this.direction.row;
        let col = head.col + this.direction.col;

        return this.game.board.getCell(row, col);
    },
    hasCell(cell) {
        this.cells.find(part => part === cell);
    },
    renderHead() {
        // get head of snake and rebder it
        let head = this.cells[0];
        let halfSize = this.game.sprites.head.width / 2;
        // save prev context
        this.game.ctx.save();
        // move the origin to the center of the head
        this.game.ctx.translate(head.x, head.y);
        // move the origin to the coordinates of the head
        this.game.ctx.translate(halfSize, halfSize);
        // rotate context relative the sprite's center
        this.game.ctx.rotate(this.direction.angle * Math.PI / 180);
        // rendering the head with contextual rotation
        this.game.ctx.drawImage(this.game.sprites.head, -halfSize, -halfSize);
        // restore the source state of the context
        this.game.ctx.restore();
    },
    renderBody() {
        for (let i = 1; i < this.cells.length; i++) {
            this.game.ctx.drawImage(this.game.sprites.body, this.cells[i].x, this.cells[i].y);
        }
    },
    render() {
        this.renderHead();
        this.renderBody();
    },
    move() {
        if (!this.moving) {
            return;
        }

        // get next cell
        let cell = this.getNextCell();
        /**
         * if cell exists add new cell in the snake.cells
         * remove last cell from snake.cells
         */
        if (cell) {
            this.cells.unshift(cell);

            if (!this.game.board.isFoodCell(cell)) {
                // if the next cell isn't an apple - remove the tail of the snake
                this.cells.pop();
            }
            else {
                // if new cell is an apple
                this.game.board.createFood();
            }
        }
    },
    moving: false,
    start(keyCode) {
        switch (keyCode) {
            case 38: this.direction = this.directions.up;
                break;
            case 37: this.direction = this.directions.left;
                break;
            case 39: this.direction = this.directions.right;
                break;
            case 40: this.direction = this.directions.down;
                break;
        }

        this.moving = true;
    },
};