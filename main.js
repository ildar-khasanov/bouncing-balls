const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const width = canvas.width = window.innerWidth
const heigth = canvas.height = window.innerHeight

const para = document.querySelector('p')




function random(min, max) {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

function randomRGB() {
    return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}


// consructor

function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}

function Ball(x, y, velX, velY, exists, size, color) {
    Shape.call(this, x, y, velX, velY, exists);

    this.size = size;
    this.color = color;

};

function EvilCircle(x, y, velX, velY, exists, size, color) {
    Shape.call(this, x, y, 20, 20, exists);

    this.size = 20;
    this.color = 'white';
}


// Метод рисует белый круг
EvilCircle.prototype.draw = function () {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();

}

// Белый круг можно передвигать с помощью клавиш (W, A, S, D)
EvilCircle.prototype.setControls = function () {
    var _this = this;
    window.onkeydown = function (e) {
        if (e.keyCode === 65) {
            _this.x -= _this.velX;
        } else if (e.keyCode === 68) {
            _this.x += _this.velX;
        } else if (e.keyCode === 87) {
            _this.y -= _this.velY;
        } else if (e.keyCode === 83) {
            _this.y += _this.velY;
        }
    }
}

EvilCircle.prototype.CheckBounds = function () {

    if ((this.x + this.size) >= width) {
        this.x = width - this.size
    }

    if ((this.x - this.size) < 0) {
        this.x = this.size
    }
    if ((this.y + this.size) >= heigth) {
        this.y = heigth - this.size
    }

    if ((this.y - this.size) < 0) {
        this.y = this.size
    }
}

EvilCircle.prototype.collisionDetect = function () {
    for (const ball of balls)
        if (ball.exists === true) {
            const dx = this.x - ball.x
            const dy = this.y - ball.y

            const distanse = Math.sqrt(dx * dx + dy * dy)

            if (distanse < this.size + ball.size) {
                ball.exists = false;
                count--
                para.innerHTML = `Ball count: ${count}`

            }
        }
}

const eCircle = new EvilCircle(random(0, width),
    random(0, heigth))

Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}


Ball.prototype.update = function () {
    if ((this.x + this.size) >= width) {
        this.velX = -this.velX
    }

    if ((this.x - this.size) < 0) {
        this.velX = -this.velX
    }
    if ((this.y + this.size) >= heigth) {
        this.velY = -this.velY
    }

    if ((this.y - this.size) < 0) {
        this.velY = -this.velY
    }

    this.x += this.velX
    this.y += this.velY
}

// При столкновение шаров, они получают рандомный цвет
Ball.prototype.collisionDetect = function () {
    for (const ball of balls)
        if (!(this === ball)) {
            const dx = this.x - ball.x
            const dy = this.y - ball.y

            const distanse = Math.sqrt(dx * dx + dy * dy)

            if (distanse < this.size + ball.size) {
                this.color = ball.color = randomRGB();
            }
        }
}

const balls = [];

// В пустой массив balls добавляются экземпляры объектов
while (balls.length < 15) {
    const ballCircle = new Ball(
        random(0, width), // x
        random(0, heigth), //y 
        random(-7, 7), // velX
        random(-7, 7), // velY
        true,
        random(10, 25), // excits
        'rgb(' + random(0, 250) + ',' + random(0, 250) + ',' + random(0, 250) + ')',
    );

    balls.push(ballCircle)

}
let count = balls.length


function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, heigth)

    eCircle.setControls()

    for (const ball of balls) {
        if (ball.exists) {
            ball.draw();
            ball.update()
            ball.collisionDetect()

            eCircle.draw()
            eCircle.CheckBounds()
            eCircle.collisionDetect()

        }

    }
    requestAnimationFrame(loop);
}

loop();


// Определение конструктора и прототипа
Ball.prototype = Object.create(Shape.prototype)
Object.defineProperty(Ball.prototype, 'constructor', {
    value: Ball,
    enumerable: false, // false, чтобы данное свойство не появлялось в цикле for in
    writable: true
});

EvilCircle.prototype = Object.create(Shape.prototype)
Object.defineProperty(EvilCircle.prototype, 'constructor', {
    value: EvilCircle,
    enumerable: false, // false, чтобы данное свойство не появлялось в цикле for in
    writable: true
});

