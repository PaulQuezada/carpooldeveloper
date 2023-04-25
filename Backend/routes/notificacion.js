import express from 'express';
const router = express.Router();

// importar el modelo nota
import notificacionSchema from '../models/notificacion';

router.post('/addnotificacion', async (req, res) => {
  const body = req.body;
  const notificacion = notificacionSchema(body)
  console.log(body)
  await notificacion.save()
    .then((result) => {
      res.json(result)

    })
    .catch((err) => {
      console.log(err)
      res.json(err)
    });

});

router.delete('/eliminarnotificacion/:id', async (req, res) => {
  const notificacionID = req.params.id
  console.log(req.params)
  const notificacion = notificacionSchema.find()
  await notificacion.deleteOne({ _id: notificacionID })
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      console.log(err)
      res.json(err)
    });
});

router.get('/getallnotificaciones', async (req, res) => {
  const notificacion = await notificacionSchema.find()
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      console.log(err)
      res.json(err)
    });
});

// Actualizar el estado de una notificación
router.put('/cambioEstado', async (req, res) => {
  const body = req.body;
  const notificacionId = body.notificacionId;
  const estado = body.estado;
  var tipoCambiar = ""
  // Actualizar el estado
  try {
    if(estado){
      tipoCambiar="Solicitud unirse al viaje Aceptada"
    }else{
      tipoCambiar="Solicitud unirse al viaje Denegada"
    }
    const resp = await notificacionSchema.updateOne(
      {
        _id: notificacionId,
      },
      {
        tipo:tipoCambiar,
        estado: estado,
      }
    );
    console.log(resp);
    res.status(200).json({ message: 'Estado actualizado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el estado' });
  }
});

module.exports = router;