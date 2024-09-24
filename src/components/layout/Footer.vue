<template>
  <div class="footer">
    <div class="items"  v-for="(item,index) in list" :key="index"  @click="handleClick(item)">
      <img :src="item.img" />
      <div>{{ item.name }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import HomeH from '@/assets/images/footer/home.png'
import { computed, reactive, ref } from 'vue'
import {useRouter,useRoute} from 'vue-router'
const router = useRouter()
const route = useRoute()
const currentIndex = ref(0)
const list = reactive([
  {
    name:"首页",
    img: computed(()=> currentIndex.value === 0? HomeH: HomeH),
    path:'root'
  },
  {
    name:"活动",
    img: computed(()=> currentIndex.value === 0? HomeH: HomeH),
    path:'root'
  },
  {
    name:"个人",
    img: computed(()=> currentIndex.value === 0? HomeH: HomeH),
    path:'personal'
  },
  {
    name:"客服",
    img: computed(()=> currentIndex.value === 0? HomeH: HomeH),
    path:'root'
  },
  {
    name:"推广",
    img: computed(()=> currentIndex.value === 0? HomeH: HomeH),
    path:'root'
  },
])

const handleClick = (item:any) =>{
  if(item.path === route.name)  return
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
      color: var(--nut-text-color4);
    }
  }
}
</style>