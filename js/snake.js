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
        },
        down: {
            row: 1,
            col: 0,

        },
        right: {
            row: 0,
            col: 1,

        },
        left: {
            row: 0,
            col: -1,
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
    render() {
        this.cells.forEach(cell => {
            this.game.ctx.drawImage(this.game.sprites.body, cell.x, cell.y);
        });
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
            this.cells.pop();
        }
    },
    moving: false,
    start(keyCode) {
        switch(keyCode) {
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