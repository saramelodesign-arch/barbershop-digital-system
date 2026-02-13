const pool = require('../config/db');

//====== CREATE =======
const createAppointment = async (req, res) => {
  try {
    const {
      client_name,
      client_email,
      service_id,
      barber_id,
      start_time
    } = req.body;

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

        const serviceResult = await pool.query(
      'SELECT duration FROM services WHERE id = $1',
      [service_id]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

        const barberResult = await pool.query(
      'SELECT id FROM barbers WHERE id = $1',
      [barber_id]
    );

    if (barberResult.rows.length === 0) {
      return res.status(404).json({ error: 'Barber not found' });
    }

        const duration = serviceResult.rows[0].duration;

            const startDate = new Date(start_time);

                const endDate = new Date(startDate.getTime() + duration * 60000);

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

module.exports = {
  createAppointment
};
