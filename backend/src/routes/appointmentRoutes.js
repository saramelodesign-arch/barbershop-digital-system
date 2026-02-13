const express = require('express');
const router = express.Router();

const {
  createAppointment
} = require('../controllers/appointmentController');

// CREATE
router.post('/', createAppointment);

module.exports = router;
