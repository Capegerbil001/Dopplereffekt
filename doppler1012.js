let font;
let fontsize = 40;
let rings;                  // Declare the array
let numRings = 600;
let currentRing = 0;
let horizontY = 300;
let xpos;
let ypos;
let ortAuto = 30;
let x, y, diameter;
let xBeobachter = 550;
let on = false;
let xbeob, ybeob;
let c = 30;
let k = 5;
let animationsGeschwindigkeit = 0.5;
let schallGeschwindigkeit = 1.0;
let v, vBeobachter;
let frequenz;
let f;
let startKnopf, startKnopfBeobachter, instandstellungsKnopf;
let startBefehl = false;
let startBefehlBeobachter = false;
let instandstellung;
let resetKnopf = false;
let takt;
let c1, c2;
let Y_AXIS = 1;
let frameZaehler;
let checkBox;







function setup() {
  createCanvas(600, 400);
  
  frameRate(60);
  
  textSize(12);
  textFont('Georgia');
    
  v = createSlider(-2.0, 2.0, 0.2, 0.05);
  v.position(220, 10);
  f = createSlider(0.0, 3.0, 1.0, 0.5);
  f.position(220, 40);
  
  startKnopf = createButton('Start Quelle');
  startKnopf.mousePressed(startsignal);
  startKnopf.position(20, 360);
  
  vBeobachter = createSlider(-2.0, 2.0, 0.0, 0.05);
  vBeobachter.position(220, 70);
  
  startKnopfBeobachter = createButton('Start Beobachter');
  startKnopfBeobachter.mousePressed(startsignalBeobachter);
  startKnopfBeobachter.position(150, 360);
  
  instandstellungsKnopf = createButton('Anfangsposition');
  instandstellungsKnopf.mousePressed(instandstellungsFunktion);
  instandstellungsKnopf.position(430, 360);
  
  checkBox = createCheckbox('Zeitlupe');
  checkBox.position(320,360);
  checkBox.changed(animGeschwindigkeit);
  
  
    
  c1 = color('#36BFFF');
  c2 = color('#ffffff');
  
  rings = new Ring();  // Create the array
  for (let i = 0; i < numRings; i++) {
    rings[i] = new Ring();     // Create each object
  }
}


function draw() {
  
  setGradient(0, 0, 600, 300, c1, c2, Y_AXIS);
  
  push();
  fill(color('#FF2F87'), 140);
  noStroke();
  text('Geschwindigkeit Quelle:', 20, 25);
  text(concat((v.value() / schallGeschwindigkeit).toString(), ' c'), 380, 15, 90, 75);
  text('Frequenz Quelle:', 20, 55);
  text(concat((f.value()).toString(), ' Hz'), 380, 45, 90, 75);
  pop();
  
  push();
  fill(color('#6125E8'), 140);
  noStroke();
  text('Geschwindigkeit Beobachter:', 20, 85);
  text(concat((vBeobachter.value()).toString(), ' c'), 380, 75, 90, 75);
  pop();
  
  push();
  fill(color('#FF2F87'));
  stroke(color('#FF2F87'));
  if (startBefehl == true) {
    ortAuto += animationsGeschwindigkeit * v.value();
  }
  rect(ortAuto - 20, horizontY - 10, 20, 10);
  pop();
  
  if (startBefehlBeobachter == true) {
    xBeobachter += animationsGeschwindigkeit * vBeobachter.value();
  }
  
  takt = 60.0 * 0.5 / (f.value() * animationsGeschwindigkeit);
  if ((frameCount - frameZaehler) % (takt) == 0) {
    rings[currentRing].start(ortAuto, horizontY);
    currentRing++;
    if (currentRing >= numRings) {
      currentRing = 0;
    }
  }
  
  push();
  for (let i = 0; i < numRings; i++) {
    rings[i].grow();
    if (i >= 0) {
      rings[i].display();
    }
  }
  pop();
  
  push();
  noStroke();
  fill('#25E85D');
  rect(0, horizontY, 600, height - horizontY);
  pop();
  
  beobachter();
}

function startsignal() {
  startBefehl = true;
  frameZaehler = frameCount;
}

function startsignalBeobachter() {
  startBefehlBeobachter = true;
}

function instandstellungsFunktion() {
  startBefehl = false;
  startBefehlBeobachter = false;
  xBeobachter = 550;
  ortAuto = 30;
  push();
  fill(color('#FF2F87'));
  stroke(color('#FF2F87'));
  rect(ortAuto - 20, horizontY - 10, 20, 10);
  pop();
  
  rings = new Ring();  // Create the array
  for (let i = 0; i < numRings; i++) {
    rings[i] = new Ring();     // Create each object
  }
}


function animGeschwindigkeit() {
  if (this.checked()) {
    animationsGeschwindigkeit = 0.1;
  } else {
    animationsGeschwindigkeit = 0.5;
  }
}


class Ring {
  constructor() {
    this.x;
    this.y; // X-coordinate, y-coordinate
    this.diameter;      // Diameter of the ring
    this.on = false;  // Turns the display on and off
  }
  start(xpos, ypos) {
    this.x = xpos;
    this.y = ypos; 
    this.diameter = 1;
    this.on = true;
  }
  
  grow() {
    if (this.on === true  && startBefehl == true) {
      this.diameter += 2 * animationsGeschwindigkeit * schallGeschwindigkeit;
      if (this.diameter > 2000) {
        this.on = false;
        this.diameter = 0;
      }
    }
  }

  display() {
    if (this.on === true) {
      noFill();
      strokeWeight(2);
      stroke(70, 140);
      ellipse(this.x, this.y, this.diameter, this.diameter);
    }
  }
}


function beobachter () {
  push();
  noStroke();
  fill(color('#6125E8'));
  rect(xBeobachter, horizontY - 15, 5, 15);
  pop();
}



function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === Y_AXIS) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === X_AXIS) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}







