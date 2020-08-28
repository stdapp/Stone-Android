<template>
  <div class="transfer">
    <mt-header :title="$t('home.asset.transfer')" fixed >
      <router-link to="" slot="left">
        <mt-button  icon="back"  @click.native="$router.back(-1)" ></mt-button>
      </router-link>
    </mt-header>
    <div class="box"></div>
    <div class="trans-c">
      <div class="tc-g font-z-16">
        <div class="tg-t font-c-666 margin-lr-20">{{$t('trans.collect.coin')}}</div>
        <div class="tg-b tg-choose padding-16-20" @click="changeCoin = !changeCoin">
          <div class="tg-coin">{{selectCoin}}</div>
          <div class="tg-arrow arrow" :class="{ 'tg-arrow-roll' : changeCoin }"></div>
        </div>
      </div>
      <div class="tc-g font-z-16">
        <div class="tg-t font-c-666 margin-lr-20">{{$t('trans.transfer.addr')}}</div>
        <div class="tg-b padding-16-20"><input type="text" :placeholder="$t('trans.transfer.addrPH')" v-model="trans.toAddr"></div>
      </div>
      <div class="tc-g tc-ban font-z-16">
        <div class="tg-t font-c-666 margin-lr-20">
          <div>{{$t('trans.transfer.amount')}}</div>
          <div class="font-c-999 font-z-12" v-if="selectCoin !== 'BIU'">{{$t('trans.transfer.balance')}}：{{balance}}</div>
        </div>
        <div class="tg-b padding-16-20"><input type="number" :placeholder="$t('trans.transfer.amountPH')" v-model="trans.amount"></div>
      </div>
      <div class="tc-g font-z-16" v-if="selectCoin === 'BIU'">
        <div class="tg-t font-c-666 margin-lr-20">Gas Limit</div>
        <div class="tg-b padding-16-20">{{trans.limit}}<!--<input type="text" v-model="trans.limit">--></div>
      </div>
      <div class="tc-g font-z-16"  v-if="selectCoin === 'BIU'">
        <div class="tg-t font-c-666 margin-lr-20">Gas Price</div>
        <div class="tg-b padding-16-20">{{trans.prices}}<!--<input type="text" v-model="trans.prices">--></div>
      </div>
      <div class="btn-style font-z-16 margin-lr-20" v-if="!canTrans">{{$t('home.asset.transfer')}}</div>
      <div class="btn-style btn-style-click font-z-16 margin-lr-20" v-if="canTrans" @click="Transfer">{{$t('home.asset.transfer')}}</div>
    </div>
    <mt-actionsheet :actions= "coinSheet" :cancelText="$t('common.cancel')" v-model="changeCoin"></mt-actionsheet>
  </div>
</template>

<script>
  import BigNumber from 'bignumber.js'
  let fetch = require("node-fetch");
  export default {
    name: "Transfer",
    data() {
      return {
        addr: '',
        keystore: '',
        ethAddr: '',
        usdtObj: '',
        canTrans: false,
        trans: {
          toAddr: '',
          amount: '',
          limit: '0',
          prices: '0',
        },
        changeCoin: false,
        coinSheet: [{
          name: 'USDT',
          method: this.chooseUSDT
        },
        {
          name: 'ETH',
          method: this.chooseETH
        },
        {
          name: 'BIU',
          method: this.chooseBIU
        }],
        selectCoin: 'BIU',
        balance: 0,
        ethBalance: 0,
        nonce: 0,
      }
    },
    created() {
      this.$common.openLoad();
      this.addr = plus.storage.getItem('address');
      this.keystore = plus.storage.getItem('keystore');
      this.ethAddr = plus.storage.getItem('ethAddr');
      this.getBIUBalance();
      this.getBIUNonce();
    },
    mounted() {
    },
    watch: {
      trans: {
        deep: true,
        handler (nVal, oVal) {
          this.canTrans = (this.trans.toAddr && this.trans.amount > 0 && this.trans.prices && this.trans.limit)
        }
      }
    },
    methods: {
      chooseUSDT() {
        this.$common.openLoad();
        this.selectCoin = "USDT";
        this.getUSDTBalance();
      },
      chooseBIU() {
        this.$common.openLoad();
        this.selectCoin = "BIU";
        this.getBIUBalance();
      },
      chooseETH() {
        this.$common.openLoad();
        this.selectCoin = "ETH";
        this.getUSDTBalance();
      },
      getBIUNonce() {
        let nonceData = {
          jsonrpc: "2.0",
          id: "1",
          method: "sec_getNonce",
          params: [this.addr],
        };
        this.$axios.post(`${this.$common.URL}/api/game/proxy`, {
          method: "post",
          body: JSON.stringify(nonceData), // request is a string
          headers: {
            "content-type": "application/json",
          }
        })
          .then(result => {
            this.nonce = result.data.result.Nonce
          })
          .catch(err => {
            console.log(err);
          })
      },
      getUSDTBalance() {
        let param = {
          address: this.ethAddr
        };
        this.$axios.post(`${this.$common.URL}/api/eth/info`,param).then(res => {
          this.$common.closeLoad();
          this.usdtObj = res.data;
          this.balance = this.selectCoin === 'USDT' ? this.$common.toDecimalNNoZero(+res.data.balance,4) : this.$common.toDecimalNNoZero(+res.data.ethBalance,4);
        }).catch(err => {
          this.$common.closeLoad();
          this.$toast({
            message: this.$t('common.network'),
            position: 'bottom',
            duration: 3000
          })
        })
      },
      getBIUBalance() {
        let Data = {
          jsonrpc: "2.0",
          id: "1",
          method: "sec_getBalance",
          params: [this.addr],
        };
        this.$axios.post(`${this.$common.URL}/api/game/proxy`, {
          method: "post",
          mode: "cors",
          body: JSON.stringify(Data), // request is a string
          headers: {
            "content-type": "application/json",
          },
        })
          .then(result => {
            this.$common.closeLoad();
            this.balance = this.$common.toDecimalNNoZero(result.data.result.value,4);
          })
      },
      Transfer() {
        let that = this;
        let option = JSON.parse(that.keystore);
        if (+that.trans.amount > +that.balance) {
          that.$toast({
            message: this.$t('trans.transfer.exceeds'),
            position: 'bottom',
            duration: 3000
          });
        } else {
          that.$messagebox.prompt(' ',that.$t('common.pswPH'),{inputPlaceholder:that.$t('common.pswPH'),inputType:'password'}).then(res => {
            that.$common.openLoad();
            let psw = res.value;
            setTimeout(()=> {
              wal.decodeFromOption(option, psw).then(res => {
                if (res === 'error') {
                  that.$common.closeLoad();
                  that.$toast({
                    message: that.$t('common.pswError'),
                    position: 'bottom',
                    duration: 3000
                  });
                } else {
                  if (that.selectCoin === 'BIU') {//BIU 交易
                    const transfer = {
                      timeStamp: new Date().getTime(),
                      walletAddress: that.addr,
                      sendToAddress: that.trans.toAddr,
                      amount: that.trans.amount,
                      txFee: '0.01',
                      gasLimit: "0",
                      gas: "0",
                      gasPrice: "0",
                      data: "",
                      nonce: this.nonce,
                      inputData: '备注消息',
                      chainName: "SEN",
                    };
                    let signature = that.signedTx(res,transfer);
                    let postData = {
                      method: "sec_sendRawTransaction",
                      id: "1",
                      jsonrpc: "2.0",
                      params: signature,
                    };
                    that.$axios.post(`${this.$common.URL}/api/game/proxy`, {
                      method: "post",
                      body: JSON.stringify(postData), // request is a string
                      headers: {
                        "content-type": "application/json"
                      }
                    })
                      .then(result => {
                        let res = result.data.result;
                        let msg = '';
                        msg = res.info === 'OK'?  that.$t('common.transSendSuccess') : res.info;
                        this.$messagebox.alert('',{
                          title: this.$t('common.tips'),
                          message: msg,
                          confirmButtonText: this.$t('common.confirm')
                        }).then(res => {
                          that.$common.closeLoad();
                          that.trans.amount = '';
                          that.trans.toAddr = '';
                        })
                    }).catch(err => {
                      console.log(err);
                    })
                  } else { //eth usdt 交易
                    let param = that.usdtObj;
                    param.toAddress = that.trans.toAddr;
                    param.amount = that.trans.amount;
                    param.account = {
                      address: that.ethAddr,
                      privateKey: that.$common.privateTest(res)
                    };
                    let str = that.selectCoin === 'USDT' ? that.$sd_eth.signTransferToken(param) : that.$sd_eth.signTransferEth(param);
                    that.$axios.post(`${that.$common.URL}/api/eth/sendSignedTransaction`,{signStr:str}).then(res => {
                      let msg = '';
                      msg = res.data.code ? res.data.message : that.$t('common.transSendSuccess');
                      that.$messagebox.alert('',{
                        title: that.$t('common.tips'),
                        message: msg,
                        confirmButtonText: that.$t('common.confirm')
                      }).then(res => {
                        that.$common.closeLoad();
                        that.trans.amount = '';
                        that.trans.toAddr = '';
                      });
                    })
                  }
                }
              }).catch(err => {
                that.$common.closeLoad();
              })
            },50)
          }).catch(err => {
            console.log(err);
          })
        }
      },
      signedTx(privateKey, transfer) {
        let timeStamp = new Date().getTime();
        let transferData = [
          {
            timestamp: timeStamp,
            from: transfer.walletAddress,
            to: transfer.sendToAddress,
            value: transfer.amount,
            txFee: transfer.txFee,
            nonce: transfer.nonce,
            gasLimit: "0",
            gas: "0",
            gasPrice: "0",
            data: "",
            inputData: transfer.inputData,
            chainName: transfer.chainName,
          },
        ];
        const tokenTxBuffer = [
          this.$sec.bufferToInt(transferData[0].timestamp),
          Buffer.from(transferData[0].from, "hex"),
          Buffer.from(transferData[0].to, "hex"),
          Buffer.from(transferData[0].value),
          Buffer.from(transferData[0].gasLimit),
          Buffer.from(transferData[0].gas),
          Buffer.from(transferData[0].gasPrice),
          Buffer.from(transferData[0].nonce),
          Buffer.from(transferData[0].inputData),
          Buffer.from(transferData[0].chainName),
        ];
        let txSigHash = Buffer.from(
          this.$sec.rlphash(tokenTxBuffer).toString("hex"),
          "hex"
        );
        let signature = this.$sec.ecsign(txSigHash, Buffer.from(privateKey, "hex"));
        transferData[0].data = {
          v: signature.v,
          r: signature.r.toString("hex"),
          s: signature.s.toString("hex"),
        };
        return transferData;
      },
      test() {
        setTimeout(()=> {
          let addr = wal.addressFromPrivateKey(walletPrivate);
          let param = {
            address: addr
          };
          if (!walletName) {
            closeLoad();
            this.$toast({
              message: this.$t('message.null'),
              position: 'bottom',
              duration: 3000
            })
          } else if (walletName.length > 20) {
            closeLoad();
            this.$toast({
              message: this.$t('message.nameErr'),
              position: 'bottom',
              duration: 3000
            });
          } else if (walletName === plus.storage.getItem('name')) {
            closeLoad();
            this.$toast({
              message: this.$t('message.taken'),
              position: 'bottom',
              duration: 3000
            })
          } else if (pswTest(that.wallet.wPsw)) {
            closeLoad();
            this.$toast({
              message: this.$t('message.pswFormat'),
              position: 'bottom',
              duration: 3000
            })
          } else if (!addr) {
            closeLoad();
            that.$toast({
              message: this.$t('message.private'),
              position: 'bottom',
              duration: 3000
            })
          } else if (addr === plus.storage.getItem('address')) {
            closeLoad();
            that.$toast({
              message: this.$t('message.exist'),
              position: 'bottom',
              duration: 3000
            })
          } else if (that.wallet.wPsw !== that.wallet.wrePsw) {
            closeLoad();
            that.$toast({
              message: this.$t('message.inconsistent'),
              position: 'bottom',
              duration: 3000
            })
          } else {
            let newKey = wal.makeWalletByPrivate(that.priKey, that.psw.newPsw);
            newKey = JSON.stringify(newKey);
            let sql = "select * from walletInfo where keystore = '" + that.mdfKey + "'";
            let sql2 = "update walletInfo set keystore = '" + newKey +"' where keystore = '"+ that.mdfKey +"'";
            openDB().then(res => {
              query(sql).then(res1 => {
                if (res1.data[0].status === 1) {
                  plus.storage.setItem('keystore',newKey)
                }
                query(sql2,1).then(res2 => {
                  closeLoad();
                  plus.sqlite.closeDatabase({name: 'wallet'});
                  that.$messagebox.alert('',{
                    title: that.$t('message.tips'),
                    message: that.$t('modify.success'),
                    confirmButtonText: that.$t('message.confirm')
                  }).then(()=>{
                    that.$router.go(-1);
                  });
                }).catch(err2 => {
                  closeLoad();
                  that.$toast({
                    message: that.$t('message.sysErr'),
                    position: 'bottom',
                    duration: 3000
                  });
                  plus.sqlite.closeDatabase({name: 'wallet'});
                })
              }).catch(err1 => {
                closeLoad();
                that.$toast({
                  message: that.$t('message.sysErr'),
                  position: 'bottom',
                  duration: 3000
                });
                plus.sqlite.closeDatabase({name: 'wallet'});
              })
            }).catch(err => {
              closeLoad();
              that.$toast({
                message: that.$t('message.sysErr'),
                position: 'bottom',
                duration: 3000
              });
              plus.sqlite.closeDatabase({name: 'wallet'});
            })
          }
        },50)
      }
    }
  }
</script>

<style scoped>
  .transfer {
    min-height: 100%;
    background-color: #fafafa;
  }

  .transfer .trans-c {
    padding-bottom: 2.56rem;
  }

  .transfer .trans-c .tc-g {
    padding-top: 0.8533333rem;
  }

  .trans-c .tc-g .tg-t {
    margin-bottom: 8px;
  }

  .trans-c .tc-g .tg-b {
    background-color: #fff;
  }

  .tc-g .tg-b input {
    width: 100%;
    font-size: 0.853333rem;
  }

  .trans-c .tg-choose {
    position: relative;
  }

  .trans-c .tg-choose .tg-arrow {
    width: 1.066667rem;
    height: 1.0666667rem;
    background: url("../../assets/arrow-down.png") no-repeat center/contain;
    transition: all 0.3s;
  }

  .tg-choose .tg-arrow-roll {
    transform: rotate(180deg) translateY(50%);
  }

  .trans-c .tc-ban .tg-t {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .trans-c .btn-style {
    margin-top: 2.56rem;
  }


</style>
