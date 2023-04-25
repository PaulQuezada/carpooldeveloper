<template>
    <div>
        <vs-button @click="entrar">
            entrar
        </vs-button>
        <div v-if="valor==1">
            <ConductorRoom/>
        </div>
    </div>
</template>

<script>

import ConductorRoom from "@/components/ConductorRoom.vue";


export default {
    name: "G2ProyTaller12023ChatView",
    data() {
        return {
            valor: 0
        };
    },
    mounted() {
    },
    methods: {
        entrar() {
            this.valor = 1;
        }
    },
    components: { ConductorRoom }
};
</script>

<style  scoped>


</style>