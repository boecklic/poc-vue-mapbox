<template>
  <div class="mgl-map-wrapper">
    <div v-once :id="container" ref="container" />
    <slot v-if="initialized" />
  </div>
</template>

<script>
import Mapbox from "mapbox-gl";
// import withEvents from "../../lib/withEvents";
// import mapEvents from "./events";
// import props from "./options";
// import withWatchers from "./mixins/withWatchers";
// import withPrivateMethods from "./mixins/withPrivateMethods";
// import withAsyncActions from "./mixins/withAsyncActions";

import Debugger from '../debugger/debugger'

const debug = new Debugger("map");


const props = {
	minZoom: {
    type: Number,
    default: 0
  },
  maxZoom: {
    type: Number,
    default: 22
	},
	mapStyle: {
		type: [String, Object],
		default: "https://vectortiles.geo.admin.ch/gl-styles/ch.swisstopo.leichte-basiskarte.vt/v006/style.json"
    // default: "https://ltboc.infra.bgdi.ch/static/stopo_sample_style.json"
	}
}

export default {
  name: "MapboxMap",
  // mixins: [withWatchers, withAsyncActions, withPrivateMethods, withEvents],
  props,
  provide() {
    const self = this;
    return {
      get mapbox() {
        return self.mapbox;
      },
      get map() {
        return self.map;
      },
      get actions() {
        return self.actions;
      }
    };
  },
  data() {
    return {
      initial: true,
      initialized: false
    };
  },
  computed: {
    loaded() {
      return this.map ? this.map.loaded() : false;
    },
    version() {
      return this.map ? this.map.version : null;
    },
    // TODO: make 'bounds' synced prop
    bounds() {
      return this.map ? this.map.getBounds() : null;
    },
    isStyleLoaded() {
      return this.map ? this.map.isStyleLoaded() : false;
    },
    areTilesLoaded() {
      return this.map ? this.map.areTilesLoaded() : false;
    },
    isMoving() {
      return this.map ? this.map.isMoving() : false;
    },
    canvas() {
      return this.map ? this.map.getCanvas() : null;
    },
    canvasContainer() {
      return this.map ? this.map.getCanvasContainer() : null;
    },
    images() {
      return this.map ? this.map.listImages() : null;
    }
  },
  methods: {
  	$_loadMap() {
      return new Promise(resolve => {
        // if (this.accessToken) 
        this.mapbox.accessToken = '';
        const map = new this.mapbox.Map({
          ...this._props,
          container: this.$refs.container,
          style: this.mapStyle,
          transformRequest: (url, resourceType)=> {
            console.log(url);
            if(url.startsWith('https://ltboc.infra')) {
              console.log('adding referer header');
              return {
                url: url,
                headers: { 'Referer': 'ltboc.infra.bgdi.ch' }
              }
            }
          }
        });
        debug.log(map);

        // Fired immediately after all necessary resources have
        // been downloaded and the first visually complete rendering
        // of the map has occurred.
        map.on("load", function (){
          map.addLayer({
            'id': 'hikingtrails',
            'type': 'line',
            "source": {
              type: 'vector',
              url: 'https://ltboc.infra.bgdi.ch/tileserver/stopo_sample.json'
              // url: 'https://ltboc.infra.bgdi.ch/static/stopo_sample_style.json'
            },
            'source-layer': 'hikingtrails',
            // "layout": {
            //   "line-join": "round",
            //   "line-cap": "round"
            // },
            // "paint": {
            //   "line-color": "#ff69b4",
            //   "line-width": 1
            // }
          });
          resolve(map);
        });
        // 
      });
    },

    $_RTLTextPluginError(error) {
      this.$emit("rtl-plugin-error", { map: this.map, error: error });
		},
  },
  created() {
    this.map = null;
    this.propsIsUpdating = {};
    this.mapbox = Mapbox;
  },
  mounted() {
  	console.log("$refs", this.$refs);
    this.$_loadMap().then(map => {
      this.map = map;
      if (this.RTLTextPluginUrl !== undefined) {
        this.mapbox.setRTLTextPlugin(
          this.RTLTextPluginUrl,
          this.$_RTLTextPluginError
        );
      }
      console.log('got here');
    //   const mapEvents = {
    //   	resize: { name: "resize" },
  		// 	webglcontextlost: { name: "webglcontextlost" },
  		// 	webglcontextrestored: { name: "webglcontextrestored" },
				// remove: { name: "remove" }
    //   }
    //   const eventNames = Object.keys(mapEvents);
    //   this.$_bindMapEvents(eventNames);
    //   this.$_registerAsyncActions(map);
    //   this.$_bindPropsUpdateEvents();
      this.initial = false;
      this.initialized = true;
      this.$emit("load", { map, component: this });
    });
  },
  beforeDestroy() {
    if (this.map) this.map.remove();
  }
};
</script>

<style scoped>
/*<link rel='stylesheet' type='text/css' href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.css'/>*/
@import url("https://api.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.css");

.mgl-map-wrapper {
  height: 100vh;
  position: relative;
  width: 100vw;
  left: 50%;
  top: 50%;
  padding: 0px;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: -50vw;
  margin-right: -50vw;
}
.mapboxgl-map {
  height: 100%;
  left: 0;
  overflow: hidden;
  position: absolute;
  top: 0;
  width: 100%;
}
.mapboxgl-canvas {
  left: 0;
}
</style>