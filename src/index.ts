import express, {Request, Response} from 'express';
import { createBlocks, wrapBlocks } from './block-generator';
import { addMinutes } from 'date-fns';

const app = express();

app.get('/', (req: Request, res: Response) => {
    res.json({
        status: 'ok'
    });
});

app.get('/blocks', async (req: Request, res: Response) => {
    const startTime = req.query.startTime ? new Date(req.query.startTime as string) : addMinutes(new Date(), -15);
    const endTime = req.query.endTime ? new Date(req.query.endTime as string) : addMinutes(startTime, 15);

    if (startTime > endTime) {
        res.status(400).json({ error: 'startTime must be before endTime' });
        return;
    }

    const data = createBlocks(startTime, endTime);
    res.json(data);
});

app.get('/file', async (req: Request, res: Response) => {
    const startTime = req.query.startTime ? new Date(req.query.startTime as string) : addMinutes(new Date(), -15);
    const endTime = req.query.endTime ? new Date(req.query.endTime as string) : addMinutes(startTime, 15);
    const source = req.query.source as string ?? "unknown";

    console.log(`Request from ${source} for ${startTime} to ${endTime}`);

    if (startTime > endTime) {
        res.status(400).json({ error: 'startTime must be before endTime' });
        return;
    }

    const blocks = createBlocks(startTime, endTime);
    const data = wrapBlocks(blocks);
    res.json(data);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})