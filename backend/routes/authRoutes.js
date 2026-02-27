import express from 'express';

const router = express.Router();

// Stubs for legacy routes (Frontend should use Firebase directly)
router.post('/register', (req, res) => {
    res.status(501).json({ message: 'Register via Firebase directly' });
});

router.post('/login', (req, res) => {
    res.status(501).json({ message: 'Login via Firebase directly' });
});

export default router;
