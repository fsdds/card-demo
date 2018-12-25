<template>
  <div class="home">
    <app-payment/>
  </div>
</template>

<script>
// @ is an alias to /src
import AppPayment from '@/components/AppPayment.vue'

export default {
  name: 'home',
  components: {
    AppPayment
  }
}
</script>
