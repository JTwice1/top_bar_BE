import express from 'express';
const router = express.Router();

import {
  saveFile,
  getFile,
  sendJSON,
  sendActualJSON,
} from '../controllers/textsFileController';

router.route('/saveFile').post(saveFile);
router.route('/getFile').post(getFile);
router.route('/sendJSON').get(sendJSON);
router.route('/sendActualJSON').get(sendActualJSON);

export default router;
