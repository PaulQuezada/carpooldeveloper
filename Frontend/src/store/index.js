import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import SocketioService from "../services/socketio.service";
import * as io from "socket.io-client";

export default new Vuex.Store({
  state: {
    precio: 0,
    asientos: 0,
    fecha: "",
    hora: "",
    haciautalca: true,
    opcion:0,
    marker1: {
      nombre: "",
      lng: 0,
      lat: 0
    },
    marker2: {
      nombre: "Universidad de talca, sede Los niches",
      lng: -71.23025064539733,
      lat: -35.00254581757482
    },
    menu: "viajar",
    origenseleccionado: {
      nombre:"",
      lng: 0,
      lat: 0
    },
    destinoseleccionado: {
      nombre:"",
      lng: 0,
      lat: 0
    },
    coordenadas: [],
    posicionseleccionada: {
      lng: 0,
      lat: 0
    },
    idchoferseleccionado: null,
    SocketioService: SocketioService,
    idviaje:null,
    activarchat:false,
  },
  getters: {
    menu: state => state.menu
  },
  mutations: {
    cambiarviaje(state, valor) {
      state.menu = valor
    },
    conectarSocket() {
      console.log("conectando...")
      /* this.socket = io("http://localhost:5003"); */
      this.socket = io("https://carpoolsocketnotificacion-wacd334doa-tl.a.run.app");
      this.socket.on("connect_error", (err) => {
        console.log(err.message);
      })
      SocketioService.socket = this.socket;
    },
    desconectarSocket() {
      console.log("desconectando...")
      this.socket.disconnect();
      SocketioService.disconnect();
    }

  },
  actions: {
  },
  modules: {
  }
})
