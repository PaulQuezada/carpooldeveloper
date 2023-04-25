<template>
    <div class="conten">
        <div v-if="option == 0">
            <AdminVista1 />
        </div>
        <div v-if="option == 1">
        </div>
        <div class="elemento">
            <vs-button @click="cambioestado" class="boton">
            <span  >
                crear viaje
            </span>
        </vs-button>
        </div>
        

        <vs-dialog not-close not-padding blur v-model="active">
            <AdminVista2 @viajecreado="creado"/>
        </vs-dialog>
        
    </div>
</template>

<script>
import AdminVista1 from './AdminVista1.vue';
import AdminVista2 from './AdminVista2.vue';

export default {
    name: "G2ProyTaller12023CrearViaje",
    data() {
        return {
            option: 0,
            active: false,
        };
    },
    methods: {

        next() {
            if (this.option == 0) {
                this.option = 1
            }
            else {
                this.option = 0
            }

        },cambioestado(){

            if(this.$store.state.marker1.lng!=0 && this.$store.state.marker1.lat!=0){
                this.active = !this.active
            }else{
                this.openNotification("Error al crear",2000,"Necesitas buscar en la barra tu origen/ destino","danger","top-right")
            }
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
        },creado(){
            this.$emit("viajecreado")
        }
    },mounted(){
        this.$store.state.marker1.lng=0
        this.$store.state.marker1.lat=0
    },
    components: { AdminVista1, AdminVista2 }
};
</script>

<style  scoped>
.conten {
    display: block;
    width: 100vw;
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