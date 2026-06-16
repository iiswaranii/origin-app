const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

function createToken(user) {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        }
    );
}

async function signup(req, res) {
    try {

        const { name, email, password } = req.body;

        const normalizedEmail = email.toLowerCase();

        const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [normalizedEmail]);

        if(existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered!"
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const result = await pool.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at`, [name, normalizedEmail, passwordHash]);

        const user = result.rows[0];
        const token = createToken(user);

        return res.status(201).json({
            success: true,
            message: "Signup successful",
            data: {
                user, token
            }
        });

    } catch (err) {
        console.error("Signup error🚨:", err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong during signup!"
        })
    }
}

async function login(req, res) {
    try {

        const {email, password} = req.body;

        const normalizedEmail = email.toLowerCase();

        const result = await pool.query(`SELECT id, name, email, password, created_at FROM users WHERE email = $1`, [normalizedEmail]);

        if(result.rows.length === 0) {
            return res.status(401).json({
                sucess: false,
                message: "Invalid email or password!"
            });
        }

        const user = result.rows[0];

        const passwordMatches = await bcrypt.compare(password, user.password);

        if(!passwordMatches) return res.status(401).json({success: false, message: "Invalid email or password!"});

        const token = createToken(user);

        delete user.password;

        return res.json({
            success: true,
            message: "Login Successful!",
            data: {
                user, token
            }
        });

    } catch (err) {
        console.error("Login Error🚨:", err);
        res.status(500).json({
            success: false,
            message: "Something went wrong during login!"
        });
    }
}

async function me(req, res) {
    return res.json({
        success: true,
        message: "Authenticated user fetched successfully!",
        data: {
            user: req.user
        }
    });
}

module.exports = {signup, login, me};