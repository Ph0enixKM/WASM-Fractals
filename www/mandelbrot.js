const MAX = 255;

// Convert hue to rgb (this function is taken from previous rust project)
function hueToRgb(hue) {
  if (hue < 43) {
    return [MAX, hue * 6, 0];
  } else if (hue < 85) {
    return [MAX - (hue - 43) * 6, MAX, 0];
  } else if (hue < 128) {
    return [0, MAX, (hue - 85) * 6];
  } else if (hue < 170) {
    return [0, MAX - (hue - 128) * 6, MAX];
  } else if (hue < 213) {
    return [(hue - 170) * 6, 0, MAX];
  } else {
    return [MAX, 0, MAX - (hue - 213) * 6];
  }
}

// Render mandelbrot set in canvas (JS version)
// This function is just a translated version of the rust version
export function mandelbrot(canvas, centerX, centerY, zoom, isPerformance = true) {
    const context = canvas.getContext("2d");
    const width = parseInt(window.innerWidth / (isPerformance ? 2 : 1));
    const height = parseInt(window.innerHeight / (isPerformance ? 2 : 1));
    canvas.width = width;
    canvas.height = height;
    const imageData = context.createImageData(width, height);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cRe = (x - width / 2) * 4 / width / zoom + centerX;
            const cIm = (y - height / 2) * 4 / width / zoom + centerY;
            let zRe = cRe;
            let zIm = cIm;

            let isInside = true;
            let ii = 0;
            for (let i = 0; i < 255; i++) {
                const zReSquared = zRe * zRe;
                const zImSquared = zIm * zIm;
                if (zReSquared + zImSquared > 4) {
                    isInside = false;
                    break;
                }
                zIm = 2 * zRe * zIm + cIm;
                zRe = zReSquared - zImSquared + cRe;
                ii = i;
            }
            const pixelIndex = (y * width + x) * 4;
            if (isInside) {
                imageData.data[pixelIndex] = 0;
                imageData.data[pixelIndex + 1] = 0;
                imageData.data[pixelIndex + 2] = 0;
                imageData.data[pixelIndex + 3] = 255;
            } else {
                const [r, g, b] = hueToRgb(ii);
                imageData.data[pixelIndex] = r;
                imageData.data[pixelIndex + 1] = g;
                imageData.data[pixelIndex + 2] = b;
                imageData.data[pixelIndex + 3] = 255;
            }
        }
    }
    context.putImageData(imageData, 0, 0);
}


export function mandelbrot_quality(canvas, zoomFactor, centerX, centerY) {
    return mandelbrot(canvas, zoomFactor, centerX, centerY, false);
}