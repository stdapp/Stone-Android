<template>
  <div class="create">
    <mt-header :title="$t('wallet.manage.modifyPsw')" fixed >
      <router-link to="" slot="left">
        <mt-button  icon="back"  @click.native="$router.back(-1)" ></mt-button>
      </router-link>
    </mt-header>
    <div class="box"></div>
    <div class="create-c">
      <div class="cc-group">
        <div class="cc-gt font-z-16 font-c-666">{{$t('wallet.manage.oPsw')}}</div>
        <div class="cc-input"><input class="font-z-16" type="password" :placeholder="$t('wallet.pswPH')" v-model="param.oldPsw"></div>
      </div>
      <div class="cc-group">
        <div class="cc-gt font-z-16 font-c-666">{{$t('wallet.manage.nPsw')}}</div>
        <div class="cc-input"><input class="font-z-16" type="password" :placeholder="$t('wallet.manage.nPswPlace')" v-model="param.newPsw"></div>
        <div class="cc-tip font-z-12 font-c-999">{{$t('wallet.pswLimit')}}</div>
      </div>
      <div class="cc-group">
        <div class="cc-gt font-z-16 font-c-666">{{$t('wallet.manage.reNPsw')}}</div>
        <div class="cc-input"><input class="font-z-16" type="password" :placeholder="$t('wallet.manage.nPswPlace')" v-model="param.rePsw"></div>
      </div>
      <div class="btn-style font-z-16" v-if="!isImport"><span>{{$t('wallet.manage.confirm')}}</span></div>
      <div class="btn-style font-z-16" v-if="isImport" :class="{'btn-style-click':isImport}" @click="modifyPsw"><span>{{$t('wallet.manage.confirm')}}</span></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ModifyPsw",
    data() {
      return {
        param: {
          oldPsw: '',
          newPsw: '',
          rePsw: ''
        },
        isImport: false,
        mdfKey: plus.storage.getItem('keystore'),
        priKey: ''
      }
    },
    created() {
    },
    mounted() {
    },
    watch: {
      param: {
        deep: true,
        handler() {
          this.isImport = (this.param.oldPsw && this.param.newPsw && this.param.rePsw && this.param.newPsw.length >= 9)
        }
      }
    },
    methods: {
      modifyPsw() {
        this.$common.openLoad();
        let that = this;
        let option = JSON.parse(this.mdfKey);
        setTimeout(()=> {
          if (that.param.newPsw === that.param.rePsw) {
            wal.decodeFromOption(option, that.param.oldPsw).then(res =>{
              if (res === 'error') {
                that.$common.closeLoad();
                that.$toast({
                  message: that.$t('common.pswError'),
                  position: 'bottom',
                  duration: 3000
                })
              } else {
                that.priKey = res;
                if (that.$common.pswTest(that.param.newPsw)) {
                  that.$common.closeLoad();
                  that.$toast({
                    message: that.$t('wallet.pswFormat'),
                    position: 'bottom',
                    duration: 3000
                  })
                } else {
                  let newKey = wal.makeWalletByPrivate(that.priKey, that.param.newPsw);
                  newKey.address = that.$sec.privateToAddress(Buffer.from(that.priKey, 'hex')).toString('hex');
                  newKey = JSON.stringify(newKey);
                  console.log(newKey);
                  let sql = "select * from walletInfo where keystore = '" + that.mdfKey + "'";
                  let sql2 = "update walletInfo set keystore = '" + newKey +"' where keystore = '"+ that.mdfKey +"'";
                  that.$common.openDB().then(res => {
                    that.$common.query(sql).then(res1 => {
                      if (res1.data[0].status === 1) {
                        plus.storage.setItem('keystore',newKey)
                      }
                      that.$common.query(sql2,1).then(res2 => {
                        that.$common.closeLoad();
                        plus.sqlite.closeDatabase({name: 'wallet'});
                        that.$messagebox.alert('',{
                          title: that.$t('common.tips'),
                          message: that.$t('wallet.manage.success'),
                          confirmButtonText: that.$t('common.confirm')
                        }).then(()=>{
                          that.$router.go(-1);
                        });
                      }).catch(err2 => {
                        that.$common.closeLoad();
                        that.$toast({
                          message: this.$t('common.system'),
                          position: 'bottom',
                          duration: 3000
                        });
                        plus.sqlite.closeDatabase({name: 'wallet'});
                      })
                    }).catch(err1 => {
                      that.$common.closeLoad();
                      that.$toast({
                        message: this.$t('common.system'),
                        position: 'bottom',
                        duration: 3000
                      });
                      plus.sqlite.closeDatabase({name: 'wallet'});
                    })
                  }).catch(err => {
                    that.$common.closeLoad();
                    that.$toast({
                      message: this.$t('common.system'),
                      position: 'bottom',
                      duration: 3000
                    });
                    plus.sqlite.closeDatabase({name: 'wallet'});
                  })
                }
              }
            })
          } else {
            this.$common.closeLoad();
            that.$toast({
              message: that.$t('wallet.pswNotSame'),
              position: 'bottom',
              duration: 3000
            })
          }
        },50);
      }
    }
  }
</script>

<style scoped>
  .create .create-c {
    padding: 0.853333rem 1.0666667rem 2.56rem;
  }

  .create-c .cc-group {
    margin-top: 1.28rem;
  }

  .create-c .cc-group:first-of-type {
    margin-top: 0;
  }

  .cc-group .cc-input {
    margin-top: 0.64rem;
    padding: 0.8533333rem;
    background-color: #f7f7f7;
    border-radius: 8px;
  }

  .cc-group .cc-input input {
    width: 100%;
  }

  .cc-group .cc-tip {
    margin-top: 4px;
  }

  .create-c .btn-style {
    margin-top: 2.4rem;
  }

</style>
