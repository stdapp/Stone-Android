<template>
  <div class="wallet">
    <div class="w-block">
      <div class="w-t font-c-666 font-z-24"><span>我没有钱包账户</span></div>
      <router-link tag="div" to="/create/CreateWallet" class="w-f">
        <div class="wf-icon"><img src="../../assets/changjian.png" alt=""></div>
        <div class="wf-text">
          <div class="wf-i font-z-16 font-w-500">创建钱包</div>
          <div class="wf-ii font-z-12 font-c-999">创建一个新的钱包</div>
        </div>
        <div class="arrow wf-arrow"></div>
      </router-link>
    </div>
    <div class="w-block">
      <div class="w-t font-c-666 font-z-24"><span>我已有钱包账户</span></div>
      <router-link tag="div" to="/import/importWallet" class="w-f">
        <div class="wf-icon"><img src="../../assets/daoru.png" alt=""></div>
        <div class="wf-text">
          <div class="wf-i font-z-16 font-w-500">导入钱包</div>
          <div class="wf-ii font-z-12 font-c-999">通过Keystore或者私钥导入钱包</div>
        </div>
        <div class="arrow wf-arrow"></div>
      </router-link>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Wallet"
    }
</script>

<style scoped>
  .wallet {
    margin: 5.33333rem 1.066667rem 0;
  }

  .wallet .w-block:last-of-type {
    margin-top: 2.56rem;
  }

  .wallet .w-block .w-f {
    position: relative;
    margin-top: 0.853333rem;
    padding: 1.066667rem;
    display: flex;
    align-items: center;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 #ccc;
  }

  .w-block .w-f .wf-icon {
    width: 2.56rem;
    height: 2.56rem;
    font-size: 0;
    margin-right: 0.853333rem;
  }

  .w-block .w-f .wf-icon img {
    width: 100%;
  }

  .w-block .w-f .wf-arrow {
    background: url("../../assets/arrow.png") center/contain;
  }
</style>
