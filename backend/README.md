# Barbershop Digital System – Backend

Node.js + Express + PostgreSQL backend for a barbershop booking system.

## Tech Stack

- Node.js
- Express
- PostgreSQL
- pg (node-postgres)
- dotenv

---

## Architecture Overview

The backend follows a layered structure:

controllers/ → HTTP logic  
routes/ → endpoint definitions  
services/ → business logic (availability generation)  
config/ → database configuration  

Clear separation between:
- HTTP layer
- Business rules
- Database queries

---

## Core Features

### Services
- Create, read, update, delete services
- Duration-based logic for scheduling

### Barbers
- Working hours management
- Active status support

### Appointments
- Full CRUD
- Automatic end_time calculation
- Overlap prevention
- Status control (booked / cancelled / completed)
- Domain rule: non-booked appointments cannot be modified

### Availability Engine
Generates dynamic time slots based on:
- Barber working hours
- Service duration
- Existing appointments
- Overlap validation

---

## Business Rules

- No overlapping appointments for the same barber
- Only "booked" appointments can be edited
- Cancelled appointments do not block availability
- Time slots respect working hours
- End time is calculated automatically

---

## API Endpoints

### Services
GET /services  
POST /services  
PUT /services/:id  
DELETE /services/:id  

### Barbers
GET /barbers  
POST /barbers  
PUT /barbers/:id  
DELETE /barbers/:id  

### Appointments
GET /appointments  
GET /appointments/:id  
POST /appointments  
PUT /appointments/:id  
PATCH /appointments/:id/status  
DELETE /appointments/:id  

### Availability
GET /availability?barber_id=1&service_id=1&date=YYYY-MM-DD  

Returns available time slots in ISO format.

---

## How to Run

1. Install dependencies:

npm install


2. Configure `.env`:

PORT=3000
DATABASE_URL=your_postgres_connection_string


3. Start server:

npm start

