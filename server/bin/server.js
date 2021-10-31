#!/usr/bin/env node

import getApp from '../index.js';

const port = process.env.PORT || 5000;
const adress = '0.0.0.0';
console.log('port=', port);

getApp().listen(port, adress, (err) => {
  console.log(`Server is running on port: ${port}`);
  if (err) {
    console.log(err);
    process.exit(1);
  }
});
