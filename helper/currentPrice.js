import fetch from 'node-fetch';

export async function getCurrentPrice(symbol = 'BTCUSDT') {
    const url = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return parseFloat(data.price);
    } catch (error) {
        console.error('Error fetching current price:', error);
    }
}
