<template>
  <div class="msg">
    <mt-header :title="$t('home.mine.message')" fixed >
      <router-link to="" slot="left">
        <mt-button  icon="back"  @click.native="$router.back(-1)" ></mt-button>
      </router-link>
      <div slot="right" class="font-z-14 font-c-666" @click="msgAllRead"><span>{{$t('game.message.read')}}</span></div>
    </mt-header>
    <div class="box"></div>
    <div class="msg-c">
      <div class="msg-list padding-16-20" v-if="msgList.length">
        <router-link tag="div" :to="item.url" class="msg-b" v-for="(item,index) in msgList" :key="index">
          <div class="mb-t font-z-16 font-w-500">
            <div class="mt-l">
              <div class="m-doc" v-if="item.status"></div>
              <div class="m-t">{{item.title}}</div>
            </div>
            <div class="mt-r font-z-12 font-c-999">{{item.createTime}}</div>
          </div>
          <div class="mb-c font-z-14 font-c-666">{{item.des}}</div>
        </router-link>
      </div>
      <div class="no-data" v-if="!msgList.length">
        <img src="../../assets/nodata.png" alt="">
        <div class="data-t"><span>{{$t('common.nodata')}}</span></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Message",
    data() {
      return {
        userToken: '',
        msgList: [],
      }
    },
    created() {
      this.userToken = plus.storage.getItem('uuid');
      this.getMsgList();
    },

    methods: {
      getMsgList() {
        this.$axios({
          url: `${this.$common.URL}/api/notice/list`,
          method: 'post',
          headers: {
            'access-auth-token': this.userToken
          },
        }).then(res => {
          this.msgList = res.data;
          for (let i of this.msgList) {
            i.createTime = this.$moment(i.createTime).format('YYYY-MM-DD  HH:mm:ss');
            i.url = `/mine/msgDetail/${i.id}`;
          }
        })
      },
      msgAllRead() {
        for (let i of this.msgList) {
          i.status = 0;
        }
        this.$axios({
          url: `${this.$common.URL}/api/notice/readAll`,
          method: 'post',
          headers: {
            'access-auth-token': this.userToken
          },
        }).then(res => {
          console.log(res);
        })
      }
    }
  }
</script>

<style scoped>
  .msg-b {
    padding: 0.853333rem 0;
    border-bottom: 1px solid #f2f2f2;
  }

  .msg-b:first-of-type {
    padding-top: 0;
  }

  .msg-b .mb-t {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.2666667rem;
  }

  .mb-t .mt-l {
    display: flex;
    align-items: center;
  }

  .mb-t .m-doc {
    width: 0.42666667rem;
    height: 0.42666667rem;
    margin-right: 0.42666667rem;
    border-radius: 50%;
    background-color: #631CEF;
  }

  .msg-b .mb-c {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 0.2666667rem;
  }
</style>
