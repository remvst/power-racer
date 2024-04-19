const w = window;

let can;
let ctx;
let level;

let GAME_PAUSED;

let DEBUG = false;

let CANVAS_WIDTH = 1600;
let CANVAS_HEIGHT = 900;

canvasPrototype = CanvasRenderingContext2D.prototype;
