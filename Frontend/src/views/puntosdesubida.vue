<template>
  <div>
    <vs-sidebar v-if="$store.state.opcion==0" relative v-model="$store.state.opcion" open>
      <vs-sidebar-group>
        <template #header>
          <vs-sidebar-item arrow>
            <template #icon>
              <span class="material-icons-outlined">
                settings
              </span>
            </template>
            Opciones
          </vs-sidebar-item>
        </template>

        <vs-sidebar-item id="chat">
          <template #icon>
            <span class="material-icons-outlined">
              chat
            </span>
          </template>
          Chat
        </vs-sidebar-item>
        <vs-sidebar-item id="info">
          <template #icon>
            <span class="material-icons-outlined">
              info
            </span>
          </template>
          Informacion
        </vs-sidebar-item>
      </vs-sidebar-group>
    </vs-sidebar>


    <div v-if="$store.state.opcion == 'chat'" class="chatcontenedor">
      <chatusuarios @cambioestado="cambio2" />
    </div>
    <div v-if="$store.state.opcion == 'info'" class="infochofercontenedor">
      <infochofer @infochofercerrado="cambio3" />
    </div>


    <div id="map" ref="map"></div>
  </div>
</template>
<script>

import mapboxgl from "!mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapboxClient from "@mapbox/mapbox-sdk";
import MapboxDirections from "@mapbox/mapbox-sdk/services/directions";
import Vue from 'vue'
import Vuesax from 'vuesax'
import chatusuarios from "../components/chatusuarios.vue"
import infochofer from "../components/infochofer.vue"
Vue.use(Vuesax)
export default {
  name: "MapboxMap",
  data() {
    return {
      map: null,
      geocoder: null,
      marker1: null,
      marker2: null,
      marker3: null,
      mapboxGeocoder: null,
      routeLayer: null,
      coordinates: null,
      routeGeoJSON: null,
      zoom: 0,
      origen: this.$store.state.origenseleccionado,
      destino: this.$store.state.destinoseleccionado,
      puntosdeparada: [],
      mostrar: false,
      chat: this.$store.state.activarchat,
      eschoferdelviaje: false,
      infochofer: false,

      active: 0,
      active2: 0
    };
  },
  mounted() {
    mapboxgl.accessToken =
      "pk.eyJ1IjoidGhlcm9kcm9nbyIsImEiOiJjbDIxOWFueHUweWk0M2NvNjV3M2I0ZWcwIn0.-HRLRZ2Adj0LExGfnJiajQ";
    this.initializeMap();
    this.puntosdeparada = [[-71.23557978471557, -34.99826892011222], [-71.23375611048168, -34.991118251187935],
    [-71.23463110784012, -34.98356727606076], [-71.23874509015704, -34.97555393699721]]


  },
  methods: {
    activarinfochofer() {
      console.log(this.infochofer)
      this.infochofer = !this.infochofer
      console.log(this.infochofer)
    },

    openNotification(titulo, duration, text, color, position) {
      // Envia una notificacion (es de vuesax)
      this.$vs.notification({
        position,
        color: color,
        duration: duration,
        title: titulo,
        text: text
      })
    },
    createMarkerElement(iconUrl) {
      const markerElement = document.createElement("div");
      markerElement.style.backgroundImage = `url(${iconUrl})`;
      markerElement.style.width = "40px";
      markerElement.style.height = "50px";
      markerElement.style.backgroundSize = "contain";
      return markerElement;
    },

    initializeMap() {


      const mapboxClient = MapboxClient({ accessToken: mapboxgl.accessToken });
      this.directionsClient = MapboxDirections(mapboxClient);

      this.map = new mapboxgl.Map({
        container: this.$refs.map,
        style: "mapbox://styles/therodrogo/clg72edy900cs01pp0z1rf0r9",
        center: [-71.23025064539733, -35.00254581757482],
        zoom: 13,
      });

      this.map.on("load", () => {





        //marker de origen
        this.marker1 = new mapboxgl.Marker({
          draggable: false,
          element: this.createMarkerElement("https://i.ibb.co/wK3cnP5/logo-red-copia.png"),
        })
          .setLngLat([-71.244072, -34.974014])
          .addTo(this.map);
        //marker de destino
        this.marker2 = new mapboxgl.Marker({
          draggable: false,
          element: this.createMarkerElement("https://i.ibb.co/wK3cnP5/logo-red-copia.png"),
        })
          .setLngLat([-71.23025064539733, -35.00254581757482])
          .addTo(this.map);
        this.centrarruta()

        this.map.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: [],
              },
            },
          },
          layout: {
            "line-join": "bevel",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#EB568D",
            "line-width": 4,
          },
        });
        this.updateRoute();

      });

    },

    updateRoute() {

      const origin = this.marker1.getLngLat();
      const destination = this.marker2.getLngLat();

      this.directionsClient
        .getDirections({
          profile: "driving",
          waypoints: [
            { coordinates: [origin.lng, origin.lat] },
            { coordinates: [destination.lng, destination.lat] },
          ],
          geometries: "geojson",
        })
        .send()
        .then(response => {
          this.routeGeoJSON = response.body.routes[0].geometry;

          // Vamos a llamar la función que anima la ruta en vez de establecer dir3ectamente los datos en la capa (OSEA QUE LO TRAZE DIRECTAMENTE)




          for (let index = 0; index < this.puntosdeparada.length; index++) {

            this.coordinates = this.routeGeoJSON.coordinates
            this.marker3 = new mapboxgl.Marker({
              draggable: false,

            })
              .setLngLat(this.puntosdeparada[index])
              .addTo(this.map);
          }




          this.map.getSource("route").setData(this.routeGeoJSON);
        })
        .catch(error => {
          console.error("Error al obtener la ruta:", error);
        });
    }
    , centrarruta() {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend({ lng: this.map.getCenter().lng, lat: this.map.getCenter().lat });
      bounds.extend({ lng: this.marker1.getLngLat().lng, lat: this.marker1.getLngLat().lat });
      this.map.fitBounds(bounds, { padding: 100 });

    }, mostrarBotones() {
      this.mostrar = !this.mostrar;
    }, activarchat() {
      this.chat = !this.chat
      this.$store.state.activarchat = !this.$store.state.activarchat
    }, cambio2() {
      this.chat = !this.chat
      this.$store.state.activarchat = !this.$store.state.activarchat
    }, cambio3() {

      this.infochofer = !this.infochofer;

    }

  }, components: {
    chatusuarios, infochofer
  }
}
</script>
 
<style>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 1;
  width: 100%;
}

.mapboxgl-ctrl-top-right .mapboxgl-ctrl {
  float: right;
  margin: 10px 10px 0 22px;
}

.boton-centrado {
  position: fixed;
  bottom: 20px;
  left: 20px;
  /* ajustar la propiedad left para mover el botón a la izquierda */
  text-align: center;
  z-index: 499;
}

.boton-encima-mapa {
  z-index: 500;
}

.botones-adicionales {
  margin-top: 10px;
}

.chatcontenedor {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 10001;
}

.infochofercontenedor {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 10001;


}
</style>