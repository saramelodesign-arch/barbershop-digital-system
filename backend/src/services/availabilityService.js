const pool = require('../config/db');

/**
 * Generate available time slots for a barber on a specific date
 */
const getAvailableSlots = async (barber_id, service_id, date) => {
  try {

    // 1. Validate barber existence and get working hours
    const barberResult = await pool.query(
      'SELECT working_hours_start, working_hours_end FROM barbers WHERE id = $1',
      [barber_id]
    );

    if (barberResult.rows.length === 0) {
      throw new Error('Barber not found');
    }

    // 2. Validate service existence and get duration
    const serviceResult = await pool.query(
      'SELECT duration FROM services WHERE id = $1',
      [service_id]
    );

    if (serviceResult.rows.length === 0) {
      throw new Error('Service not found');
    }

    const workingStart = barberResult.rows[0].working_hours_start;
    const workingEnd = barberResult.rows[0].working_hours_end;
    const duration = serviceResult.rows[0].duration;

    // 3. Build working day time window
    const dayStart = new Date(`${date}T${workingStart}`);
    const dayEnd = new Date(`${date}T${workingEnd}`);

    // 4. Get existing appointments for that barber on that date
    const appointmentsResult = await pool.query(
      `SELECT start_time, end_time
       FROM appointments
       WHERE barber_id = $1
       AND status != 'cancelled'
       AND DATE(start_time) = $2`,
      [barber_id, date]
    );

    let current = new Date(dayStart);
    const availableSlots = [];

    // 5. Generate slots dynamically
    while (current.getTime() + duration * 60000 <= dayEnd.getTime()) {

      const slotStart = new Date(current);
      const slotEnd = new Date(current.getTime() + duration * 60000);

      // Check overlap with existing appointments
      const hasConflict = appointmentsResult.rows.some(appt => {
        const existingStart = new Date(appt.start_time);
        const existingEnd = new Date(appt.end_time);

        return slotStart < existingEnd && slotEnd > existingStart;
      });

      if (!hasConflict) {
        availableSlots.push(slotStart.toISOString());
      }

      // Move to next possible slot
      current = new Date(current.getTime() + duration * 60000);
    }

    return availableSlots;

  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getAvailableSlots
};
