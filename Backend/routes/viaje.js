import express from 'express';
const router = express.Router();

// importar el modelo nota
import viajeSchema from '../models/viaje';

router.post('/addviaje', async(req, res) => {
    const body = req.body;  
    console.log(body)
    const viaje = viajeSchema(body)   
        
    await viaje.save()
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      console.log(err)
      res.json(err)
    });
  });
router.get('/getallviajes',async(req,res)=>{
  const viajes = await  viajeSchema.find()
  .then((result) => {
    res.json(result)
  })
  .catch((err) => {
    console.log(err)
    res.json(err)
  });
  


});


router.delete('/eliminarviajebyid/:id', async(req, res) => {
  const viajeID = req.params.id 
  console.log(req.params)
  const viaje = viajeSchema.find() 
  await viaje.deleteOne({ _id: viajeID })
  .then((result) => {
    res.json(result)
  })
  .catch((err) => {
    console.log(err)
    res.json(err)
  });
});
  module.exports = router;