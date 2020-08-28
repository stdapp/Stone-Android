<template>
  <div class="invest font-z-16">
    <mt-header :title="$t('home.game.withdraw')" fixed >
      <router-link to="" slot="left">
        <mt-button  icon="back"  @click.native="$router.back(-1)" ></mt-button>
      </router-link>
    </mt-header>
    <div class="box"></div>
    <div class="invest-c">
      <div class="ic-coin ic-b padding-16-20" @click="changeCoin = !changeCoin">
        <div class="ic-t"><span>{{$t('game.withdraw.coin')}}：</span><span>{{selectCoin}}</span></div>
        <div class="arrow ic-arrow" :class="{'ic-arrow-roll' : changeCoin}"></div>
      </div>
      <div class="ic-money">
        <div class="im-input ic-b padding-16-20">
          <div class="im-i">{{$t('game.withdraw.amount')}}：</div>
          <div class="im-ii"><input class="font-z-16" type="number" :placeholder="$t('game.withdraw.min')+min" v-model="amount" @input="getFee"><!--<span class="font-z-14" @click="">全部</span>--></div>
        </div>
        <div class="im-b font-z-12 font-c-666 margin-lr-20" v-if="selectCoin === 'BIU'">{{$t('game.invest.game')}} {{BIUgameAsset}} BIU</div>
        <div class="im-b font-z-12 font-c-666 margin-lr-20" v-if="selectCoin === 'USDT'">{{$t('game.invest.game')}} {{USDTgameAsset}} USDT</div>
      </div>
      <div class="ic-mark ic-b padding-16-20 font-z-16">
        <div class="ic-i">{{$t('game.withdraw.gas')}}：</div>
        <div class="ic-ii" v-if="selectCoin === 'BIU'">{{fee}} BIU</div>
        <div class="ic-ii" v-if="selectCoin === 'USDT'">{{fee}} USDT</div>
      </div>
      <div class="ic-mark ic-b padding-16-20 font-z-16">
        <div class="ic-i">{{$t('game.invest.remark')}}：</div>
        <div class="ic-ii"><input type="text" :placeholder="$t('game.invest.remarkPH')"></div>
      </div>
      <div class="btn-style margin-lr-20" v-if="!canInvest">{{$t('home.game.withdraw')}}</div>
      <div class="btn-style btn-style-click margin-lr-20" v-if="canInvest" @click="cashOut(selectCoin)">{{$t('home.game.withdraw')}}</div>
    </div>
    <mt-actionsheet :actions= "coinSheet" :cancelText="$t('common.cancel')" v-model="changeCoin"></mt-actionsheet>
  </div>
</template>

<script>
  export default {
    name: "Withdraw",
    data() {
      return {
        userToken: '',
        changeCoin: false,
        amount: '',
        coinSheet: [{
          name: 'BIU',
          method: this.chooseBIU
        },{
          name: 'USDT',
          method: this.chooseUSDT
        }],
        selectCoin: 'BIU',
        canInvest: false,
        BIUgameAsset: 0,
        USDTgameAsset: 0,
        gas: {},
        fee: 0,
        BIUtoUsdt: 0,
        min: 0,
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
        this.userToken = plus.storage.getItem('uuid');
        this.GameAssetsToUsd(this.userToken);
        this.getWithdrawInfo();
      }
    },
    mounted() {
    },
    watch: {
      amount(value) {
        console.log(+this.min);
        this.canInvest = (value && value >= +this.min);
      }
    },
    methods: {
      chooseBIU() {
        this.selectCoin = "BIU";
        this.amount = '';
        this.min = this.$common.toDecimalNNoZero(this.gas.minCashOut / this.BIUtoUsdt,4);
      },
      chooseUSDT() {
        this.selectCoin = "USDT";
        this.amount = '';
        this.min = this.gas.minCashOut;
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
      getGas() {
        return this.$axios.post(`${this.$common.URL}/api/game/cashOutFee`)
      },
      getSymbolThumb() {
        return this.$axios({
          url: `${this.$common.ExchangeUrl}/market/symbol-thumb`,
          method: "POST",
        })
      },
      getWithdrawInfo() {
        this.$axios.all([this.getGas(),this.getSymbolThumb()]).then(this.$axios.spread((fee,res) => {
          this.gas = fee.data;
          for (let item of res.data) {
            if (item.symbol === "BIU/USDT") {
              this.BIUtoUsdt = item.close;
              this.min = this.$common.toDecimalNNoZero(this.gas.minCashOut / this.BIUtoUsdt,4);
            }
          }
        }))
      },
      GameAssetsToUsd (uid){
        this.$axios.all([this.getBIUAsset(uid),this.getUSDTAsset(uid)]).then(this.$axios.spread((BIUAsset,USDTAsset) => {
          this.$common.closeLoad();
          let BIU = BIUAsset.data;
          let USDT = USDTAsset.data;
          this.BIUgameAsset = this.$common.toDecimalNNoZero(BIU.balance, 4);
          this.USDTgameAsset = this.$common.toDecimalNNoZero(USDT.balance, 4);
        }));
      },
      cashOut(coin) {
        let ban = coin === 'BIU' ? this.BIUgameAsset : this.USDTgameAsset;
        if (+ban < +this.amount) {
          this.$messagebox.alert('',{
            title: this.$t('common.tips'),
            message: this.$t('game.withdraw.balance'),
            confirmButtonText: this.$t('common.confirm')
          }).then(()=> {
            this.amount = '';
          })
        } else {
          this.$common.openLoad();
          this.$axios({
            url : `${this.$common.URL}/api/exchange/cashOut`,
            method : 'post',
            headers :{
              'access-auth-token': this.userToken
            },
            data: {
              'coinId': coin,
              'amount': this.amount
            }
          }).then(res => {
            this.$common.closeLoad();
            let msg = res.data.code ? res.data.message : this.$t('common.transSendSuccess');
            this.$messagebox.alert('',{
              title: this.$t('common.tips'),
              message: msg,
              confirmButtonText: this.$t('common.confirm')
            }).then(()=> {
              this.amount = '';
            });
          }).catch(err => {
            console.log(err);
          })
        }
      },
      getFee() {
        this.fee = this.selectCoin === 'BIU' ? this.amount * this.gas.BIU : this.amount * this.gas.USDT;
        this.fee = this.$common.toDecimalNNoZero(this.fee);
      }
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

  .invest .ic-usdt .ic-ii {
    width: 75%;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
  }

  .im-input .im-ii {
    width: 70%;
  }

  .im-input input {
    width: 100%;
  }

  .im-input span {

  }

  .ic-money .im-b {
    margin-top: 5px;
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
