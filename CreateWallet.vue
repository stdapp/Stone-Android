<template>
  <div class="create">
    <mt-header :title="$t('home.asset.createWallet')" fixed >
      <router-link to="" slot="left">
        <mt-button  icon="back"  @click.native="$router.back(-1)" ></mt-button>
      </router-link>
    </mt-header>
    <div class="box"></div>
    <div class="create-c">
      <div class="cc-tip font-z-16 font-c-666"><span>{{$t('wallet.create.remember')}}</span></div>
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
      <div class="cc-group">
        <div class="cc-gt font-z-16 font-c-666">{{$t('wallet.rePsw')}}</div>
        <div class="cc-input"><input class="font-z-16" type="password" :placeholder="$t('wallet.pswPH')" v-model="param.rePsw"></div>
      </div>
      <div class="cc-group">
        <div class="cc-gt font-z-16 font-c-666">{{$t('wallet.nickname')}}</div>
        <div class="cc-input"><input class="font-z-16" type="text" :placeholder="$t('wallet.nicknamePH')" v-model="param.nickname"></div>
      </div>
      <div class="cc-group">
        <div class="cc-gt font-z-16 font-c-666">{{$t('wallet.invite')}}</div>
        <div class="cc-input"><input class="font-z-16" type="text" :placeholder="$t('wallet.invitePH')" v-model="param.invite"></div>
      </div>
      <div class="btn-style font-z-16" v-if="!isImport"><span>{{$t('home.asset.createWallet')}}</span></div>
      <div class="btn-style font-z-16" v-if="isImport" :class="{'btn-style-click':isImport}" @click="createWallet"><span>{{$t('home.asset.createWallet')}}</span></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CreateWallet",
    data() {
      return {
        param: {
          walletName: '',
          nickname: '',
          invite: '',
          psw: '',
          rePsw: ''
        },
        isImport: false,
        importWallet: true,
        status: ''
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
          this.isImport = (this.param.walletName && this.param.nickname && this.param.invite && this.param.psw && this.param.psw === this.param.rePsw)
        }
      }
    },
    methods: {
      createWallet () {
        this.$common.openLoad();
        let that = this;
        let walletName = that.param.walletName.trim();
        setTimeout(() => {
          if (!walletName) {
            that.$common.closeLoad();
            that.param.walletName = '';
            this.$toast({
              message: this.$t('wallet.nameNotNull'),
              position: 'bottom',
              duration: 3000
            })
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
          } else if (that.$common.pswTest(that.param.psw)) {
            that.param.psw = '';
            that.param.rePsw = '';
            that.$common.closeLoad();
            this.$toast({
              message: this.$t('wallet.pswFormat'),
              position: 'bottom',
              duration: 3000
            })
          } else if (that.param.psw !== that.param.rePsw) {
            that.$common.closeLoad();
            this.$toast({
              message: this.$t('wallet.pswNotSame'),
              position: 'bottom',
              duration: 3000
            })
          } else {
            let file = wal.makeWalletAccount(that.param.psw);
            // let addr = file.json.address;
            let addr = that.$sec.privateToAddress(Buffer.from(file.privateKey,'hex')).toString('hex');
            let keystore = JSON.stringify(file.json);
            let eth = this.$sd_eth.fromPrivateForEth(that.$common.privateTest(file.privateKey));
            that.$common.openDB().then(res => {
              let select = 'select * from stoneInfo';
              that.$common.query(select).then(res1 => {
                let data1 = res1.data;
                if (data1.length) {
                  that.status = 0;
                  for(let item of data1) {
                    if (item.name === walletName) {
                      that.$common.closeLoad();
                      this.$toast({
                        message: this.$t('wallet.exist'),
                        position: 'bottom',
                        duration: 3000
                      });
                      that.import = false;
                      break;
                    } else {
                      let addrList = '';
                      addrList += (item.address + ',');
                      plus.storage.setItem('addrList',addrList);
                    }
                  }
                } else {
                  that.status = 1;
                  plus.storage.setItem('address',addr);
                  plus.storage.setItem('keystore',keystore);
                  plus.storage.setItem('name',walletName);
                  plus.storage.setItem('imported','false');
                  plus.storage.setItem('addrList',addr);
                  plus.storage.setItem('privateKey',file.privateKey);
                  plus.storage.setItem('ethAddr',eth.address);
                }
                if (this.importWallet) {
                  that.Register(addr,file.privateKey,keystore,walletName,eth.address);
                } else {
                  plus.sqlite.closeDatabase({name: 'stoneApp'});
                }
              }).catch(err2 =>{
                plus.sqlite.closeDatabase({name: 'stoneApp'});
                that.$common.closeLoad();
                this.$toast({
                  message: this.$t('common.system'),
                  position: 'bottom',
                  duration: 3000
                });
              })
            }).catch(err1 => {
              plus.sqlite.closeDatabase({name: 'stoneApp'});
              that.$common.closeLoad();
              this.$toast({
                message: this.$t('common.system'),
                position: 'bottom',
                duration: 3000
              })
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
        this.$axios.post(`${that.$common.URL}/api/exchange/register`, register).then(res => {
          console.log(res);
          if (!res.data.code) {
            plus.storage.setItem('str',signStr);
            plus.storage.setItem('signature',JSON.stringify(data));
            let str = "insert into stoneInfo (address, keystore, name, str, signature, ethAddr, status) values('"+ addr +"','"+ key +"','"+ name +"','" + signStr +"','" + data + "','" + eth + "'," + that.status +")";
            that.$common.query(str, 1).then(res2 => {
              that.$common.closeLoad();
              that.$messagebox.alert('',{
                title: that.$t('common.tips'),
                message: that.$t('wallet.create.success'),
                confirmButtonText: that.$t('common.confirm')
              }).then(()=>{
                that.$router.push('/create/createBakeUp');
              });
              plus.sqlite.closeDatabase({name: 'stoneApp'});
            }).catch(err2 => {
              that.$common.closeLoad();
              plus.sqlite.closeDatabase({name: 'stoneApp'});
            })
          } else {
            that.$messagebox.alert('',{
              title: that.$t('common.tips'),
              message: res.data.message,
              confirmButtonText: that.$t('common.confirm')
            });
            that.$common.closeLoad();
            plus.sqlite.closeDatabase({name: 'stoneApp'});
          }
        }).catch(err => {
          this.$toast({
            message: this.$t('common.network'),
            position: 'bottom',
            duration: 3000
          })
        })
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
    }
  }
</script>

<style scoped>
  .create #box {
    border-bottom: 1px solid #f6f6f6;
  }

  .create .create-c {
    padding: 0.853333rem 1.0666667rem 2.56rem;
  }

  .create-c .cc-group {
    margin-top: 1.28rem;
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
