import WebSocket from 'ws';
import { Alert } from '../models/alert.js'
import { publishEmailTask } from '../message_queue/producer.js';
import { User } from '../models/user.js';

const alertsSubscriptions = new Map();

function subscribeToCurrencyPair(pair) {
    if (alertsSubscriptions.has(pair)) return;

    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${pair.toLowerCase()}@trade`);
    alertsSubscriptions.set(pair, ws);

    ws.on('message', (data) => {
        const { s: symbol, p: price } = JSON.parse(data);
        checkAndNotifyAlerts(symbol, parseFloat(price));
    });

    ws.on('close', () => {
        alertsSubscriptions.delete(pair);
        console.log(`${pair} WebSocket closed`);
    });

    console.log(`Subscribed to ${pair}`);
}

function closeAllConnections() {
    alertsSubscriptions.forEach((ws, pair) => {
        console.log(`Closing connection for ${pair}`);
        ws.close();
        alertsSubscriptions.delete(pair);
    });
}

async function refreshSubscriptions() {
    closeAllConnections();
    const activeAlerts = await Alert.findAll({
        where: { status: 'active' },
        attributes: ['currencyPair']
    });

    const uniquePairs = new Set(activeAlerts.map(alert => alert.currencyPair));

    uniquePairs.forEach(currencyPair => {
        subscribeToCurrencyPair(currencyPair);
    });
}

async function checkAndNotifyAlerts(symbol, currentPrice) {
    const alerts = await Alert.findAll({ where: { currencyPair: symbol, status: 'active' } });

    alerts.forEach(async (alert) => {
        let isTriggered = false;
        console.log(currentPrice, alert.targetPrice);

        if ((alert.direction === 'above' && currentPrice >= alert.targetPrice) ||
            (alert.direction === 'below' && currentPrice <= alert.targetPrice)) {
            isTriggered = true;
        }

        if (isTriggered) {
            alert.status = 'triggered';
            await alert.save();
            console.log("Price has changed", symbol, alert.id);

            const user = await User.findOne({ where: { id: alert.userId } });
            const emailData = {
                to: user.email,
                subject: `Alert Triggered for ${symbol}`,
                body: `Your alert for ${symbol} at price ${alert.targetPrice} has been triggered. Current price: ${currentPrice}.`
            };
            await publishEmailTask(emailData);
        }
    });
}

refreshSubscriptions();
setInterval(refreshSubscriptions, 120000); 