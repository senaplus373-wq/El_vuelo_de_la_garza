let x = 0;

function setup() {
  createCanvas(400, 200);
}

function draw() {
  background(135, 206, 235); // Cielo azul
  fill(255);
  ellipse(x, 100, 40, 40); // “Garza”
  x += 2;
  if (x > width) {
    x = 0;
  }
}
