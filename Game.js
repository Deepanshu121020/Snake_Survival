import {
    WIDTH,
    HEIGHT,
    MAXLEVEL,
    SPEED,
    CELLSIZE,
    COLORS,
    Directions
} from "./constants.js";

import { Grid } from './grid.js';
import { Snake } from './snake.js';

export class Game {
    constructor() {

        this.running = false;

        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.canvas.width = WIDTH * CELLSIZE;
        this.canvas.height = HEIGHT * CELLSIZE;

        this.canvas.style.width = WIDTH * CELLSIZE + 'px';
        this.canvas.style.height = HEIGHT * CELLSIZE + 'px';

        this.configuration = {
            level: 0,
            speed: SPEED,
            width: this.canvas.width,
            height: this.canvas.height,
            nbCellsX: WIDTH,
            nbCellsY: HEIGHT,
            cellSize: CELLSIZE,
            color: COLORS[0]
        };

        this.grid = new Grid(this);
        this.snake = new Snake(this);
        this.score = 0;

        document.addEventListener('keydown', this.onKeyDown);
    }

    start() {
        this.running = true;
        this.nextMove = 0;
        requestAnimationFrame(this.loop);

    };

    loop = (time) => {
        requestAnimationFrame(this.loop);

        if (this.running) {
            if (time >= this.nextMove) {
                this.nextMove = time + this.configuration.speed;

                this.snake.move();

                switch (this.checkState()) {
                    case -1:
                        this.end();
                        break;
                    case 1:
                        this.score += 100;

                        this.snake.grow();

                        this.grid.eat(this.snake.head);

                        if (this.grid.isDone()) {
                            this.levelUp();
                        };
                    default:
                        this.draw();
                }
            }
        }
    }

    levelUp() {
        this.score += 1000;

        this.configuration.level++;

        if (this.configuration.level >= MAXLEVEL) {
            alert("Kudos! You Completed the game!");
            this.stop();
            return;
        }

        this.configuration.speed -= 10;
        this.configuration.color = COLORS[this.configuration.level];
        this.grid.seed();
    }

    stop() {
        this.running = false;
    }

    end() {
        alert('Better Luck Next Time !!! Your Score is ' + this.score);
        this.stop();
    }

    draw() {
        const { width, height, color } = this.configuration;
        const context = this.canvas.getContext('2d');

        context.fillStyle = color;
        context.fillRect(0, 0, width, height);

        this.grid.draw(context);
        this.snake.draw(context);
    }

    checkState() {
        const head = this.snake.head;
        //
        if (this.grid.isOutside(head) || this.snake.isTail(head)) {
            return -1;
        }

        if (this.grid.isApple(head)) {
            return 1;
        }

        return 0;
    }

    onKeyDown = (event) => {
        event.preventDefault();

        switch (event.key) {
            case 'ArrowUp':
                this.snake.setDirection(Directions.UP);
                break;
            case 'ArrowDown':
                this.snake.setDirection(Directions.DOWN);
                break;
            case 'ArrowLeft':
                this.snake.setDirection(Directions.LEFT);
                break;
            case 'ArrowRight':
                this.snake.setDirection(Directions.RIGHT);
                break;
        }
    }
}