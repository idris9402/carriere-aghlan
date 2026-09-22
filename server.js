const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let drivers = [
  {id: 1, name: 'سائق 01', phone: '0550000000', status: 'available'},
  {id: 2, name: 'سائق 02', phone: '0660000000', status: 'busy'}
];
let orders = [
  {id: 'AG-1001', material: 'حصى', quantity: 15, pickup: 'المحجرة', drop: 'الجزائر', status: 'pending', driverId: null},
  {id: 'AG-1002', material: 'ردم', quantity: 20, pickup: 'المحجرة', drop: 'البليدة', status: 'in_progress', driverId: 1}
];

app.get('/api/health', (_req,res) => res.json({ok:true, app:'CARRIÈRE AGHLAN'}));
app.get('/api/drivers', (_req,res) => res.json(drivers));
app.get('/api/orders', (_req,res) => res.json(orders));

app.post('/api/orders', (req,res) => {
  const {material='حصى', quantity=1, pickup='المحجرة', drop='الجزائر'} = req.body || {};
  const order = {id:`AG-${1000 + orders.length + 1}`, material, quantity:Number(quantity), pickup, drop, status:'pending', driverId:null};
  orders.push(order);
  res.status(201).json(order);
});

app.patch('/api/orders/:id/status', (req,res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({error:'Order not found'});
  order.status = req.body.status || order.status;
  res.json(order);
});

app.patch('/api/orders/:id/assign', (req,res) => {
  const order = orders.find(o => o.id === req.params.id);
  const driver = drivers.find(d => d.id === Number(req.body.driverId));
  if (!order || !driver) return res.status(404).json({error:'Order or driver not found'});
  order.driverId = driver.id;
  order.status = 'in_progress';
  driver.status = 'busy';
  res.json(order);
});

app.get('*', (_req,res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.listen(PORT, () => console.log(`CARRIÈRE AGHLAN listening on ${PORT}`));
