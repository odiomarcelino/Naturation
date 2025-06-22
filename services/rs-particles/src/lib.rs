use wasm_bindgen::prelude::*;
use js_sys::Math;

#[wasm_bindgen]
pub struct Particle {
    pub x: f32,
    pub y: f32,
    pub vx: f32,
    pub vy: f32,
}

#[wasm_bindgen]
impl Particle {
    pub fn update(&mut self) {
        self.x += self.vx;
        self.y += self.vy;
    }
}

#[wasm_bindgen]
pub fn random_particle() -> Particle {
    Particle {
        x: Math::random() as f32,
        y: Math::random() as f32,
        vx: (Math::random() - 0.5) as f32 * 0.01,
        vy: (Math::random() - 0.5) as f32 * 0.01,
    }
}
