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
  return {
    hash: "0x948d041796facb5dc38cde0e3bf27226ed7bc360849953eb82d8d84fcc6437ac",
    tokenId: '123000013'
  }
}

const tokenData = genTokenData(123);
// const tokenData = genStaticTokenData(123);

const shapes = []
const possibleShapes = [
  {filename: 'outlineBlack.png', min: 1, max: 5},
  {filename: 'outlineBlack2.png', min: 1, max: 5},
  {filename: 'outlineBlack3.png', min: 1, max: 5},
  // {filename: 'outlineBlue.png', min: 1, max: 3},
  {filename: 'outlineOrange.png', min: 1, max: 10},
  {filename: 'outlinePink.png', min: 1, max: 10},
  {filename: 'solidBlack.png', min: 1, max: 5},
  {filename: 'solidBlue.png', min: 1, max: 10},
  {filename: 'solidLime.png', min: 1, max: 30},
  {filename: 'solidPink.png', min: 1, max: 10},
  {filename: 'solidWhite.png', min: 1, max: 5},
  {filename: 'solidWhite2.png', min: 1, max: 5},
  {filename: 'solidYellowish.png', min: 1, max: 30},
  {filename: 'cluster01.png', min: 1, max: 5},
  {filename: 'cluster02.png', min: 1, max: 5},
  {filename: 'cluster03.png', min: 1, max: 5},
  {filename: 'cluster04.png', min: 1, max: 5},
  {filename: 'cluster05.png', min: 1, max: 5},
  {filename: 'cluster06.png', min: 1, max: 5},
  {filename: 'cluster07.png', min: 1, max: 5},
  {filename: 'cluster08.png', min: 1, max: 5},
  {filename: 'cluster09.png', min: 1, max: 5},
]

const images = []

function preload() {
  randomHelper = new Random()

  const totalImages = randomHelper.random_int(3, 8)

  // Criteria
  let hasSolid = false
  let hasOutline = false
  let hasTotalImages = false

  while(!hasSolid || !hasOutline || !hasTotalImages) {
    const index = randomHelper.random_int(0, possibleShapes.length - 1)
    const filename = possibleShapes[index].filename
    const img = loadImage(`./shapes/${filename}`)

    const qty = randomHelper.random_int(possibleShapes[index].min, possibleShapes[index].max)

    images.push({img, filename: filename, qty})

    if(images.length >= totalImages){
      hasTotalImages = true
    }

    if(filename.indexOf('solid') !== -1 && filename.indexOf('Pink') == -1 && filename.indexOf('Blue') == -1) {
      hasSolid = true
    }

    if(filename.indexOf('outline') !== -1) {
      hasOutline = true
    }
  }

  console.log('totalImages', totalImages)

}

function setup() {
    // put setup code here
    createCanvas(800, 800)
    imageMode(CENTER);

    // Loop through possible images
    for (let i = 0; i < images.length; i++) {
      const img = images[i]

      for (let i = 0; i < img.qty; i++) {
        shapes.push(new Shape(img))
      }

    }

    console.log(images)
}

function draw() {  
    for(let i = 0; i < shapes.length; i++) {
      shapes[i].draw()
    }
}

class Shape {
  constructor(img) {
    if(img.filename.indexOf('cluster') > -1) {
      this.scale = randomHelper.random_num(30, 90) * .01
    }else{
      this.scale = randomHelper.random_num(10, 50) * .01
    }

    this.img = img.img

    this.x = randomHelper.random_num(-300, 300);
    this.y = randomHelper.random_num(-300, 300);
    this.w = img.img.width * this.scale
    this.h = img.img.height * this.scale

    this.rotation = randomHelper.random_num(-180, 180)
  }

  draw() {
    push()
    translate(width / 2, height / 2);
    rotate(this.rotation)
    image(this.img, this.x, this.y, this.w, this.h)
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