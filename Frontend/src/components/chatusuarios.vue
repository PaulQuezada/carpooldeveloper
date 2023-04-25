<template>
  <div class="dialog">
    <div class="sup">
      <div class="cerrar">
        <vs-button circle success class="botoncerrar" @click="handleClose">
          <span class="material-icons-outlined">
            close
          </span>
        </vs-button>
      </div>
    </div>

    <div class="contenedorchat" ref="contenedorchat">
      <div v-for="(mensaje, index) in mensajes" :key="index">
        <div v-if="mensaje.enviado">
          <div class="mensaje-enviado">
            <div class="mensaje-info">
              <span class="hora">{{ mensaje.hora }}</span>
            </div>
            <vs-button class="enviado">
              {{ mensaje.texto }}
            </vs-button>

          </div>
        </div>
        <div v-else>
          <div class="mensaje-recibido">
            <div class="mensaje-info">
              <span class="nombre">{{ mensaje.nombre }}</span>
              <span class="hora">{{ mensaje.hora }}</span>
            </div>
            <vs-button class="recibido">
              {{ mensaje.texto }}
            </vs-button>
          </div>
        </div>
      </div>
    </div>
    <div class="contenedorenviar">
      <div class="contenedortexto">
        <vs-input border placeholder="Ingrese un mensaje" v-model="mensajaparaenviar" />
      </div>
      <div class="contenedorboton">
        <vs-button circle @click="enviarMsj()">
          <span class="material-icons-outlined">
            chevron_right
          </span>
        </vs-button>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      active: 0,
      chat: this.$store.state.activarchat,
      mensajes: [
        {
          nombre: 'María',
          texto: 'Hola, ¿cómo estás?',
          enviado: true,
          hora: '12:30 pm'
        },
        {
          nombre: 'Juan',
          texto: '¡Hola! Estoy bien, ¿y tú?',
          enviado: false,
          hora: '12:35 pm'
        },
        {
          nombre: 'María',
          texto: 'También estoy bien, gracias. ¿Qué has hecho hoy?',
          enviado: true,
          hora: '12:40 pm'
        },
        {
          nombre: 'Juan',
          texto: 'He estado trabajando todo el día. ¿Y tú?',
          enviado: false,
          hora: '12:45 pm'
        },
        {
          nombre: 'María',
          texto: 'Fui al supermercado y ahora estoy cocinando.',
          enviado: true,
          hora: '12:50 pm'
        },
        {
          nombre: 'Juan',
          texto: '¿Qué estás cocinando?',
          enviado: false,
          hora: '12:55 pm'
        },
        {
          nombre: 'María',
          texto: 'Hoy voy a hacer una lasaña.',
          enviado: true,
          hora: '1:00 pm'
        },

        {
          nombre: 'María',
          texto: 'Hola, ¿cómo estás?',
          enviado: true,
          hora: '12:30 pm'
        },
        {
          nombre: 'Juan',
          texto: '¡Hola! Estoy bien, ¿y tú?',
          enviado: false,
          hora: '12:35 pm'
        },
        {
          nombre: 'María',
          texto: 'También estoy bien, gracias. ¿Qué has hecho hoy?',
          enviado: true,
          hora: '12:40 pm'
        },
        {
          nombre: 'Juan',
          texto: 'He estado trabajando todo el día. ¿Y tú?',
          enviado: false,
          hora: '12:45 pm'
        },
        {
          nombre: 'María',
          texto: 'Fui al supermercado y ahora estoy cocinando.',
          enviado: true,
          hora: '12:50 pm'
        },
        {
          nombre: 'Juan',
          texto: '¿Qué estás cocinando?',
          enviado: false,
          hora: '12:55 pm'
        },
        {
          nombre: 'María',
          texto: 'Hoy voy a hacer una lasaña.',
          enviado: true,
          hora: '1:00 pm'
        }
      ], mensajaparaenviar: "",
    }
  },
  methods: {
    handleClose() {
      this.$store.state.opcion = 0
      /* this.$emit("cambioestado") */
    },
    enviarMsj() {
      const now = new Date(Date.now());
      const hours = now.getHours();
      const minutes = now.getMinutes();
      this.mensajes.push({
        nombre: 'María',
        texto: this.mensajaparaenviar,
        enviado: true,
        hora: hours + ":" + minutes + " pm"
      })
      this.$store.state.SocketioService.sendChat({
        nombre: 'María',
        texto: this.mensajaparaenviar,
        enviado: false,
        hora: hours + ":" + minutes + " pm"
      })
      //
      this.mensajaparaenviar = ""
      this.$nextTick(() => {
        const myElement = this.$refs.contenedorchat;
        myElement.scrollTop = myElement.scrollHeight;

      });
    },
    obtenerMensajesSocket() {
      this.$store.state.SocketioService.socket.on("chat:recibido", (data) => {
        console.log("recibido")
        console.log(data)
        this.mensajes.push(data)
        this.$nextTick(() => {
          const myElement = this.$refs.contenedorchat;
          myElement.scrollTop = myElement.scrollHeight;

        });
      });
    },
  },
  mounted() {
    this.obtenerMensajesSocket()
    this.$nextTick(() => {
      const myElement = this.$refs.contenedorchat;
      myElement.scrollTop = myElement.scrollHeight;

    });
  },
  created() {
    this.$store.commit('conectarSocket');
  },
  beforeDestroy() {
    this.$store.commit('desconectarSocket');
  },
}

</script>

<style scoped>
.dialog {
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #eeeeee;

}

.vs-input {
  width: 100vw;
}

.contenedorchat {

  max-height: 88vh;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 2%;

}

.contenedorenviar {
  display: flex;

  bottom: 0;
  width: 100%;
  position: relative;
  top: 4%;
  /* 
  

  background-color: #B0E0E6; */

}

.contenedortexto {

  margin-left: 2%;
  width: 100%;
  /* background-color: #d7d7d7; */
}

.contenedorboton {
  display: flex;
  justify-content: center;
  position: relative;
  bottom: 4%;
}

.contenedorboton .vs-button {

  width: 40px;
  height: 80%;
}

.mensaje-enviado {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.enviado {
  color: white;
  padding: 5px;
  border-radius: 10px;
  max-width: 70%;
  margin-bottom: 5px;
  text-align: left;
  word-wrap: break-word;
}

.recibido {
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
  padding: 5px;
  border-radius: 10px;
  max-width: 70%;
  margin-bottom: 5px;
  text-align: left;
  word-wrap: break-word;
}

.mensaje-recibido {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.nombre {
  font-weight: bold;
  margin-right: 5px;
}

.barrasup {
  width: 100%;
  height: 5%;
  display: flex;
  align-items: center;


}

.titulo {
  display: inline-block;
  width: 90%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.cerrar {
  width: 12%;
  display: flex;

}

.sup {
  position: absolute;
  display: flex;
  width: 100vw;
  background: none;
  justify-content: flex-end;
  z-index: 10;
}

.botoncerrar {
  display: inline-block;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;

}

.material-icons-outlined {
  font-size: 2em;
  margin-left: 0px;
}</style>