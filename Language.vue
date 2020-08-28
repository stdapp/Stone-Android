<template>
  <div class="language">
    <mt-header :title="$t('wallet.manage.language')" fixed>
      <router-link to="" slot="left">
        <mt-button icon="back" @click.native="$router.back(-1)"></mt-button>
      </router-link>
    </mt-header>
    <div class="box"></div>
    <div class="l-c font-z-16">
      <div class="l-list margin-lr-20" @click="clickLanguage('zh')">
        <span>中文</span><img src="../../assets/success.png" alt="" v-if="showImg === 'zh'">
      </div>
      <div class="l-list margin-lr-20" @click="clickLanguage('en')">
        <span>English</span><img src="../../assets/success.png" alt="" v-if="showImg === 'en'">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Language",
    data() {
      return {
        showImg: '',
      }
    },
    created() {
      this.showImg = plus.storage.getItem('language') || 'zh';
    },
    methods: {
      clickLanguage(lang) {
        this.showImg = lang;
        this.changeLang(lang);
      },
      changeLang(tem) {
        this.$i18n.locale = tem;//改变当前语言
        plus.storage.setItem('language',tem);
        this.$router.push('/?select=asset');
      }
    }
  }
</script>

<style scoped>
 .language .l-c .l-list {
   padding: 0.8533333rem 0;
   display: flex;
   align-items: center;
   justify-content: space-between;
   border-bottom: 1px solid #f2f2f2;
 }

  .l-c .l-list img {
    width: 0.96rem;
    height: 0.96rem;
  }
</style>
