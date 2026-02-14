const express = require('express');
const router = express.Router();
const { getAvailableSlots } = require('../services/availabilityService');

router.get('/', async (req, res) => {
  try {
    const { barber_id, service_id, date } = req.query;

    if (!barber_id || !service_id || !date) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const slots = await getAvailableSlots(
      Number(barber_id),
      Number(service_id),
      date
    );

    res.status(200).json(slots);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
