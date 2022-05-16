import 'p5';

function sketch(s) {

  const GAME = { width: 500, height: 400, gameOver: true }
  GAME.halfWidth = GAME.width / 2
  GAME.halfHeight = GAME.height / 2

  let streetImage;
  let heroImage;
  let hitSound;
  let backgroundSound;
  let points = 500;
  let timer = 20;
  
  const hero = { x: 100, y: 366, yA: 366, yB: 0, width: 30, height: 30 }
  const key = { x: 100, y: 4, width: 28, height: 28, yA: 4, yB: 366, inverse: false, image: null, imagePath: 'assets/key.png'}

  const initialXCar = GAME.width + 100;
  const cars = [
    { x: initialXCar, y: 40, width: 50, height: 40, speed: 2, image: null, imagePath: 'assets/carro-1.png' },
    { x: initialXCar, y: 96, width: 50, height: 40, speed: 2.5, image: null, imagePath: 'assets/carro-2.png' },
    { x: initialXCar, y: 150, width: 50, height: 40, speed: 3.2, image: null, imagePath: 'assets/carro-3.png' },
    { x: initialXCar, y: 210, width: 50, height: 40, speed: 5, image: null, imagePath: 'assets/carro-2.png' },
    { x: initialXCar, y: 266, width: 50, height: 40, speed: 3.3, image: null, imagePath: 'assets/carro-3.png' },
    { x: initialXCar, y: 318, width: 50, height: 40, speed: 2.2, image: null, imagePath: 'assets/carro-1.png' },
  ]

  s.preload = () => {
    streetImage = s.loadImage('assets/estrada.png')
    heroImage = s.loadImage('assets/ator-1.png')
    key.image = s.loadImage(key.imagePath)
    hitSound = s.loadSound('assets/sons/colidiu.mp3')
    backgroundSound = s.loadSound('assets/sons/trilha.mp3')
    
    for (const car of cars) {
      car.image = s.loadImage(car.imagePath)
    }
  }

  s.setup = () => {
    const canvas = s.createCanvas(GAME.width, GAME.height)
    canvas.parent('sketch-canvas')
  }
  
  s.draw = () => {
    if(streetImage) {
      s.background(streetImage)
      s.image(heroImage, hero.x, hero.y, hero.width, hero.height)
      s.image(key.image, key.x, key.y, key.width, key.height)
      showCars()
      showPoints()
      showTimer()
      
      if (GAME.gameOver === false) {
        moveCars()
        moveHero()
        collisionCarHero()
        collisionHeroKey()
        calcTimer()
      } else {
        showGameOver()
        setTimeout(() => resetGame(), 1000);
      }
      
    }
  }

  function showCars() {
    for(let car of cars) {
      s.image(car.image, car.x, car.y, car.width, car.height)
    }
  }

  function showPoints() {
    s.textSize(25)
    s.fill('gold')
    s.text(points, 10, 27)
  }

  function showTimer() {
    s.textSize(25)
    s.fill('red')
    s.text(timer, GAME.width - 50, GAME.height - 10)
  }

  function showGameOver() {
    s.background('pink')
    s.fill('black')
    s.textSize(30)
    s.text('Total de pontos: ' + points, 80, 180)
    s.image(heroImage, 200, 200, hero.width, hero.height)
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
    let hit = false;
    for(let car of cars) {
      hit = s.collideRectCircle(car.x,car.y,car.width,car.height,hero.x,hero.y,hero.width/2)

      if(hit) {
        hitSound.play()
        hero.y = key.inverse ? hero.yB : hero.yA;
        points -= 50;
        points = points < 0 ? 0 : points;
      }
    }
  }

  function collisionHeroKey() {
    let hit = false;
    hit = s.collideRectCircle(key.x, key.y, key.width, key.height, hero.x, hero.y, hero.width/2)

    if(hit) {
      hitSound.play()
      key.y = key.inverse ? key.yA : key.yB;
      key.inverse = !key.inverse;
      points += 100;
    }
  }

  function moveHero() {
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
      GAME.gameOver = true;
    }
  }

  function resetGame() {
    GAME.gameOver = false
    timer = 20
    points = 0
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const buttonFullscreen = document.querySelector('#fullscreen')
  
  new p5((s) => sketch(s, buttonFullscreen))
})

