<template>
  <b-card no-body>
    <b-tabs pills card>
      <b-tab title="Caspar CG" active>
        <process-tab id='casparcg'></process-tab>
      </b-tab>
      <b-tab title="Media Scanner">
        <process-tab id='media-scanner'></process-tab>
      </b-tab>
    </b-tabs>
  </b-card>

</template>

<script>
  import ProcessTab from './LandingPage/ProcessTab'

  export default {
    name: 'landing-page',
    components: { ProcessTab }
  }
</script>

<style>
</style>
