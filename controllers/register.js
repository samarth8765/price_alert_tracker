import bcrypt from 'bcrypt';
import { User } from '../models/user.js';

export async function register(req, res,) {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({
                message: "User already existed",
            });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password: hashPassword
        });

        res.status(201).json({
            message: "User created successfully",
            user: { id: newUser.id, email: newUser.email }
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server Error",
        })
    }
}