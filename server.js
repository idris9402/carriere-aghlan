const express=require('express');
const path=require('path');
const app=express();
const PORT=process.env.PORT||3000;

app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

let drivers=[
 {id:1,name:'سائق 01',phone:'0550000000',status:'available'},
 {id:2,name:'سائق 02',phone:'0660000000',status:'busy'}
];
let orders=[
 {id:'AG-1001',material:'حصى',quantity:15,pickup:'المحجرة',drop:'الجزائر',status:'pending',driverId:null},
 {id:'AG-1002',material:'ردم',quantity:20,pickup:'المحجرة',drop:'البليدة',status:'in_progress',driverId:1}
];

app.get('/api/health',(_q,r)=>r.json({ok:true,app:'CARRIÈRE AGHLAN'}));
app.get('/api/drivers',(_q,r)=>r.json(drivers));
app.get('/api/orders',(_q,r)=>r.json(orders));

app.post('/api/orders',(q,r)=>{
 const {material='حصى',quantity=1,pickup='المحجرة',drop='الجزائر'}=q.body||{};
 const o={id:`AG-${1000+orders.length+1}`,material,quantity:Number(quantity),pickup,drop,status:'pending',driverId:null};
 orders.push(o); r.status(201).json(o);
});

app.patch('/api/orders/:id/status',(q,r)=>{
 const o=orders.find(x=>x.id===q.params.id);
 if(!o)return r.status(404).json({error:'Order not found'});
 o.status=q.body.status||o.status; r.json(o);
});

app.patch('/api/orders/:id/assign',(q,r)=>{
 const o=orders.find(x=>x.id===q.params.id);
 const d=drivers.find(x=>x.id===Number(q.body.driverId));
 if(!o||!d)return r.status(404).json({error:'Order or driver not found'});
 o.driverId=d.id;o.status='in_progress';d.status='busy';r.json(o);
});

app.get('*',(_q,r)=>r.sendFile(path.join(__dirname,'public/index.html')));
app.listen(PORT,()=>console.log(`CARRIÈRE AGHLAN listening on ${PORT}`));
