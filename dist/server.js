"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//env
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
//port
const port = process.env.PORT || 7000;
//spin server
const start = async () => {
    try {
        app_1.default.listen(port, () => console.info(`\n \n \n \n Top Bar Texts node.js/express.js  Server is 👂 on port ${port} \n © All Rights Reserved \n 🏴‍☠️️  Attention!!! Don't copy any code!!! 🏴‍☠️️ \n \n`));
    }
    catch (err) {
        console.error('Failed to start the server:', err);
        process.exit(1);
    }
};
start();
