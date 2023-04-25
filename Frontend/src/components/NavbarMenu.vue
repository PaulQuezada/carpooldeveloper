<template>
    <div>
        <vs-navbar shadow square center-collapsed v-model="active">
            <template #left>
                <span @click="activeSidebar = !activeSidebar" class="material-icons-outlined" style="color:#36568c;">
                    menu
                </span>
            </template>
            <img src="https://i.ibb.co/kM1Tm5S/otroauto.png" />

            <template #right>
                <NotificacionBotonVue/>
            </template>
        </vs-navbar>
        <vs-sidebar absolute v-model="active" :open.sync="activeSidebar">
            <template #logo>
                <vs-avatar>
                    <img src="https://bestbuyerpersona.com/wp-content/uploads/2022/02/undraw_profile_pic_ic5t.png" alt="">
                </vs-avatar>
                <div class="cajanombre">
                    <p>{{ nombreUser }}</p>
                </div>
            </template>
            <vs-sidebar-item id="perfil">
                <template #icon>
                    <span class="material-icons-outlined">
                        account_circle
                    </span>
                </template>
                Mi Perfil
            </vs-sidebar-item>
            <vs-sidebar-item id="viajar">
                <template #icon>
                    <span class="material-icons-outlined">
                        directions_car_filled
                    </span>
                </template>
                Viajar
            </vs-sidebar-item>

            <vs-sidebar-item id="crear">
                <template #icon>
                    <span class="material-icons-outlined">
                        add_circle
                    </span>
                </template>
                Crear Viaje
            </vs-sidebar-item>
            <vs-sidebar-item id="misviajes">
                <template #icon>
                    <span class="material-icons-outlined">
                        format_list_bulleted
                    </span>
                </template>
                Mis viajes
            </vs-sidebar-item>

            <vs-sidebar-item id="emergencia">
                <template #icon>
                    <span class="material-icons-outlined">
                        warning
                    </span>
                </template>
                Viajes de emergencia
            </vs-sidebar-item>
            <vs-sidebar-item id="historialviajes">
                <template #icon>
                    <span class="material-icons-outlined">
                        description
                    </span>
                </template>
                Historial de Viajes
            </vs-sidebar-item>
            <vs-sidebar-item @click="cerrarSesion" to="/"  id="salir">
                <template #icon>
                    <span class="material-icons-outlined">
                        logout
                    </span>
                </template>
                Cerrar Sesion
            </vs-sidebar-item>
        </vs-sidebar>
        <div class="contenedorMenu">
            <div v-if="active === 'viajar'">
                <ListaVehiculosMovil @mostrarviaje="cambiarviaje" />

            </div>
            <div v-if="active === 'misviajes'">
                <MisViajes />

            </div>
            <div v-if="active === 'crear'" >
                <CrearViaje @viajecreado="creado"/>

            </div>
            <div v-if="active === 'elegirviaje'">

                <elegirviaje />
                <div class="button-container">
                    <vs-button class="back-button" color="primary" @click="volverlista">
                        <span class="material-icons">arrow_back</span>

                    </vs-button>
                    
                </div>
                
                <div class="elemento">
                    <vs-button @click="revisardistancia" class="boton">
                        <span  >
                            SELECCIONAR VIAJE
                        </span>
                    </vs-button>
                </div>

            </div>
            <div v-if="active === 'perfil'">
                <PerfilUsuario />
            </div>
            <div v-if="active == 'historialviajes'">
                <HistorialViajes />
            </div>



        </div>

    </div>
</template>
<script>
import CrearViaje from './CrearViaje.vue';
import ListaVehiculosMovil from './ListaVehiculosMovil.vue'
import MisViajes from './MisViajes.vue';
import PerfilUsuario from './PerfilUsuario.vue';
import HistorialViajes from './HistorialViajes.vue';
import elegirviaje from './elegirviaje.vue'
import NotificacionBotonVue from './NotificacionBoton.vue';

import { NotiBus } from '../main.js';


export default {
    data: () => ({
        nombreUser: '',
        active: 'viajar',
        activeSidebar: false,
        eschofer: true
    }),

    mounted() {
        this.usuario()
    },

    methods: {
        cerrarSesion() {
            localStorage.removeItem('carpooltoken');

            console.log("se borro")
        },
        usuario() {
            const token = JSON.parse(localStorage.getItem("carpooltoken"))
            this.nombreUser = token.nombre
            this.eschofer = token.eschofer
            console.log(this.eschofer)
        },
        cambiarviaje() {
            this.active = "elegirviaje"
        },
        volverlista() {
            this.active = "viajar"
        },
        openNotification(titulo,duration,text,color,position) {
            // Envia una notificacion (es de vuesax)
            this.$vs.notification({
                position,
                color:color,
                duration:duration,
                title: titulo,
                text: text
            })
        },revisardistancia(){
            const turf = require('@turf/turf');
            var umbralDistancia = 4.99;
            const lineString = turf.lineString(this.$store.state.coordenadas);
            const marker = turf.point([this.$store.state.posicionseleccionada.lng,this.$store.state.posicionseleccionada.lat])
            const nearestPointOnLine = turf.nearestPointOnLine(lineString, marker);
            const distanceToLine = turf.distance(nearestPointOnLine, marker,{ units: 'meters' });
            console.log(distanceToLine)
            if(distanceToLine<=umbralDistancia){
                this.active = "viajar"
               /*  this.openNotification("Viaje seleccionado",3000,"revisa la información de tu viaje en tu apartado de viajes","success")
              */   // Enviamos la not
                NotiBus.$emit('enviarNotificacion','Solicitud unirse viaje');
            }else{
                this.openNotification("Posición incorrecta para subir",3000,"Estas a "+Math.trunc(distanceToLine)+" metros del punto de parada más cercano ","danger",
                "top-center")
            }

            /* const distanceToLine = turfdistance(nearestPointOnLine, turf.point(this.$store.state.posicionseleccionada));
            Console.log(distanceToLine ) */ 
        },creado(){
            this.active = "misviajes"
        }

    },
    components: {
        ListaVehiculosMovil,
        CrearViaje,
        elegirviaje,
        MisViajes,
        PerfilUsuario,
        NotificacionBotonVue,
        HistorialViajes
    }
}
</script>

<style scoped>
.contenedorMenu {
    display: flex;
    position: relative;
    top: 6%;
    width: 100vw;
    height: 94.5vh;
}

img {
    position: absolute;

    height: 35px;
    z-index: 5000;
}

.material-icons-outlined {
    margin-left: 0;
}

.cajanombre {
    display: flex;
    width: 50%;
}
.button-container {
  position: absolute ;
  top: 0px ;
  left: 0 ;
  margin: 10px ;
  display: flex ;
  align-items: center ;

}

.back-button, .forward-button {
  margin-right: 10px ;
  height: 40px ;
}

.back-button .material-icons, .forward-button .material-icons {
  font-size: 20px ;
  margin-right: 5px ;
  color: white ;
}
.elemento {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.boton {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
}
</style>