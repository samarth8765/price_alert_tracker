import express from 'express';
import 'dotenv/config';
import { database } from './database/database.js';
import { router } from './routes/alertroutes.js';
import { authentication } from './middleware/auth.js';
import { router as authRoute } from './routes/registerRoutes.js';
import { startWebSocketSubscriptions } from './socket/priceTracker.js'
import { startEmailConsumer } from './message_queue/consumer.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json(
        { message: "Hola Amigos" }
    );
});

app.use('/', authRoute);
app.use('/alert', authentication, router);

setTimeout(() => {
    database.sync().then(() => {
        console.log('DB is ready');
        startWebSocketSubscriptions();
    }).catch(err => console.log("Error occured", err));
}, 10000);

setTimeout(() => {
    startEmailConsumer();
}, 10000);

app.listen(PORT, () => {
    console.log(`Listening at PORT ${PORT}`);
});


