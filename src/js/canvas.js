import platform from '../img/platform.png'
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const gravity = 0.5

class Player {
    constructor () {
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 30
        this.height = 30
    }

    draw() {
        c.fillStyle ='red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity
        } else {
            this.velocity.y = 0
        }
    }
}

class Platform {
    constructor({x, y}) {
        this.position = {
            x,
            y
        }

        this.width = 200
        this.height = 20
    }

    draw() {
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const player = new Player()

const platforms = [
    new Platform({
        x:200,
        y:200
    }),
    new Platform({
        x:600,
        y:300
    }),
    new Platform({
        x:1000,
        y:400
    })
] // usar esse agora

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

let scrollOffset = 0

function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height)
    requestAnimationFrame(animate)
    player.update()
    platforms.forEach(platform => {
        platform.draw()
    })

    // key Pressed
    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = 5
    } else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -5
    } else {
        player.velocity.x = 0

        if(keys.right.pressed) {
            scrollOffset += 5
            platforms.forEach(platform => {
                platform.position.x -= 5
            })
        } else if(keys.left.pressed) {
            scrollOffset -= 5
            platforms.forEach(platform => {
                platform.position.x += 5
            })
        }
    }

    // platform collision detection
    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0
        }
    })

    // console.log(scrollOffset) testar se a rolagem passou de um determinado valor
    if (scrollOffset > 2000) {
        console.log('You Win! Parabêns!')
    }
}

animate()

addEventListener('keydown', ({key}) => {
    // console.log(event.key)
    switch (key) {
        case 'a':
            console.log('left')
            keys.left.pressed = true
            break
        case 's':
            console.log('down')
            break
        case 'd':
            console.log('right')
            keys.right.pressed = true
            break
        case 'w':
            console.log('up')
            // empurrar para cima sinal de -
            player.velocity.y -= 10
            break
    }
    console.log(keys.right.pressed)
})

// adicionado para o jogador parar de se mover quando pressionar uma tecla
addEventListener('keyup', ({key}) => {
    // console.log(event.key)
    switch (key) {
        case 'a':
            console.log('left')
            keys.left.pressed = false
            break
        case 's':
            console.log('down')
            break
        case 'd':
            console.log('right')
            keys.right.pressed = false
            // player.velocity.x = 0
            break
        case 'w':
            console.log('up')
            // empurrar para cima sinal de -
            player.velocity.y -= 10
            break
    }
    console.log(keys.right.pressed)
})