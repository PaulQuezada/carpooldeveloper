import { ObjectID } from 'bson';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const viajeSchema = new Schema({
    disponibles:Number,
    precio:Number,
    estado:String,
    origen:{
        nombre:String,
        lng: Number,
        lat: Number 
    },
    destino:{
        nombre:String,
        lng: Number,
        lat: Number 
    },
    choferid: mongoose.Types.ObjectId,
    haciautalca:Boolean,
    pasajeros:
     [
        mongoose.Types.ObjectId,
        
     ],

    parada:[   

    ],
    fecha:String,
    horainicio: String,
    horafin:Date,
    esfrecuente:Boolean


},{ versionKey: false });

const viaje = mongoose.model('viaje', viajeSchema);

export default viaje;