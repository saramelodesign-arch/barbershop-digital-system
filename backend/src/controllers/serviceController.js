let services = [];

exports.getAllServices = (req, res) => {
  res.status(200).json(services);
};

exports.createService = (req, res) => {
  const { name, duration, price } = req.body;

  if (!name || !duration || !price) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newService = {
    id: services.length + 1,
    name,
    duration,
    price,
    active: true
  };

  services.push(newService);

  res.status(201).json(newService);
};
