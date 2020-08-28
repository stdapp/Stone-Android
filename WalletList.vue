<template>
  <div class="walletList">
    <mt-header :title="$t('wallet.manage.change')" fixed >
      <router-link to="/?select=asset" slot="left">
        <mt-button icon="back" ></mt-button>
      </router-link>
    </mt-header>
    <div class="box"></div>
    <div class="wlist-c">
      <div class="wl-list" v-for="(item,index) in walletList" :key="index">
        <div class="wl-b border-radius-8 padding-16-20" @click="setDefaule(item)">
          <div class="wl-l">
            <div class="wb-name font-z-16">{{item.name}}</div>
            <div class="wb-addr font-z-12 font-c-999">{{item.address}}</div>
          </div>
          <div class="wl-r" :class="{'wl-xz': item.showDefault}"></div>
        </div>
      </div>
    </div>
    <div class="wl-active padding-all-20">
      <router-link tag="div" to="/import/importWallet" class="wl-btn import">{{$t('home.asset.importWallet')}}</router-link>
      <router-link tag="div" to="/create/createWallet" class="wl-btn create">{{$t('home.asset.createWallet')}}</router-link>
    </div>
  </div>
</template>

<script>
  import BigNumber from 'bignumber.js'
  export default {
    name: "WalletList",
    data() {
      return {
        walletList: ''
      }
    },
    created() {
      this.$common.openLoad();
      this.getWallet();
    },
    mounted() {
    },
    methods: {
      getWallet () {
        let that = this;
        let select = 'select * from stoneInfo';
        that.$common.openDB().then(res1 => {
          that.$common.query(select).then(res2 => {
            that.walletList = res2.data;
            for(let item of that.walletList){
              item.showDefault = !!(item.status);
            }
            that.$common.closeLoad();
            plus.sqlite.closeDatabase({name: 'stoneApp'});
          }).catch(err2 =>{
            that.$common.closeLoad();
            this.$toast({
              message: this.$t('common.system'),
              position: 'bottom',
              duration: 3000
            });
            plus.sqlite.closeDatabase({name: 'stoneApp'});
          })
        })
          .catch(err1 => {
            plus.sqlite.closeDatabase({name: 'stoneApp'});
            that.$common.closeLoad();
            this.$toast({
              message: this.$t('common.system'),
              position: 'bottom',
              duration: 3000
            })
          })
      },
      setDefaule(item) {
        if (!item.showDefault) {
          this.$common.openLoad();
          let that = this;
          that.$common.openDB().then(res => {
            let str = 'update stoneInfo set status = 0 where status = 1';
            that.$common.query(str,1).then(res1 => {
              let str2 = 'update stoneInfo set status = 1 where address = "'+ item.address +'"';
              that.$common.query(str2,1).then(res2 => {
                that.walletList.forEach(index => {
                  index.showDefault = false;
                });
                item.showDefault = true;
                that.walletList = [...that.walletList];
                plus.storage.setItem('address',item.address);
                plus.storage.setItem('keystore',item.keystore);
                plus.storage.setItem('name',item.name);
                plus.storage.setItem('str',item.str);
                plus.storage.setItem('signature',item.signature);
                plus.storage.setItem('ethAddr',item.ethAddr);
                plus.sqlite.closeDatabase({name: 'stoneApp'});
                this.$messagebox.alert('', {
                  title: that.$t('common.tips'),
                  message: that.$t('wallet.manage.changeSuccess'),
                  confirmButtonText: that.$t('common.confirm')
                }).then(res => {
                  that.$router.push('/?select=asset');
                });
                that.$common.closeLoad();
              }).catch(err2 => {
                plus.sqlite.closeDatabase({name: 'stoneApp'});
                that.$common.closeLoad();
                that.$toast({
                  message: this.$t('common.system'),
                  position: 'bottom',
                  duration: 3000
                });
              })
            }).catch(err1 => {
              plus.sqlite.closeDatabase({name: 'stoneApp'});
              that.$common.closeLoad();
              that.$toast({
                message: this.$t('common.system'),
                position: 'bottom',
                duration: 3000
              });
            })
          }).catch(err => {
            plus.sqlite.closeDatabase({name: 'stoneApp'});
            that.$common.closeLoad();
            that.$toast({
              message: this.$t('common.system'),
              position: 'bottom',
              duration: 3000
            });
          })
        }
      }
    }
  }
</script>

<style scoped>
  .walletList {
    position: relative;
  }

  .walletList .wlist-c {
    padding: 0 1.0666667rem 4rem;
  }

  .walletList .wl-active {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    padding-bottom: 2.56rem;
  }

  .walletList .wl-active .wl-btn {
    width: 45%;
    font-size: 0.8533333rem;
    padding: 5px 0;
    border-radius: 100px;
    text-align: center;
  }

  .wl-active .import {
    background-color: #631CEF;
    color: #fff;
  }

  .wl-active .create {
    border: 1px solid #631CEF;
    color: #631CEF;
  }

  .walletList .wlist-c .wl-list .wl-b {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.0666667rem;
    background-color: #f7f7f7;
  }

  .wl-list .wl-b .wl-r {
    width: 1.28rem;
    height: 1.28rem;

  }

  .wl-list .wl-b .wl-xz {
    background: url("../../../assets/xuanze.png") no-repeat center/contain;
  }


</style>
