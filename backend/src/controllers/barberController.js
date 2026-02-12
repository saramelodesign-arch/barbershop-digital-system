const pool = require('../config/db');

// GET ALL
const getAllBarbers = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM barbers ORDER BY id ASC'
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// GET BY ID
const getBarberById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({ error: 'Invalid barber id' });
        }

        const result = await pool.query(
            'SELECT * FROM barbers WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Barber not found' });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// CREATE
const createBarber = async (req, res) => {
    try {
        const { name, working_hours_start, working_hours_end } = req.body;

        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Invalid name' });
        }

        if (!working_hours_start || !working_hours_end) {
            return res.status(400).json({ error: 'Working hours required' });
        }

        if (
            new Date(`1970-01-01T${working_hours_end}`) <=
            new Date(`1970-01-01T${working_hours_start}`)
        ) {
            return res.status(400).json({
                error: 'End time must be after start time'
            });
        }



        const result = await pool.query(
            `INSERT INTO barbers 
       (name, working_hours_start, working_hours_end) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
            [name, working_hours_start, working_hours_end]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("FULL ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

// UPDATE
const updateBarber = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, working_hours_start, working_hours_end } = req.body;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({ error: 'Invalid barber id' });
        }

        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Invalid name' });
        }

        if (!working_hours_start || !working_hours_end) {
            return res.status(400).json({ error: 'Working hours required' });
        }

        if (new Date(`1970-01-01T${working_hours_end}`) <= 
            new Date(`1970-01-01T${working_hours_start}`)) {
            return res.status(400).json({
                error: 'End time must be after start time'
            });
        }

        const result = await pool.query(
            `UPDATE barbers 
             SET name = $1,
                 working_hours_start = $2,
                 working_hours_end = $3
             WHERE id = $4 
             RETURNING *`,
            [name, working_hours_start, working_hours_end, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Barber not found' });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// DELETE
const deleteBarber = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({ error: 'Invalid barber id' });
        }

        const result = await pool.query(
            'DELETE FROM barbers WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Barber not found' });
        }

        res.status(200).json({ message: 'Barber deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllBarbers,
    getBarberById,
    createBarber,
    updateBarber,
    deleteBarber
};
