game.board = {
    cells: [],
    create() {
        this.createCells();
    },
    createCell(row, col) {
        let cellSize = this.game.sprites.cell.width + 1;

        let offsetX = (this.game.width - cellSize * this.size) / 2;
        let offsetY = (this.game.height - cellSize * this.size) / 2;

        return {
            row: row, 
            col: col,
            x: offsetX + cellSize * col,
            y: offsetY + cellSize * row,
        };
    },
    createCells() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                this.cells.push(this.createCell(row, col));
            }
        }
    },
    createCellObject(type) {
        let cell = this.cells.find(cell => cell.type === type);

        if (cell) {
            cell.type = false;
        }

        cell = this.getRandomAvailableCell();
        cell.type = type;
    },
    createBomb() {
        this.createCellObject('bomb');
    },
    createFood() {
        this.createCellObject('food');
    },
    game: game,
    getCell(row, col) {
        return this.cells.find(cell => cell.row === row && cell.col === col);
    },
    getRandomAvailableCell() {
        let pool = this.cells.filter(cell => !cell.type && !this.game.snake.hasCell(cell));

        let index = this.game.random(0, pool.length - 1);

        return pool[index];
    },
    isFoodCell(cell) {
        return cell.type === 'food';
    },
    isBombCell(cell) {
        return cell.type === 'bomb';
    },
    render() {
        this.cells.forEach(cell => {
            this.game.ctx.drawImage(this.game.sprites.cell, cell.x, cell.y);

            if (cell.type) {
                this.game.ctx.drawImage(this.game.sprites[cell.type], cell.x, cell.y);
            }
        });
    },
    size: 15,
};