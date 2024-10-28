<template>
  <Layout :foot="true">
    <template #header>
      <Header></Header>
    </template>
    <template #content>
      <div class="containor">
        <!-- 奖池信息 -->

        <nut-tabs v-model="currentTabIndex">
          <template #titles>
            <div v-for="item in tabs" :key="item.paneKey" class="custom-tab-item">
              <div
                class="custom-title"
                :class="{
                  active: currentTabIndex === item.paneKey
                }"
              >
                {{ item.name }}
              </div>
            </div>
          </template>
          <nut-tab-pane
            v-for="item in list"
            :key="item.paneKey"
            :pane-key="item.paneKey"
            v-show="false"
          >
            {{ item.title }}
          </nut-tab-pane>
        </nut-tabs>

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
      </div>
    </template>
    <template #foot>
      <Foot></Foot>
    </template>
  </Layout>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import Header from '@/components/layout/Header.vue'
import Layout from '@/components/layout/Layout.vue'
import Foot from '@/components/layout/Footer.vue'
import USDT from '@/assets/images/global/usdt.png'
import TRX from '@/assets/images/global/trx.png'
import HomeWhite from '@/assets/images/menu/root_home_white.png'
import HomeInactive from '@/assets/images/menu/root_home_inactive.png'
import HashWhite from '@/assets/images/menu/root_hash_game_white.png'
import HashInactive from '@/assets/images/menu/root_hash_game_inactive.png'
import SportsWhite from '@/assets/images/menu/root_sports_white.png'
import SportsInactive from '@/assets/images/menu/root_sports_inactive.png'
import SlotsWhite from '@/assets/images/menu/root_slots_white.png'
import SlotsInactive from '@/assets/images/menu/root_slots_inactive.png'
import BoardWhite from '@/assets/images/menu/root_game_white.png'
import BoardInactive from '@/assets/images/menu/root_table_game_inactive.png'
import LiveWhite from '@/assets/images/menu/root_live_white.png'
import LiveInactive from '@/assets/images/menu/root_live_inactive.png'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { getBannerList, getPricePool } from '@/service/index'
import { useConfigStore } from '@/store/config'
import { $t } from '@/locales'

//const config = useConfigStore()
const modules = [Navigation, Pagination, Scrollbar, A11y, Autoplay]
const list = ref<any>([])

const currentTabIndex = ref<any>(0) //tab 选项下标
const tabs = reactive<any>([
  {
    name: computed(() => $t('home.name')),
    image: computed(() => (currentTabIndex.value == 0 ? HomeWhite : HomeInactive))
  },
  {
    name: computed(() => $t('home.hash')),
    image: computed(() => (currentTabIndex.value == 1 ? HashWhite : HashInactive))
  },
  {
    name: computed(() => $t('home.hashSport')),
    image: computed(() => (currentTabIndex.value == 2 ? SportsWhite : SportsInactive))
  },
  {
    name: computed(() => $t('home.electronic')),
    image: computed(() => (currentTabIndex.value == 3 ? SlotsWhite : SlotsInactive))
  },
  {
    name: computed(() => $t('home.board')),
    image: computed(() => (currentTabIndex.value == 4 ? BoardWhite : BoardInactive))
  },
  {
    name: computed(() => $t('home.live')),
    image: computed(() => (currentTabIndex.value == 5 ? LiveWhite : LiveInactive))
  }
])
//初始化轮播图
const initBanner = async () => {
  const res: any = await getBannerList()
  list.value = res.data.map((item: any) => item.image)
}

const handleClick = (index: number) => {
  currentTabIndex.value = index
}

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
    background-color: #f6f6f6;
    overflow-x: auto;
    .sroll-container {
      display: flex;
      align-items: center;
      width: max-content;
      padding: 10px 15px;
      height: 44px;
      .tab-item {
        display: flex;
        padding: 10px 15px;
        color: red;
        img {
          height: 20px;
          width: 20px;
        }
      }
    }
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
