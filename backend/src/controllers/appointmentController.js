const pool = require('../config/db');

/* =====================================
   CREATE APPOINTMENT
===================================== */
const createAppointment = async (req, res) => {
  try {
    const {
      client_name,
      client_email,
      service_id,
      barber_id,
      start_time
    } = req.body;

    // Validate required fields
    if (!client_name || typeof client_name !== 'string') {
      return res.status(400).json({ error: 'Invalid client name' });
    }

    if (!client_email || typeof client_email !== 'string') {
      return res.status(400).json({ error: 'Invalid client email' });
    }

    if (!Number.isInteger(service_id)) {
      return res.status(400).json({ error: 'Invalid service id' });
    }

    if (!Number.isInteger(barber_id)) {
      return res.status(400).json({ error: 'Invalid barber id' });
    }

    if (!start_time) {
      return res.status(400).json({ error: 'Start time required' });
    }

    // Check if service exists
    const serviceResult = await pool.query(
      'SELECT duration FROM services WHERE id = $1',
      [service_id]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Check if barber exists
    const barberResult = await pool.query(
      'SELECT id FROM barbers WHERE id = $1',
      [barber_id]
    );

    if (barberResult.rows.length === 0) {
      return res.status(404).json({ error: 'Barber not found' });
    }

    const duration = serviceResult.rows[0].duration;

    const startDate = new Date(start_time);
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ error: 'Invalid start time' });
    }

    // Calculate end time based on service duration
    const endDate = new Date(startDate.getTime() + duration * 60000);

    // Check for overlapping appointments
    const conflictCheck = await pool.query(
      `SELECT id FROM appointments
       WHERE barber_id = $1
       AND status != 'cancelled'
       AND $2 < end_time
       AND $3 > start_time`,
      [barber_id, startDate, endDate]
    );

    if (conflictCheck.rows.length > 0) {
      return res.status(400).json({
        error: 'Time slot already booked for this barber'
      });
    }

    // Insert appointment
    const result = await pool.query(
      `INSERT INTO appointments
       (client_name, client_email, service_id, barber_id, start_time, end_time)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        client_name,
        client_email,
        service_id,
        barber_id,
        startDate,
        endDate
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


/* =====================================
   GET ALL APPOINTMENTS
===================================== */
const getAllAppointments = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM appointments ORDER BY start_time ASC'
    );

    res.status(200).json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


/* =====================================
   GET APPOINTMENT BY ID
===================================== */
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: 'Invalid appointment id' });
    }

    const result = await pool.query(
      'SELECT * FROM appointments WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


/* =====================================
   UPDATE APPOINTMENT (FULL EDIT)
===================================== */
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: 'Invalid appointment id' });
    }

    const existing = await pool.query(
      'SELECT * FROM appointments WHERE id = $1',
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const appointment = existing.rows[0];

    // Only booked appointments can be edited
    if (appointment.status !== 'booked') {
      return res.status(400).json({
        error: 'Appointment cannot be modified'
      });
    }

    const {
      client_name,
      client_email,
      service_id,
      barber_id,
      start_time
    } = req.body;

    if (!client_name || !client_email || !service_id || !barber_id || !start_time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const serviceResult = await pool.query(
      'SELECT duration FROM services WHERE id = $1',
      [service_id]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const duration = serviceResult.rows[0].duration;

    const startDate = new Date(start_time);
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ error: 'Invalid start time' });
    }

    const endDate = new Date(startDate.getTime() + duration * 60000);

    const conflictCheck = await pool.query(
      `SELECT id FROM appointments
       WHERE barber_id = $1
       AND id != $2
       AND status != 'cancelled'
       AND $3 < end_time
       AND $4 > start_time`,
      [barber_id, id, startDate, endDate]
    );

    if (conflictCheck.rows.length > 0) {
      return res.status(400).json({
        error: 'Time slot already booked for this barber'
      });
    }

    const result = await pool.query(
      `UPDATE appointments
       SET client_name = $1,
           client_email = $2,
           service_id = $3,
           barber_id = $4,
           start_time = $5,
           end_time = $6
       WHERE id = $7
       RETURNING *`,
      [
        client_name,
        client_email,
        service_id,
        barber_id,
        startDate,
        endDate,
        id
      ]
    );

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


/* =====================================
   DELETE APPOINTMENT
===================================== */
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: 'Invalid appointment id' });
    }

    const result = await pool.query(
      'DELETE FROM appointments WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


/* =====================================
   UPDATE STATUS ONLY
===================================== */
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: 'Invalid appointment id' });
    }

    const allowedStatus = ['booked', 'cancelled', 'completed'];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const result = await pool.query(
      `UPDATE appointments
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus
};
