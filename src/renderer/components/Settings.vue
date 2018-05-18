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
          
          <b-form-group id="scannerArgsInputGroup"
                        label="Media Scanner Arguments:"
                        label-for="scannerArgsInput">
            <b-form-input id="scannerArgsInput"
                          type="text"
                          v-model="config.args['media-scanner']"
                          placeholder="">
            </b-form-input>
          </b-form-group>

        <b-button type="submit" variant="primary">Save</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>

       </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  const {ipcRenderer} = require('electron')

  export default {
    created () {
      ipcRenderer.on('config', (s, conf) => {
        this.config = conf

        if (!this.config.args) {
          this.config.args = {}
        }
      })
      ipcRenderer.send('config.get')
    },
    data () {
      return {
        config: {
          args: {}
        }
      }
    },

    methods: {
      onSubmit (evt) {
        evt.preventDefault()
        ipcRenderer.send('config.set', this.config)
      },
      onReset (evt) {
        evt.preventDefault()
        ipcRenderer.send('config.get')
      }
    }
  }
</script>

<style scoped>
</style>
