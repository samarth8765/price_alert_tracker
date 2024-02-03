import { User } from "../models/user.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email } });
        const validUser = user && await bcrypt.compare(password, user.password);

        if (!validUser) {
            return res.status(401).json("Either email or password is wrong");
        }

        const token = jwt.sign({ userId: user.id, email: email }, process.env.JWT_TOKEN);
        res.status(200).json({
            message: "Login sucessfully",
            token: token
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}