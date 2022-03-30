function genTokenData(projectNum) {
  let data = {};
  let hash = "0x";
  for (var i = 0; i < 64; i++) {
    hash += Math.floor(Math.random() * 16).toString(16);
  }
  data.hash = hash;
  data.tokenId = (projectNum * 1000000 + Math.floor(Math.random() * 1000)).toString();
  return data;
}

function genStaticTokenData() {
  return {hash: '0xe8f2cd0f000cd2881f7091e8f14badf6388ea570fb1b00f553329505d647dda7', tokenId: '123000041'}
}

const tokenData = genTokenData(123);
// console.log(tokenData)
// const tokenData = genStaticTokenData(123);

const possibleShapes = [
  {filename: 'outlineBlack.png', min: 1, max: 5},
  {filename: 'outlineBlack2.png', min: 1, max: 5},
  {filename: 'outlineBlue.png', min: 1, max: 3},
  {filename: 'outlineYellow.png', min: 1, max: 5},
  {filename: 'outlinePink.png', min: 1, max: 5},
  {filename: 'solidBlack.png', min: 1, max: 3},
  {filename: 'solidBlue.png', min: 1, max: 8},
  {filename: 'solidLime.png', min: 1, max: 5},
  {filename: 'solidPink.png', min: 1, max: 5},
  {filename: 'solidWhite.png', min: 1, max: 2},
  // {filename: 'solidWhite2.png', min: 1, max: 5},
  {filename: 'solidYellow.png', min: 1, max: 5},
  // {filename: 'cluster01.png', min: 1, max: 5},
  {filename: 'cluster02.png', min: 1, max: 10},
  // {filename: 'cluster03.png', min: 1, max: 5},
  {filename: 'cluster04.png', min: 1, max: 5},
  // {filename: 'cluster05.png', min: 1, max: 5},
  // {filename: 'cluster06.png', min: 1, max: 5},
  {filename: 'cluster07.png', min: 1, max: 5},
  {filename: 'cluster08.png', min: 1, max: 5},
  {filename: 'cluster09.png', min: 1, max: 5},
]

const shapes = []

const bgColors = [
  '#0e1137',
  '#e58225',
  '#000000'
]

let bgColor = '#FFFFFF'

function preload() {
  randomHelper = new Random()
  // Load All images
  for (let i = 0; i < possibleShapes.length; i++) {
    const possibleShape = possibleShapes[i];
    possibleShape.image = loadImage(`./shapes/${possibleShape.filename}`)
    possibleShape.qty = randomHelper.random_int(possibleShape.min, possibleShape.max)
  }
}

function setup() {
  createCanvas(800, 800)
  imageMode(CENTER);

  // 25% chance
  const hasBackground = randomHelper.random_int(1, 5) === 1

  let totalImages = randomHelper.random_int(5, 10)

  if(hasBackground) {
    let bgColorIndex = randomHelper.random_int(0, bgColors.length - 1)
    totalImages -= 2
    bgColor = bgColors[bgColorIndex]
  }

  let hasCluster = false
  let iterations = 0

  // Change to while loop with conditions
  while(!hasCluster || iterations < totalImages) {

    const index = randomHelper.random_int(0, possibleShapes.length - 1)
    const shapeData = possibleShapes[index]


    for (let n = 0; n < shapeData.qty; n++) {
      shapes.push(new Shape(shapeData))
    }

    if(shapeData.filename.indexOf('cluster') !== -1) {
      hasCluster = true
    }

    iterations++
  }
  
}

function draw() { 
  background(bgColor);

  for(let i = 0; i < shapes.length; i++) {
    shapes[i].draw()
  }
}

class Shape {
  constructor(img) {
    this.img = img.image
    this.x = randomHelper.random_num(-300, 300);
    this.y = randomHelper.random_num(-300, 300);
    this.rotation = randomHelper.random_num(-180, 180)
    this.w = img.image.width
    this.h = img.image.height
  }

  draw() {
    push()
    translate(width / 2, height / 2);
    rotate(this.rotation)
    image(this.img, this.x, this.y)
    pop()
  }
}

class Random {
  constructor() {
    this.useA = false;
    let sfc32 = function (uint128Hex) {
      let a = parseInt(uint128Hex.substr(0, 8), 16);
      let b = parseInt(uint128Hex.substr(8, 8), 16);
      let c = parseInt(uint128Hex.substr(16, 8), 16);
      let d = parseInt(uint128Hex.substr(24, 8), 16);
      return function () {
        a |= 0; b |= 0; c |= 0; d |= 0;
        let t = (((a + b) | 0) + d) | 0;
        d = (d + 1) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
      };
    };
    // seed prngA with first half of tokenData.hash
    this.prngA = new sfc32(tokenData.hash.substr(2, 32));
    // seed prngB with second half of tokenData.hash
    this.prngB = new sfc32(tokenData.hash.substr(34, 32));
    for (let i = 0; i < 1e6; i += 2) {
      this.prngA();
      this.prngB();
    }
  }
  // random number between 0 (inclusive) and 1 (exclusive)
  random_dec() {
    this.useA = !this.useA;
    return this.useA ? this.prngA() : this.prngB();
  }
  // random number between a (inclusive) and b (exclusive)
  random_num(a, b) {
    return a + (b - a) * this.random_dec();
  }
  // random integer between a (inclusive) and b (inclusive)
  // requires a < b for proper probability distribution
  random_int(a, b) {
    return Math.floor(this.random_num(a, b + 1));
  }
  // random boolean with p as percent liklihood of true
  random_bool(p) {
    return this.random_dec() < p;
  }
  // random value in an array of items
  random_choice(list) {
    return list[this.random_int(0, list.length - 1)];
  }
}