import express from 'express';

const router = express.Router();

// Stubs for legacy routes (Frontend should use Firebase directly)
router.post('/checkSlots', (req, res) => {
    res.status(501).json({ message: 'Check slots via Firestore query' });
});

router.post('/bookAppointment', (req, res) => {
    res.status(501).json({ message: 'Book appointment via Firestore addDoc()' });
});

router.post('/sendPaymentLink', (req, res) => {
    res.status(501).json({ message: 'Payment link logic moved to frontend' });
});

export default router;
