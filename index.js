import 'p5';

function sketch(s) {

  const GAME = { width: 500, height: 400, gameOver: false, win: false }
  GAME.halfWidth = GAME.width / 2
  GAME.halfHeight = GAME.height / 2

  let streetImage;
  let heroImage;
  let hitSound;
  let backgroundSound;
  let backgroundSound2;
  let whooshSound;
  let hornSound;
  let hornSound2;
  let gameOverSound;
  let coinSound;
  let winGameSound;
  let timer = 20;
  let timeout = null
  
  const hero = { x: 100, y: 366, yA: 366, yB: 5, width: 30, height: 30, hitted: false, keys: 0, maxKeys: 1 }
  const key = { x: 100, y: 4, width: 28, height: 28, yA: 4, yB: 366, inverse: false, image: null, imagePath: 'assets/key.png'}
  
  const initialXCar = GAME.width + 100;
  const cars = [
    { x: initialXCar, y: 40,  width: 50, height: 40, speed: 2,    image: null, imagePath: 'assets/carro-1.png', horn: 1 },
    { x: initialXCar, y: 96,  width: 50, height: 40, speed: 2.5,  image: null, imagePath: 'assets/carro-2.png', horn: 2 },
    { x: initialXCar, y: 150, width: 50, height: 40, speed: 3.2,  image: null, imagePath: 'assets/carro-3.png', horn: 1 },
    { x: initialXCar, y: 210, width: 50, height: 40, speed: 5,    image: null, imagePath: 'assets/carro-2.png', horn: 2 },
    { x: initialXCar, y: 266, width: 50, height: 40, speed: 3.3,  image: null, imagePath: 'assets/carro-3.png', horn: 1 },
    { x: initialXCar, y: 318, width: 50, height: 40, speed: 2.2,  image: null, imagePath: 'assets/carro-1.png', horn: 2 },
  ]

  s.preload = () => {
    streetImage = s.loadImage('assets/estrada.png')
    heroImage = s.loadImage('assets/ator-1.png')
    key.image = s.loadImage(key.imagePath)
    hitSound = s.loadSound('assets/sons/colidiu.mp3')
    backgroundSound = s.loadSound('assets/sons/mixkit-game-level-music.wav')
    backgroundSound2 = s.loadSound('assets/sons/mixkit-urban-city-sounds-and-light-car-traffic.wav')
    whooshSound = s.loadSound('assets/sons/mixkit-air-woosh.wav')
    hornSound = s.loadSound('assets/sons/mixkit-car-horn.wav')
    hornSound2 = s.loadSound('assets/sons/mixkit-small-car-horn.wav')
    gameOverSound = s.loadSound('assets/sons/mixkit-player-losing-or-failing.wav')
    winGameSound = s.loadSound('assets/sons/mixkit-fantasy-game-success-notification.wav')
    coinSound = s.loadSound('assets/sons/mixkit-arcade-game-jump-coin.wav')
    
    for (const car of cars) {
      car.image = s.loadImage(car.imagePath)
    }
  }

  s.setup = () => {
    const canvas = s.createCanvas(GAME.width, GAME.height)
    canvas.parent('sketch-canvas')

    streetImage.loadPixels()
    
    backgroundSound.loop()
    backgroundSound.setVolume(0.1)
    backgroundSound2.loop()
    backgroundSound2.setVolume(0.2)
  }
  
  s.draw = () => {
    if(streetImage) {
      s.background(streetImage)
      
      s.image(key.image, key.x, key.y, key.width, key.height)

      showHero()
      showCars()
      showTimer()
      showDisclaimer()
      
      if (GAME.gameOver === false && GAME.win === false) {
        moveCars()
        moveHero()
        collisionCarHero()
        collisionHeroKey()
        calcTimer()
      }

      if (GAME.gameOver) {
        showGameOver()
        if (!timeout) {
          setTimeout(() => resetGame(), 2000);
          timeout = true
        }
      }
      
      if(GAME.win === true) {
        showWinScreen()
        if (!timeout) {
          setTimeout(() => resetGame(), 2000);
          timeout = true
        }
      }
    }
  }

  function showHero() {
    // Make hero show/hide animation
    if(hero.hitted === false || s.frameCount % 4 !== 0) {
      hero.image = s.image(heroImage, hero.x, hero.y, hero.width, hero.height)
    }
  }

  function showCars() {
    for(let car of cars) {
      s.image(car.image, car.x, car.y, car.width, car.height)
    }
  }

  function showDisclaimer() {
    s.textSize(15)
    s.fill('blue')
    s.text(`${hero.maxKeys - hero.keys} Chaves perdidas`, GAME.width - 190, GAME.height - 12)
  }

  function showTimer() {
    s.textSize(25)
    s.fill('red')
    s.text('0:' + timer, GAME.width - 55, GAME.height - 10)
  }

  function showGameOver() {
    s.background('pink')
    s.fill('black')
    s.textSize(30)
    s.text('Game Over', 130, 180)
    s.image(heroImage, 200, 200, hero.width, hero.height)
  }

  function showWinScreen(){
    s.background('pink')
    s.fill('black')
    s.textSize(30)
    s.text('Parabéns!', 150, 180)
    s.textSize(20)
    s.text(`${hero.keys} Chaves coletadas.`, 130, 215)
    s.image(heroImage, 200, 240, hero.width, hero.height)
  }

  function moveCars() {
    for(let car of cars) {
      car.x -= car.speed

      if(car.x < -(car.width + 10)) {
        car.x = initialXCar
      }
    }
  }

  function collisionCarHero() {
    for(let car of cars) {
      hitHeroCar(car)
      whooshHornSounds(car)
    }
  }

  function hitHeroCar(car) {
    let hit = s.collideRectCircle(car.x,car.y,car.width,car.height,hero.x,hero.y,hero.width/2)

    if(hit && hero.hitted === false) {
      hitSound.play()
      hero.hitted = true;

      setTimeout(() => {
        hero.hitted = false;
        backHeroToInitial()
      }, 2000);
    }
  }

  function whooshHornSounds(car) {
    let hit = s.collideRectRect(car.x, car.y, car.width, car.height, hero.x - 10, hero.y - 10, hero.width + 10, hero.height + 10)
    if(hit && hero.hitted === false && whooshSound.isPlaying() === false) {
      whooshSound.play();

      if(hero.y < 366 - hero.height && hero.y > hero.height + 10 ) {
        const horn = car.horn === 1 ? hornSound : hornSound2;
        
        horn.play();
        horn.setVolume(0.5)
      }
    }
  }

  function backHeroToInitial() {
    hero.y = key.inverse ? hero.yB : hero.yA;
  }

  function collisionHeroKey() {
    let hit = false;
    hit = s.collideRectCircle(key.x, key.y, key.width, key.height, hero.x, hero.y, hero.width/2)

    if(hit) {
      coinSound.play()
      key.y = key.inverse ? key.yA : key.yB;
      key.inverse = !key.inverse;
      hero.keys += 1;
      
      if(hero.keys === hero.maxKeys) {
        winWave()
        backHeroToInitial()
      }
    }
  }

  function winWave() {
    GAME.win = true;
    hero.maxKeys = hero.maxKeys < 5 ? hero.maxKeys + 1 : hero.maxKeys;
    backgroundSound.pause()
    backgroundSound2.pause()
    winGameSound.play()
  }

  function moveHero() {
    if (hero.hitted) {
      return
    }

    if (s.keyIsDown(s.UP_ARROW)) {
      if (collisionHeroBorder(hero.y - 3) === false) {
        hero.y -= 3;
      }
    }

    if (s.keyIsDown(s.DOWN_ARROW)) {
      if (collisionHeroBorder(hero.y + 3) === false) {
        hero.y += 3;
      }
    }
  }

  function collisionHeroBorder(heroY) {
    return heroY < 0 || (heroY + hero.height) > GAME.height;
  }

  function calcTimer() {
    if (s.frameCount % 60 === 0 && timer > 0) {
      timer -= 1;
    } else if (timer === 0){
      setGameOver()
    }
  }

  function setGameOver() {
    GAME.gameOver = true;
    hero.maxKeys = 1;
    backgroundSound.pause()
    backgroundSound2.pause()
    gameOverSound.play()
  }

  function resetGame() {
    GAME.gameOver = false
    GAME.win = false
    timer = 20
    hero.keys = 0
    hero.hitted = false
    backgroundSound.play()
    backgroundSound2.play()
    backHeroToInitial()
    timeout = null
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const buttonFullscreen = document.querySelector('#fullscreen')
  
  new p5((s) => sketch(s, buttonFullscreen))
})

