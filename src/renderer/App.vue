<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="dark" sticky>

      <b-navbar-nav>
        <b-nav-item v-bind:key="val.id" v-for="val in processes" :to="'/' + val.id">{{ val.name }}</b-nav-item>
      </b-navbar-nav>
      
      <b-navbar-nav  class="ml-auto">
        <b-nav-item to="/settings" right>Settings</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    
    <router-view></router-view>
  </div>
</template>

<script>
  const {ipcRenderer} = require('electron')

  export default {
    name: 'casparcg-launcher',

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

<style>
  /* CSS */
</style>
