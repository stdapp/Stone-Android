<template>
  <div class="invite">
    <mt-header :title="$t('game.invite.invite')" fixed >
      <router-link to="" slot="left">
        <mt-button  icon="back"  @click.native="$router.back(-1)" ></mt-button>
      </router-link>
    </mt-header>
    <div class="box"></div>
    <div class="invite-c">
      <div class="ic-community">
        <div class="ic-t">
          <div class="ict-i font-z-18">{{$t('game.invite.com')}}</div>
          <router-link tag="div" to="/game/inviteRule" class="ict-ii font-z-14 font-c-666">{{$t('game.invite.rule')}}</router-link>
        </div>
        <div class="com-c">
          <div class="com-level padding-16-20">
            <div class="cl-l font-z-16 font-w-500">{{$t('game.invite.level')}}：{{level}}</div>
            <div class="cl-r font-z-14 font-c-666">{{$t('game.invite.today')}}：<span class="font-c-397">{{comInfo.todayGameCount}}</span></div>
          </div>
          <div class="com-g">
            <div class="ic-li font-z-14">
              <div class="li-l">
                <div class="li-i font-c-666">{{$t('game.invite.bonusRate')}}</div>
                <div class="li-ii font-c-397">{{comInfo.bonusRate}}</div>
              </div>
              <div class="li-r">
                <div class="li-i font-c-666">{{$t('game.invite.comTotal')}}</div>
                <div class="li-ii font-c-397">{{comInfo.totalReward}} USDT</div>
              </div>
            </div>
            <div class="ic-li font-z-14">
              <div class="li-l">
                <div class="li-i font-c-666">{{$t('game.invite.yesterday')}}</div>
                <div class="li-ii font-c-397">{{comInfo.yesterdayGameCount}}</div>
              </div>
              <div class="li-r">
                <div class="li-i font-c-666">{{$t('game.invite.yesterdayComTotal')}}</div>
                <div class="li-ii font-c-397">{{comInfo.yesterdayReward}} USDT</div>
              </div>
            </div>
            <div class="ic-li">
              <div class="li-l"><router-link tag="div" to="/game/record/community" class="ic-btn-l">{{$t('game.invite.record')}}</router-link></div>
              <div class="li-r"><router-link tag="div" to="/game/ranking/community" class="ic-btn-r">{{$t('game.invite.rank')}}</router-link></div>
            </div>
          </div>
        </div>
      </div>
      <div class="ic-person">
        <div class="ic-t">
          <div class="ict-i font-z-18">{{$t('game.invite.person')}}</div>
<!--          <div class="ict-ii font-z-14 font-c-666">我的直推记录</div>-->
        </div>
        <div class="per-c padding-16-20">
          <div class="ic-li font-z-14">
            <div class="li-l">
              <div class="li-i font-c-666">{{$t('game.invite.directPush')}}</div>
              <div class="li-ii font-c-397">{{personInfo.directPushCount}}</div>
            </div>
            <div class="li-r">
              <div class="li-i font-c-666">{{$t('game.invite.directPushGame')}}</div>
              <div class="li-ii font-c-397">{{personInfo.directPushGameCount}}</div>
            </div>
          </div>
          <div class="ic-li font-z-14">
            <div class="li-l">
              <div class="li-i font-c-666">{{$t('game.invite.indirectPush')}}</div>
              <div class="li-ii font-c-397">{{personInfo.indirectPromotionCount}}</div>
            </div>
            <div class="li-r">
              <div class="li-i font-c-666">{{$t('game.invite.indirectPushGame')}}</div>
              <div class="li-ii font-c-397">{{personInfo.indirectPromotionGameCount}}</div>
            </div>
          </div>
          <div class="ic-li font-z-14 ic-total">
            <div class="li-i font-c-666">{{$t('game.invite.personTotal')}}：</div>
            <div class="li-ii font-c-397">{{personInfo.totalReward}} USDT</div>
          </div>
          <div class="ic-li">
            <div class="li-l"><router-link class="ic-btn-l" tag="div" to="/game/record/person">{{$t('game.invite.record')}}</router-link></div>
            <div class="li-r"><router-link class="ic-btn-r" tag="div" to="/game/ranking/person">{{$t('game.invite.rank')}}</router-link></div>
          </div>
        </div>
      </div>
      <router-link tag="div" to="/game/poster" class="ic-invite-btn btn-style">{{$t('game.invite.invite')}}</router-link>
      <div class="ic-tip font-z-12 font-c-666">{{$t('game.invite.share')}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Invite",
    data() {
      return {
        userToken: '',
        level: '',
        comInfo: {},
        personInfo: {}
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
        this.getComInfo();
        this.getPersonInfo();
        this.getUserInfo();
      }
    },
    mounted() {
    },
    methods: {
      getComInfo() {
        this.$axios({
          url : `${this.$common.URL}/api/game/bonusOutline`,
          method : 'post',
          headers :{
            'access-auth-token': this.userToken
          }
        }).then( res => {
          this.comInfo = res.data;
          this.comInfo.bonusRate = this.comInfo.bonusRate || 0;
          this.comInfo.totalReward = this.$common.toDecimalNNoZero(this.comInfo.totalReward,4);
          this.comInfo.yesterdayReward = this.$common.toDecimalNNoZero(this.comInfo.yesterdayReward,4);
          this.$common.closeLoad();
        })
      },
      getPersonInfo() {
        this.$axios({
          url : `${this.$common.URL}/api/game/extensionOutline`,
          method : 'post',
          headers :{
            'access-auth-token': this.userToken
          }
        }).then( res => {
          this.personInfo = res.data;
          this.personInfo.totalReward = this.$common.toDecimalNNoZero(this.personInfo.totalReward,4)
          this.$common.closeLoad();
        })
      },
      getUserInfo() {
        this.$axios({
          url : `${this.$common.URL}/api/exchange/userInfo`,
          method : 'post',
          headers :{
            'access-auth-token': this.userToken
          }
        }).then( res => {
          this.level = res.data.level ? res.data.level : this.$t('game.invite.general');
          this.$common.closeLoad();
        })
      }
    }
  }
</script>

<style scoped>
  .invite {
    min-height: 100%;
    background-color: #fafafa;
  }

  .invite .invite-c {
    padding-bottom: 2.45rem;
  }

  .invite .invite-c .ic-t {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
    padding: 0.64rem 1.066667rem;
  }

  .invite-c .ic-community .com-c {
    background: #fff;
  }

  .ic-community .com-c .com-level {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f2f2f2;
  }

  .ic-community .com-c .com-g {
    padding: 0.8533333rem 1.0666667rem;
  }

  .invite-c .ic-li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .invite-c .ic-total {
    justify-content: normal;
  }

  .invite-c .ic-li .li-l {
    width: 50%;
  }

  .invite-c .ic-li .li-r {
    width: 50%;
  }

  .invite-c .ic-li .ic-btn-l {
    width: 80%;
    /*margin: auto;*/
    font-size: 14px;
    font-weight: 500;
    background-color: #631CEF;
    padding: 5px 0;
    border-radius: 100px;
    color: #fff;
    text-align: center;
  }

  .invite-c .ic-li .ic-btn-r {
    width: 80%;
    /*margin: auto;*/
    font-size: 14px;
    font-weight: 500;
    background-color: #ebf2ff;
    border-radius: 100px;
    border: 1px solid #631CEF;
    padding: 5px 0;
    color: #631CEF;
    text-align: center;
  }

  .invite-c .ic-person .per-c {
    background-color: #fff;
  }

  .invite .invite-c .ic-invite-btn {
    background-color: #631CEF;
    margin: 2.45rem 1.0666667rem 0;
  }

  .invite .invite-c .ic-tip {
    text-align: center;
    margin-top: 1.066667rem;
  }
</style>
