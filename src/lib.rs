mod utils;
mod mandelbrot;
mod color;

use utils::set_panic_hook;
use wasm_bindgen::prelude::*;
use mandelbrot::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, wasm-mandelbrot!");
}

#[wasm_bindgen]
pub fn mandelbrot(
    canvas: &web_sys::HtmlCanvasElement,
    center_x: f64,
    center_y: f64,
    zoom: f64
) -> Result<(), JsValue> {
    set_panic_hook();
    draw_mandelbrot(canvas, zoom, center_x, center_y, true)
}

#[wasm_bindgen]
pub fn mandelbrot_quality(
    canvas: &web_sys::HtmlCanvasElement,
    center_x: f64,
    center_y: f64,
    zoom: f64
) -> Result<(), JsValue> {
    set_panic_hook();
    draw_mandelbrot(canvas, zoom, center_x, center_y, false)
}