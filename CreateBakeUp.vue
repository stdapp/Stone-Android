<template>
  <div class="bake-up">
    <mt-header :title="$t('wallet.manage.bakeUp')" fixed >
      <router-link to="" slot="left">
        <mt-button  icon="back"  @click.native="$router.back(-1)" ></mt-button>
      </router-link>
    </mt-header>
    <div class="box"></div>
    <div class="bake-c">
      <div class="bake-tip">
        <div class="bt-t font-z-16">{{$t('wallet.create.cache')}}</div>
        <div class="bt-i font-z-14 font-c-666">{{$t('wallet.create.save')}}</div>
      </div>
      <div class="bake-tip">
        <div class="bt-t font-z-16">{{$t('wallet.create.noUseNet')}}</div>
        <div class="bt-i font-z-14 font-c-666">{{$t('wallet.create.irreversible')}}</div>
      </div>
      <div class="bake-g">
        <div class="bake-b">
          <div class="bg-t font-c-666 font-z-16">{{$t('wallet.create.private')}}</div>
          <div class="bg-b">
            <div class="bb-t padding-16-20 font-z-14">{{privateKey}}</div>
            <div class="bb-blur border-radius-8"><div class="bb-btn btn1" data-clipboard-action="copy" :data-clipboard-text="privateKey" @click="copyPrivate">{{$t('wallet.create.click')}}</div></div>
          </div>
        </div>
        <div class="bake-b">
          <div class="bg-t font-c-666 font-z-16">Keystore</div>
          <div class="bg-b">
            <div class="bb-t padding-16-20 font-z-14">{{keystore}}</div>
            <div class="bb-blur border-radius-8"><div class="bb-btn btn2" data-clipboard-action="copy" :data-clipboard-text="keystore" @click="copyKey">{{$t('wallet.create.click')}}</div></div>
          </div>
        </div>
      </div>
      <div class="btn-style btn-style-click font-z-16" @click="toHome">{{$t('wallet.create.done')}}</div>
    </div>
  </div>
</template>

<script>
  import Clipboard from 'clipboard';
  export default {
    name: "CreateBakeUp",
    data() {
      return{
        keystore: plus.storage.getItem('keystore'),
        privateKey: plus.storage.getItem('privateKey'),
      }
    },
    created() {
    },
    methods: {
      copyPrivate() {
        let that = this;
        that.clipboard = new Clipboard('.btn1');
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
      },
      copyKey() {
        let that = this;
        that.clipboard = new Clipboard('.btn2');
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
      },
      toHome() {
        this.$router.push(`/?select=asset`);
      }
    }
  }
</script>

<style scoped>
  .bake-up .bake-c {
    padding: 0 1.066667rem;
  }

  .bake-c .bake-tip {
    margin-top: 1.066667rem;
  }

  .bake-tip .bt-t {
    color: #f63d27;
  }

  .bake-tip .bt-i {
    margin-top: 5px;
  }

  .bake-up .bake-g {
    margin-top: 1.6rem;
  }

  .bake-up .bake-b {
    margin-top: 1.066667rem;
  }

  .bake-up .bake-b .bg-b {
    position: relative;
  }

  .bake-up .bake-b .bg-b .bb-t {
    margin-top: 0.64rem;
    word-break: break-word;
    filter: blur(3px);
  }

  .bake-b .bg-b .bb-blur {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.2);
  }

  .bake-b .bg-b .bb-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    padding: 5px 20px;
    background-color: #631CEF;
    border-radius: 100px;
    color: #ffffff;
    font-size: 0.74666667rem;
  }

  .bake-c .btn-style {
    margin: 1.066667rem 0 1.70666667rem;
  }
</style>
