<template>
  <Layout :foot="true">
    <template #header>
      <Header></Header>
    </template>
    <template #content>
      <div class="containor">
        <!-- 奖池信息 -->
        <div class="head-tab"></div>
        <div class="card">
          <div class="card-left">
            <div class="card-left-top">
              <div class="left-item">
                <div class="item-top"><img :src="USDT" alt="" /> &nbsp;USDT</div>
                <div class="item-num">
                  <div>1000.00</div>
                </div>
              </div>
              <div class="left-item">
                <div class="item-top"><img :src="TRX" alt="" /> &nbsp;TRX</div>
                <div>1000.00</div>
              </div>
            </div>

            <div class="card-left-bottom">主返奖地址:TZSsss</div>
          </div>
          <div class="card-right" @click="openDetail">奖池详情</div>
        </div>

        <!-- 轮播图 -->
        <div>
          <swiper
            :modules="modules"
            :loop="true"
            :autoplay="{ delay: 3000, disableOnInteraction: false }"
            :slides-per-view="1"
            :space-between="0"
            :scrollbar="{ draggable: true }"
            :speed="2000"
            :observe-parents="true"
            :observer="true"
          >
            <SwiperSlide v-for="(item, index) in list" :key="index">
              <img :src="item" alt="" style="height: 120px; width: 100%" />
            </SwiperSlide>
          </swiper>
        </div>

        <!-- 游戏列表 -->

        <!-- <nut-button @click="send" primary>send message</nut-button> -->
      </div>
    </template>
    <template #foot>
      <Foot></Foot>
    </template>
  </Layout>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import Header from '@/components/layout/Header.vue'
import Layout from '@/components/layout/Layout.vue'
import Foot from '@/components/layout/Footer.vue'
import USDT from '@/assets/images/global/usdt.png'
import TRX from '@/assets/images/global/trx.png'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { PushStream } from '@/longpoll/pushstream'
import { getBannerList, getPricePool } from '@/service/index'
import { useConfigStore } from '@/store/config'

const config = useConfigStore()
const modules = [Navigation, Pagination, Scrollbar, A11y, Autoplay]
const list = ref<any>([])

//初始化轮播图
const initBanner = async () => {
  const res: any = await getBannerList()
  list.value = res.data.map((item: any) => item.image)
}

//奖池详情接口
const pushstream = ref<any>(null)

const initContenct = () => {
  pushstream.value = new PushStream({
    host: '15.168.138.19',
    port: 80,
    modes: 'longpolling'
  })
  _connect('private-example')
  pushstream.value.onmessage = manageEvent
}
const _connect = (channel: any) => {
  console.log(channel)
  pushstream.value.removeAllChannels()
  try {
    pushstream.value.addChannel(channel)
    pushstream.value.connect()
  } catch (e) {
    console.log(e)
  }
}
const manageEvent = (msg: any) => {
  console.log(`eventMessage`, msg)
}
// const send = () => {
//   pushstream.value.sendMessage(JSON.stringify({ nick: '甲1', text: 'connect to the word' }))
// }

const openDetail = () => {}
onMounted(() => {
  //initContenct()
  initBanner()
})
</script>
<style lang="scss" scoped>
.containor {
  display: flex;
  flex-direction: column;
  background: var(--nut-background-color1);
  .head-tab {
    width: 100%;
    height: 44px;
    background-color: var();
  }
  .card {
    margin: 0 auto;
    height: 96px;
    width: 344px;
    background: url(@/assets/images/home/card.png) no-repeat;
    background-size: 100% 100%;
    display: flex;
    .card-left {
      height: 100%;
      width: 308px;
      .card-left-top {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .left-item {
          padding-top: 12px;
          display: flex;
          flex-direction: column;
          flex: 1;
          text-align: center;
          align-items: center;
          .item-top {
            margin: 0 auto;
            display: flex;
            align-items: center;
            font-size: var(--nut-font-size-2);
            font-weight: 400;
            img {
              height: 22px;
              width: 22px;
            }
          }
          .item-num {
            font-size: var(--nut-font-size-3);
            font-weight: 500;
          }
        }
      }
      .card-left-bottom {
        padding-top: 4px;
        color: var(--nut-white);
        font-size: var(--nut-font-size-1);
        text-indent: 2em;
      }
    }
    .card-right {
      width: 36px;
      height: 100%;
      color: #fff;
      writing-mode: tb-rl;
      padding: 8px 15px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
  }
}
</style>
