// Imports.
require('dotenv').config()
const express = require('express');
const fileAdapter = require('lowdb/adapters/FileSync');
const helpers = require('./helpers');
const lowDB = require('lowdb');
const _ = require('lodash');

// Globals.
const DATABASE = 'coloursDatabase.json';

// Express.
const app = express();
const db = lowDB(new fileAdapter(DATABASE));

app.use(express.static(__dirname + '/public'));

db.get('colours')
  .forEach(o => {
    o.rgb = helpers.convertHexToRGB(o.hex.split('#')[1]);
    o.cmyk = helpers.convertRGBToCMYK(o.rgb);
  })
  .write();

// Routes.
app.get('/', (request, response) => {
  response.sendFile('/index.html');
});

app.get('/api/colours', (request, response) => {
  if (!request.query.colour) {
    response.status(400).send('Bad request.');
    return;
  }

  const hexColourString = request.query.colour;
  const colourSearchRange = parseInt(request.query.range) || 64;

  const rgbArray = helpers.convertHexToRGB(hexColourString);
  const dominantChannel = helpers.findDominantChannel(rgbArray);
  const maxChannelValue = rgbArray[dominantChannel] + colourSearchRange;
  const minChannelValue = rgbArray[dominantChannel] - colourSearchRange;

  response.json(
    db
      .get('colours')
      .filter(colourObject => {
        const targetDominantChannel = helpers.findDominantChannel(colourObject.rgb);

        if (
          targetDominantChannel == dominantChannel &&
          colourObject.rgb[dominantChannel] >= minChannelValue &&
          colourObject.rgb[dominantChannel] <= maxChannelValue
        )
          return colourObject;
      })
      .value()
      .sort((colourObjectA, colourObjectB) => {
        const channelR = Math.abs(rgbArray[0] - colourObjectA.rgb[0]) - Math.abs(rgbArray[0] - colourObjectB.rgb[0]);
        const channelG = Math.abs(rgbArray[1] - colourObjectA.rgb[1]) - Math.abs(rgbArray[1] - colourObjectB.rgb[1]);
        const channelB = Math.abs(rgbArray[2] - colourObjectA.rgb[2]) - Math.abs(rgbArray[2] - colourObjectB.rgb[2]);

        return channelR + channelG + channelB;
      })
      .slice(0, 50),
  );

  return;
});

app.listen(process.env.PORT || 3000, () => console.log(`Server is listening on port ${process.env.PORT}`));
