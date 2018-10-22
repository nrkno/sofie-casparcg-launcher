<template>
  <b-container fluid>
    <b-row>
      <b-col>

        <b-table striped :items="processes" :fields="[
            'name',
            { key: 'status', label: '' }
            ]">
            <template slot="name" slot-scope="data">
                <b-link v-bind:to="'/' + data.item.id">{{ data.value }}</b-link>
            </template>
            <template slot="status" slot-scope="data">
                <process-controls :id="data.item.id" />
            </template>
        </b-table>



      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import ProcessControls from './ProcessControls'
  const {ipcRenderer} = require('electron')

  export default {
    components: {
      'process-controls': ProcessControls
    },
    created () {
      ipcRenderer.on('processes.get', (s, data) => {
        this.processes = data || []
      })
      ipcRenderer.send('processes.get')
    },
    data () {
      return {
        processes: []
      }
    }
  }
</script>

<style scoped>
</style>
