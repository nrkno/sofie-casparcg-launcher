<template>
  <div id="process-controls">
    <span>
      {{ data.status }}
    </span>
    <b-button-group>
      <b-button v-if="showClear" variant="warning" v-on:click="clearLog">Clear Log</b-button>
      <b-button variant="success" v-on:click="start">Start</b-button>
      <b-button variant="danger" v-on:click="stop">Stop</b-button>
      <b-button variant="info" v-on:click="restart">Restart</b-button>
    </b-button-group>
  </div>
</template>

<script>
  const {ipcRenderer} = require('electron')

  export default {
    props: ['id', 'showClear'],
    created () {
      this.$store.dispatch('init', { id: this.id })
    },
    data () {
      return {
        data: this.$store.state.Process[this.id] || {}
      }
    },
    methods: {
      clearLog () {
        this.$store.dispatch('logClear', { id: this.id })
      },
      stop () {
        ipcRenderer.send(this.id + '.control', 'stop')
      },
      start () {
        ipcRenderer.send(this.id + '.control', 'start')
      },
      restart () {
        ipcRenderer.send(this.id + '.control', 'restart')
      }
    }
  }
</script>

<style scoped>
  #process-controls {
    text-align: right;
  }
  .btn-group {
    margin: 15px;
  }
</style>
