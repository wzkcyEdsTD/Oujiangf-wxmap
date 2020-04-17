<style lang="less">
  .newidx {

    .vux-slider > .vux-swiper > .vux-swiper-item > a > .vux-img {
      background-size: 100% 100%;
    }

    .weui-grid:before {
      border-right: 1px solid #aaa;
    }

    .weui-grid:after {
      border-bottom: 1px solid #aaa;
    }

  }
</style>

<template>
  <div class="newidx">

    <!--幻灯片-->
    <swiper loop auto :list="swiperList"></swiper>

    <!--列表-->
    <!--<div class="header2_right">
      <div class="header_search" style="width:100%;left:0;border-bottom:1px solid #ddd;">
      <div class="man">
        <input type="text" v-model="page.key" class="text" @keyup.enter="searchkey" placeholder="请输入关键字搜索">
        <input class="btn" value="" @click="searchkey">
      </div>
      </div>
    </div>-->
    <div class="tmap-search3" style="border-bottom:1px solid #e5e5e5">
      <div class="searchicon">
        <img src="@/img/search_icon.png">
      </div>
      <div class="tmap-search-wrap" style="display: flex;flex:1;">
        <!-- 搜索 -->
        <div class="tmap-search-input">
          <input id="searchKey" type="text" ref="searchInput" placeholder="请输入关键字" v-model="page.key"
                 @keyup.enter="searchkey">
          <img src="@/images/clear.png" v-if="page.key.length" @click="()=>{
            page.key='';
            $refs.searchInput.focus();
          }" class="clearimg" alt="">
        </div>
      </div>
      <!-- 搜索按钮 -->
      <div @click="searchkey" class="search-btn">搜索</div>
    </div>
    <tab>
      <template v-if="catalogList">
        <tab-item v-for="(i,idx) in catalogList" :selected="group['show'+(idx+1)]"
                  @on-item-click="groupShow(i.id)">{{i.name}}
        </tab-item>
      </template>
    </tab>
    <div class="news-list" style="margin-top:15px;">
      <div class="news-item" style="display: flex;background: #fff;padding:8px;border-bottom: 1px solid #ddd"
           v-for="i in noticeList" @click="toNewsCon(i)">
        <div v-if="i.pic"><img :src="i.pic" alt="" width="90" height="60"></div>
        <div v-else><img src="@/images/nopic.jpg" width="90" height="60"></div>
        <div style="flex:3;padding-left:10px;">
          <div>{{i.title}}</div>
          <div style="color:#666;font-size: 12px;margin:5px 0;">{{i.summary}}</div>
          <div style="color:#666;font-size: 12px;">{{i.showtime|dateFormat}}</div>
        </div>
      </div>
    </div>
    <!-- 加载更多 -->
    <div v-if="hasNext" class="bottom-btn mt10" @click="loadMore">加载更多</div>
    <div v-else style="text-align:center;margin-top:15px;color:#666;">没有更多了~</div>
  </div>
</template>

<script>
    import {Swiper, Group, Cell, Tab, TabItem} from 'vux';
    import Util from '@/libs/util';

    export default {
        components: {
            Swiper, Group, Cell, Tab, TabItem
        },
        data() {
            return {
                //首页幻灯片
                swiperList: [],
                //首页公告
                noticeList: [],
                //分类按钮
                catalogList: [],
                //加载状态
                idxLoad: {
                    load1: false,
                    load2: false,
                    load3: false
                },
                page: {
                    nowPage: 1,
                    pageSize: 10,
                    key: "",
                    bean: {
                        columnid: 0
                    }
                },
                searchKey: "",
                hasNext: true,
                group: {
                    show1: true,
                    show2: false,
                    show3: false,
                    show4: false
                }
            }
        },
        filters: {
            substr(str) {
                return str.substr(0, 20);
            }
        },
        methods: {
            init() {
                // 显示
                this.$vux.loading.show();
                const self = this;
                //分类
                Util.ajax.post('/fapi/public/news/column').then(function (response) {
                    self.idxLoad.load3 = true;
                    self.isLoadingTrue();
                    // <tab-item :selected="group['show4']" @on-item-click="groupShow(12)">更新动态</tab-item>
                    response.data.push({
                        name: "更新动态",
                        id: 12
                    });
                    self.catalogList = response.data;
                    console.log(self.page.bean.columnid);
                    self.page.bean.columnid = self.page.bean.columnid || response.data[0].id;
                    //轮播图
                    Util.ajax.post('/fapi/public/news/swiper?columnid=' + self.page.bean.columnid).then(function (res2) {
                        self.idxLoad.load2 = true;
                        self.isLoadingTrue();
                        self.swiperList = [];
                        const list = res2.data;
                        if (list && list.length > 0) {
                            self.swiperList = [];
                            list.forEach(function (item) {
                                self.swiperList.push({
                                    url: item.link ? (item.link) : ("/newsContent?id=" + item.id),
                                    img: item.pic,
                                    title: item.title
                                });
                            });
                        }
                    });
                    self.loadList();
                });
            },
            groupShow(id) {
                this.page.bean.columnid = id;
                this.page.nowPage = 1;
                this.page.key = '';
                this.noticeList = [];
                const self = this;
                //轮播图
                Util.ajax.post('/fapi/public/news/swiper?columnid=' + self.page.bean.columnid).then(function (res2) {
                    self.idxLoad.load2 = true;
                    self.isLoadingTrue();
                    self.swiperList = [];
                    const list = res2.data;
                    if (list && list.length > 0) {
                        self.swiperList = [];
                        list.forEach(function (item) {
                            self.swiperList.push({
                                url: item.link ? (item.link) : ("/newsContent?id=" + item.id),
                                img: item.pic,
                                title: item.title
                            });
                        });
                    }
                });
                this.loadList();
                location.href = 'http://' + location.hostname + '/#/newslist?tab=' + (id == '2' ? 1 : (id == '3' ? 2 : id == '4' ? 3 : 4));
            },
            //公告详情
            toNewsCon(i) {
                if (i.link) {
                    location.href = i.link;
                } else {
                    this.$router.push({name: "NewsContent", query: {id: i.id}});
                }
            },
            //是否加载完毕
            isLoadingTrue() {
                if (this.idxLoad.load1 && this.idxLoad.load2 && this.idxLoad.load3) {
                    this.$vux.loading.hide();
                }
            },
            loadList() {
                const self = this;
                //公告
                self.idxLoad.load1 = false;
                this.$vux.loading.show();
                Util.ajax.post("/fapi/public/news/list", self.page).then(function (response) {
                    self.idxLoad.load1 = true;
                    self.isLoadingTrue();
                    const list = response.data.datas;
                    if (list && list.length > 0) {
                        list.forEach(function (item) {
                            self.noticeList.push(item);
                        });
                        self.checkNext();
                    } else {
                        self.hasNext = false;
                    }
                });
            },
            //检查下一页
            checkNext: function () {
                if (this.noticeList.length > 0 && (this.noticeList.length % this.page.pageSize) == 0) {
                    this.hasNext = true;
                } else {
                    this.hasNext = false;
                }
            },
            //加载更多
            loadMore: function () {
                this.page.nowPage++;
                this.loadList();
            },
            searchkey() {
                this.page.nowPage = 1;
                this.noticeList = [];
                this.loadList();
            }
        },
        mounted() {
            //http://wxsc.izkl.site/#/newsList?tab=1
            const query = this.$route.query;
            const self = this;
            if (query && query.tab) {
                console.log(query.tab);
                switch (query.tab) {
                    case "1":
                        self.page.bean.columnid = 2;
                        self.group.show1 = true;
                        break;
                    case "2":
                        self.page.bean.columnid = 3;
                        self.group.show1 = false;
                        self.group.show2 = true;
                        break;
                    case "3":
                        self.page.bean.columnid = 4;
                        self.group.show1 = false;
                        self.group.show3 = true;
                        break;
                    case "4":
                        self.page.bean.columnid = 12;
                        self.group.show1 = false;
                        self.group.show4 = true;
                        break;
                }
            }
            this.init();
        }
    }
</script>
