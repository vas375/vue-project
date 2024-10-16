<template>
  <div class="footer">
    <div class="items"  v-for="(item,index) in list" :key="index"  @click="handleClick(item, index)">
      <img :src="item.img" />
      <div :class="[index===currentIndex?'active':'noraml']">{{ item.name }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { $t } from '@/locales';
import { computed, reactive, ref } from 'vue'
import {useRouter,useRoute} from 'vue-router'
import HomeH from '@/assets/images/menu/home.png'
import HomeD from '@/assets/images/menu/homeD.png'
import ActiveH from '@/assets/images/menu/active.png'
import ActiveD from '@/assets/images/menu/activeD.png'
import Personal from '@/assets/images/menu/personal.png'
import CustomerH from '@/assets/images/menu/customer.png'
import CustomerD from '@/assets/images/menu/customerD.png'
import PromoteH from '@/assets/images/menu/promote.png'
import PromoteD from '@/assets/images/menu/promoteD.png'
const router = useRouter()
const route = useRoute()
const currentIndex = ref<number>(0)
const list = reactive([
  {
    name:computed(()=>$t('tabbar.home')),
    img: computed(()=> currentIndex.value === 0? HomeH: HomeD),
    path:'root'
  },
  {
    name:"活动",
    img: computed(()=> currentIndex.value === 1? ActiveH: ActiveD),
    path:'active'
  },
  {
    name:"个人",
    img: Personal,
    path:'personal'
  },
  {
    name:"客服",
    img: computed(()=> currentIndex.value === 3? CustomerH: CustomerD),
    path:'curtomer'
  },
  {
    name:"推广",
    img: computed(()=> currentIndex.value === 4? PromoteH: PromoteD),
    path:'promote'
  },
])

const handleClick = (item:any,index:number) =>{
  if(item.path === route.name) return
  currentIndex.value = index
  router.push({name:item.path})
}

</script>
<style scoped lang="scss">
.footer{
  height: 60px;
  padding: 10px 15px;
  display: flex;
  background: var(--nut-white);
  box-shadow: 0 -2px 4px #00000040;
  overflow: visible;
  .items{
    flex: 1;
    text-align: center;
    cursor: pointer;
    img{
      height: 28px;
      width: 28px;
    }
    div{
      margin-top:-12px;
      font-size: var(--nut-font-size-2);
    }
    .active{
        color: var(--nut-primary-color) ;
      }
      .noraml{
        color: var(--nut-text-color4);
      }
    &:nth-of-type(3){
      img{
        height: 48px;
        width:  48px;
        position: absolute;
        bottom: 32px;
        left: calc(50% - 24px);
      }
      div{  
        margin-top:18px;
        font-size: var(--nut-font-size-3);
      }
    }
  }
}

</style>