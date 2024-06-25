import { Router } from 'express';
import { User } from '../../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { checkAuth } from '../../middleware/checkAuth';
import { IAuthRequest } from '../../interfaces/authRequest';

const authController = Router();

authController.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
    
        if (!username || !password) {
            return res.status(400).send('Username and password are required!');
        }
    
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).send('Username already exists!');
        }
    
        if (password.length < 8) {
            return res.status(400).send('Password must be at least 8 characters long!');
        }
    
        const passwordHash = await bcrypt.hash(password, 10);
        await User.create({ username, passwordHash });

        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while creating the user!');
    }
});

authController.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(401).send('Username and password do not match!');
    }

    if (!bcrypt.compareSync(password, user.passwordHash)) {
        return res.status(401).send('Username and password do not match!');
    }

    const authValiditySeconds = 60 * 60 * 24 * 30; // 30 days
    const expiresIn = Date.now() + (authValiditySeconds * 1000);
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: authValiditySeconds });

    res.cookie('PhonebookAuth', jwtToken, {
        expires: new Date(expiresIn),
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    });

    res.status(200);
    res.json({ username: user.username });
});

authController.post('/logout', (req, res) => {
    res.clearCookie('PhonebookAuth');
    res.sendStatus(200);
});

authController.get('/current', checkAuth, async (req: IAuthRequest, res) => {
    if (!!req.user) {
        res.json({ username: req.user.username });
    }
    else {
        res.json({ username: null });
    }
});

export default authController;



