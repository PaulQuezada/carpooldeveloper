<template>
    <div class="contenedor">
        <loading v-if="isLoading"></loading>
        <div class="caja">
            <div class="tab">
                <div class="buscarGrande">
                    <div class="buscar">
                        <vs-input v-model="value1" @keyup="buscar" placeholder="Buscar destino">
                        </vs-input>
                        <div class="botonBuscar">
                            <vs-button id="btnBuscar" success>
                                <span class="material-icons-outlined">
                                    search
                                </span>
                            </vs-button>
                            <vs-button id="btnBorrar" success style="display: none;">
                                <span class="material-icons-outlined">
                                    delete
                                </span>
                            </vs-button>
                        </div>
                    </div>
                    <div class="filtro" id="Filtrar">
                        <vs-select v-model="value2">
                            <vs-option label="Fecha más reciente" value="1">
                                Fecha más reciente
                            </vs-option>
                            <vs-option label="Fecha más antigüa" value="2">
                                Fecha más antigüa
                            </vs-option>
                            <vs-option label="Precio más barato" value="3">
                                Precio más barato
                            </vs-option>
                            <vs-option label="Precio más caro" value="4">
                                Precio más caro
                            </vs-option>
                        </vs-select>
                    </div>

                </div>
            </div>
            <div id="here">
                <div class="lista">
                    <div class="card" v-for="(item, index) in viajesBusqueda" :key="item.id">
                        <vs-button :active="active2 == index" @click="active2 = index">
                            <img src="https://i.ibb.co/hRm5L5K/logo-copia.png" alt="">
                            <div class="info" @click="elegirviaje(item.origen, item.destino, item.choferid, item._id)">
                                <p>>Destino: {{ item.destino.nombre }}</p>
                                <p>>Origen: {{ item.origen.nombre }}</p>
                                <p>>Asientos disponibles : {{ item.disponibles }}/4</p>
                                <p>>Fecha: {{ item.fecha }}</p>
                                <p>>Hora: {{ item.horainicio }}</p>
                                <p>>Precio: {{ item.precio }}</p>
                            </div>
                        </vs-button>
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>
    
<script>
import API from '@/api';
import Swal from 'sweetalert2'
import loading from './loading.vue';
import { viajeBus } from '@/main';


export default {
    components: { loading },
    data: () => ({
        select1Normal: '',
        select1: 2,
        active: 1,
        active2: 0,
        active3: false,
        value1: '',
        value2: 1,
        viajes: [],
        viajesBusqueda: [],
        input: '0',
        active5: true,
        newArr: [],
        newObj: [],
        copyOfArray: [],
        flag: 0,
        cont: 0,
        isLoading: null
    }),


    methods: {
        async obtenerViajes() {
            // LOADING
            const type = 'default'
            this.isLoading = true
            this.viajes = await API.getallviajes();


            //ordenar por fecha más actual a más antigüo
            function convertirFecha(fechaString) {

                var fechaSp = fechaString.split("-");
                var anio = new Date().getFullYear();

                if (fechaSp.length == 3) {
                    anio = fechaSp[2];
                }

                var mes = fechaSp[1] - 1;
                var dia = fechaSp[0];

                return new Date(anio, mes, dia);
            }

            this.viajes.sort(function (a, b) {

                return convertirFecha(b.fecha) - convertirFecha(a.fecha);
            })
            this.viajesBusqueda = [...this.viajes];
            this.isLoading = false

        },
        elegirviaje(origen, destino, idChofer, idViaje) {
            this.$store.state.origenseleccionado = origen
            this.$store.state.destinoseleccionado = destino
            this.$store.state.idchoferseleccionado = idChofer
            this.$store.state.idviaje = idViaje
            

            console.log(idChofer)
            this.$emit('mostrarviaje')
        },
        obtenerSocketViajes() {
            this.$store.state.SocketioService.socket.on("viaje:recibido", (data) => {
                if (data._idenviado != JSON.parse(localStorage.getItem("carpooltoken"))._id) {
                    this.viajes.push(data);
                }
            });
        },
        enviarViajes(data) {
            data._idenviado = JSON.parse(localStorage.getItem("carpooltoken"))._id;
            console.log("enviando viaje...")
            console.log(data._idenviado)
            this.$store.state.SocketioService.sendViaje(data)
        },
        buscar() {
            this.value1 = this.value1.toLowerCase()
            if (this.value1 == "") {
                this.viajesBusqueda = this.viajes
            } else {
                var viajeCambiado
                if (this.active3) {
                    viajeCambiado = this.viajes.filter(viaje => viaje.destino.nombre.toLowerCase().indexOf(this.value1) !== -1)
                } else {
                    viajeCambiado = this.viajes.filter(viaje => viaje.origen.nombre.toLowerCase().indexOf(this.value1) !== -1)
                }
                this.viajesBusqueda = viajeCambiado
            }
        },
        filtrar() {
            switch (this.value2) {
                case "1": // Fecha más reciente
                    this.viajesBusqueda.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                    break;
                case "2": // Fecha más antigüa
                    this.viajesBusqueda.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
                    break;
                case "3": // Precio más barato
                    this.viajesBusqueda.sort((a, b) => a.precio - b.precio);
                    break;
                case "4": // Precio más caro
                    this.viajesBusqueda.sort((a, b) => b.precio - a.precio);
                    break;
            }
        },
    },
    mounted() {
        this.obtenerViajes()
        this.obtenerSocketViajes()
    },
    created() {
        // Creamos el evento para que se ejecute la funcion cuando se llame
        viajeBus.$on('enviarViaje', this.enviarViajes);
    },
    watch: {
        value2() {
            this.filtrar();
        },
    },
}
</script>
    
<style  scoped>
.contenedor {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 95vh;
}

.caja {
    display: flex;
    flex-direction: column;
    width: 100vw;
    background: white;

}

.lista {
    width: 100%;
    overflow-y: scroll;
    height: auto;
}

.tab {
    display: flex;
    flex-direction: column;
    justify-content: center;

    background-color: #36568c;
    height: 100px;
    padding-bottom: 5px;
}

.tab2 {
    display: flex;
}

.buscar {
    display: flex;
    justify-content: center;

}

.filtro {
    position: relative;
    width: 96%;
    left: 4%;
}

.botonBuscar {
    position: relative;
    bottom: 10%;
    margin-right: 20%;
    margin-top: 4%;

}

.info {

    display: flex;
    flex-direction: column;
    text-align: left;
    margin-left: 5%;
    width: 90vh;
}

.info p {
    margin: 1%;

    font-size: 1.2em;
}

img {
    width: 50px;
}

.listaGrande {
    display: flex;
    flex-direction: row;
    height: 84.5%;
    border-radius: 2%;
    scroll-behavior: auto;


}

.listaGrande2 {
    display: flex;
    flex-direction: row;
    height: 84.5%;
    border-radius: 2%;
    scroll-behavior: auto;
    display: none;

}

.card {
    display: flex;
    justify-content: center;

    font-size: 20em;
}

.card .vs-button {
    width: 300px;
}

.vs-switch {
    display: flex;
    width: 30%;
    margin-left: 9%;
}

.buscarGrande {
    display: flex;
    flex-direction: column;
    width: 100vw;
}

.vs-select {
    position: relative;
    left: 8%;
}

.vs-button {
    width: 70%;
    height: 70%;
}

.material-icons-outlined {
    margin-left: 0px;
}

.buscar2 {
    position: absolute;
    overflow: hidden;
}

.con-select-example {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100000000;
}
</style>