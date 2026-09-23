const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const db = require("./config/database");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());


// Test route
app.get("/", (req, res) => {
    res.send("Thanal backend is running!");
});


// SIGNUP
app.post("/api/signup", async (req, res) => {

    const { name, email, password, confirmPassword } = req.body;

    // Check required fields
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({
            message: "Please fill in all fields."
        });
    }

    // Check passwords
    if (password !== confirmPassword) {
        return res.status(400).json({
            message: "Passwords do not match."
        });
    }

    try {

        // Check whether email already exists
        db.query(
            "SELECT id FROM users WHERE email = ?",
            [email],
            async (err, results) => {

                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        message: "Database error."
                    });
                }

                if (results.length > 0) {
                    return res.status(409).json({
                        message: "An account with this email already exists."
                    });
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Insert user
                db.query(
                    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                    [name, email, hashedPassword],
                    (err) => {

                        if (err) {
                            console.error(err);
                            return res.status(500).json({
                                message: "Could not create account."
                            });
                        }

                        res.status(201).json({
                            message: "Account created successfully!"
                        });
                    }
                );
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error."
        });
    }
});

// LOGIN
app.post("/api/login", async (req, res) => {

    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
        return res.status(400).json({
            message: "Please enter your email and password."
        });
    }

    try {

        // Find user by email
        db.query(
            "SELECT * FROM users WHERE email = ?",
            [email],
            async (err, results) => {

                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        message: "Database error."
                    });
                }

                // User doesn't exist
                if (results.length === 0) {
                    return res.status(401).json({
                        message: "Invalid email or password."
                    });
                }

                const user = results[0];

                // Compare password with stored bcrypt hash
                const passwordMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!passwordMatch) {
                    return res.status(401).json({
                        message: "Invalid email or password."
                    });
                }

                // Login successful
                res.status(200).json({
                    message: "Login successful!",
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                });
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error."
        });
    }
});
// START SERVER
app.listen(PORT, () => {
    console.log(`Thanal backend running at http://localhost:${PORT}`);
});