<template>
  <div class="record">
    <mt-header :title="$t('game.invite.record')" fixed >
      <router-link to="" slot="left">
        <mt-button  icon="back"  @click.native="$router.back(-1)" ></mt-button>
      </router-link>
    </mt-header>
    <div class="box"></div>
    <div class="record-c">
      <div class="re-list margin-lr-20" v-if="recordList.length">
        <div class="re-li font-z-14" v-for="(item,index) in recordList" :key="index">
          <div class="rl-time">{{item.grantTime}}</div>
          <div class="rl-sdy font-w-500">{{item.amount}}</div>
        </div>
      </div>
      <div class="no-data" v-if="!recordList.length">
        <img src="../../assets/nodata.png" alt="">
        <div class="data-t"><span>{{$t('common.nodata')}}</span></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Record",
    data() {
      return {
        type: this.$route.params.type,
        userToken: '',
        recordList: [],
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
        this.getRecord();
      }

    },
    mounted() {
    },
    methods: {
      getRecord() {
        let url = this.type === 'community' ? 'bonusRecord' : 'extensionRewardRecord';
        this.$axios({
          url : `${this.$common.URL}/api/game/${url}`,
          method : 'post',
          headers :{
            'access-auth-token': this.userToken
          },
          data: {
            'pageNo': 1,
            'pageSize': 99999
          }
        }).then(res => {
          this.recordList = res.data.list;
          this.$common.closeLoad();
          for (let i of this.recordList) {
            i.amount = this.$common.toDecimalNNoZero(i.amount, 4) + ' ' + i.coinId;
            i.grantTime = this.$moment(i.grantTime).format('YYYY-MM-DD  HH:mm:ss');
          }
        })
      }
    }
  }
</script>

<style scoped>
  .record-c .re-li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.853333rem 0;
    border-bottom: 1px solid #f2f2f2;
  }
</style>
