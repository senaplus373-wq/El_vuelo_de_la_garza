// ====== VARIABLES DEL JUEGO ======
let ancho = 800;
let alto = 600;
let estado = 0; // 0 = inicio, 1 = juego, 2 = game over
let pausado = false;

// ====== SPRITES E IMÁGENES ======
let imgGarza, imgArbol, imgNube, imgFondo;

function preload() {
  imgGarza = loadImage("data/garza.png");
  imgArbol = loadImage("data/arbol.png");
  imgNube = loadImage("data/nube.png");
  imgFondo = loadImage("data/fondo.png");
}

function setup() {
  createCanvas(ancho, alto);
}

function draw() {
  if (estado == 0) {
    pantallaInicio();
  } else if (estado == 1) {
    if (!pausado) {
      pantallaJuego();
    } else {
      pantallaPausa();
    }
  } else if (estado == 2) {
    pantallaGameOver();
  }
}

function pantallaInicio() {
  background(200);
  textAlign(CENTER);
  textSize(40);
  fill(0);
  text("¡Bienvenido a Pixelandia!", width / 2, height / 2 - 20);
  textSize(20);
  text("Presiona ENTER para comenzar", width / 2, height / 2 + 20);
}

function pantallaJuego() {
  background(imgFondo);

  // Mostrar garza (ejemplo, pon tu lógica de movimiento)
  image(imgGarza, width / 2 - 50, height / 2 - 50, 100, 80);

  // Aquí va tu lógica del juego: colisiones, puntuación, etc.
}

function pantallaPausa() {
  fill(0, 150);
  rect(0, 0, width, height);
  textAlign(CENTER);
  textSize(30);
  fill(255);
  text("PAUSADO", width / 2, height / 2);
}

function pantallaGameOver() {
  background(100);
  textAlign(CENTER);
  textSize(40);
  fill(255, 0, 0);
  text("GAME OVER", width / 2, height / 2 - 20);
  textSize(20);
  fill(255);
  text("Presiona R para reiniciar", width / 2, height / 2 + 20);
}

function keyPressed() {
  if (estado == 0) {
    if (keyCode === ENTER) {
      estado = 1;
    }
  } else if (estado == 1) {
    if (key === 'p' || key === 'P') {
      pausado = !pausado;
    }
  } else if (estado == 2) {
    if (key === 'r' || key === 'R') {
      estado = 0;
    }
  }
}
