const express = require('express');
const router = express.Router();

// Import controller functions
const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus
} = require('../controllers/appointmentController');

// CREATE
router.post('/', createAppointment);

// READ
router.get('/', getAllAppointments);
router.get('/:id', getAppointmentById);

// UPDATE
router.put('/:id', updateAppointment);

// DELETE
router.delete('/:id', deleteAppointment);

// UPDATE STATUS ONLY
router.patch('/:id/status', updateAppointmentStatus);

module.exports = router;
