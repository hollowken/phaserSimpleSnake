const MAX_WIDTH = Math.floor(document.body.clientWidth / 32);
const MAX_HEIGHT = Math.floor((screen.height - 150) / 32);
let direction = 'right',
    fruct,
    snake = [],
    score,
    gameLoop;

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let game = new Phaser.Game(MAX_WIDTH * 32, MAX_HEIGHT * 32);

let gameState = {
    preload: function () {
        game.load.image('head', 'assets/head.png');
        game.load.image('tail', 'assets/tail.png');
        game.load.image('fruct', 'assets/fruct.png');
    },

    create: function () {
        clearInterval(gameLoop);
        game.stage.backgroundColor = '#3598db';
        direction = 'right';
        snake = [
            game.add.sprite(4 * 32, 4 * 32, 'head'),
            game.add.sprite(3 * 32, 4 * 32, 'tail'),
            game.add.sprite(2 * 32, 4 * 32, 'tail'),
            game.add.sprite(32, 4 * 32, 'tail')
        ];

        fruct = game.add.sprite(12 * 32, 12 * 32, 'fruct');
        score = 0;

        // get keys for WASD control
        let wKey = game.input.keyboard.addKey(Phaser.Keyboard.W),
            sKey = game.input.keyboard.addKey(Phaser.Keyboard.S),
            aKey = game.input.keyboard.addKey(Phaser.Keyboard.A),
            dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        // ....................

        // functions that change moving direction of Snake by WASD keys
        wKey.onDown.add(function () {
            direction = 'up';
        }, this);
        sKey.onDown.add(function () {
            direction = 'down';
        }, this);
        aKey.onDown.add(function () {
            direction = 'left';
        }, this);
        dKey.onDown.add(function () {
            direction = 'right';
        }, this);
        // ....................

        gameLoop = setInterval(updateSnake, 150);
    },

    update: function () {
    }
};

game.state.add('game', gameState);

function updateSnake() {

    for (let i = snake.length - 1; i > 0; i--) {
        snake[i].x = snake[i - 1].x;
        snake[i].y = snake[i - 1].y;
    }

    switch (direction) {
        case 'left':
            snake[0].x -= 32;
            if (snake[0].x < 0) snake[0].x = (MAX_WIDTH - 1) * 32;
            break;
        case 'right':
            snake[0].x += 32;
            if (snake[0].x > (MAX_WIDTH - 1) * 32) snake[0].x = 0;
            break;
        case 'up':
            snake[0].y -= 32;
            if (snake[0].y < 0) snake[0].y = (MAX_HEIGHT - 1) * 32;
            break;
        case 'down':
            snake[0].y += 32;
            if (snake[0].y > (MAX_HEIGHT - 1) * 32) snake[0].y = 0;
            break;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) game.state.start('game');
        if (snake[0].x === fruct.x && snake[0].y === fruct.y) {
            fruct.x = randomInt(1, MAX_WIDTH - 1) * 32;
            fruct.y = randomInt(1, MAX_HEIGHT - 1) * 32;
            snake.push(game.add.sprite(snake[snake.length - 1].x, snake[snake.length - 1].y, 'tail'));
            score++;
        }
    }
}

game.state.start('game');