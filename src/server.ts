//env
import dotenv from 'dotenv';

dotenv.config();

import app from './app';

//port
const port = process.env.PORT || 7000;

//spin server
const start = async () => {
  try {
    app.listen(port, () =>
      console.info(
        `\n \n \n \n Top Bar Texts node.js/express.js  Server is 👂 on port ${port} \n © All Rights Reserved \n 🏴‍☠️️  Attention!!! Don't copy any code!!! 🏴‍☠️️ \n \n`
      )
    );
  } catch (err) {
    console.error('Failed to start the server:', err);
    process.exit(1);
  }
};

start();
