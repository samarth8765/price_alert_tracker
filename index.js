import express from 'express';
import 'dotenv/config';
import { database } from './database/database.js';
import { Router } from 'express';

const app = express();
const PORT = process.env.PORT || 8080;



app.get('/health', (req, res) => {
    res.status(200).json(
        { message: "Hola Amigos" }
    );
});


database.sync().then(() => console.log('DB is ready')).catch(err => console.log("Error occured", err));

app.listen(PORT, () => {
    console.log(`Listening at PORT ${PORT}`);
});


