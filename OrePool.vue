<template>
  <div class="ore-pool">
    <mt-header :title="$t('home.game.pool')" fixed >
      <router-link to="/?select=game" slot="left">
        <mt-button icon="back" ></mt-button>
      </router-link>
    </mt-header>
    <div class="box"></div>
    <div class="op-c">
      <div class="opc-asset">
        <div class="opa-ban">
          <div class="opb-i font-z-14">{{$t('game.orePool.balance')}} (BIU)</div>
          <div class="opb-ii font-z-28 font-w-500">{{poolAsset}}</div>
        </div>
        <div class="opa-ratio">
          <div class="opr-t">
            <div class="opt-i font-z-12">{{$t('game.orePool.releaseTotal')}}</div>
            <div class="opt-ii font-z-14 font-w-500">{{poolRelease}} BIU</div>
          </div>
          <div class="opr-t">
            <div class="opt-i font-z-12">{{$t('game.orePool.releaseRate')}}</div>
            <div class="opt-ii font-z-14 font-w-500">{{poolRate}}</div>
          </div>
        </div>
      </div>
      <div class="opc-record">
        <div class="opr-t font-z-18 font-w-500">{{$t('game.orePool.record')}}</div>
        <div class="opr-list" v-if="poolList.length">
          <div class="opl-b" v-for="(item,index) in poolList" :key="index">
            <div class="opl-l">
              <div class="opl-i font-z-14">{{$t('game.orePool.released')}}</div>
              <div class="opl-ii font-z-12 font-c-999">{{item.releaseTime}}</div>
            </div>
            <div class="opl-r">
              <div class="opl-i font-z-14">{{item.amount}} BIU</div>
<!--              <div class="opl-ii font-z-12 font-c-999">≈$ {{item.road}}</div>-->
            </div>
          </div>
        </div>
        <div class="no-data" v-if="!poolList.length">
          <img src="../../assets/nodata.png" alt="">
          <div class="data-t"><span>{{$t('common.nodata')}}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "OrePool",
    data() {
      return {
        uuid: '',
        poolList: [],
        poolAsset: '',
        poolRelease: '',
        poolRate: 0,
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
        this.uuid = plus.storage.getItem('uuid');
      }
    },
    mounted() {
      this.getOrePool();
    },
    methods: {
      getOrePool() {
        this.$axios({
          url : `${this.$common.URL}/api/game/pool`,
          method : 'post',
          headers :{
            'access-auth-token': this.uuid
          },
          data: {
            'pageNo': 1,
            'pageSize': 9999,
          }
        }).then( res => {
          this.$common.closeLoad();
          let data = res.data;
          this.poolAsset = this.$common.toDecimalNNoZero(data.balance,4);
          this.poolRelease = this.$common.toDecimalNNoZero(data.releaseAmount,4);
          this.poolList = res.data.list;
          if (data.balance === 0 ) {
            this.poolRate = 0;
          } else if (data.releaseAmount === 0) {
            this.poolRate = 0;
          } else {
            this.poolRate = data.releaseAmount/(data.releaseAmount+data.balance) * 100;
            this.poolRate = this.$common.toDecimalNNoZero(this.poolRate,2) + '%';
          }
          for (let i of this.poolList) {
            i.amount = this.$common.toDecimalNNoZero(i.amount,4);
            i.releaseTime = this.$moment(i.releaseTime).format('YYYY-MM-DD  HH:mm:ss');
            // i.road = this.$common.toDecimalNNoZero(roadPrice * i.amount,2);
          }
        })
      },
      getUSDTBalance() {
        let param = {
          address: this.ethAddr
        };
        return this.$axios.post(`${this.$common.URL}/api/eth/info`,param)
      },
      getTokenList() {
        let source = {address:this.IntAddr,pageSize:10000,source:'wallet'};
        return this.$axios.get('https://explorer.intchain.io/api/wallet/walletList',{params:source})
      },
      getUsdToCNY() {
        return this.$axios.post(`${this.$common.ExchangeUrl}/market/exchange-rate/usd-cny`)
      },
      getSDAsset (uid) {
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
      getSDYAsset (uid) {
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
      getSDPrice() {
        return this.$axios.post(`${this.$common.ExchangeUrl}/market/symbol-thumb`)
      }
    }
  }
</script>

<style scoped>
  .ore-pool {
    padding-bottom: 2.56rem;
  }

  .ore-pool .opc-asset {
    padding: 1.28rem 1.066667rem;
    color: #ffffff;
    background-image: linear-gradient( to right,#8C53FC, #631CEF);
  }

  .opc-asset .opa-ban {
    margin-bottom: 1.28rem;
  }

  .opc-asset .opa-ban .opb-i {
    margin-bottom: 5px;
  }

  .opc-asset .opa-ratio {
    display: flex;
    align-items: center;
  }

  .opc-asset .opa-ratio .opr-t:first-of-type {
    width: 60%;
  }

  .op-c .opc-record {
    margin: 1.493333rem 1.0666667rem 0;
  }

  .opc-record .opr-list .opl-b {
    padding: 0.64rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f2f2f2;
  }

  .opr-list .opl-b .opl-r {
    text-align: right;
  }

  .opr-list .opl-b .opl-i {
    margin-bottom: 4px;
  }

</style>
