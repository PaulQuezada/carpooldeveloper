<template>
    <div class='contenedorperfil'>
        <div class="contimg">
            <img class="circle" height="128" width="128"
                src="https://bestbuyerpersona.com/wp-content/uploads/2022/02/undraw_profile_pic_ic5t.png"
                alt="No imagen">
        </div>


        <h3>{{ this.nombre }}</h3>
        <div class="correo">
            <p class="correo">{{ this.correo }}</p>
        </div>
        <div class="contimg">
            <button class="botonChofer" v-if="this.eschofer">Chofer</button>
            <button class="botonChofer" v-if="!this.eschofer">Pasajero</button>
        </div>


        <p style="margin-left: 2px;">Actividad: {{ this.actividad }} </p>
        <p v-if="this.eschofer">
            <vs-button style="width: 95%;" @click="mostrarInfoAuto">
                Información Vehiculo
            </vs-button>
        </p>
        <div class="centrar-div" v-if="this.clickInfoAuto">
            <div>
                <p class="info_user">Patente: {{ vehiculo.patente }} </p>
                <p class="info_user">Marca: {{ vehiculo.marca }} </p>
                <p class="info_user">Modelo: {{ vehiculo.modelo }} </p>
                <div class="calificacion">
                    <p class="info_user">Calificación como chofer
                        <br />
                        <span class="material-icons-outlined" v-for="i in 3" :key="i">
                            star
                        </span>

                    </p>
                </div>
            </div>
        </div>
    </div>
</template> 

<script>
export default {
    name: 'G2ProyTaller12023PerfilUsuario',
    data() {
        return {
            nombre: "",
            correo: "",
            actividad: "",
            eschofer: false,
            vehiculo: null,
            clickInfoAuto: false
        };
    },

    mounted() {
        this.usuario()
    },
    methods: {
        usuario() {
            const token = JSON.parse(localStorage.getItem("carpooltoken"))
            // Obtener nombre
            this.nombre = token.nombre
            this.correo = token.correo
            this.actividad = token.actividad
            this.eschofer = token.eschofer
            console.log(this.eschofer)
            this.vehiculo = token.vehiculo
        },
        mostrarInfoAuto() {
            this.clickInfoAuto = !this.clickInfoAuto
        }
    },
}
</script>

<style scoped>
.contenedorperfil {
    background: white;
    
    color: #000;
    text-shadow: 0 1px 1px rgba(255, 255, 255, 0.1);
    text-align: center;
    display: flex;
    flex-direction: column;

    width: 100vw;
    height: 100%;

}

::-moz-selection {
    background: rgba(0, 0, 0, 0.1);
}

::selection {
    background: rgba(0, 0, 0, 0.1);
}

h1 {
    font-weight: 100;
    font-size: 2.7em;
}

h3 {
    color: #111222;
    font-size: 1.4em;
}

a {
    color: RoyalBlue;
    font-weight: normal;
    text-decoration: none;
}

a:hover {
    color: CornflowerBlue;
}

.contimg {
    display: flex;
    justify-content: center;
    width: 100%;
}

.circle {
    line-height: 0;
    /* remover line-height */
    display: inline-block;
    /* ciruclo alrededor de la imagen */
    margin: 5px;
    border: 4px solid rgba(200, 200, 200, 0.4);
    border-radius: 50%;
    /* El valor es relativo al tamaño de la imagen */
    /*box-shadow: 0px 0px 5px rgba(0,0,0,0.4);*/
    transition: linear 0.25s;
    height: 128px;
    width: 128px;
    margin-top: 4vh;
}

.circle {
    display: flex;
    border-radius: 50%;
    /* El valor es relativo al tamaño de la imagen */
}

.circle:hover {
    transition: ease-out 0.2s;
    border: 4px solid rgba(0, 0, 0, 0.2);
    -webkit-transition: ease-out 0.2s;
}

.barra_arriba {
    height: 5vh;
    background-color: #36568C;
}

.letra_chofer_pasajero {
    font-size: 18px;
}

.informacion_usuario {
    background-color: #feb677;
    width: 200px;
    display: inline-block;
    justify-content: center;
}

.botonChofer {
    background-color: #f79034;
    border: none;
    color: white;
    padding: 15px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 12px;
    width: 25vh;
    cursor: default;
}

.correo {
    font-size: 18px;
    color: gray;
}

.info_user {
    border: 4px solid rgba(46, 46, 46, 0.4);
    border-radius: 3%;
    margin-right: 3px;
}

.info_user.boton {
    background-color: orange;
    cursor: pointer;
    width: 100%;

}

.centrar-div {
    display: flex;
    justify-content: center;
}
</style>