<template>
  <div class="poster">
    <mt-header :title="$t('game.invite.invite')" fixed >
      <router-link to="" slot="left">
        <mt-button  icon="back"  @click.native="$router.back(-1)" ></mt-button>
      </router-link>
    </mt-header>
    <div class="box"></div>
    <div class="poster-c">
      <div class="pc-img" ref="img">
        <div class="img-bg"><img src="../../assets/invite.png" alt=""></div>
        <div class="pc-qr">
          <div class="qr-code" ref="qrcode"></div>
          <div class="qr-in">
            <div class="q-i font-z-12"><span>{{$t('game.invite.inviteCode')}}</span></div>
            <div class="q-ii font-z-18"><span>{{invitationCode}}</span></div>
          </div>
        </div>
      </div>
      <div class="pc-btn margin-lr-20 font-z-16">
        <div class="btn-style btn-style-click" @click="savePhoto">{{$t('game.invite.save')}}</div>
        <div class="btn-code" data-clipboard-action="copy" :data-clipboard-text="invitationCode" @click="copyCode">{{$t('game.invite.copy')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import Clipboard from 'clipboard';
  import QRCode from 'qrcodejs2';
  import html2canvas from 'html2canvas';
  export default {
    name: "Poster",
    data() {
      return {
        userToken: '',
        invitationCode: '',
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
        this.getUserInfo();
      }

    },
    mounted() {
    },
    methods: {
      getUserInfo() {
        this.$axios({
          url : `${this.$common.URL}/api/exchange/userInfo`,
          method : 'post',
          headers :{
            'access-auth-token': this.userToken
          }
        }).then( res => {
          this.$common.closeLoad();
          this.invitationCode = res.data.invitationCode;
          this.createQrCode();
        })
      },
      createQrCode() {
        new QRCode(this.$refs.qrcode, {
          text: this.invitationCode,
          colorDark: "#333333",
          colorLight: "#ffffff",
          width: 90,
          height: 90,
          correctLevel: QRCode.CorrectLevel.H
        })
      },
      copyCode() {
        let that = this;
        that.clipboard = new Clipboard(".btn-code");
        if (that.invitationCode) {
          that.clipboard.on('success',function (e) {
            that.$toast({
              message: that.$t('common.copySuccess'),
              position: 'bottom',
              duration: 3000
            });
            e.clearSelection();
            that.clipboard.destroy();
          });
          that.clipboard.on('error',function () {
            that.$toast({
              message: that.$t('common.copyFailed'),
              position: 'bottom',
              duration: 3000
            });
            e.clearSelection();
            that.clipboard.destroy();
          })
        }
      },
      savePhoto() {
        this.$common.openLoad();
        window.pageYoffset = 0;
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        let that = this;
        let imgName = '_doc/share_'+ (new Date()).getTime()  +'.jpeg';
        let width = 375;
        let height = 667;
        html2canvas(that.$refs.img,{
          dpi: window.devicePixelRatio,
          scale: 2,
          width: width,
          height: height,
          backgroundColor: '#ffffff',
          useCORS: true
        }).then((canvas) => {
          let dataUrl = canvas.toDataURL("image/png",1.0);
          that.dataURL = dataUrl;
          var b = new plus.nativeObj.Bitmap();
          b.loadBase64Data(that.dataURL,(res) => {
            b.save(imgName,{overwrite:true},(res) => {
              plus.gallery.save(imgName, (res) => {
                this.$common.closeLoad();
                that.$messagebox.alert('',{
                  title: that.$t('common.tips'),
                  message: that.$t('game.invite.saveSuccess'),
                  confirmButtonText: that.$t('common.confirm')
                }).then(()=>{
                });
              },(err) => {
                this.$common.closeLoad();
                that.$toast({
                  message: that.$t('game.invite.saveToAlbumFailed'),
                  position: 'bottom',
                  duration: 3000
                });
              })
            },(err) => {
              this.$common.closeLoad();
              that.$toast({
                message: that.$t('game.invite.saveImgFailed'),
                position: 'bottom',
                duration: 3000
              });
            });
          },(err) => {
            this.$common.closeLoad();
            that.$toast({
              message: that.$t('game.invite.createImgFailed'),
              position: 'bottom',
              duration: 3000
            });
          });
        }).catch(err => {
          this.$common.closeLoad();
          that.$toast({
            message: that.$t('common.network'),
            position: 'bottom',
            duration: 3000
          });
        })
      }
    }
  }
</script>

<style scoped>
  .poster {
    min-height: 100%;
    background-color: #fafafa;
  }

  .poster .poster-c {
    padding: 1.28rem 0 2.56rem;
  }

  .poster .poster-c .pc-img {
    position: relative;
    width: 70%;
    margin: auto;
  }

  .poster-c .pc-img .img-bg {
    width: 100%;
    font-size: 0;
  }

  .pc-img .img-bg img {
    width: 100%;
  }

  .poster-c .pc-img .pc-qr {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding-bottom: 1.28rem;
    text-align: center;
    color: #ffffff;
  }

  .pc-img .pc-qr .qr-code {
    width: 90px;
    height: 90px;
    padding: 3px;
    background-color: #fff;
    margin: auto;
    font-size: 0;
  }

  .pc-img .pc-qr .qr-in {
    margin-top: 8px;
  }

  .poster-c .pc-btn {
    margin-top: 1.7066667rem;
  }

  .pc-btn .btn-code {
    text-align: center;
    margin-top: 1.28rem;
  }

</style>
