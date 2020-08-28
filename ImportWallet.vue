<template>
  <div class="import">
    <mt-header :title="$t('home.asset.importWallet')" fixed >
      <router-link to="" slot="left">
        <mt-button  icon="back"  @click.native="$router.back(-1)" ></mt-button>
      </router-link>
    </mt-header>
    <div class="box"></div>
    <div class="import-c">
      <router-link to="/import/importByKeystore" tag="div" class="i-block padding-all-20 margin-lr-20 border-radius-8">
        <div class="ib-i font-z-16">{{$t('wallet.import.keystore')}}</div>
        <div class="ib-ii font-z-12 font-c-999">{{$t('wallet.import.byKeystore')}}</div>
        <div class="arrow ib-arrow"></div>
      </router-link>
      <router-link to="/import/importByPrivateKey" tag="div" class="i-block padding-all-20 margin-lr-20  border-radius-8">
        <div class="ib-i font-z-16">{{$t('wallet.import.private')}}</div>
        <div class="ib-ii font-z-12 font-c-999">{{$t('wallet.import.byPrivate')}}</div>
        <div class="arrow ib-arrow"></div>
      </router-link>
    </div>
  </div>
</template>

<script>
    export default {
        name: "ImportWallet"
    }
</script>

<style scoped>
  .import .import-c {
  }

  .import-c .i-block {
    position: relative;
    margin-top: 0.853333rem;
    box-shadow: 0 2px 12px 0 #ccc;
  }

  .import-c .ib-arrow {
    background: url("../../../assets/arrow.png") center/contain;
  }
</style>
