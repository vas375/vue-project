import { defineStore } from 'pinia';
import { fetchGetConfig,fetchAccount,getGameConfig,getBalanceWallet,hashGameOdds} from '@/service/api'
import {getUserInfo} from '@/utils'
export const useConfigStore = defineStore( {
  id: 'config',
  state: () => ({
    configData: <any>null,
    userInfo: <any>null ,
    walletData:<any>null,
    balanceData:<any>null,
    oddsOptions: <any>[],
    oddsData: <any>{},
    oddsDataList:<any>null,
    rebateData: <any>{},   // 个人返水数据
    gameProviderList:<any>{},
    languageOptions: [
        { label: '中文', key: 'zh' },
        { label: 'English', key: 'en' },
        { label: '현국인', key: 'ko' }
    ]
  }),
  actions: {
    /**
		 * 重载页面
		 */
    async getConfig() {
        const res:any  = await fetchGetConfig()
        this.configData = res.data 
          const isGoogleHas = Array.from(document.scripts).some(script=>script.src.includes('https://www.googletagmanager.com/gtag/js'))
          if(isGoogleHas)  return
          // google analytics
          const script1: any = document.createElement(`script`)
          script1.src = `https://www.googletagmanager.com/gtag/js?id=${res.data.google_analytics}`
          document.head.appendChild(script1)
          const script2: any = document.createElement(`script`)
          script2.text = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
      
            gtag('config', '${res.data.google_analytics}');`
          document.head.appendChild(script2)
    },
    async getUserInfo() {
      const res:any = await getUserInfo()
      console.log('userInfo:', res)
      this.userInfo = res
    },
    async getWallet (){
      const address =  getUserInfo().addr  || ''
      if(!address)return
      const res:any  = await fetchAccount(address)
      const data = {
        usdt:0,
        trx:0
      }
      res.data?.withPriceTokens.forEach((ele:any) => {
        if(ele.tokenAbbr==='USDT') data.usdt = Number((ele.balance/ 1000000).toString().match(/^\d+(?:\.\d{0,2})?/))
        if(ele.tokenAbbr==='trx') data.trx = Number((ele.balance/ 1000000).toString().match(/^\d+(?:\.\d{0,2})?/))
        this.walletData = data
      });

    },
    // 获取钱包金额
    async getBalance (){
      if(!this.userInfo.token) return
      this.balanceData = {
        usdt:0,
        trx:0
      }
      const res:any = await getBalanceWallet()
      res.data.forEach((element:any) => {
        if(element.currencyid===1) this.balanceData.usdt = element.availablebalance
        if(element.currencyid===2) this.balanceData.trx = element.availablebalance
      });
       
    },
    // 获取不同场次赔率
    getOdds(id: any) {
      getGameConfig(id).then((res:any) => {
        if (res && res.data) {
          this.oddsOptions = res.data
          if (this.oddsOptions.length > 0) this.oddsData = this.oddsOptions[0]
        }
      })
    },
    //获取所有hash游戏的 等级场次
    async getAllOdds(){
     const res:any = await hashGameOdds()
      if (res && res.data) {
        this.oddsDataList = res.data
      }
    },
    async reset(){
      this.$reset()
    }
  }
});
