<template>
  <div class="msg-detail">
    <mt-header :title="$t('home.mine.message')" fixed >
      <router-link to="" slot="left">
        <mt-button  icon="back"  @click.native="$router.back(-1)" ></mt-button>
      </router-link>
    </mt-header>
    <div class="box"></div>
    <div class="md-c padding-16-20">
      <div class="mdc-t font-z-18 font-w-500">{{msg.title}}</div>
      <div class="mdc-time font-z-12 font-c-999">{{msg.createTime}}</div>
      <div class="mdc-c font-z-14">{{msg.des}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MsgDetail",
    data() {
      return {
        userToken: '',
        id: this.$route.params.id,
        msg: {},
      }
    },
    created() {
      this.userToken = plus.storage.getItem('uuid');
      // this.userToken = '81966cb6-9219-47fb-a3e1-ffcfa679d802';
      this.getMsgDetail();
      this.readMsg();
    },
    methods: {
      getMsgDetail() {
        this.$axios({
          url: `${this.$common.URL}/api/notice/detail`,
          method: 'post',
          headers: {
            'access-auth-token': this.userToken
          },
          data: {
            noticeId: this.id
          }
        }).then(res => {
          this.msg = res.data
          this.msg.createTime =  this.$moment(this.msg.createTime).format('YYYY-MM-DD  HH:mm:ss');
        })
      },
      readMsg() {
        this.$axios({
          url: `${this.$common.URL}/api/notice/read`,
          method: 'post',
          headers: {
            'access-auth-token': this.userToken
          },
          data: {
            noticeId: this.id
          }
        }).then(res => {
          console.log(res);
        })
      }
    }
  }
</script>

<style scoped>
  .msg-detail .mdc-time {
    margin-bottom: 0.5333333rem;
  }
</style>
