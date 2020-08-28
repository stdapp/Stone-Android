<template>
  <div class="create">
    <mt-header :title="$t('home.asset.importWallet')" fixed >
      <router-link to="" slot="left">
        <mt-button  icon="back"  @click.native="$router.back(-1)" ></mt-button>
      </router-link>
    </mt-header>
    <div class="box"></div>
    <div class="create-c">
      <div class="cc-group">
        <div class="cc-gt font-z-16 font-c-666">{{$t('wallet.import.inputKey')}}</div>
        <div class="cc-input"><textarea name="" id="" rows="5" :placeholder="$t('wallet.import.keyPH')" v-model="param.keystore" @input="checkAddr"></textarea></div>
      </div>
      <div class="cc-group">
        <div class="cc-gt font-z-16 font-c-666">{{$t('wallet.name')}}</div>
        <div class="cc-input"><input class="font-z-16" type="text" :placeholder="$t('wallet.namePH')" v-model="param.walletName"></div>
        <div class="cc-tip font-z-12 font-c-999">{{$t('wallet.nameLimit')}}</div>
      </div>
      <div class="cc-group">
        <div class="cc-gt font-z-16 font-c-666">{{$t('wallet.password')}}</div>
        <div class="cc-input"><input class="font-z-16" type="password" :placeholder="$t('wallet.pswPH')" v-model="param.psw"></div>
        <div class="cc-tip font-z-12 font-c-999">{{$t('wallet.pswLimit')}}</div>
      </div>
      <div v-if="!isRegister">
        <div class="cc-group" style="margin-top: 1.28rem;">
          <div class="cc-gt font-z-16 font-c-666">{{$t('wallet.nickname')}}</div>
          <div class="cc-input"><input class="font-z-16" type="text" :placeholder="$t('wallet.nicknamePH')" v-model="param.nickname"></div>
        </div>
        <div class="cc-group">
          <div class="cc-gt font-z-16 font-c-666">{{$t('wallet.invite')}}</div>
          <div class="cc-input"><input class="font-z-16" type="text" :placeholder="$t('wallet.invitePH')" v-model="param.invite"></div>
        </div>
      </div>
      <div class="btn-style font-z-16" v-if="!isImport"><span>{{$t('wallet.import.import')}}</span></div>
      <div class="btn-style font-z-16" v-if="isImport" :class="{'btn-style-click':isImport}" @click="importByKeystore"><span>{{$t('wallet.import.import')}}</span></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ImportByKeystore",
    data() {
      return {
        param: {
          keystore: '',
          walletName: '',
          nickname: '',
          invite: '',
          psw: ''
        },
        isImport: false,
        importWallet: true,
        status: '',
        isRegister: false
      }
    },
    created() {
    },
    mounted() {
    },
    watch: {
      param: {
        deep: true,
        handler (nVal, oVal) {
          if (this.isRegister) {
            this.isImport = (this.param.walletName && this.param.keystore && this.param.psw)
          } else {
            this.isImport = (this.param.walletName && this.param.keystore && this.param.nickname && this.param.invite && this.param.psw)
          }
        }
      }
    },
    methods: {
      checkAddr() {
        if (this.$common.jsonTest(this.param.keystore)) {
          let option = JSON.parse(this.param.keystore);
          let checkRegister = {
            address: option.address
          };
          this.$axios.post(`${this.$common.URL}/api/exchange/isRegistered`, checkRegister).then(res => {
            this.isRegister = res.data;
          }).catch(err => {
            this.$toast({
              message: this.$t('common.network'),
              position: 'bottom',
              duration: 3000
            });
          })
        } else {
          this.$toast({
            message: this.$t('wallet.import.keystoreErr'),
            position: 'bottom',
            duration: 3000
          })
        }
      },
      importByKeystore() {
        let that = this;
        that.$common.openLoad();
        let walletName = that.param.walletName.trim();
        setTimeout(()=> {
          if (!walletName) {
            that.$common.closeLoad();
            this.$toast({
              message: this.$t('wallet.nameNotNull'),
              position: 'bottom',
              duration: 3000
            });
          } else if (walletName.length > 20) {
            that.$common.closeLoad();
            this.$toast({
              message: this.$t('wallet.nameFormat'),
              position: 'bottom',
              duration: 3000
            });
          } else if (walletName === plus.storage.getItem('name')) {
            that.$common.closeLoad();
            this.$toast({
              message: this.$t('wallet.exist'),
              position: 'bottom',
              duration: 3000
            })
          } else if (that.$common.jsonTest(that.param.keystore)) {
            let option = JSON.parse(that.param.keystore);
            if (option.address === plus.storage.getItem('address')) {
              that.$common.closeLoad();
              this.$toast({
                message: this.$t('wallet.walletExist'),
                position: 'bottom',
                duration: 3000
              })
            } else {
              wal.decodeFromOption(option,that.param.psw).then(res => {
                let PRI = res;
                if (PRI === 'error') {
                  that.$common.closeLoad();
                  that.$toast({
                    message: that.$t('common.pswError'),
                    position: 'bottom',
                    duration: 3000
                  })
                } else {
                  let eth = this.$sd_eth.fromPrivateForEth(that.$common.privateTest(PRI));
                  that.$common.openDB().then(res => {
                    let select = 'select * from stoneInfo';
                    that.$common.query(select).then(res1 => {
                      let data1 = res1.data;
                      if (data1.length) {
                        that.status = 0;
                        for(let item of data1) {
                          if (item.address === option.address) {
                            that.$common.closeLoad();
                            this.$toast({
                              message: that.$t('wallet.walletExist'),
                              position: 'bottom',
                              duration: 3000
                            });
                            that.importWallet = false;
                            break
                          } else if (item.name === walletName) {
                            that.$common.closeLoad();
                            this.$toast({
                              message: that.$t('wallet.exist'),
                              position: 'bottom',
                              duration: 3000
                            });
                            that.importWallet = false;
                            break
                          } else {
                            let addrList = '';
                            addrList += (item.address + ',');
                            plus.storage.setItem('addrList',addrList);
                          }
                        }
                      } else {
                        that.status = 1;
                        plus.storage.setItem('address',option.address);
                        plus.storage.setItem('keystore',that.param.keystore);
                        plus.storage.setItem('name',walletName);
                        plus.storage.setItem('imported','false');
                        plus.storage.setItem('addrList',option.address);
                        plus.storage.setItem('privateKey',PRI);
                        plus.storage.setItem('ethAddr',eth.address);
                      }
                      if (that.importWallet) {
                        that.Register(option.address,PRI,that.param.keystore,that.param.walletName,eth.address);
                      } else {
                        plus.sqlite.closeDatabase({name: 'stoneApp'});
                      }
                    }).catch(err1 => {
                      that.$toast({
                        message: that.$t('common.system'),
                        position: 'bottom',
                        duration: 3000
                      });
                      plus.sqlite.closeDatabase({name: 'stoneApp'});
                    })
                  }).catch(err => {
                    that.$toast({
                      message: that.$t('common.system'),
                      position: 'bottom',
                      duration: 3000
                    });
                    plus.sqlite.closeDatabase({name: 'stoneApp'});
                  })
                }
              }).catch(err => {
                that.$common.closeLoad();
                that.$toast({
                  message: that.$t('common.pswError'),
                  position: 'bottom',
                  duration: 3000
                });
              })
            }
          } else {
            that.$common.closeLoad();
            this.$toast({
              message: this.$t('wallet.import.keystoreErr'),
              position: 'bottom',
              duration: 3000
            })
          }
        },50)
      },
      Register(addr,secret,key,name,eth) {
        let signStr = (new Date()).getTime() + '5234567ab44c6f3232e6379e8ac62dc6cb43d78923fe96d6467';
        let data = this.getLoginParam(signStr,secret);
        let register = {
          nickname: this.param.nickname,
          invitationCode: this.param.invite,
          str: signStr,
          signature: data,
          // publicKey: data.publicKey,
          ethAddress: eth
        };
        let that = this;
        let str = "insert into stoneInfo (address, keystore, name, str, signature, ethAddr, status) values('"+ addr +"','"+ key +"','"+ name +"','" + signStr +"','" + data + "','" + eth + "'," + that.status +")";
        if (!that.isRegister) {
          this.$axios.post(`${that.$common.URL}/api/exchange/register`, register).then(res => {
            if (res.data.code) {
              this.$messagebox.alert('',{
                title: this.$t('common.tips'),
                message: res.data.message,
                confirmButtonText: this.$t('common.confirm')
              }).then(res => {
                that.$common.closeLoad();
                plus.sqlite.closeDatabase({name: 'stoneApp'});
              })
            } else {
              plus.storage.setItem('str',signStr);
              plus.storage.setItem('signature',JSON.stringify(data));
              that.saveSql(str);
            }
          }).catch(err => {
            this.$toast({
              message: this.$t('common.network'),
              position: 'bottom',
              duration: 3000
            })
          })
        } else {
          plus.storage.setItem('str',signStr);
          plus.storage.setItem('signature',JSON.stringify(data));
          that.saveSql(str);
        }
      },
      getLoginParam(str,secret) {
        let txSigHash = Buffer.from(
          this.$sec.rlphash(str).toString("hex"),
          "hex"
        );
        let signature = this.$sec.ecsign(txSigHash, Buffer.from(secret, "hex"));
        signature.r = signature.r.toString('hex')
        signature.s = signature.s.toString('hex')
        return signature;
      },
      saveSql(sql) {
        let that = this;
        that.$common.query(sql, 1).then(res2 => {
          that.$common.closeLoad();
          that.$messagebox.alert('',{
            title: that.$t('common.tips'),
            message: that.$t('wallet.import.success'),
            confirmButtonText: that.$t('common.confirm')
          }).then(()=>{
            that.$router.push('/?select=asset');
          });
          plus.sqlite.closeDatabase({name: 'stoneApp'});
        }).catch(err2 => {
          that.$common.closeLoad();
          plus.sqlite.closeDatabase({name: 'stoneApp'});
        });
      }
    }
  }
</script>

<style scoped>
  .create #box {
    border-bottom: 1px solid #f6f6f6;
  }

  .create .create-c {
    padding: 0.853333rem 1.0666667rem;
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

  .cc-group .cc-input textarea {
    border: 0;
    outline: 0;
    background-color: transparent;
    width: 100%;
    resize: none;
    font-size: 0.853333rem;
  }

</style>
