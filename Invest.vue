<template>
  <div class="invest font-z-16">
    <mt-header :title="$t('home.game.invest')" fixed >
      <router-link to="" slot="left">
        <mt-button  icon="back"  @click.native="$router.back(-1)" ></mt-button>
      </router-link>
    </mt-header>
    <div class="box"></div>
    <div class="invest-c">
      <div class="ic-coin ic-b padding-16-20" @click="changeCoin = !changeCoin">
        <div class="ic-t"><span>{{$t('game.invest.coin')}}：</span><span>{{selectCoin}}</span></div>
        <div class="arrow ic-arrow" :class="{'ic-arrow-roll' : changeCoin}"></div>
      </div>
      <div class="ic-money">
        <div class="im-input ic-b padding-16-20">
          <input class="font-z-16" type="number" :placeholder="$t('game.invest.investPH')" v-model="amount"><!--<span class="font-z-14" @click="">全部</span>-->
        </div>
        <div style="display:flex;justify-content:space-between;align-items: center;margin-top: 5px;">
          <div class="font-z-12 font-c-666 margin-lr-20" v-if="selectCoin === 'BIU'">{{$t('trans.transfer.balance')}} {{balance}} BIU</div>
          <div class="font-z-12 font-c-666 margin-lr-20" v-if="selectCoin === 'USDT'">{{$t('trans.transfer.balance')}} {{balance}} USDT</div>
          <div class="font-z-12 font-c-666 margin-lr-20" v-if="selectCoin === 'BIU'">{{$t('game.invest.game')}} {{BIUGameAsset}} BIU</div>
          <div class="font-z-12 font-c-666 margin-lr-20" v-if="selectCoin === 'USDT'">{{$t('game.invest.game')}} {{USDTGameAsset}} USDT</div>
        </div>
      </div>
      <div class="ic-mark ic-b padding-16-20 font-z-16">
        <div class="ic-i">{{$t('game.invest.remark')}}：</div>
        <div class="ic-ii"><input type="text" :placeholder="$t('game.invest.remarkPH')"></div>
      </div>
      <div class="btn-style margin-lr-20" v-if="!canInvest">{{$t('home.game.invest')}}</div>
      <div class="btn-style btn-style-click margin-lr-20" v-if="canInvest" @click="Invest">{{$t('home.game.invest')}}</div>
    </div>
    <mt-actionsheet :actions= "coinSheet" :cancelText="$t('common.cancel')" v-model="changeCoin"></mt-actionsheet>
  </div>
</template>

<script>
  import fetch from 'node-fetch'
  import BigNumber from 'bignumber.js'
  export default {
    name: "Invest",
    data() {
      return {
        userToken: '',
        changeCoin: false,
        addr: '',
        keystore: '',
        ethAddr: '',
        toAddr: 'ecf67827a7ebf30601b65a06f9b32b8ad5d149d3',
        amount: '',
        coinSheet: [{
          name: 'BIU',
          method: this.chooseBIU
        },
          {
          name: 'USDT',
          method: this.chooseUSDT
        }],
        selectCoin: 'BIU',
        usdtToBIUPrice: 0,
        balance: 0,
        usdtObj: '',
        canInvest: false,
        BIUGameAsset: 0,
        USDTGameAsset: 0,
        nonce: 0,
      }
    },
    created() {
      if (plus.storage.getItem('imported') === 'true') {
        this.$messagebox.alert('',{
          title: this.$t('common.tips'),
          message: this.$t('common.first'),
          confirmButtonText: this.$t('common.confirm')
        }).then(()=>{
          this.$router.push('/?select=asset');
        });
      } else {
        this.$common.openLoad();
        this.userToken = plus.storage.getItem('uuid');//81966cb6-9219-47fb-a3e1-ffcfa679d802
        this.addr = plus.storage.getItem('address');
        this.keystore = plus.storage.getItem('keystore');
        this.ethAddr = plus.storage.getItem('ethAddr');
        this.getBIUBalance();
        this.getBIUNonce();
        this.GameAssetsToUsd(this.userToken);
      }
    },
    mounted() {
    },
    watch: {
      amount(value) {
        this.canInvest = (value && value > 0);
      }
    },
    methods: {
      chooseBIU() {
        this.$common.openLoad();
        this.selectCoin = "BIU";
        this.amount = '';
        this.getBIUBalance();
      },
      chooseUSDT() {
        this.$common.openLoad();
        this.selectCoin = "USDT";
        this.amount = '';
        this.getUSDTBalance();
      },
      getUSDTBalance() {
        let param = {
          address: this.ethAddr
        };
        this.$axios.post(`${this.$common.URL}/api/eth/info`,param).then(res => {
          this.$common.closeLoad();
          this.usdtObj = res.data;
          this.balance = this.$common.toDecimalNNoZero(+res.data.balance,4);
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
            "content-type": "application/json"
          },
        })
        .then(result => {
          this.$common.closeLoad();
          this.balance = this.$common.toDecimalNNoZero(result.data.result.value,4);
        })
      },
      Invest() {
        let that = this;
        let option = JSON.parse(that.keystore);
        if (+that.amount > +that.balance) {
          that.$toast({
            message: that.$t('game.invest.investLimit'),
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
                      sendToAddress: that.toAddr,
                      amount: that.amount,
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
                          that.amount = '';
                        })
                      }).catch(err => {
                      console.log(err);
                    })
                  } else {
                    let param = that.usdtObj;
                    param.amount = that.amount;
                    param.account = {
                      address: that.ethAddr,
                      privateKey: that.$common.privateTest(res)
                    };
                    let str = that.$sd_eth.signTransferToken(param);
                    that.$axios.post(`${this.$common.URL}/api/eth/sendSignedTransaction`,{signStr:str}).then(res => {
                      let msg = '';
                      msg = res.data.code ? res.data.message : that.$t('common.transSendSuccess');
                      that.$messagebox.alert('',{
                        title: that.$t('common.tips'),
                        message: msg,
                        confirmButtonText: that.$t('common.confirm')
                      }).then(res => {
                        that.$common.closeLoad();
                        that.amount = '';
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
      getBIUAsset (uid) {
        return this.$axios({
          url : `${this.$common.URL}/api/exchange/getBalanceByCoinId`,
          method : 'post',
          headers :{
            'access-auth-token': uid
          },
          data: {
            'coinId': 'BIU'
          }
        })
      },
      getUSDTAsset (uid) {
        return this.$axios({
          url : `${this.$common.URL}/api/exchange/getBalanceByCoinId`,
          method : 'post',
          headers :{
            'access-auth-token': uid
          },
          data: {
            'coinId': 'USDT'
          }
        })
      },
      GameAssetsToUsd (uid){
        this.$axios.all([this.getBIUAsset(uid),this.getUSDTAsset(uid)]).then(this.$axios.spread((BIUAsset,USDTAsset) => {
          let BIU = BIUAsset.data;
          let USDT = USDTAsset.data;
          this.BIUGameAsset = this.$common.toDecimalNNoZero(BIU.balance,4);
          this.USDTGameAsset = this.$common.toDecimalNNoZero(USDT.balance,4)
        }));
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
    }
  }
</script>

<style scoped>
  .padding-16-20 {
    padding: 0.853333rem 1.066667rem;
  }

  .invest {
    min-height: 100%;
    background-color: #fafafa;
  }

  .invest .ic-b {
    margin-top: 0.85333rem;
    background-color: #fff;
  }

  .ic-coin {
    position: relative;
  }

  .ic-coin .ic-arrow {
    width: 1.066667rem;
    height: 1.0666667rem;
    background: url("../../assets/arrow-down.png") center/contain;
    transition: all 0.3s;
  }

  .ic-coin .ic-arrow-roll {
    transform: rotate(180deg) translateY(50%);
  }

  .ic-money .im-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .im-input input {
    width: 90%;
  }

  .im-input span {
    color: #631CEF;
  }

  .ic-money .im-b {
    text-align: right;
  }

  .invest-c .ic-ban .ib-c {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.066667rem;
    margin-top: 0.8533333rem;
  }

  .invest-c .ic-ban .ic-b {
    margin-top: 5px;
  }

  .invest-c .ic-ban .ib-b {
    text-align: right;
    margin-top: 5px;
  }

  .invest-c .ic-mark {
    display: flex;
    align-items: center;
  }

  .ic-mark .ic-ii {
    width: 60%;
  }

  .ic-mark .ic-ii input {
    font-size: 0.853333rem;
  }

  .invest-c .btn-style {
    margin-top: 2.56rem;
  }

</style>
