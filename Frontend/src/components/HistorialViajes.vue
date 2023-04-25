<template>
    <div class="cajita">
        <div  style="text-align: center;">
            <vs-button color="#7d33ff" style="display:inline-block;" @click="botonesEstado(1); clickedAct = !clickedAct; "
                :flat="clickedAct == false" :disabled="clickedFin == true || clickedFechas == true">
                <span v-if=" !clickedAct ">
                    Activos
                </span>
                <b v-else> Activos x</b>
            </vs-button>
            <vs-button  style="display:inline-block;"
                @click=" botonesEstado(2); clickedFin = !clickedFin; " :flat=" clickedFin == false "
                :disabled=" clickedAct == true || clickedFechas == true ">
                <span v-if=" !clickedFin ">
                    Finalizados
                </span>
                <b v-else> Finalizados x
                </b>
            </vs-button>
            <vs-button color="#ffa733" style="display:inline-block;"
                @click=" ordenarPorFechaAsc(); clickedFechas = !clickedFechas; "
                :disabled=" clickedAct == true || clickedFin == true ">
                <span v-if=" !clickedFechas ">
                    Fecha Asc
                </span>
                <span v-else> Fecha Desc
                </span>
            </vs-button>
        </div>



        <vs-button transparent class="historial" :active=" active5 == 1 " @click=" active5 = 1 ">
            <div v-for="(        viaje, index        ) in         this.viajesprueba        " :key=" index ">


                <div v-if=" page == index ">
                    <div v-for="(        viaje, index        ) in         recortararrayviajes((index - 1) * 5)        "
                        :key=" index ">

                        <div>
                            <!-- Solo mostramos 5 viajes por pagina -->
                            <vs-alert class="alertas" :hidden-content.sync=" hidden[index] " v-if=" viaje.estado ">
                                <template #title>
                                    Código del viaje: {{ viaje.codigo }}<br>
                                    Origen: MiCasa<br>
                                    Destino: LaU<br>
                                </template>
                                Fecha: {{ viaje.fecha }} <br>
                                Hora: viaje.hora <br>
                                Ver Participantes:
                                <vs-select placeholder="Participantes" v-model=" value2 " style="color: red;">
                                    <vs-option label="Conductor: Pableque" value="1">
                                        Conductor: Pableque
                                    </vs-option>
                                    <vs-option label="Nacho" value="2">
                                        Nacho
                                    </vs-option>
                                    <vs-option label="Pol" value="3">
                                        Pol
                                    </vs-option>
                                </vs-select>
                            </vs-alert>
                            <vs-alert class="alertasactivos" :hidden-content.sync=" hidden[index] " v-if=" !viaje.estado ">
                                <template #title>
                                    Código del viaje: {{ viaje.codigo }}<br>
                                    Origen: MiCasa<br>
                                    Destino: LaU<br>
                                </template>
                                Fecha: {{ viaje.fecha }} <br>
                                Hora: viaje.hora <br>
                                Ver Participantes:
                                <vs-select placeholder="Participantes" v-model=" value2 " style="color: red;">
                                    <vs-option label="Conductor: Pableque" value="1">
                                        Conductor: Pableque
                                    </vs-option>
                                    <vs-option label="Nacho" value="2">
                                        Nacho
                                    </vs-option>
                                    <vs-option label="Pol" value="3">
                                        Pol
                                    </vs-option>
                                </vs-select>
                            </vs-alert>
                            <div style="font-size: 5px;">&nbsp;</div>
                        </div>

                    </div>

                </div>

            </div>
        </vs-button>
        <vs-pagination only-arrows v-model=" page " :length=" this.calcularpaginas() " />

    </div>
</template>

<script>
import API from '@/api';

export default {
    name: 'G2ProyTaller12023HistorialViajes',
    data() {
        return {
            id: "",
            viajes: [],
            chofer: "",
            /**Variable para vuesax */
            value: 0,
            value2: '',
            /*5 por pagina*/
            hidden: [true, true, true, true, true],
            page: 1,
            page2: 1,
            active5: 1,
            /**Viajes de prueba solo con el codigo */
            viajesprueba: [
                {
                    codigo: 1,
                    /*Si el estado es true esta finalizado*/
                    estado: false,
                    fecha: "02-01-2001"
                },
                {
                    codigo: 2,
                    /*Si el estado es true esta finalizado*/
                    estado: false,
                    fecha: "06-01-2001"
                },
                {
                    codigo: 3,
                    /*Si el estado es true esta finalizado*/
                    estado: true,
                    fecha: "04-01-2001"
                },
                {
                    codigo: 4,
                    /*Si el estado es true esta finalizado*/
                    estado: true,
                    fecha: "06-01-2001"
                },
                {
                    codigo: 5,
                    /*Si el estado es true esta finalizado*/
                    estado: true,
                    fecha: "10-01-2001"
                },
                {
                    codigo: 6,
                    /*Si el estado es true esta finalizado*/
                    estado: true,
                    fecha: "12-01-2001"
                },
                {
                    codigo: 7,
                    /*Si el estado es true esta finalizado*/
                    estado: true,
                    fecha: "02-01-2001"
                },
                {
                    codigo: 8,
                    /*Si el estado es true esta finalizado*/
                    estado: true,
                    fecha: "10-01-2001"
                },
                {
                    codigo: 9,
                    /*Si el estado es true esta finalizado*/
                    estado: true,
                    fecha: "13-01-2001"
                },
                {
                    codigo: 10,
                    /*Si el estado es true esta finalizado*/
                    estado: true,
                    fecha: "01-01-2001"
                },
                {
                    codigo: 11,
                    /*Si el estado es true esta finalizado*/
                    estado: true,
                    fecha: "01-01-2001"
                },
                {
                    codigo: 12,
                    /*Si el estado es true esta finalizado*/
                    estado: true,
                    fecha: "01-01-2001"
                },
                {
                    codigo: 13,
                    /*Si el estado es true esta finalizado*/
                    estado: true,
                    fecha: "01-01-2001"
                },
                {
                    codigo: 14,
                    /*Si el estado es true esta finalizado*/
                    estado: true,
                    fecha: "01-01-2001"
                },
                {
                    codigo: 15,
                    /*Si el estado es true esta finalizado*/
                    estado: true,
                    fecha: "01-01-2001"
                },
                {
                    codigo: 16,
                    /*Si el estado es true esta finalizado*/
                    estado: true,
                    fecha: "01-01-2001"
                },
                {
                    codigo: 17,
                    /*Si el estado es true esta finalizado*/
                    estado: true,
                    fecha: "01-01-2001"
                },
                {
                    codigo: 18,
                    /*Si el estado es true esta finalizado*/
                    estado: true,
                    fecha: "01-01-2001"
                },
            ],
            /**0 -> Todos los viajes
             * 1 -> Activos
             * 2 -> Finalizados
             */
            mostrarviajes: 0,
            clickedAct: false,
            clickedFin: false,
            clickedFechas: false,

        };
    },
    mounted() {
        this.getViajes()
        this.usuario()
        this.ordenarPorFechaDesc()
    },
    methods: {
        usuario() {
            const token = JSON.parse(localStorage.getItem("carpooltoken"))
            // Obtener datos
            this.id = token._id

        },
        datosChofer(id) {
            this.buscarChoferPorId(id);
            return this.chofer
        },
        async buscarChoferPorId(id) {
            var chofer = await API.getuserbyid(id);
            this.chofer = chofer.nombre

        },
        async getViajes() {
            const user = JSON.parse(localStorage.getItem('carpooltoken'));
            var allviajes = await API.getallviajes();
            var viajescambiados = allviajes.filter(v => v.choferid == user._id)
            this.viajes = viajescambiados;
        },
        calcularpaginas() {
            if (this.clickedAct == false && this.clickedFin == false) {
                return Math.ceil(this.viajesprueba.length / 5) /**Numero de paginas = numeroViajes/5 redondeado para arriba siempre */
            } else if (this.clickedAct == true) {
                return Math.ceil(this.obteneractivos().length / 5)
            } else if (this.clickedFin == true) {
                return Math.ceil(this.obtenerfin().length / 5)
            }

        },
        recortararrayviajes(pagina) {
            if (this.clickedAct == false && this.clickedFin == false) {
                var viajescortados = this.viajesprueba.slice(pagina, pagina + 5)
                return viajescortados
            } else if (this.clickedAct == true) {
                return this.obteneractivos().slice(pagina, pagina + 5)
            } else if (this.clickedFin == true) {
                return this.obtenerfin().slice(pagina, pagina + 5)
            }

        },
        obteneractivos() {
            var viajesactivos = new Array();
            var cont = 0;
            for (let index = 0; index < this.viajesprueba.length; index++) {
                if (this.viajesprueba[index].estado == false) {
                    viajesactivos[cont] = this.viajesprueba[index];
                    cont = cont + 1
                }

            }
            return viajesactivos/**NO FUNCA ACTUALIZAR LAS PAGINAS...*/
        },
        obtenerfin() {
            var viajesfin = new Array();
            var cont = 0;
            for (let index = 0; index < this.viajesprueba.length; index++) {
                if (this.viajesprueba[index].estado == true) {
                    viajesfin[cont] = this.viajesprueba[index];
                    cont = cont + 1
                }

            }
            return viajesfin/**NO FUNCA ACTUALIZAR LAS PAGINAS...*/
        },
        botonesEstado(n) {
            if (n == 1) {

                if (this.mostrarviajes != 1) {
                    this.mostrarviajes = 1;

                }
                else { this.mostrarviajes = 0; }
            } else if (n == 2) {
                if (this.mostrarviajes != 2) {
                    this.mostrarviajes = 2;

                }
                else { this.mostrarviajes = 0; }
            }


        },
        ordenarPorFechaDesc() {
            var sortedProducts = this.viajesprueba.sort((p1, p2) => (p1.fecha < p2.fecha) ? 1 : (p1.fecha > p2.fecha) ? -1 : 0);
            this.viajesprueba = sortedProducts;
        },
        ordenarPorFechaAsc() {
            if (this.clickedFechas == false) {
                var sortedProducts = this.viajesprueba.sort((p1, p2) => (p1.fecha > p2.fecha) ? 1 : (p1.fecha < p2.fecha) ? -1 : 0);
                this.viajesprueba = sortedProducts;
            } else {
                this.ordenarPorFechaDesc()
            }

        }
    },
}

</script>

<style scoped>

.cajita{
    position: relative;
    top: 2%;
}
.contenedorAlertas {
    height: 100vh;
}

.contenedorAlertas .titulo {
    margin: auto;

}

.contenedorAlertas .alertasactivos {
    color: #7d33ff;
    background-color: #e2d1ff;
}

.alertasactivos {
    color: #7d33ff;
    background-color: #e2d1ff;
}

.material-icons-outlined {
    font-size: auto;
    text-align: center;
}

.historial {
    display: flex;
    width: 95vw;
    height: auto;
}
</style>