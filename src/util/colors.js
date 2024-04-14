function multiplyColor(color, factor) {
    let colorHex = color.slice(1);
    if (colorHex.length === 3) {
        colorHex = `${colorHex.charAt(0)}0${colorHex.charAt(1)}0${colorHex.charAt(2)}0`;
    }

    const colorNum = parseInt(colorHex, 16);

    let r = (colorNum >> (8 * 2)) % 256;
    let g = (colorNum >> (8 * 1)) % 256;
    let b = (colorNum >> (8 * 0)) % 256;

    r *= factor;
    g *= factor;
    b *= factor;

    return '#' + ((r << (8 * 2)) | (g << (8 * 1)) | (b << (8  * 0))).toString(16).padStart(6, '0');
}
