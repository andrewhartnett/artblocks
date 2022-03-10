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
  '01.png',
  '02.png',
  '03.png',
  '04.png',
  '05.png',
  '06.png',
  '09.png',
  '10.png',
  '11.png',
  '12.png',
  '13.png',
  'cluster01.png',
  'cluster02.png',
  'cluster03.png',
  'cluster04.png',
  'cluster05.png',
  'cluster06.png',
  'cluster07.png',
  'cluster08.png',
  'cluster09.png',
]

const images = []

function preload() {
  // img = loadImage('./01_small.png');
  randomHelper = new Random()

  const totalImages = randomHelper.random_int(2, 8)

  for (let i = 0; i < totalImages; i++) {
    const index = randomHelper.random_int(0, possibleShapes.length - 1)
    const img = loadImage(`./shapes/${possibleShapes[index]}`)
    images.push({img: img, filename: possibleShapes[index], qty: null})

  }

}

function setup() {
    // put setup code here
    createCanvas(800, 800)
    imageMode(CENTER);

    // Loop through possible images
    for (let i = 0; i < images.length; i++) {
      const img = images[i]

      if(img.filename.indexOf('cluster') > -1) {
        img.qty = randomHelper.random_int(1, 5)
      }else{
        img.qty = randomHelper.random_int(5, 50)
      }
      

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