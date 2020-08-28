import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Wallet from '@/components/wallet/Wallet'
import CreateWallet from '@/components/wallet/create/CreateWallet'
import CreateBakeUp from '@/components/wallet/create/CreateBakeUp'
import ImportWallet from '@/components/wallet/import/ImportWallet'
import ImportByKeystore from '@/components/wallet/import/ImportByKeystore'
import ImportByPrivateKey from '@/components/wallet/import/ImportByPrivateKey'
import Invest from '@/components/game/Invest'
import Collect from '@/components/asset/Collect'
import Transfer from '@/components/asset/Transfer'
import LuckyEgg from '@/components/game/LuckyEgg'
import WalletDetail from '@/components/wallet/manage/WalletDetail'
import BakeUpWallet from '@/components/wallet/manage/BakeUpWallet'
import WalletList from '@/components/wallet/manage/WalletList'
import ModifyPsw from '@/components/wallet/manage/ModifyPsw'
import Kline from '@/components/exchange/kline'
import Assets from '@/components/exchange/assets'
import Entrust from '@/components/exchange/entrust'
import OrePool from '@/components/game/OrePool'
import God from '@/components/game/God'
import GodRule from '@/components/game/GodRule'
import Invite from '@/components/game/Invite'
import InviteRule from '@/components/game/InviteRule'
import Record from '@/components/game/Record'
import Ranking from '@/components/game/Ranking'
import Withdraw from '@/components/game/Withdraw'
import Poster from '@/components/game/Poster'
import AboutUs from '@/components/mine/AboutUs'
import Language from "@/components/mine/Language";
import Message from "@/components/mine/Message";
import MsgDetail from "../components/mine/MsgDetail";
import test from "../components/test";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/wallet',
      name: 'Wallet',
      component: Wallet
    },
    {
      path: '/create/createWallet',
      name: 'CreateWallet',
      component: CreateWallet
    },
    {
      path: '/create/createBakeUp',
      name: 'CreateBakeUp',
      component: CreateBakeUp
    },
    {
      path: '/import/importWallet',
      name: 'ImportWallet',
      component: ImportWallet
    },
    {
      path: '/import/importByKeystore',
      name: 'ImportByKeystore',
      component: ImportByKeystore
    },
    {
      path: '/import/importByPrivateKey',
      name: 'ImportByPrivateKey',
      component: ImportByPrivateKey
    },
    {
      path: '/game/invest',
      name: 'Invest',
      component: Invest
    },
    {
      path: '/asset/collect',
      name: 'Collect',
      component: Collect
    },
    {
      path: '/asset/transfer',
      name: 'Transfer',
      component: Transfer
    },
    {
      path: '/game/luckyEgg',
      name: 'LuckyEgg',
      component: LuckyEgg
    },
    {
      path: '/wallet/manage/walletDetail',
      name: 'WalletDetail',
      component: WalletDetail
    },
    {
      path: '/wallet/manage/bakeUpWallet',
      name: 'BakeUpWallet',
      component: BakeUpWallet
    },
    {
      path: '/wallet/manage/walletList',
      name: 'WalletList',
      component: WalletList
    },
    {
      path: '/wallet/manage/modifyPsw',
      name: 'ModifyPsw',
      component: ModifyPsw
    },
    {
      path: '/exchange/kline',
      name: 'kline',
      component: Kline
    },
    {
      path: '/exchange/assets',
      name: 'assets',
      component: Assets
    },
    {
      path: '/exchange/entrust',
      name: 'entrust',
      component: Entrust
    },
    {
      path: '/game/orePool',
      name: 'OrePool',
      component: OrePool
    },
    {
      path: '/game/god',
      name: 'God',
      component: God
    },
    {
      path: '/game/godrule',
      name: 'GodRule',
      component: GodRule
    },
    {
      path: '/game/invite',
      name: 'Invite',
      component: Invite
    },
    {
      path: '/game/inviterule',
      name: 'InviteRule',
      component: InviteRule
    },
    {
      path: '/game/record/:type',
      name: 'Record',
      component: Record
    },
    {
      path: '/game/ranking/:type',
      name: 'Ranking',
      component: Ranking
    },
    {
      path: '/game/withdraw',
      name: 'Withdraw',
      component: Withdraw
    },
    {
      path: '/game/poster',
      name: 'Poster',
      component: Poster
    },
    {
      path: '/mine/about',
      name: 'AboutUs',
      component: AboutUs
    },
    {
      path: '/mine/language',
      name: 'Language',
      component: Language
    },
    {
      path: '/mine/message',
      name: 'Message',
      component: Message
    },
    {
      path: '/mine/msgDetail/:id',
      name: 'MsgDetail',
      component: MsgDetail
    },



    {

    }

  ]
})
