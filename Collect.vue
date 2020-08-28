<template>
  <div class="collect">
    <mt-header :title="$t('home.asset.collect')" fixed >
      <router-link to="" slot="left">
        <mt-button  icon="back"  @click.native="$router.back(-1)" ></mt-button>
      </router-link>
    </mt-header>
    <div class="box"></div>
    <div class="collect-c">
      <div class="cc-g font-z-16">
        <div class="cg-b cg-choose padding-16-20" @click="changeCoin = !changeCoin">
          <div class="cg-coin">{{$t('trans.collect.coin')}}： {{selectCoin}}</div>
          <div class="cg-arrow arrow" :class="{ 'cg-arrow-roll' : changeCoin }"></div>
        </div>
      </div>
      <div class="cc-c padding-all-20" v-show="selectCoin === 'USDT/ETH'">
        <div class="cc-qr border-radius-8">
          <div class="cc-t font-z-16">{{$t('trans.collect.scan')}}</div>
          <div class="cc-code" ref="qrcode"></div>
          <div class="cc-addr font-z-12">{{ethAddr}}</div>
        </div>
        <div id="usdt" class="btn-style btn-style-click" data-clipboard-action="copy" :data-clipboard-text="ethAddr" @click="copyEthAddr">{{$t('trans.collect.copy')}}</div>
      </div>
      <div class="cc-c padding-all-20" v-show="selectCoin === 'BIU'">
        <div class="cc-qr border-radius-8">
          <div class="cc-t font-z-16">{{$t('trans.collect.scan')}}</div>
          <div class="cc-code" ref="qrsd"></div>
          <div class="cc-addr font-z-12">{{IntAddr}}</div>
        </div>
        <div id="sd" class="btn-style btn-style-click" data-clipboard-action="copy" :data-clipboard-text="IntAddr" @click="copyBIUAddr">{{$t('trans.collect.copy')}}</div>
      </div>
    </div>
    <mt-actionsheet :actions= "coinSheet" :cancelText="$t('common.cancel')" v-model="changeCoin"></mt-actionsheet>
  </div>
</template>

<script>
  import Clipboard from 'clipboard';
  import QRCode from 'qrcodejs2';
  export default {
    name: "Collect",
    data() {
      return {
        IntAddr: '',
        ethAddr: '',
        selectCoin: 'BIU',
        changeCoin: false,
        coinSheet: [{
          name: 'BIU',
          method: this.chooseBIU
        },{
          name: 'USDT/ETH',
          method: this.chooseUSDT
        }]
      }
    },
    created() {
      this.$common.openLoad();
      this.IntAddr = plus.storage.getItem("address");
      this.ethAddr = plus.storage.getItem("ethAddr");
    },
    mounted() {
      this.createQrCode();
      this.createBIUCode();
    },
    methods: {
      chooseUSDT() {
        this.selectCoin = "USDT/ETH";
      },
      chooseBIU() {
        this.selectCoin = "BIU";
      },
      copyBIUAddr() {
        let that = this;
        that.clipboard = new Clipboard("#sd");
        if (that.IntAddr) {
          that.clipboard.on('success',function (e) {
            that.$toast({
              message: that.$t('common.copySuccess'),
              position: 'bottom',
              duration: 3000
            });
            e.clearSelection();
            that.clipboard.destroy();
          });
          that.clipboard.on('error',function () {
            that.$toast({
              message: that.$t('common.copyFailed'),
              position: 'bottom',
              duration: 3000
            });
            e.clearSelection();
            that.clipboard.destroy();
          })
        }
      },
      copyEthAddr() {
        let that = this;
        that.clipboard = new Clipboard("#usdt");
        if (that.ethAddr) {
          that.clipboard.on('success',function (e) {
            that.$toast({
              message: that.$t('common.copySuccess'),
              position: 'bottom',
              duration: 3000
            });
            e.clearSelection();
            that.clipboard.destroy();
          });
          that.clipboard.on('error',function () {
            that.$toast({
              message: that.$t('common.copyFailed'),
              position: 'bottom',
              duration: 3000
            });
            e.clearSelection();
            that.clipboard.destroy();
          })
        }
      },
      createQrCode() {
        new QRCode(this.$refs.qrcode, {
          text: this.ethAddr,
          colorDark: "#333333",
          colorLight: "#ffffff",
          width: 200,
          height: 200,
          correctLevel: QRCode.CorrectLevel.H
        });
        this.$common.closeLoad();
      },
      createBIUCode() {
        new QRCode(this.$refs.qrsd, {
          text: this.IntAddr,
          colorDark: "#333333",
          colorLight: "#ffffff",
          width: 200,
          height: 200,
          correctLevel: QRCode.CorrectLevel.H
        });
      },
    }
  }
</script>

<style scoped>
  .collect {
    min-height: 100%;
    background-color: #fafafa;
  }

  .collect-c .cc-g .cg-b {
    background-color: #fff;
  }

  .collect-c .cg-choose {
    position: relative;
  }

  .collect-c .cg-choose .cg-arrow {
    width: 1.066667rem;
    height: 1.0666667rem;
    background: url("../../assets/arrow-down.png") no-repeat center/contain;
    transition: all 0.3s;
  }

  .tg-choose .cg-arrow-roll {
    transform: rotate(180deg) translateY(50%);
  }


  .collect-c .cc-qr {
    margin-top: 1.28rem;
    width: 100%;
    padding: 2.56rem 0 2.666667rem;
    text-align: center;
    box-shadow: 0 2px 12px 0 #ccc;
    background-color: #fff;
  }

  .collect-c .cc-qr .cc-code {
    width: 200px;
    height: 200px;
    background-color: #fff;
    margin: 1.066667rem auto;
  }

  .collect-c .btn-style {
    margin-top: 2.56rem;
  }
</style>
