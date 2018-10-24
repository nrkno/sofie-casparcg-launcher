<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <b-form @submit="onSubmit" @reset="onReset">
          <legend>Processes</legend>
          <b-form-group id="basePathInputGroup"
                        horizontal
                        label="Base Path:"
                        label-for="basePathInput">
            <b-form-input id="basePathInput"
                          type="text"
                          v-model="config.basePath"
                          placeholder="./">
            </b-form-input>
          </b-form-group>

          <b-form-group id="processesGroup"
                        label-for="processesTable">
            <b-button type="submit" variant="primary" @click="onAddProcessRow">Add process</b-button>
            <b-table striped :items="config.processes" :fields="[
                'name',
                { key: 'exeName', label: 'Executable' },
                { key: 'args', label: 'Arguments' },
                { key: 'health', label: 'Health Check' },
                'actions'
              ]">
              <template slot="name" slot-scope="data">
                <b-form-input :id="'processName' + data.index"
                          type="text" required
                          v-model="config.processes[data.index].name">
                </b-form-input>
              </template>
              <template slot="exeName" slot-scope="data" label="Executable">
                <b-form-input :id="'processExeName' + data.index"
                          type="text" required
                          v-model="config.processes[data.index].exeName">
                </b-form-input>
              </template>
              <template slot="args" slot-scope="data">
                <b-form-input :id="'processArgs' + data.index"
                          type="text"
                          v-model="config.processes[data.index].args">
                </b-form-input>
              </template>
              <template slot="health" slot-scope="data">
                <b-form-select :id="'processArgs' + data.index" :options="healthOptions" class="mb-3" 
                          v-model="config.processes[data.index].health" />
              </template>
              <template slot="actions" slot-scope="row">
                <!-- we use @click.stop here to prevent emitting of a 'row-clicked' event  -->
                <b-button size="sm" @click.stop="onRemoveProcessRow(row)" class="mr-2">
                Remove
                </b-button>
              </template>
            </b-table>
          </b-form-group>

          <legend>HTTP</legend>
          <b-form-group id="httpApiEnableGroup"
                        horizontal
                        label="Enable HTTP Server:"
                        label-for="httpApiEnableInput">
            <b-form-checkbox id="httpApiEnableInput"
                          v-model="config.api.enable">
            </b-form-checkbox>
          </b-form-group>
          
          <b-form-group id="httpApiPortGroup"
                        horizontal
                        label="HTTP Server Port:"
                        label-for="httpApiPortInput">
            <b-form-input id="httpApiPortInput"
                          type="number"
                          v-model="config.api.port"
                          placeholder="8005">
            </b-form-input>
          </b-form-group>
          
          <b-form-group id="httpApiProcessControlGroup"
                        horizontal
                        label="Process control API:"
                        label-for="httpApiProcessControlInput">
            <b-form-checkbox id="httpApiProcessControlInput"
                          v-model="config.api.processControl">
            </b-form-checkbox>
          </b-form-group>

          <b-form-group id="httpApiStaticPathsGroup"
                        label="Static paths"
                        label-for="httpApiStaticPathsTable">
            <b-button type="submit" variant="primary" @click="onAddStaticPathRow">Add static path</b-button>
            <b-table striped :items="config.api.staticPaths" :fields="['name', 'path', 'actions']">
              <template slot="name" slot-scope="data">
                <b-form-input :id="'httpApiStaticPathName' + data.index"
                          type="text" required
                          v-model="config.api.staticPaths[data.index].name">
                </b-form-input>
              </template>
              <template slot="path" slot-scope="data">
                <b-form-input :id="'httpApiStaticPathPath' + data.index"
                          type="text" required
                          v-model="config.api.staticPaths[data.index].path">
                </b-form-input>
              </template>
              <template slot="actions" slot-scope="row">
                <!-- we use @click.stop here to prevent emitting of a 'row-clicked' event  -->
                <b-button size="sm" @click.stop="onRemoveStaticPathRow(row)" class="mr-2">
                Remove
                </b-button>
              </template>
            </b-table>
          </b-form-group>

          <b-button type="submit" variant="primary">Save</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>

          <p>Version: {{ version }}</p>

        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  const {ipcRenderer} = require('electron')
  const packageJson = require('../../../package.json')

  export default {
    created () {
      ipcRenderer.on('config', (s, conf) => {
        this.config = conf

        if (!this.config.api) {
          this.config.api = {}
        }
        if (!this.config.api.staticPaths) {
          this.config.api.staticPaths = []
        }
      })
      ipcRenderer.send('config.get')
    },
    data () {
      return {
        version: packageJson.version,
        healthOptions: [
          { value: undefined, text: 'None' },
          { value: 'casparcg', text: 'CasparCG Ping' }
        ],
        config: {
          api: {
            staticPaths: []
          },
          processes: []
        }
      }
    },

    methods: {
      onSubmit (evt) {
        // TODO - some data validation (especially staticPaths)

        evt.preventDefault()
        ipcRenderer.send('config.set', this.config)
      },
      onReset (evt) {
        evt.preventDefault()
        ipcRenderer.send('config.get')
      },
      onAddStaticPathRow (evt) {
        evt.preventDefault()
        this.config.api.staticPaths.push({})
      },
      onRemoveStaticPathRow (row) {
        this.config.api.staticPaths.splice(row.index, 1)
      },
      onAddProcessRow (evt) {
        evt.preventDefault()
        this.config.processes.push({
          id: Math.random().toString(36).substring(7)
        })
      },
      onRemoveProcessRow (row) {
        this.config.processes.splice(row.index, 1)
      }
    }
  }
</script>

<style scoped>
</style>
