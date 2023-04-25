<template>
    <div class="contadmin2">
        <h2 style="text-align: center;">Crea tu viaje</h2>

        <vs-input v-model="precio" icon-after placeholder="Precio" label="Precio">
            <template #icon>
                <span class="material-icons-outlined">
                    attach_money
                </span>
            </template>
        </vs-input>
        <br>
        <vs-input v-model="asientos" icon-after placeholder="Asientos disponibles" label="Asientos disponibles">
            <template #icon>
                <span class="material-icons-outlined">
                    airline_seat_recline_extra
                </span>
            </template>
        </vs-input>
        <br>

        <vs-input type="date" :min="fechaActual" v-model="fecha" label="Fecha" />
        <br>
        <vs-input type="time" v-model="hora" label="Hora" />
        <div class="checkfrecuente">
            <vs-checkbox v-model="option">
                Viaje frecuente
            </vs-checkbox>
        </div>
        <div class="center">
            <vs-radio v-model="picked" val=false>
                Hacia utalca
            </vs-radio>
            <vs-radio success v-model="picked" val=true>
                Desde utalca
            </vs-radio>
        </div>
        <div class="boton">
            <vs-button @click="creaviaje">
                Crear Viaje
            </vs-button>
        </div>

    </div>
</template>

<script>
import API from '@/api';
import { viajeBus } from "../main.js";
export default {
    name: 'MapboxMap',
    data() {
        return {
            fecha: "",
            hora: "",
            asientos: 0,
            precio: 0,
            option: false,
            origen: null,
            destino: null,
            fechaActual: null,
            horaActual: null,
            NumeroPattern: /^\d+$/,
            picked: null,

        };
    },
    methods: {
        async creaviaje() {
            if (this.fecha !== "" && this.hora !== "" && (this.NumeroPattern.test(this.precio) && this.precio >= 0)
                && (this.NumeroPattern.test(this.asientos) && this.asientos > 0 && this.asientos <= 5) && this.picked != null) {
                const token = JSON.parse(localStorage.getItem("carpooltoken"))

                if (this.$store.state.haciautalca === true) {
                    this.origen = this.$store.state.marker1
                    this.destino = this.$store.state.marker2
                } else {
                    this.origen = this.$store.state.marker2
                    this.destino = this.$store.state.marker1
                }
                var Utils = {
                    generarCadena: function () {
                        var caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        var longitudCadena = 9;
                        var cadena = "";
                        for (var i = 0; i < longitudCadena; i++) {
                            cadena += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
                        }
                        return cadena.toString();
                    }
                };
                console.log(this.$store.state.asientos)

                const resp = await API.addviaje(
                    {
                        "disponibles": parseInt(this.asientos),
                        "precio": parseInt(this.precio),
                        "origen": this.origen,
                        "destino": this.destino,
                        "choferid": token._id,
                        "haciautalca": this.$store.state.haciautalca,
                        "pasajeros": [],
                        "fecha": this.fecha,
                        "horainicio": this.hora,
                        "esfrecuente": this.option,
                        "codigo": Utils.generarCadena
                    }
                )

                console.log("AXIOS " + token._id + ", " + resp._id)
                this.$emit('viajecreado')
                await this.axios.put(`updateusuario`, {
                    "userid": token._id,
                    "viajeid": resp._id
                })
                this.openNotification("Tu viaje ha sido creado con exito", 3000, "", "#27F055")
                // SOCKET IO, ENVIAMOS UN VIAJE A TIEMPO REAL A TODOS LOS WEONES
                console.log("Emitiendo viaje")
                viajeBus.$emit('enviarViaje', resp);
            } else {

                if (!this.NumeroPattern.test(this.asientos) || (this.asientos <= 0 || this.asientos > 5)) {

                    this.openNotification("Numero de asientos invalido", 3000, "", "danger")
                } else if (!this.NumeroPattern.test(this.precio)) {
                    if (this.precio !== 0) {
                        this.openNotification("Necesitas ingresar un precio valido", 3000, "", "danger")
                    }

                } else if (this.hora === "") {
                    this.openNotification("Necesitas ingresar una hora valida", 3000, "", "danger")
                } else {
                    this.openNotification("Debes marcar Desde/Hacia utalca ", 3000, "", "danger")

                }
            }
        },
        openNotification(titulo, duration, text, color, position) {
            // Envia una notificacion (es de vuesax)
            this.$vs.notification({
                color: color,
                duration: duration,
                title: titulo,
                text: text
            })
        }, DiaActual() {
            const hoy = new Date();
            const mes = hoy.getMonth() + 1;
            const dia = hoy.getDate();
            const year = hoy.getFullYear();
            this.fechaActual = `${year}-${mes < 10 ? '0' + mes : mes}-${dia < 10 ? '0' + dia : dia}`;
            this.fecha = this.fechaActual


        }
    }, mounted() {
        this.DiaActual()
    }
};
</script>

<style scoped>
.contadmin2 {
    display: flex;
    flex-direction: column;
    height: 55vh;
    justify-content: center;
}

.boton {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 20%;
}

.checkfrecuente {
    display: flex;
    justify-content: center;
}
</style> 

