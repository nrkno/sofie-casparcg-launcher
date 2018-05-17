<template>
  <div>
    <div>
      <b-button-group>
        <b-button variant="warning" v-on:click="clearLog">Clear Log</b-button>
        <b-button variant="success" v-on:click="start">Start</b-button>
        <b-button variant="danger" v-on:click="stop">Stop</b-button>
      </b-button-group>
    </div>

    <ul id="log-panel">
      <li v-for="l in lines" v-bind:class="l.type">
        {{ l.content }}
      </li>
    </ul>
  </div>
</template>

<script>
  const {ipcRenderer} = require('electron')

  export default {
    props: ['id'],

    created () {
      ipcRenderer.on(this.$props.id + '.log', (e, data) => {
        this.$store.dispatch('logLine', { id: this.$props.id, data: JSON.parse(data) })
      })
    },

    data () {
      return {
        lines: this.$store.state.Logs[this.$props.id]
      }
    },

    methods: {
      clearLog () {
        this.$store.dispatch('logClear', { id: this.$props.id })
      },
      stop () {
        ipcRenderer.send(this.$props.id + '.control', 'stop')
      },
      start () {
        ipcRenderer.send(this.$props.id + '.control', 'start')
      }
    }
  }
</script>

<style scoped>
  #log-panel {
    list-style-type: none;
    overflow: auto;

    /* display: flex;
    flex-direction: column-reverse; */

    overflow-y: scroll;
    height: 50vh;
  }

  #log-panel li {
    white-space: nowrap;
  }

  #log-panel li.event {
    color: blue;
  }
</style>
