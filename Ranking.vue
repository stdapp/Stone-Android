<template>
  <div class="rank">
    <mt-header :title="$t('game.invite.rank')" fixed >
      <router-link to="" slot="left">
        <mt-button  icon="back"  @click.native="$router.back(-1)" ></mt-button>
      </router-link>
    </mt-header>
    <div class="box"></div>
    <div class="rank-c">
      <div class="rc-t font-z-12 font-c-999">
        <div class="rank-i">{{$t('game.rank.rank')}}</div>
        <div class="rank-ii">{{$t('game.rank.nickname')}}</div>
        <div class="rank-iii">{{$t('game.rank.reward')}}</div>
      </div>
      <div class="rc-table">
        <div class="rt-block" v-for="(item,index) in rankList" :key="index">
          <div class="rank-i">
            <div class="rb-i font-z-14 font-c-999" v-if="index === 0"><img src="../../assets/rank1.png" alt=""></div>
            <div class="rb-i" v-if="index === 1"><img src="../../assets/rank2.png" alt=""></div>
            <div class="rb-i" v-if="index === 2"><img src="../../assets/rank3.png" alt=""></div>
            <div class="rb-i" v-if="index !== 0 && index !== 1 && index !== 2">{{index}}</div>
          </div>
          <div class="rank-ii font-z-14 font-w-500"><div class="rb-ii">{{item.nickname}}</div></div>
          <div class="rank-iii font-z-14">
            <div class="rb-iii">
              <div class="rbi-l font-w-500">{{item.reward}}</div>
              <div class="rbi-r">USDT</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Ranking",
    data() {
      return {
        type: this.$route.params.type,
        userToken: '',
        rankList: [],
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
        this.getRank();
      }
    },
    mounted() {
    },
    methods: {
      getRank() {
        let url = this.type === 'community' ? 'bonusRanking' : 'extensionRewardRanking';
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
          this.rankList = res.data.list;
          this.$common.closeLoad();
          for (let i in this.rankList) {
            this.rankList[i].reward = this.$common.toDecimalNNoZero(this.rankList[i].reward,4);
          }
        })
      }
    }
  }
</script>

<style scoped>
  .rank {
    min-height: 100%;
    background-color: #fafafa;
  }

  .rank .rc-t {
    display: flex;
    align-items: center;
    padding: 0.64rem 1.066667rem;
  }

  .rank .rank-c .rank-i {
    width: 20%;
  }

  .rank .rank-c .rank-ii {

    width: 40%;
  }

  .rank .rank-c .rank-iii {
    width: 48%;
    text-align: right;
  }

  .rank-c .rc-table {
    background-color: #fff;
    padding: 0 1.0666667rem;
  }

  .rc-table .rt-block {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f2f2f2;
    padding: 0.64rem 0;
  }

  .rt-block .rb-i {
    width: 1.28rem;
    height: 1.28rem;
    margin: auto;
    text-align: center;
  }

  .rt-block .rb-i img {
    width: 100%;
  }

  .rt-block .rb-ii {
    width: 95%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }

  .rt-block .rb-iii {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .rt-block .rb-iii .rbi-r {
    width: 1.6rem;
    text-align: right;
  }

  .rt-block .rb-iii .rbi-l {
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    width: calc(100% - 1.6rem);
  }
</style>

