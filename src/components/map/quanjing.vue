<template>
  <div>
    <iframe v-if="url" :src="url" style="height:100%;width:100%;" frameborder="0"></iframe>
  </div>
</template>

<script>
  export default{
  	props:['url']
  }
</script>
