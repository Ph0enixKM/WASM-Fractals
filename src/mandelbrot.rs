use wasm_bindgen::Clamped;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::ImageData;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement};

use crate::color::Color;

#[wasm_bindgen]
pub fn draw_mandelbrot(
    canvas: &HtmlCanvasElement,
    center_x: f64,
    center_y: f64,
    zoom: f64,
    is_performance: bool,
) -> Result<(), JsValue> {
    let context = canvas
        .get_context("2d")?
        .unwrap()
        .dyn_into::<CanvasRenderingContext2d>()?;

    let window = web_sys::window().unwrap();
    // We optimize the canvas size by dividing the window size by 2
    let width = window.inner_width().unwrap().as_f64().unwrap() as u32 / if is_performance { 2 } else { 1 };
    let height = window.inner_height().unwrap().as_f64().unwrap() as u32 / if is_performance { 2 } else { 1 };
    canvas.set_width(width);
    canvas.set_height(height);

    let image_data = context.create_image_data_with_sw_and_sh(width as f64, height as f64)?;
    let mut data = image_data.data();

    for y in 0..height {
        for x in 0..width {
            // Initial value of c
            let c_re = (x as f64 - width as f64 / 2.0) * 4.0 / width as f64 / zoom + center_x;
            let c_im = (y as f64 - height as f64 / 2.0) * 4.0 / width as f64 / zoom + center_y;
            // Initialize z = c
            let mut z_re = c_re;
            let mut z_im = c_im;
            // Iterate until |z| > 4
            let mut is_inside = true;
            let mut ii = 0;
            for i in 0..255 {
                // Calculate z^2
                let z_re_squared = z_re * z_re;
                let z_im_squared = z_im * z_im;
                // If |z| > 4, then it is not in the Mandelbrot set
                if z_re_squared + z_im_squared > 4.0 {
                    is_inside = false;
                    break;
                }
                // We are using the formula z = z^2 + c here
                z_im = 2.0 * z_re * z_im + c_im;
                z_re = z_re_squared - z_im_squared + c_re;
                ii = i;
            }
            let pixel_index = (y * width + x) as usize * 4;
            if is_inside {
                data[pixel_index] = 0;
                data[pixel_index + 1] = 0;
                data[pixel_index + 2] = 0;
                data[pixel_index + 3] = 255;
            } else {
                let Color(r, g, b) = Color::from_hue(ii as u8);
                data[pixel_index] = r;
                data[pixel_index + 1] = g;
                data[pixel_index + 2] = b;
                data[pixel_index + 3] = 255;
            }
        }
    }
    // We need to use the `Clamped` wrapper to avoid a panic
    let slice = Clamped(&data.0[..]);
    if let Ok(new_image) = ImageData::new_with_u8_clamped_array_and_sh(slice, width, height) {
        context.put_image_data(&new_image, 0.0, 0.0)?;
    }
    Ok(())
}
