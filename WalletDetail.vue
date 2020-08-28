<template>
  <div class="w-detail">
    <mt-header :title="$t('wallet.manage.detail')" fixed >
      <router-link to="" slot="left">
        <mt-button  icon="back"  @click.native="$router.back(-1)" ></mt-button>
      </router-link>
    </mt-header>
    <div class="box"></div>
    <div class="wd-c">
      <div class="wd-name padding-16-20">
        <div class="font-z-16">{{$t('wallet.name')}}</div>
        <div class="font-z-14 font-c-999">{{walletName}}</div>
      </div>
      <div class="wd-g font-z-16">
        <div class="wd-b" @click="chooseAction(1)">
          <div class="wd-t">{{$t('wallet.manage.keystore')}}</div>
          <div class="arrow wd-arrow"></div>
        </div>
        <div class="wd-b" @click="chooseAction(1)">
          <div class="wd-t">{{$t('wallet.manage.private')}}</div>
          <div class="arrow wd-arrow"></div>
        </div>
        <router-link tag="div" to="" class="wd-b">
          <div class="wd-t">{{$t('wallet.manage.modifyPsw')}}</div>
          <div class="arrow wd-arrow"></div>
        </router-link>
        <!--<router-link tag="div" to="/mine/language" class="wd-b">
          <div class="wd-t">{{$t('wallet.manage.language')}}</div>
          <div class="arrow wd-arrow"></div>
        </router-link>-->
      </div>
      <div class="wd-delete padding-16-20 font-z-16 font-w-500" @click="chooseAction(2)">{{$t('wallet.manage.delete')}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "WalletDetail",
    data() {
      return {
        walletName: '',
        addr: '',
        keystore: '',
        move: '',
      }
    },
    created() {
      this.addr = plus.storage.getItem('address');
      this.keystore = plus.storage.getItem('keystore');
      this.walletName = plus.storage.getItem('name');
    },
    mounted() {
    },
    methods: {
      chooseAction(action) {
        switch (action) {
          case 1:
            this.move = 'router';
            this.checkPsw();
            break;
          case 2:
            this.move = 'delete';
            this.checkPsw();
            break;
          default:
            break;
        }
      },
      checkPsw() {
        let that = this;
        let option = JSON.parse(that.keystore);
        that.$messagebox.prompt(' ',that.$t('common.pswPH'),{inputPlaceholder:that.$t('common.pswPH'),inputType:'password'}).then(res => {
          that.$common.openLoad();
          console.log(res);
          let psw = res.value;
          setTimeout(()=> {
            wal.decodeFromOption(option, psw).then(res => {
              if (res === 'error') {
                that.$common.closeLoad();
                that.$toast({
                  message: that.$t('common.pswError'),
                  position: 'bottom',
                  duration: 3000
                });
              } else {
                plus.storage.setItem('privateKey',res);
                if (that.move === 'router') {
                  that.$common.closeLoad();
                  that.$router.push('/wallet/manage/bakeUpWallet');
                } else {
                  that.DeleteWallet();
                }
              }
            }).catch(err => {
              that.$common.closeLoad();

            })
          },50)
        }).catch(err => {
          console.log(err);
        })
      },
      DeleteWallet() {
        let that = this;
        let walletList = {};
        let lite = 'delete from stoneInfo where address = "' + that.addr + '"';
        let lite2 = `select * from stoneInfo`;
        let flag = false;
        that.$common.openDB().then(rse => {
          that.$common.query(lite,1).then(res => {
            that.$common.query(lite2).then(res1 => {
              walletList = res1.data;
              let len = walletList.length;
              if (len) {
                let lite3 = 'update stoneInfo set status = 1 where address = "'+ walletList[0].address +'"';
                for (let i = 0 ; i < len; i++) {
                  if (walletList[i].status === 1) {
                    flag = true;
                    break;
                  }
                }
                if (!flag) {
                  that.$common.query(lite3).then(res2 => {
                    plus.storage.setItem('address',walletList[0].address);
                    plus.storage.setItem('keystore',walletList[0].keystore);
                    plus.storage.setItem('name',walletList[0].name);
                    plus.storage.setItem('ethAddr',walletList[0].ethAddr);
                    plus.sqlite.closeDatabase({name: 'stoneApp'});
                  }).catch(err2 => {
                    that.$toast({
                      message: that.$t('common.system'),
                      position: 'bottom',
                      duration: 3000
                    });
                    plus.sqlite.closeDatabase({name: 'stoneApp'});
                  })
                } else {
                  plus.sqlite.closeDatabase({name: 'stoneApp'});
                }
                that.$common.closeLoad();
                that.$messagebox.alert('',{
                  title: that.$t('common.tips'),
                  message: that.$t('wallet.manage.delSuccess'),
                  confirmButtonText: that.$t('common.confirm')
                }).then(()=>{
                  that.$router.push('/?select=asset');
                });
              } else {
                plus.storage.removeItem('address');
                plus.storage.removeItem('keystore');
                plus.storage.removeItem('name');
                plus.storage.removeItem('ethAddr');
                plus.storage.setItem('imported', 'true');
                plus.sqlite.closeDatabase({name: 'stoneApp'});
                that.$common.closeLoad();
                that.$messagebox.alert('',{
                  title: that.$t('common.tips'),
                  message: that.$t('wallet.manage.delSuccess'),
                  confirmButtonText: that.$t('common.confirm')
                }).then(()=>{
                  that.$router.push('/?select=assets');
                });
              }
            }).catch(err1 => {
              that.$common.closeLoad();
              plus.sqlite.closeDatabase({name: 'stoneApp'});
              that.$toast({
                message: that.$t('common.system'),
                position: 'bottom',
                duration: 3000
              })
            })
          }).catch(err => {
            that.$common.closeLoad();
            plus.sqlite.closeDatabase({name: 'stoneApp'});
            that.$toast({
              message: that.$t('common.system'),
              position: 'bottom',
              duration: 3000
            })
          })
        }).catch(error => {
          that.$common.closeLoad();
          plus.sqlite.closeDatabase({name: 'stoneApp'});
          that.$toast({
            message: that.$t('common.system'),
            position: 'bottom',
            duration: 3000
          })
        })
      },
    }
  }
</script>

<style scoped>
  .w-detail {
    min-height: 100%;
    background-color: #fafafa;
  }

  .w-detail .wd-name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0.64rem 0;
    background-color: #fff;
  }

  .w-detail .wd-g {
    padding: 0 1.066667rem;
    background-color: #ffffff;
  }

  .w-detail .wd-g .wd-b {
    position: relative;
    padding: 0.8533333rem 0;
    border-bottom: 1px solid #f2f2f2;
  }

  .w-detail .wd-g .wd-b:last-of-type {
    border-bottom: 0;
  }

  .wd-g .wd-b .wd-arrow {
    right: 0;
    background: url("../../../assets/arrow.png") no-repeat center/contain;
  }

  .w-detail .wd-delete {
    text-align: center;
    margin: 0.64rem 0;
    background-color: #fff;
    color: #f15846;
  }
</style>
