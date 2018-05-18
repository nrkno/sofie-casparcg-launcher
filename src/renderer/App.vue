<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="dark" sticky>

      <b-navbar-nav>
        <b-nav-item to="/casparcg">CasparCG</b-nav-item>
        <b-nav-item to="/media-scanner">Media Scanner</b-nav-item>
      </b-navbar-nav>
      
      <b-navbar-nav  class="ml-auto">
        <b-nav-item to="/settings" right>Settings</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'casparcg-launcher'
  }
</script>

<style>
  /* CSS */
</style>
