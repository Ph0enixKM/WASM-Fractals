use std::fmt::Display;

#[derive(Clone, Debug)]
pub struct Color(pub u8, pub u8, pub u8);

const MAX: u8 = 255;

// Implements to_string for Color
impl Display for Color {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{} {} {}", self.0, self.1, self.2)
    }
}

impl Color {
    pub fn from_hue(hue: u8) -> Self {
        let (r, g, b) = if hue < 43 {
            (MAX, hue * 6, 0)
        } else if hue < 85 {
            (MAX - (hue - 43) * 6, MAX, 0)
        } else if hue < 128 {
            (0, MAX, (hue - 85) * 6)
        } else if hue < 170 {
            (0, MAX - (hue - 128) * 6, MAX)
        } else if hue < 213 {
            ((hue - 170) * 6, 0, MAX)
        } else {
            (MAX, 0, MAX - (hue - 213) * 6)
        };
        Color(r, g, b)
    }
}