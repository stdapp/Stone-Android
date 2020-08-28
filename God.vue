<template>
  <div class="god">
    <mt-header :title="$t('game.god.lock')" fixed >
      <router-link to="" slot="left">
        <mt-button  icon="back"  @click.native="$router.back(-1)" ></mt-button>
      </router-link>
      <router-link to="/game/godrule" slot="right">
        <mt-button>{{$t('game.god.rule')}}</mt-button>
      </router-link>
    </mt-header>
    <div class="box"></div>
    <div class="god-c">
      <div class="gc-buy">
        <div class="gb-t font-z-18 font-w-500">
          <div class="gbt-i">{{$t('game.god.god')}}</div>
          <div class="gbt-ii">{{$t('game.god.godLock')}} {{godLock}} BIU</div>
        </div>
        <div class="gb-tip font-z-14 font-c-666">{{$t('game.god.godRate1')}} <span class="font-z-18 font-w-500" style="color: #30b883">{{godRate}}</span> {{$t('game.god.godRate2')}}</div>
        <div class="gb-f">
          <div class="gbf-i font-z-14 font-c-666">{{$t('game.god.left1')}} <span class="font-z-18 font-w-500" style="color: #30b883">{{left}}</span> {{$t('game.god.left2')}}</div>
          <div class="gbf-ii" @click="toBeGod">{{$t('game.god.buy')}}</div>
        </div>
      </div>
      <div class="gc-line"></div>
      <div class="gc-list">
        <div class="gl-t font-z-18 font-w-500">{{$t('game.god.record')}}</div>
        <div class="gl-c" v-if="godList.length">
          <div class="gl-b" v-for="(item,index) in godList" :key="index">
            <div class="gb-l">
              <div class="gbl-i font-z-16">{{$t('game.god.done')}}</div>
              <div class="gbl-ii font-z-12 font-c-999">{{item.createTime}}</div>
            </div>
            <div class="gb-r">
              <div class="gbl-i font-z-16">{{item.amount}} USDT</div>
              <div class="gbl-ii font-z-12 font-c-999">≈$ {{item.usd}}</div>
            </div>
          </div>
        </div>
        <div class="no-data" v-if="!godList.length">
          <img src="../../assets/nodata.png" alt="">
          <div class="data-t"><span>{{$t('common.nodata')}}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { v1 as uuidv1 } from 'uuid';
  export default {
    name: "God",
    data() {
      return {
        userToken: '',
        godLock: 0,
        godRate: '40%',
        left: 0,
        BIUBalance: 0,
        godList: []
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
        this.userToken = plus.storage.getItem('uuid'); //'d226d480-dc61-11ea-975c-e55329365cd6'
        this.getGod();
        this.getBIUBalance();
      }

    },
    mounted() {
    },
    methods: {
      getUsdToCNY() {
        return this.$axios.post(`${this.$common.ExchangeUrl}/market/exchange-rate/usd-cny`)
      },
      getGodInfo() {
        return this.$axios({
          url : `${this.$common.URL}/api/game/genesisGodRecord`,
          method : 'post',
          headers :{
            'access-auth-token': this.userToken
          },
          data: {
            'pageNo': 1,
            'pageSize': 9999,
          }
        })
      },
      getGod() {
        this.$axios.all([this.getUsdToCNY(),this.getGodInfo()]).then(this.$axios.spread((cny,god) => {
          this.$common.closeLoad();
          console.log(cny.data);
          console.log(god.data);
          let usdToCny = cny.data.data;
          this.godLock = god.data.needSDAmount;
          this.left = god.data.surplus;
          this.godList = god.data.list;
          for (let i of this.godList) {
            i.usd = this.$common.toDecimalNNoZero(i.amount*0.1/usdToCny,4);
            i.amount = this.$common.toDecimalNNoZero(i.amount,4);
            i.createTime = this.$moment(i.createTime).format('YYYY-MM-DD  HH:mm:ss');
          }
        }))
      },
      getBIUBalance() {
        this.$axios({
          url : `${this.$common.URL}/api/exchange/getBalanceByCoinId`,
          method : 'post',
          headers :{
            'access-auth-token': this.userToken
          },
          data: {
            'coinId': 'BIU'
          }
        }).then(res => {
          this.BIUBalance = res.data.balance;
        })
      },
      toBeGod() {
        this.$common.openLoad();
        if (this.BIUBalance < this.godLock) {
          this.$common.closeLoad();
          this.$toast({
            message: this.$t('common.balance'),
            position: 'bottom',
            duration: 3000
          })
        } else {
          this.$axios({
            url : `${this.$common.URL}/api/exchange/becomeGenesisGod`,
            method : 'post',
            headers :{
              'access-auth-token': this.userToken
            }
          }).then(res => {
            let msg = res.data.code ? res.data.message : this.$t('common.success');
            this.$messagebox.alert('',{
              title: this.$t('common.tips'),
              message: msg,
              confirmButtonText: this.$t('common.confirm')
            }).then(() => {
              this.getGod();
              this.getBIUBalance();
            })
          })
        }
      }
    }
  }
</script>

<style scoped>
  .god .god-c .gc-buy {
    padding: 1.0666667rem;
  }

  .gc-buy .gb-t {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .gc-buy .gb-tip {
    margin-bottom: 12px;
  }

  .gc-buy .gb-f {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .gc-buy .gb-f .gbf-ii {
    padding: 5px 2rem;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    border-radius: 100px;
    background-color: #631CEF;
  }

  .god-c .gc-line {
    width: 100%;
    height: 12px;
    background-color: #fafafa;
  }

  .god-c .gc-list {
    padding: 1.0666667rem;
  }

  .gc-list .gl-t {
    margin-bottom: 5px;
  }

  .gc-list .gl-c .gl-b {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.64rem 0;
    border-bottom: 1px solid #f2f2f2;
  }

  .gc-list .gl-b .gbl-i {
    margin-bottom: 5px;
  }

  .gc-list .gl-b .gb-r {
    text-align: right;
  }
</style>
