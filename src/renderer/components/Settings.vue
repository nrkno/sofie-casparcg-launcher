<template>
  <b-container fluid>
    <b-form @submit="onSubmit" @reset="onReset">
      <b-row>
        <b-col id="content">
          <legend>Processes</legend>
          <b-form-group id="basePathInputGroup" horizontal label="Base Path:" label-for="basePathInput">
            <b-input-group>
              <b-form-input id="basePathInput" type="text" v-model="config.basePath" placeholder="./"> </b-form-input>
              <b-button type="info" size="sm" class="mr-2" @click.stop="onOpenBasePath">
                Open
              </b-button>
            </b-input-group>
          </b-form-group>

          <b-form-group id="logsPathInputGroup" horizontal label="Logs Path:" label-for="logsPathInput">
            <b-input-group>
              <b-form-input id="logsPathInput" type="text" v-model="config.logsPath" placeholder="logs/" />
              <b-button type="info" size="sm" class="mr-2" @click.stop="onOpenLogsPath">
                Open
              </b-button>
            </b-input-group>
          </b-form-group>

          <b-form-group id="processesGroup" label-for="processesTable">
            <b-button type="submit" variant="primary" @click="onAddProcessRow">
              Add process
            </b-button>
            <b-table
              striped
              :items="config.processes"
              :fields="[
                'name',
                { key: 'exeName', label: 'Executable' },
                { key: 'args', label: 'Arguments' },
                { key: 'health', label: 'Health Check' },
                { key: 'log', label: 'Save log' },
                { key: 'start', label: 'Auto start' },
                'actions',
              ]"
            >
              <template #cell(name)="data">
                <b-form-input
                  :id="'processName' + data.index"
                  v-model="config.processes[data.index].name"
                  type="text"
                  required
                />
              </template>
              <template #cell(exeName)="data" label="Executable">
                <b-form-input
                  :id="'processExeName' + data.index"
                  v-model="config.processes[data.index].exeName"
                  type="text"
                  required
                />
              </template>
              <template #cell(args)="data">
                <b-form-input
                  :id="'processArgs' + data.index"
                  v-model="config.processes[data.index].args"
                  type="text"
                />
              </template>
              <template #cell(health)="data">
                <b-form-select
                  :id="'processHealth' + data.index"
                  v-model="config.processes[data.index].health"
                  :options="healthOptions"
                  class="mb-3"
                />
              </template>
              <template #cell(log)="data">
                <b-form-checkbox :id="'processLog' + data.index" v-model="config.processes[data.index].logMode" />
              </template>
              <template #cell(start)="data">
                <b-form-checkbox :id="'autoStart' + data.index" v-model="config.processes[data.index].autoStart" />
              </template>
              <template #cell(actions)="row">
                <!-- we use @click.stop here to prevent emitting of a 'row-clicked' event  -->
                <b-button size="sm" @click.stop="onRemoveProcessRow(row)" class="mr-2">
                  Remove
                </b-button>
              </template>
            </b-table>
          </b-form-group>

          <legend>HTTP</legend>
          <b-form-group id="httpApiEnableGroup" horizontal label="Enable HTTP Server:" label-for="httpApiEnableInput">
            <b-form-checkbox id="httpApiEnableInput" v-model="config.api.enable"> </b-form-checkbox>
          </b-form-group>

          <b-form-group id="httpApiPortGroup" horizontal label="HTTP Server Port:" label-for="httpApiPortInput">
            <b-form-input id="httpApiPortInput" type="number" v-model="config.api.port" placeholder="8005" />
          </b-form-group>

          <b-form-group
            id="httpApiProcessControlGroup"
            horizontal
            label="Process control API:"
            label-for="httpApiProcessControlInput"
          >
            <b-form-checkbox id="httpApiProcessControlInput" v-model="config.api.processControl"> </b-form-checkbox>
          </b-form-group>

          <b-form-group id="httpApiStaticPathsGroup" label="Static paths" label-for="httpApiStaticPathsTable">
            <b-button type="submit" variant="primary" @click="onAddStaticPathRow">
              Add static path
            </b-button>
            <b-table striped :items="config.api.staticPaths" :fields="['name', 'path', 'allowDelete', 'actions']">
              <template #cell(name)="data">
                <b-form-input
                  :id="'httpApiStaticPathName' + data.index"
                  v-model="config.api.staticPaths[data.index].name"
                  type="text"
                  required
                />
              </template>
              <template #cell(path)="data">
                <b-form-input
                  :id="'httpApiStaticPathPath' + data.index"
                  v-model="config.api.staticPaths[data.index].path"
                  type="text"
                  required
                />
              </template>
              <template #cell(allowDelete)="data">
                <b-form-checkbox
                  :id="'httpApiStaticPathAllowDelete' + data.index"
                  v-model="config.api.staticPaths[data.index].allowDelete"
                />
              </template>
              <template #cell(actions)="row">
                <!-- we use @click.stop here to prevent emitting of a 'row-clicked' event  -->
                <b-button size="sm" @click.stop="onRemoveStaticPathRow(row)" class="mr-2">
                  Remove
                </b-button>
              </template>
            </b-table>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row id="footer">
        <b-col>
          <b-button type="submit" variant="primary">
            Save
          </b-button>
          <b-button type="reset" variant="danger">
            Reset
          </b-button>
        </b-col>
        <b-col id="version">
          <p class="text-right">Version: {{ version }}</p>
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
const { ipcRenderer } = require('electron')
const packageJson = require('../../../package.json')

export default {
  data() {
    return {
      version: packageJson.version,
      healthOptions: [
        { value: undefined, text: 'None' },
        { value: 'casparcg', text: 'CasparCG Ping' },
      ],
      config: {
        api: {
          staticPaths: [],
        },
        processes: [],
      },
    }
  },
  created() {
    ipcRenderer.on('config', (s, conf) => {
      this.config = conf

      if (!this.config.api) {
        this.$set(this.config, 'api', {})
      }
      if (!this.config.api.staticPaths) {
        this.$set(this.config.api, 'staticPaths', [])
      }
    })
    ipcRenderer.send('config.get')
  },

  methods: {
    onSubmit(evt) {
      // TODO - some data validation (especially staticPaths)

      evt.preventDefault()
      ipcRenderer.send('config.set', this.config)
    },
    onReset(evt) {
      evt.preventDefault()
      ipcRenderer.send('config.get')
    },
    onAddStaticPathRow(evt) {
      evt.preventDefault()
      this.config.api.staticPaths.push({})
    },
    onRemoveStaticPathRow(row) {
      this.config.api.staticPaths.splice(row.index, 1)
    },
    onAddProcessRow(evt) {
      evt.preventDefault()
      this.config.processes.push({
        id: Math.random().toString(36).substring(7),
        autoStart: true,
      })
    },
    onRemoveProcessRow(row) {
      this.config.processes.splice(row.index, 1)
    },
    onOpenBasePath(evt) {
      evt.preventDefault()
      ipcRenderer.send('openPath', 'basePath')
    },
    onOpenLogsPath(evt) {
      evt.preventDefault()
      ipcRenderer.send('openPath', 'logsPath')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../../node_modules/bootstrap/scss/bootstrap';
@import '../../../node_modules/bootstrap/scss/_variables';
$button-height: 40px;
$footer-padding: 1rem;
$footer-height: calc(#{$button-height} + #{2 * $footer-padding});
#content {
  margin-bottom: $footer-height;
}
#footer {
  background: $light;
  bottom: 0;
  width: 100%;
  height: $footer-height;
  padding-top: $footer-padding;
  position: fixed;
}
#version {
  padding-top: $btn-padding-y;
}
</style>
