const pool = require('../config/db');

// GET ALL
const getAllServices = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM services ORDER BY id ASC'
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// CREATE
const createService = async (req, res) => {
  try {
    const { name, duration, price } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Invalid name' });
    }

    if (!Number.isInteger(duration) || duration <= 0) {
      return res.status(400).json({ error: 'Invalid duration' });
    }

    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: 'Invalid price' });
    }

    const result = await pool.query(
      'INSERT INTO services (name, duration, price) VALUES ($1, $2, $3) RETURNING *',
      [name, duration, price]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET BY ID
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: 'Invalid service id' });
    }

    const result = await pool.query(
      'SELECT * FROM services WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, duration, price } = req.body;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: 'Invalid service id' });
    }

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Invalid name' });
    }

    if (!Number.isInteger(duration) || duration <= 0) {
      return res.status(400).json({ error: 'Invalid duration' });
    }

    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: 'Invalid price' });
    }

    const result = await pool.query(
      `UPDATE services
       SET name = $1, duration = $2, price = $3
       WHERE id = $4
       RETURNING *`,
      [name, duration, price, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ error: 'Invalid service id' });
    }

    const result = await pool.query(
      'DELETE FROM services WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.status(200).json({ message: 'Service deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = {
  getAllServices,
  createService,
  getServiceById,
  updateService,
  deleteService
};

