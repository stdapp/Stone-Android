<template>
  <div class="about">
    <mt-header :title="$t('home.mine.about')" fixed >
      <router-link to="" slot="left">
        <mt-button  icon="back"  @click.native="$router.back(-1)" ></mt-button>
      </router-link>
    </mt-header>
    <div class="box"></div>
    <div class="ab-c padding-all-20 font-z-14">{{$t('about.about')}}</div>
  </div>
</template>

<script>
    export default {
        name: "AboutUs"
    }
</script>

<style scoped>
  .ab-c {
    text-indent: 2em;
  }
</style>
