<template>
  <div class="rule">
    <mt-header :title="$t('game.god.rule')" fixed >
      <router-link to="" slot="left">
        <mt-button  icon="back"  @click.native="$router.back(-1)" ></mt-button>
      </router-link>
    </mt-header>
    <div class="box"></div>
    <div class="rule-c padding-16-20">
      <div class="rc-i font-z-14">1）{{$t('game.god.rule1')}}</div>
      <div class="rc-i font-z-14">2）{{$t('game.god.rule2')}}</div>
      <div class="rc-i font-z-14">3）{{$t('game.god.rule3')}}</div>
      <div class="rc-i font-z-14">4）{{$t('game.god.rule4')}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "GodRule"
  }
</script>

<style scoped>
  .rule .rule-c {
  }

  .rule-c .rc-i {
    margin-bottom: 0.8533333rem;
  }
</style>
