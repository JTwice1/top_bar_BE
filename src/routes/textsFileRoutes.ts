import express from 'express';
const router = express.Router();

import {
  saveFile,
  getFile,
  sendJSON,
} from '../controllers/textsFileController';

router.route('/saveFile').post(saveFile);
router.route('/getFile').get(getFile);
router.route('/sendJSON').get(sendJSON);

export default router;
