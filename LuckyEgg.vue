<template>
  <div class="test">
    <mt-header :title="$t('home.game.sd')" fixed >
      <router-link to="/?select=game" slot="left">
        <mt-button icon="back" ></mt-button>
      </router-link>
    </mt-header>
  </div>
</template>

<script>
  export default {
    name: "LuckyEgg",
    data() {
      return {

      }
    },
    created() {
      if (plus.storage.getItem('imported') && plus.storage.getItem('imported') === 'false') {

        let uuid = plus.storage.getItem('uuid');

        var wurl = "https://sd.797lxs.com/?code="+ uuid;

        var ws = plus.webview.currentWebview();

        var embed = plus.webview.create(wurl, 'lucky',{top:'60px',bottom:'0px',cachemode: 'noCache'});

        ws.append(embed);
      } else {
        this.$messagebox.alert('',{
          title: this.$t('common.tips'),
          message: this.$t('common.first'),
          confirmButtonText: this.$t('common.confirm')
        }).then(()=>{
          this.$router.push('/?select=asset');
        });
      }
    },
    mounted() {
    },
    destroyed() {
      var ws = plus.webview.getWebviewById( 'lucky' );
      plus.webview.close(ws);
    }
  }
</script>

<style scoped>

</style>
