import express from 'express';
const router = express.Router();

import { saveFile, getFile } from '../controllers/textsFileController';

router.route('/saveFile').post(saveFile);
router.route('/getFile').get(getFile);

export default router;
