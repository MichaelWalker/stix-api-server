"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const block_generator_1 = require("./block-generator");
const date_fns_1 = require("date-fns");
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.json({
        status: 'ok'
    });
});
app.get('/blocks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const startTime = req.query.startTime ? new Date(req.query.startTime) : (0, date_fns_1.addMinutes)(new Date(), -15);
    const endTime = req.query.endTime ? new Date(req.query.endTime) : (0, date_fns_1.addMinutes)(startTime, 15);
    if (startTime > endTime) {
        res.status(400).json({ error: 'startTime must be before endTime' });
        return;
    }
    const data = (0, block_generator_1.createBlocks)(startTime, endTime);
    res.json(data);
}));
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
