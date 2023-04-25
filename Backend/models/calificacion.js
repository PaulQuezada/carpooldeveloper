import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const calificacionSchema = new Schema({
    nota:Number,
    calificador: mongoose.Types.ObjectId,
    descripcion:String,
    eschofer: Boolean

});

const calificacion = mongoose.model('calificacion', calificacionSchema);

export default calificacion;