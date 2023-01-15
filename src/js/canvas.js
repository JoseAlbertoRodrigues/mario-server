import platform from '../img/platform.png'
import hills from '../img/hills.png'
import background from '../img/background.png'
import platformSmallTall from '../img/platformSmallTall.png'

// Player 1
import spriteRunLeft from '../img/spriteRunLeft.png'
import spriteRunRight from '../img/spriteRunRight.png'
import spriteStandLeft from '../img/spriteStandLeft.png'
import spriteStandRight from '../img/spriteStandRight.png'

// Player 2
import idleRight from '../img/idleRight.png'
import idleLeft from '../img/idleLeft.png'
import runRight from '../img/runRight.png'
import runLeft from '../img/runLeft.png'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

addEventListener('load', function() {
    const gravity = 1.5

    class Player {
        constructor () {
            this.speed = 10
            this.position = {
                x: 100,
                y: 100
            }
            this.velocity = {
                x: 0,
                y: 0
            }
            // Player 1
            // this.width = 66
            // this.height = 150
            // this.image = createImage(spriteStandRight)

            this.frames = 0 // qual o quadro estamos

            // será um tipo de objeto, porque se eu quiser mudar o estado do sprite
            // eu usarei ele, tipo correndo, parado, talvez atirando, ainda verei o que posso fazer
            // this.sprites = {
            //     stand: {
            //         right: createImage(spriteStandRight),
            //         left: createImage(spriteStandLeft),
            //         cropWidth: 177, // largura do corte
            //         width: 66 // largura da versão pequena da imagem
            //     },
            //     run: {
            //         right: createImage(spriteRunRight),
            //         left: createImage(spriteRunLeft),
            //         cropWidth: 341, // largura do corte
            //         width: 127.875 // largura da versão pequena da imagem
            //     }
            // }
            // sprite atual player 1
            // this.currentSprite = this.sprites.stand.right
            // this.currentCropWidth = 177

            // Player 2
            this.width =  567 * 0.313 //imagem mais estreita 286 * 0.313 // 567 * 0.313
            this.height = 556 * 0.313 //estreita 475 * 0.313 // 556 * 0.313
            this.image = createImage(idleRight)
            this.sprites = {
                stand: {
                    right: createImage(idleRight),
                    left: createImage(idleLeft),
                    cropWidth: 567, //286, // 567 largura do corte
                    width: 567 * 0.313 // 286 * 0.313 // 567 * 0.313 // largura da versão pequena da imagem
                },
                run: {
                    right: createImage(runRight),
                    left: createImage(runLeft),
                    cropWidth: 567, //286, // 567 * 0.313 largura do corte, pode talvez ser quase o dobro
                    width: 567 * 0.313 //286 * 0.313 // 567 * 0.313 // largura da versão pequena da imagem
                }
            }
            // // sprite atual player 2
            this.currentSprite = this.sprites.stand.right
            this.currentCropWidth = 567 // 286 // 567
        }

        draw() {
            // c.fillStyle ='red'
            // c.fillRect(this.position.x, this.position.y, this.width, this.height)
            
            // Player 1
            // c.drawImage(
            //     this.currentSprite,
            //     this.currentCropWidth * this.frames,
            //     0,
            //     this.currentCropWidth,
            //     400,
            //     this.position.x,
            //     this.position.y,
            //     this.width,
            //     this.height)
            
            // Player 2
            c.strokeRect(this.position.x, this.position.y, this.width, this.height)
            c.drawImage(
                this.currentSprite,
                this.currentCropWidth * this.frames,
                0,
                this.currentCropWidth,
                556, // 475, // 556,
                this.position.x,
                this.position.y,
                this.width,
                this.height)
        }

        update() {
            this.frames++
            // player 1
            // if (this.frames > 59 && (this.currentSprite === this.sprites.stand.right ||
            //     this.currentSprite === this.sprites.stand.left)) {
            //     this.frames = 0
            // } else if (this.frames > 29  && (this.currentSprite === this.sprites.run.right ||
            //     this.currentSprite === this.sprites.run.left)) {
            //     this.frames = 0
            // }

            // player 2
            if (this.frames > 9  && (this.currentSprite === this.sprites.stand.right ||
                this.currentSprite === this.sprites.stand.left)) {
                this.frames = 0
            } else if (this.frames > 7  && (this.currentSprite === this.sprites.run.right ||
                this.currentSprite === this.sprites.run.left)) {
                this.frames = 0
            }

            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y

            // se o personagem sair da tela abaixo do chão
            if (this.position.y + this.height + this.velocity.y <= canvas.height) {
                this.velocity.y += gravity
            }
        }
    }

    class Platform {
        constructor({x, y, image}) {
            this.position = {
                x,
                y
            }
            this.width = image.width
            this.height = image.height
            this.image = image
        }

        draw() {
            c.drawImage(this.image, this.position.x, this.position.y)
        }
    }

    class GenericObject {
        constructor({x, y, image}) {
            this.position = {
                x,
                y
            }
            this.width = image.width
            this.height = image.height
            this.image = image
        }

        draw() {
            c.drawImage(this.image, this.position.x, this.position.y)
        }
    }

    function createImage(imageSrc) {
        const image = new Image()
        image.src = imageSrc
        return image
    }

    let platformImage = createImage(platform)
    let platformSmallTallImage = createImage(platformSmallTall)

    let player = new Player()
    let platforms = [] // usar esse agora
    let genericObjects = []

    let lastKey
    const keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        }
    }

    let scrollOffset = 0

    function init() {
        platformImage = createImage(platform)

        player = new Player()
        platforms = [
            new Platform({
                x: platformImage.width * 4 + 300 - 2 + platformImage.width - platformSmallTallImage.width,
                y: 270,
                image: createImage(platformSmallTall)
            }),
            new Platform({
                x: -1,
                y: 470,
                image: platformImage
            }),
            new Platform({
                x: platformImage.width - 3,
                y: 470,
                image: platformImage
            }),
            new Platform({
                x: platformImage.width * 2 + 100,
                y: 470,
                image: platformImage
            }),
            new Platform({
                x: platformImage.width * 3 + 300,
                y: 470,
                image: platformImage
            }),
            new Platform({
                x: platformImage.width * 4 + 300 - 2,
                y: 470,
                image: platformImage
            }),
            new Platform({
                x: platformImage.width * 5 + 800 - 2,
                y: 470,
                image: platformImage
            })
        ] // usar esse agora

        genericObjects = [
            new GenericObject({
                x: -1,
                y: -1,
                image: createImage(background)
            }),
            new GenericObject({
                x: -1,
                y: -1,
                image: createImage(hills)
            })
        ]

        scrollOffset = 0
    }

    function animate() {
        c.fillStyle = 'white'
        c.fillRect(0, 0, canvas.width, canvas.height)
        requestAnimationFrame(animate)

        genericObjects.forEach((genericObject) => {
            genericObject.draw()
        })

        platforms.forEach((platform) => {
            platform.draw()
        })
        player.update()

        // key Pressed
        if (keys.right.pressed && player.position.x < 400) {
            player.velocity.x = player.speed
        } else if ((keys.left.pressed && player.position.x > 100) 
        || keys.left.pressed && scrollOffset === 0 && player.position.x > 0) {
            player.velocity.x = -player.speed
        } else {
            player.velocity.x = 0

            if(keys.right.pressed) {
                scrollOffset += player.speed
                platforms.forEach(platform => {
                    platform.position.x -= player.speed
                })

                genericObjects.forEach((genericObject) => {
                    genericObject.position.x -= player.speed * 0.66
                })
            } else if(keys.left.pressed && scrollOffset > 0) {
                scrollOffset -= player.speed
                platforms.forEach(platform => {
                    platform.position.x += player.speed
                })

                genericObjects.forEach((genericObject) => {
                    genericObject.position.x += player.speed * 0.66
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

        // se a tecla está precionada
        // sprite switching
        if (keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.run.right) {
            player.frames = 1
            player.currentSprite = player.sprites.run.right
            player.currentCropWidth = player.sprites.run.cropWidth
            player.width = player.sprites.run.width
        } else if (keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.run.left) {
            player.currentSprite = player.sprites.run.left
            player.currentCropWidth = player.sprites.run.cropWidth
            player.width = player.sprites.run.width
        } else if (!keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.stand.left) {
            player.currentSprite = player.sprites.stand.left
            player.currentCropWidth = player.sprites.stand.cropWidth
            player.width = player.sprites.stand.width
        } else if (!keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.stand.right) {
            player.currentSprite = player.sprites.stand.right
            player.currentCropWidth = player.sprites.stand.cropWidth
            player.width = player.sprites.stand.width
        }

        // console.log(scrollOffset) testar se a rolagem passou de um determinado valor
        // win condition
        if (scrollOffset > platformImage.width * 5 + 300 - 2) {
            console.log('You Win! Parabêns!')
        }

        // lose condition
        if (player.position.y > canvas.height) {
            init()
            console.log('you lose')
        }
    }

    init()
    animate()

    addEventListener('keydown', ({key}) => {
        // console.log(event.key)
        switch (key) {
            case 'a':
                console.log('left')
                keys.left.pressed = true
                lastKey = 'left'
                // player.currentSprite = player.sprites.run.left
                // player.currentCropWidth = player.sprites.run.cropWidth
                // player.width = player.sprites.run.width
                break
            case 's':
                console.log('down')
                break
            case 'd':
                console.log('right')
                keys.right.pressed = true
                lastKey = 'right'
                // player.currentSprite = player.sprites.run.right
                // player.currentCropWidth = player.sprites.run.cropWidth
                // player.width = player.sprites.run.width
                break
            case 'w':
                console.log('up')
                // empurrar para cima sinal de -
                player.velocity.y -= 25
                break
        }
        // console.log(keys.right.pressed)
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
                // player.currentSprite = player.sprites.stand.right
                // player.currentCropWidth = player.sprites.stand.cropWidth
                // player.width = player.sprites.stand.width
                // player.velocity.x = 0
                break
            case 'w':
                console.log('up')
                // empurrar para cima sinal de -
                // player.velocity.y -= 10
                break
        }
        // console.log(keys.right.pressed)
    })
})