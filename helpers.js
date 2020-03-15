function convertHexToRGB(hexColourString) {
  return [
    parseInt(hexColourString[0] + hexColourString[1], 16),
    parseInt(hexColourString[2] + hexColourString[3], 16),
    parseInt(hexColourString[4] + hexColourString[5], 16),
  ];
}

function convertRGBToCMYK(rgb) {
  let r = rgb[0] / 255;
  let g = rgb[1] / 255;
  let b = rgb[2] / 255;
  let k = Math.min(1 - r, 1 - g, 1 - b);
  let c = (1 - r - k) / (1 - k) || 0;
  let m = (1 - g - k) / (1 - k) || 0;
  let y = (1 - b - k) / (1 - k) || 0;
  return [
    Math.round(c * 100), 
    Math.round(m * 100), 
    Math.round(y * 100), 
    Math.round(k * 100)
  ];
}

function findDominantChannel(rgbArray) {
  let channel = 0;
  let channelValue = -1;

  for (let i = 0; i < 3; i++) {
    if (rgbArray[i] > channelValue) {
      channel = i;
      channelValue = rgbArray[i];
    }
  }

  return channel;
}

module.exports = {
  convertHexToRGB,
  convertRGBToCMYK,
  findDominantChannel,
};
