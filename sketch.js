// ====== IMPORTAR LIBRERÍA DE SONIDO ======
// import ddf.minim.*;  // SE COMENTA PORQUE NO USAREMOS SONIDO
// Minim minim;
// AudioPlayer musicaFondo;

// ====== VARIABLES DE JUEGO ======
int ancho = 800;
int alto = 600;
int estado = 0; // 0 = inicio, 1 = juego, 2 = game over
PImage imgGarza, imgArbol, imgNube, imgFondo;
boolean pausado = false;

void setup() {
  size(ancho, alto);
  
  // Cargar imágenes
  imgGarza = loadImage("garza.png");
  imgArbol = loadImage("arbol.png");
  imgNube = loadImage("nube.png");
  imgFondo = loadImage("fondo.png");
  
  // Música DE FONDO (DESACTIVADA)
  // minim = new Minim(this);
  // musicaFondo = minim.loadFile("fondomusica.mp3");
  // musicaFondo.loop();
}

void draw() {
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

void pantallaInicio() {
  background(200);
  textAlign(CENTER);
  textSize(40);
  fill(0);
  text("¡Bienvenido a Pixelandia!", width/2, height/2 - 20);
  textSize(20);
  text("Presiona ENTER para comenzar", width/2, height/2 + 20);
}

void pantallaJuego() {
  background(imgFondo);
  // Aquí va tu lógica de juego (movimiento, colisiones, etc.)
  
  // EJEMPLO: mostrar garza
  image(imgGarza, width/2 - 50, height/2 - 50, 100, 80);
}

void pantallaPausa() {
  fill(0, 150);
  rect(0, 0, width, height);
  textAlign(CENTER);
  textSize(30);
  fill(255);
  text("PAUSA", width/2, height/2);
}

void pantallaGameOver() {
  background(100);
  textAlign(CENTER);
  textSize(40);
  fill(255, 0, 0);
  text("GAME OVER", width/2, height/2 - 20);
  textSize(20);
  fill(255);
  text("Presiona R para reiniciar", width/2, height/2 + 20);
}

void keyPressed() {
  if (estado == 0) {
    if (keyCode == ENTER) {
      estado = 1;
    }
  } else if (estado == 1) {
    if (key == 'p' || key == 'P') {
      pausado = !pausado;
    }
  } else if (estado == 2) {
    if (key == 'r' || key == 'R') {
      estado = 0;
    }
  }
}
