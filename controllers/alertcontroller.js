import { getCurrentPrice } from "../helper/currentPrice.js";
import { Alert } from "../models/alert.js";
import Redis from 'ioredis';
const redis = new Redis();

export const createAlert = async (req, res) => {
    try {
        const { targetPrice, currencyPair } = req.body;
        const userId = req.user.userId;
        const currentPrice = await getCurrentPrice(currencyPair);
        const direction = (currentPrice > targetPrice) ? "below" : "above";
        const alert = await Alert.create({
            userId: userId,
            targetPrice,
            currencyPair,
            status: 'active',
            direction
        });
        res.status(201).json(alert);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server error" });
    }
}

export const deleteAlert = async (req, res) => {
    try {
        const id = req.params.id;
        const alert = await Alert.destroy({ where: { id } });

        if (alert) {
            res.status(200).json({
                message: "Alert Deleted",
            })
        }
        else {
            res.json(403), json({
                message: "Invalid alert id"
            })
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
        })
    }
}

export const getAllAlerts = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { status } = req.query;
        const cacheKey = `alerts:${userId}:${status || 'all'}`;

        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }

        const whereClause = { userId };
        if (status) whereClause.status = status;

        const alerts = await Alert.findAll({
            where: whereClause
        });

        await redis.set(cacheKey, JSON.stringify(alerts), 'EX', 60);

        res.status(200).json(alerts);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
}
