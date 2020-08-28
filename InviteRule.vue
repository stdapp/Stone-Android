<template>
  <div class="rule">
    <mt-header :title='$t("game.invite.rule")' fixed >
      <router-link to="" slot="left">
        <mt-button  icon="back"  @click.native="$router.back(-1)" ></mt-button>
      </router-link>
    </mt-header>
    <div class="box"></div>
    <div class="rule-c padding-16-20">
      <div class="rc-g">
        <div class="rg-t font-z-16 font-w-500">I {{$t('game.inviteRule.com')}}</div>
        <div class="rg-b font-z-14">
          <div class="rb-i">{{$t('game.inviteRule.comRule1')}}</div>
          <div class="rb-ii font-c-666">{{$t('game.inviteRule.comS1')}}</div>
          <div class="rb-ii font-c-666">{{$t('game.inviteRule.comS2')}}</div>
          <div class="rb-ii font-c-666">{{$t('game.inviteRule.comS3')}}</div>
          <div class="rb-ii font-c-666">{{$t('game.inviteRule.comS4')}}</div>
          <div class="rb-ii font-c-666">{{$t('game.inviteRule.remark')}}</div>
        </div>
      </div>
      <div class="rc-g">
        <div class="rg-t font-z-16 font-w-500">II {{$t('game.inviteRule.person')}}</div>
        <div class="rg-i font-z-14">1.{{$t('game.inviteRule.personRule1')}}</div>
        <div class="rg-i font-z-14">2.{{$t('game.inviteRule.personRule2')}}</div>
        <div class="rg-i font-z-14">3.{{$t('game.inviteRule.personRule3')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "InviteRule"
    }
</script>

<style scoped>
  .rule .rule-c {
    padding-bottom: 2.58rem;
  }

  .rule-c .rc-g {
    margin-bottom: 1.28rem;
  }

  .rule-c .rc-g .rg-t {
    margin-bottom: 10px;
  }

  .rule-c .rc-g .rg-b {
    margin-bottom: 0.8533333rem;
  }

  .rc-g .rg-b .rb-ii {
    margin-top: 5px;
    margin-left: 1.28rem;
  }

</style>

