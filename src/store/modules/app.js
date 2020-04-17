import {routers} from '@/router/index';

const app = {
  state: {
    appTabbarIsShow: true,
    menuList: [],
    nowRoute:null,//当前所在路由
    pageOpenedList: [{
      title: '首页',
      path: '',
      name: 'home_index'
    }],
    currentPageName: '',
    routers: [
      routers
    ]
  },
  getters:{
    nowRoute(state) {
      if (!state.nowRoute) {
        state.nowRoute = localStorage.getItem('nowRoute')?JSON.parse(localStorage.getItem('nowRoute')):null;
      }
      return state.nowRoute ? state.nowRoute : null;
    }
  },
  mutations: {
    appLogout (state){
      state.menuList = [];
    },
    appTabbarShow (state, isShow){
      state.appTabbarIsShow = isShow ? true : false;
    },
    updateMenulist (state, resourceList) {
      state.menuList = resourceList;
    },
    setCurrentPageName (state, name) {
      state.currentPageName = name;
    },
    updateNowRoute(state,route){
      state.nowRoute = route;
      //console.log(route);
      localStorage.setItem('nowRoute',JSON.stringify({name:route.name,query:route.query}));
    }
  },
  actions: {}
};

export default app;
