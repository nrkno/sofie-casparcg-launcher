<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <div>
          <b-button-group>
            <b-button variant="warning" v-on:click="clearLog">Clear Log</b-button>
            <b-button variant="success" v-on:click="start">Start</b-button>
            <b-button variant="danger" v-on:click="stop">Stop</b-button>
          </b-button-group>
        </div>

        <ul id="log-panel" v-chat-scroll="{always: false}">
          <li v-for="l in lines" v-bind:class="[l.type, logClass(l)]">
            {{ l.content }}
          </li>
        </ul>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  const {ipcRenderer} = require('electron')

  export default {
    // created () {
    //   const id = this.$route.params.id
    //   ipcRenderer.on(id + '.log', (e, data) => {
    //     this.$store.dispatch('logLine', { id: id, data: JSON.parse(data) })
    //   })
    // },

    data () {
      return {
        lines: this.$store.state.Logs[this.$route.params.id]
      }
    },

    watch: {
      '$route' (to, from) {
        this.lines = this.$store.state.Logs[to.params.id]
      }
    },

    methods: {
      clearLog () {
        this.$store.dispatch('logClear', { id: this.$route.params.id })
      },
      stop () {
        ipcRenderer.send(this.$route.params.id + '.control', 'stop')
      },
      start () {
        ipcRenderer.send(this.$route.params.id + '.control', 'start')
      },

      logClass (l) {
        if (l.content.indexOf('[error]') !== -1) {
          return 'error'
        }
        if (l.content.indexOf('[warning]') !== -1) {
          return 'warning'
        }
        if (l.content.indexOf('[info]') !== -1) {
          return 'info'
        }

        return null
      }
    }
  }
</script>

<style scoped>
  .btn-group {
    margin: 15px;
  }
  
  #log-panel {
    list-style-type: none;
    overflow: auto;

    /* display: flex;
    flex-direction: column-reverse; */

    overflow-y: scroll;
    height: calc(100vh - 56px - 38px - 50px);

    font-family: courier;
    font-size: 0.95em;
  }

  #log-panel li {
    white-space: nowrap;
  }

  #log-panel li.event {
    color: blue;
  }
  
  #log-panel li.log.error {
    color: red;
  }
  #log-panel li.log.warning {
    color: orange;
  }
</style>
