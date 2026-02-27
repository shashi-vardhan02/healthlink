import express from 'express';

const router = express.Router();

// Stubs for legacy routes (Frontend should use Firebase directly)
router.get('/', (req, res) => {
    res.status(501).json({ message: 'Fetch hospitals via Firestore listener in AuthContext' });
});

router.get('/:id', (req, res) => {
    res.status(501).json({ message: 'Fetch hospital via Firestore doc() in AuthContext' });
});

export default router;
