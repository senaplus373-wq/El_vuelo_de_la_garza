// ====== VARIABLES DEL JUEGO ======
let fondo, inicioFondo, finFondo;
let garza = [];
let garzaCae;
let arbol;

// ====== NUEVAS VARIABLES PARA EL FONDO EN MOVIMIENTO ======
let xFondo1 = 0;
let xFondo2;

// ====== ANIMACIÓN GARZA ======
let frameActual = 0;
let tiempoFrame = 0;

let xGarza = 150;
let yGarza = 100;
let velocidad = 0;
let gravedad = 0.6;
let impulso = -10;

// ====== ARBOLES ======
const numArboles = 3;
let xArbol = new Array(numArboles);
let yArbol = new Array(numArboles);
let alturaArbol = new Array(numArboles);

let velocidadArbol = 4;
let distanciaMinArbol = 250;
let alturaMin = 180;
let alturaMax = 350;

// ====== ESTADOS ======
let juegoActivo = false;
let puntoSumado = new Array(numArboles);
let puntaje = 0;
let puntajeFinal = 0;
let highScore = 0;
let mostrandoCaida = false;
let tiempoCaida = 0;
let pausa = false;
let sonidoActivado = true;
let estadoJuego = "inicio"; // "inicio", "jugando", "fin"

// ====== VIDAS ======
let vidas = 3;

// ====== SONIDOS ======
let sonidoVuelo, sonidoChoque, musicaFondo;

// ====== BOTONES ======
let botonX, botonY, botonAncho = 200, botonAlto = 60;
let botonVolX, botonVolY, botonVolAncho = 200, botonVolAlto = 60;

// ====== PRELOAD ======
function preload() {
  fondo = loadImage("assets/fondo.png");
  inicioFondo = loadImage("assets/inicio.png");
  finFondo = loadImage("assets/fin.png");
  arbol = loadImage("assets/arbol.png");
  garza[0] = loadImage("assets/garza1.png");
  garza[1] = loadImage("assets/garza2.png");
  garzaCae = loadImage("assets/garzaCae.png");

  // sonidos
  sonidoVuelo = loadSound("assets/vuelo.mp3");
  sonidoChoque = loadSound("assets/choque.mp3");
  musicaFondo = loadSound("assets/fondoMusica.mp3");
}

// ====== SETUP ======
function setup() {
  createCanvas(windowWidth, windowHeight); // se ajusta a toda la pantalla

  xFondo1 = 0;
  xFondo2 = width;

  // Configurar música de fondo
  musicaFondo.setLoop(true);
  musicaFondo.setVolume(0.5); // volumen medio

  // Botones
  botonY = height - 100;
  botonX = 80;
  botonVolX = width - 280;
  botonVolY = botonY;

  reiniciarArboles();
}

// ====== DRAW ======
function draw() {
  if (estadoJuego === "inicio") pantallaInicio();
  else if (estadoJuego === "jugando") pantallaJuego();
  else if (estadoJuego === "fin") pantallaFin();
}

// ====== PANTALLA DE INICIO ======
function pantallaInicio() {
  image(inicioFondo, 0, 0, width, height);

  fill(255, 200);
  rect(botonX, botonY, botonAncho, botonAlto, 20);
  fill(0);
  textAlign(CENTER);
  textSize(26);
  text("Comenzar", botonX + botonAncho / 2, botonY + 38);

  fill(255, 200);
  rect(botonVolX, botonVolY, botonVolAncho, botonVolAlto, 20);
  fill(0);
  textSize(22);
  text(
    sonidoActivado ? " Sonido: Activado" : " Sonido: Desactivado",
    botonVolX + botonVolAncho / 2,
    botonVolY + 35
  );

  fill(0);
  textSize(18);
  text("Presiona ESPACIO para volar", width / 2, height - 120);
  text("Letra P: Pausa  |  Letra R: Reinicia", width / 2, height - 90);
  textSize(22);
  text("Récord actual: " + highScore, width / 2, height - 40);
}

// ====== PANTALLA DE JUEGO ======
function pantallaJuego() {
  moverFondo();
  image(fondo, xFondo1, 0, width, height);
  image(fondo, xFondo2, 0, width, height);

  for (let i = 0; i < numArboles; i++) {
    image(arbol, xArbol[i], yArbol[i], 100, alturaArbol[i]);
  }

  if (mostrandoCaida) {
    image(garzaCae, xGarza, yGarza, 100, 80);
    yGarza += 8;
    if (millis() - tiempoCaida > 1200) {
      mostrandoCaida = false;
      if (vidas > 0) reiniciarDespuesDeCaer();
      else estadoJuego = "fin";
    }
    return;
  }

  if (pausa) {
    image(garza[frameActual], xGarza, yGarza, 100, 80);
    mostrarPuntaje();
    fill(0, 120);
    rect(0, 0, width, height);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("PAUSA", width / 2, height / 2 - 20);
    textSize(20);
    text("Presiona 'P' para continuar", width / 2, height / 2 + 30);
    if (musicaFondo.isPlaying()) musicaFondo.pause();
    return;
  } else if (!musicaFondo.isPlaying() && sonidoActivado) {
    musicaFondo.loop();
  }

  if (juegoActivo) {
    tiempoFrame++;
    if (tiempoFrame > 10) {
      frameActual = (frameActual + 1) % 2;
      tiempoFrame = 0;
    }

    image(garza[frameActual], xGarza, yGarza, 100, 80);
    velocidad += gravedad;
    yGarza += velocidad;

    for (let i = 0; i < numArboles; i++) {
      xArbol[i] -= velocidadArbol;

      if (!puntoSumado[i] && xGarza > xArbol[i] + 100) {
        puntaje++;
        puntoSumado[i] = true;
        aumentarDificultad();
      }

      if (xArbol[i] < -100) {
        xArbol[i] = width + random(distanciaMinArbol, distanciaMinArbol + 200);
        alturaArbol[i] = random(alturaMin, alturaMax);
        yArbol[i] = height - alturaArbol[i];
        puntoSumado[i] = false;
      }
    }

    mostrarPuntaje();

    if (colisiona() || yGarza > height - 80 || yGarza < 0) {
      vidas--;
      mostrandoCaida = true;
      tiempoCaida = millis();
      puntajeFinal = puntaje;
      if (puntajeFinal > highScore) highScore = puntajeFinal;
      if (musicaFondo.isPlaying()) musicaFondo.pause();
      reproducirChoque();
    }
  }
}

// ====== FONDO EN MOVIMIENTO ======
function moverFondo() {
  if (pausa || mostrandoCaida) return;
  xFondo1 -= velocidadArbol * 0.3;
  xFondo2 -= velocidadArbol * 0.3;
  if (xFondo1 <= -width) xFondo1 = width;
  if (xFondo2 <= -width) xFondo2 = width;
}

// ====== PANTALLA DE FIN ======
function pantallaFin() {
  image(finFondo, 0, 0, width, height);
  fill(0, 150);
  rect(0, 0, width, height);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("Fin del juego", width / 2, height / 2 - 80);
  textSize(24);
  text("Puntaje final: " + puntajeFinal, width / 2, height / 2 - 25);
  text("Récord: " + highScore, width / 2, height / 2 + 10);
  textSize(22);
  text("Vidas: 0", width / 2, height / 2 + 40);
  textSize(18);
  text("Presiona 'R' para reiniciar", width / 2, height / 2 + 80);

  if (musicaFondo.isPlaying()) musicaFondo.stop();
}

// ====== MOSTRAR PUNTAJE ======
function mostrarPuntaje() {
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Puntos: " + puntaje + " | Récord: " + highScore, 20, 20);
  textAlign(RIGHT, TOP);
  text("Vidas: " + vidas, width - 20, 20);
}

// ====== COLISIÓN ======
function colisiona() {
  for (let i = 0; i < numArboles; i++) {
    if (
      xGarza + 80 > xArbol[i] &&
      xGarza < xArbol[i] + 80 &&
      yGarza + 60 > yArbol[i]
    ) {
      return true;
    }
  }
  return false;
}

// ====== REINICIAR ======
function reiniciarArboles() {
  let separacion = 300;
  for (let i = 0; i < numArboles; i++) {
    xArbol[i] = width + i * separacion;
    alturaArbol[i] = random(alturaMin, alturaMax);
    yArbol[i] = height - alturaArbol[i];
    puntoSumado[i] = false;
  }
}

function aumentarDificultad() {
  if (puntaje % 5 === 0) {
    if (velocidadArbol < 12) velocidadArbol += 0.5;
    if (distanciaMinArbol > 150) distanciaMinArbol -= 10;
  }
}

function reiniciarDespuesDeCaer() {
  yGarza = 100;
  velocidad = 0;
  mostrandoCaida = false;
  reiniciarArboles();
  xFondo1 = 0;
  xFondo2 = width;
  juegoActivo = true;
  if (sonidoActivado) {
    musicaFondo.stop();
    musicaFondo.loop();
  }
}

function reiniciarJuego() {
  yGarza = 100;
  velocidad = 0;
  puntaje = 0;
  velocidadArbol = 4;
  distanciaMinArbol = 250;
  juegoActivo = true;
  mostrandoCaida = false;
  pausa = false;
  vidas = 3;
  reiniciarArboles();
  xFondo1 = 0;
  xFondo2 = width;
  if (sonidoActivado) {
    musicaFondo.stop();
    musicaFondo.loop();
  }
}

// ====== TECLAS ======
function keyPressed() {
  if (estadoJuego === "inicio") {
    if (key === " ") {
      estadoJuego = "jugando";
      juegoActivo = true;
      if (sonidoActivado && !musicaFondo.isPlaying()) musicaFondo.loop();
    }
  } else if (estadoJuego === "jugando") {
    if (key === " ") {
      if (!pausa) {
        velocidad = impulso;
        if (sonidoActivado) reproducirVuelo();
      }
    }
    if (key === "p" || key === "P") {
      pausa = !pausa;
      if (pausa && musicaFondo.isPlaying()) musicaFondo.pause();
      else if (!pausa && sonidoActivado && !musicaFondo.isPlaying())
        musicaFondo.loop();
    }
  } else if (estadoJuego === "fin") {
    if (key === "r" || key === "R") {
      reiniciarJuego();
      estadoJuego = "jugando";
    }
  }
}

// ====== MOUSE ======
function mousePressed() {
  if (estadoJuego === "inicio") {
    if (
      mouseX > botonX &&
      mouseX < botonX + botonAncho &&
      mouseY > botonY &&
      mouseY < botonY + botonAlto
    ) {
      estadoJuego = "jugando";
      juegoActivo = true;
      if (sonidoActivado && !musicaFondo.isPlaying()) musicaFondo.loop();
    } else if (
      mouseX > botonVolX &&
      mouseX < botonVolX + botonVolAncho &&
      mouseY > botonVolY &&
      mouseY < botonVolY + botonVolAlto
    ) {
      sonidoActivado = !sonidoActivado;
      if (!sonidoActivado && musicaFondo.isPlaying()) musicaFondo.stop();
      else if (sonidoActivado && !musicaFondo.isPlaying()) musicaFondo.loop();
    }
  }
}

// ====== SONIDOS ======
function reproducirVuelo() {
  sonidoVuelo.play();
}

function reproducirChoque() {
  sonidoChoque.play();
}
