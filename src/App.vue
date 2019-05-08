<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to your Vue.js App"/> -->
    <MapboxMap
      @load="onMapLoaded"
    />
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import MapboxMap from './components/map/MapboxMap.vue'

export default {
  name: 'app',
  components: {
    // HelloWorld,
    MapboxMap
  },
  methods: {
    onMapLoaded(event) {
      console.log("map loaded");
      this.map = event.map;
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  /*margin-top: 60px;*/
}
body { margin:0; padding:0; }
</style>
