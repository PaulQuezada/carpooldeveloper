<template>
    <div>
        <div class="center">
            <vs-avatar color="#FFFFFF" style="margin-top: 3px;" @click="active = !active" badge-color="danger"
                badge-position="top-right">
                <span class="material-icons-outlined" style="color:#36568c;">
                    notifications
                </span>
                <template #badge>
                    {{ notificaciones_activas }}
                </template>
            </vs-avatar>
            <vs-dialog scroll width="100%" v-model="active">
                <div style="height: 500px;">
                    <h2 class="center">Notificaciones</h2>
                    <!-- Enviar notificacion prueba -->
                    <vs-row>
                        <vs-input v-model="persona.mensaje" placeholder="Enviar Notificacion">
                        </vs-input>
                        <vs-button success @click="enviarNot('Solicitud unirse viaje')">
                            <span class="material-icons-outlined">
                                search
                            </span>
                        </vs-button>
                    </vs-row>
                    <!-- Mostramos notificaciones -->
                    <div v-if="mensajes.length > 0">
                        <vs-row v-for="(mensaje, index) in mensajes" :key="index">
                            <div class="noti">
                                <vs-row>
                                    <vs-button v-model="boton" circle :active="descrip == index"
                                        @click="activarNoti(index)">{{
                                            mensaje.tipo }}
                                        <span class="material-icons-outlined" v-if="boton[index] == true">
                                            expand_less
                                        </span>
                                        <span class="material-icons-outlined" v-if="boton[index] != true">
                                            expand_more
                                        </span>
                                    </vs-button>
                                </vs-row>
                                <vs-alert v-if="descrip == index" relief style="width: 40vh;">
                                    <div style="margin: auto;">
                                        <div style="display: flex; align-items: center; width: 100%;">
                                            <p style="font-size: .8rem; margin: 0; text-decoration: underline;">Codigo del
                                                viaje:</p>
                                            <vs-button size="mini" style="margin-left: 5px; font-size: .75rem;">
                                                Copiar
                                                <span class="material-icons-outlined">
                                                    content_paste
                                                </span>
                                            </vs-button>
                                        </div>
                                        <p style="font-size: .7rem;"><span
                                                style="font-size: .8rem; text-decoration: underline;">Origen</span> : {{
                                                    mensaje.origen }}</p>
                                        <p style="font-size: .7rem;"><span
                                                style="font-size: .8rem; text-decoration: underline;">Destino de
                                                viaje</span> :
                                            {{ mensaje.destino }}</p>
                                        <p style="font-size: .7rem;"><span
                                                style="font-size: .8rem; text-decoration: underline;">Nombre del
                                                pasajero</span>
                                            : {{ mensaje.nombrepasj }}</p>
                                        <p style="font-size: .7rem;"><span
                                                style="font-size: .8rem; text-decoration: underline;">Fecha</span> : {{
                                                    mensaje.fecha }}</p>

                                    </div>
                                </vs-alert>
                            </div>
                            <vs-button color="whatsapp" circle icon floating @click="accionVotar(mensaje, true)">
                                <span class="material-icons-outlined" style="">
                                    done
                                </span>
                            </vs-button>
                            <vs-button color="#ff3e4e" circle icon floating @click="accionVotar(mensaje, false)">
                                <span class="material-icons-outlined" style="margin: center;">
                                    close
                                </span>
                            </vs-button>
                        </vs-row>
                    </div>
                </div>
            </vs-dialog>
        </div>
    </div>
</template>
<script>
import { NotiBus } from '../main.js';
import API from '@/api';
export default {
    data: () => ({
        active: false,
        persona: {
            mensaje: ''
        },
        mensajes: [],
        estadonoti: false,
        descrip: -1,
        boton: [],
        notificaciones_activas: 0,
    }),
    methods: {
        obtenerSocketNotificaciones() {
            this.$store.state.SocketioService.socket.on("mensaje:recibido", (data) => {
                const user = JSON.parse(localStorage.getItem("carpooltoken"));
                console.log(data);
                this.mensajes.push(data);
                // Muestra la notificacin solo para otros usuarios, no para el que envip el mensaje
                if (data.receptor == null) {
                    // BROADCAST
                    this.openNotification(data.titulo);
                    this.notificaciones_activas++;
                }
                else if (data.receptor == user._id) {
                    // Envio a un usuario en especifico
                    this.openNotification(data.titulo);
                    this.notificaciones_activas++;
                }
                this.$store.state.idchoferseleccionado = null

            });
        },
        async enviarNot(tipo) {
            if (tipo == "Solicitud unirse viaje") {
                const now = new Date(Date.now());
                const day = now.getDate();
                const monthIndex = now.getMonth();
                const hours = now.getHours();
                const minutes = now.getMinutes();
                const monthNames = [
                    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                ];
                const month = monthNames[monthIndex];

                let data = {
                    emisor: JSON.parse(localStorage.getItem("carpooltoken"))._id,
                    receptor: this.$store.state.idchoferseleccionado,
                    tipo: tipo,
                    estado: null,
                    idviaje: this.$store.state.idviaje,
                    origen: this.$store.state.origenseleccionado.nombre,
                    destino: this.$store.state.destinoseleccionado.nombre,
                    nombrepasj: JSON.parse(localStorage.getItem("carpooltoken")).nombre,
                    parada: null,// añadir el objeto del punto(lo de pablek)
                    fecha: day + " de " + month + " a las " + hours + ":" + minutes
                }
                await API.addNotificacion(data)
                this.$store.state.idchoferseleccionado = null
                this.$store.state.idviaje = null
                this.$store.state.SocketioService.sendMessage(data)
                this.mensajes.push(data);
                // SOLO LO MOSTRAMOS PARA DEMOSTRAR Q EL USUARIO QUE ENVIO EL MENSAJE, es solo para testear
                this.openNotification(tipo);
                this.notificaciones_activas++;
            } else if (tipo == "Resultado solicitud unirse viaje") {
                // SE NECESITA QUE LOS BOTONES FUNCIONEN (--EN DESARROLLO--)

            } else {
                // OTRA COSA

            }
        },
        activarNoti(index) {
            this.boton[index] = !this.boton[index]
            if (this.descrip == index) {
                this.descrip = -1
            }
            else {
                this.descrip = index
            }
        },
        openNotification(titulo) {
            // Envia una notificacion (es de vuesax)
            this.$vs.notification({
                title: titulo,
                text: `Mensaje coshino 👹👹👹`
            })
        },
        async obtenerNotificaciones() {
            this.mensajes = await API.getallnotificaciones();
        },
        async accionVotar(notificacion, voto) {
            const loading = this.$vs.loading({
                type: 'default'
            })
            let data = {
                notificacionId: notificacion._id,
                estado: voto
            }
            await API.actualizarEstadoNotificacion(data)
            await this.obtenerNotificaciones()
            loading.close()
        }
    },
    created() {
        // Creamos el evento para que se ejecute la funcion cuando se llame
        NotiBus.$on('enviarNotificacion', this.enviarNot);
    },
    mounted() {
        this.obtenerNotificaciones()
        this.obtenerSocketNotificaciones()
    },
}
</script>
<style scoped>
.vs-button span {
    margin-left: 0px;
    color: rgb(255, 255, 255);
}

.noti {
    display: block;
    width: 60%;
    height: auto;
}

.datos_mensaje span {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    text-align: center;
    margin: auto;
    font-size: .5rem;
}

.vs-dialog__content {
    height: 500px;
    overflow: auto;
}</style>