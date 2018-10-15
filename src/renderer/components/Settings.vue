<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <b-form @submit="onSubmit" @reset="onReset">
          <b-form-group id="basePathInputGroup"
                        label="Base Path:"
                        label-for="basePathInput">
            <b-form-input id="basePathInput"
                          type="text"
                          v-model="config.basePath"
                          placeholder="./">
            </b-form-input>
          </b-form-group>
          
          <b-form-group id="casparcgArgsInputGroup"
                        label="CasparCG Arguments:"
                        label-for="casparcgArgsInput">
            <b-form-input id="casparcgArgsInput"
                          type="text"
                          v-model="config.args.casparcg"
                          placeholder="">
            </b-form-input>
          </b-form-group>
          
          <b-form-group id="casparcgHealthInputGroup"
                        label="CasparCG Healthcheck:"
                        label-for="casparcgHealthInput">
            <b-form-checkbox id="casparcgHealthInput"
                          v-model="config.health.casparcg">
            </b-form-checkbox>
          </b-form-group>
          
          <b-form-group id="scannerArgsInputGroup"
                        label="Media Scanner Arguments:"
                        label-for="scannerArgsInput">
            <b-form-input id="scannerArgsInput"
                          type="text"
                          v-model="config.args['media-scanner']"
                          placeholder="">
            </b-form-input>
          </b-form-group>
          
          <b-form-group id="httpApiEnableGroup"
                        label="Enable HTTP Server:"
                        label-for="httpApiEnableInput">
            <b-form-checkbox id="httpApiEnableInput"
                          v-model="config.api.enable">
            </b-form-checkbox>
          </b-form-group>
          
          <b-form-group id="httpApiPortGroup"
                        label="HTTP Server Port:"
                        label-for="httpApiPortInput">
            <b-form-input id="httpApiPortInput"
                          type="number"
                          v-model="config.api.port"
                          placeholder="8005">
            </b-form-input>
          </b-form-group>
          
          <b-form-group id="httpApiProcessControlGroup"
                        label="Enable HTTP Process control API:"
                        label-for="httpApiProcessControlInput">
            <b-form-checkbox id="httpApiProcessControlInput"
                          v-model="config.api.processControl">
            </b-form-checkbox>
          </b-form-group>

          <b-form-group id="httpApiStaticPathsGroup"
                        label="HTTP Static paths:"
                        label-for="httpApiStaticPathsTable">
            <b-button type="submit" variant="primary" @click="onAddRow">Add static path</b-button>
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
                <b-button size="sm" @click.stop="onRemoveRow(row)" class="mr-2">
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

        if (!this.config.args) {
          this.config.args = {}
        }
        if (!this.config.api) {
          this.config.api = {}
        }
        if (!this.config.api.staticPaths) {
          this.config.api.staticPaths = []
        }
        if (!this.config.health) {
          this.config.health = {}
        }
      })
      ipcRenderer.send('config.get')
    },
    data () {
      return {
        version: packageJson.version,
        config: {
          api: {
            staticPaths: []
          },
          args: {},
          health: {}
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
      onAddRow (evt) {
        evt.preventDefault()
        this.config.api.staticPaths.push({})
      },
      onRemoveRow (row) {
        this.config.api.staticPaths.splice(row.index, 1)
      }
    }
  }
</script>

<style scoped>
</style>
