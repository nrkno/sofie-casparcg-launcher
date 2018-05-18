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
                          required
                          placeholder="./">
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
        console.log(conf)
        this.config = conf
      })
      ipcRenderer.send('config.get')
    },
    data () {
      return {
        config: {}
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
