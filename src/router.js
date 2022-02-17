const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { decodeBase64 } = require('bcryptjs');
const prisma = new PrismaClient();

const router = express.Router();

const saltRounds = 10;
const secret = "etsdkjnsdlkgmsls";

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hash = await bcrypt.hash(password, saltRounds);
        const user = { username: username, password: hash };
        const newUser = await prisma.user.create({
            data: user
        });
        res.json({newUser: user});

    } catch(e) {
        res.status(500).send("Broken!!!");
        console.log(e);
    }
  

});

router.post('/login', async (req, res) => {
    const { username, password  } = req.body;

    const found = await prisma.user.findUnique({
        where: {
            username
        }
    });

    if (found) {
        if (bcrypt.compare(password, found.password)) {
            const token = jwt.sign(username, secret);
            return res.json({ newToken: token });
        } else {
            return res.json("Passwords dont match!");
        }
    } else {
        return res.json("User does not exist.");
    }


    
});

module.exports = router;
