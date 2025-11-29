use wasm_bindgen::prelude::*;

// static mut BUF: Vec<u8> = Vec::new();
// static mut BUF: UnsafeCell<Vec<u8>> = UnsafeCell::new(Vec::new()); // 10 MB

// #[wasm_bindgen]
// pub fn bitmap_to_png(rgba_data: &[u8], width: u32, height: u32) -> Result<Uint8Array, JsValue> {
//     // 验证数据长度
//     let expected_len = (width * height * 4) as usize;
//     if rgba_data.len() != expected_len {
//         return Err(JsValue::from_str(&format!(
//             "Invalid data length. Expected {}, got {}",
//             expected_len,
//             rgba_data.len()
//         )));
//     }

//     // 从原始 RGBA 数据创建图像
//     let img = image::RgbaImage::from_raw(width, height, rgba_data.to_vec())
//         .ok_or_else(|| JsValue::from_str("Failed to create image from raw data"))?;

//     #[allow(static_mut_refs)]
//     let binding = unsafe { &mut *BUF.get() };
//     let raw_binding = binding.as_mut_ptr();
//     let raw_len = binding.len();
//     let mut cursor = Cursor::new(binding);

//     // 将图像写入为 PNG 格式
//     img.write_to(&mut cursor, ImageFormat::Png)
//         .map_err(|e| JsValue::from_str(&format!("Failed to encode PNG: {}", e)))?;

//     Ok(unsafe { Uint8Array::view_mut_raw(raw_binding, raw_len) })
// }

// 反正每张图片都要复制一次，干脆就不搞全局缓冲区了
#[cfg(feature = "image")]
#[wasm_bindgen]
pub fn bitmap_to_png(rgba_data: &[u8], width: u32, height: u32) -> Result<Vec<u8>, JsValue> {
    use image::ImageFormat;
    use std::io::Cursor;

    // 验证数据长度
    let expected_len = (width * height * 4) as usize;
    if rgba_data.len() != expected_len {
        return Err(JsValue::from_str(&format!(
            "Invalid data length. Expected {}, got {}",
            expected_len,
            rgba_data.len()
        )));
    }

    // 从原始 RGBA 数据创建图像
    let img = image::RgbaImage::from_raw(width, height, rgba_data.to_vec())
        .ok_or_else(|| JsValue::from_str("Failed to create image from raw data"))?;

    // 创建一个内存缓冲区用于存储 PNG 数据
    let mut png_data = Vec::new();
    let mut cursor = Cursor::new(&mut png_data);

    // 将图像写入为 PNG 格式
    img.write_to(&mut cursor, ImageFormat::Png)
        .map_err(|e| JsValue::from_str(&format!("Failed to encode PNG: {}", e)))?;

    Ok(png_data)
}

#[cfg(feature = "zune-png")]
#[wasm_bindgen]
pub fn bitmap_to_png(rgba_data: &[u8], width: u32, height: u32) -> Result<Vec<u8>, JsValue> {
    use zune_png::zune_core;

    let expected_len = (width * height * 4) as usize;
    if rgba_data.len() != expected_len {
        return Err(JsValue::from_str(&format!(
            "Invalid data length. Expected {}, got {}",
            expected_len,
            rgba_data.len()
        )));
    }

    let option = zune_core::options::EncoderOptions::new(
        width as usize,
        height as usize,
        zune_core::colorspace::ColorSpace::RGBA,
        zune_core::bit_depth::BitDepth::Eight,
    );

    let mut encoder = zune_png::PngEncoder::new(rgba_data, option);
    let mut png_data = Vec::new();
    let _ = encoder
        .encode(&mut png_data)
        .map_err(|e| JsValue::from_str(&format!("Failed to encode PNG: {:?}", e)))?;
    Ok(png_data)
}

// Too slow even on lowest opt level, don't use
#[cfg(feature = "oxipng")]
#[wasm_bindgen]
pub fn bitmap_to_png(rgba_data: &[u8], width: u32, height: u32) -> Result<Vec<u8>, JsValue> {
    use oxipng::{Options, RawImage};

    let raw = RawImage::new(
        width,
        height,
        oxipng::ColorType::RGBA,
        oxipng::BitDepth::Eight,
        rgba_data.to_vec(),
    )
    .map_err(|e| JsValue::from_str(&format!("Failed to create RawImage: {:?}", e)))?;

    // let option = Options::from_preset(1); // lowest opt level
    let option = Options::from_preset(6); // highest opt level

    raw.create_optimized_png(&option)
        .map_err(|e| JsValue::from_str(&format!("Failed to encode PNG: {:?}", e)))
}

#[cfg(feature = "png")]
#[wasm_bindgen]
pub fn bitmap_to_png(rgba_data: &[u8], width: u32, height: u32) -> Result<Vec<u8>, JsValue> {
    use png::Encoder;
    use std::io::Cursor;

    let expected_len = (width * height * 4) as usize;
    if rgba_data.len() != expected_len {
        return Err(JsValue::from_str(&format!(
            "Invalid data length. Expected {}, got {}",
            expected_len,
            rgba_data.len()
        )));
    }

    let mut png_data = Vec::new();
    {
        let mut cursor = Cursor::new(&mut png_data);
        let mut encoder = Encoder::new(&mut cursor, width, height);
        encoder.set_color(png::ColorType::Rgba);
        encoder.set_depth(png::BitDepth::Eight);
        encoder.set_compression(png::Compression::Balanced);
        let mut writer = encoder
            .write_header()
            .map_err(|e| JsValue::from_str(&format!("Failed to write PNG header: {}", e)))?;
        writer
            .write_image_data(rgba_data)
            .map_err(|e| JsValue::from_str(&format!("Failed to write PNG data: {}", e)))?;
    }
    Ok(png_data)
}
