import * as wasm from "wasm-mandelbrot";
import * as js from "./mandelbrot.js";

const canvas = document.querySelector(".canvas");
const minimap = document.querySelector(".minimap");
const mode = document.querySelector(".mode");
const lang = document.querySelector(".lang");
const home = document.querySelector(".home");
const langs = [
    'Rust (Web Assembly)',
    'JavaScript'
]
let curLang = 0;

minimap.style.visibility = 'hidden'
const modes = [
    'Performance',
    'Quality (minimap)',
    'Quality'
]
let curMode = 0;

home.addEventListener('click', () => {
    zoom = 1;
    centerX = 0;
    centerY = 0;
})

// Choose between Rust and JavaScript
lang.addEventListener('click', () => {
    curLang = (curLang + 1) % langs.length;
    lang.textContent = langs[curLang];
})

// Choose between performance, quality, and quality with minimap
mode.addEventListener('click', () => {
    curMode = (curMode + 1) % modes.length;
    mode.textContent = modes[curMode];
    if (modes[curMode].match('minimap')) {
        minimap.style.visibility = 'visible'
    }
    else {
        minimap.style.visibility = 'hidden'
    }
})

class FPS {
    constructor() {
      this.fps = document.getElementById("fps");
      this.lastFrameTimeStamp = performance.now();
    }
  
    render() {
      const now = performance.now();
      const delta = now - this.lastFrameTimeStamp;
      this.lastFrameTimeStamp = now;
      const fps = 1 / delta * 1000;
      this.fps.textContent = `FPS ${Math.round(fps)}`
    }
}

const speed = 0.1;
const friction = 0.9;

let zoom = 1;
let centerX = 0;
let centerY = 0;
let centerXvel = 0;
let centerYvel = 0;

const keys = [0, 0]
const fps = new FPS();
let time = performance.now();

const drawMandelbrot = () => {
    fps.render()
    if (keys[0]) centerXvel = keys[0] * speed / zoom
    else centerXvel = Math.sign(centerXvel) * Math.max(Math.abs(centerXvel * friction) - 0.000001, 0)
    if (keys[1]) centerYvel = keys[1] * speed / zoom
    else centerYvel = Math.sign(centerYvel) * Math.max(Math.abs(centerYvel * friction) - 0.000001, 0)
    centerX += centerXvel
    centerY += centerYvel
    centerXvel *= friction
    centerYvel *= friction
    let language = null
    switch (langs[curLang]) {
        case 'Rust (Web Assembly)':
            language = wasm
            break
        default:
            language = js
    }
    switch (modes[curMode]) {
        case 'Performance':
            language.mandelbrot(canvas, centerX, centerY, zoom)
            break
        case 'Quality (minimap)':
            if (performance.now() - time > 5000) {
                language.mandelbrot_quality(canvas, centerX, centerY, zoom)
                time = performance.now()
            }
            language.mandelbrot(minimap, centerX, centerY, zoom)
            break
        case 'Quality':
            language.mandelbrot_quality(canvas, centerX, centerY, zoom)
            break
    }
    requestAnimationFrame(drawMandelbrot);
};

const zoomIn = () => {
    zoom *= 2;
};

const zoomOut = () => {
    zoom /= 2;
};

// Map key presses to set velocity vectors and zoom
window.addEventListener('keydown', event => {
  switch (event.key) {
    case 'w':
        keys[1] = -1;
        break;
    case 'a':
        keys[0] = -1;
      break;
    case 's':
        keys[1] = 1;
        break;
    case 'd':
        keys[0] = 1;
        break;
    case 'e':
      zoomIn();
      break;
    case 'q':
      zoomOut();
      break;
  }
});

// Reset velocity vectors when keys are released
window.addEventListener('keyup', event => {
    switch (event.key) {
        case 'w':
            keys[1] = 0;
            break;
        case 'a':
            keys[0] = 0;
            break;
        case 's':
            keys[1] = 0;
            break;
        case 'd':
            keys[0] = 0;
            break;
    }
});

drawMandelbrot();