//不需要登录
export const appRouter = [
	{
		path: '/',
		name: 'Home',
		meta: {title: '信用地图'},
		component: resolve => {
			require(['@/components/home/Home'], resolve);
		}
	},
	{
		path: '/nongye',
		name: 'nongye',
		meta: {title: '信用地图'},
		component: resolve => {
			require(['@/components/nongye/index'], resolve);
		}
	},
	{
		path: '/nongye/list',
		name: 'nongyeList',
		meta: {title: '信用地图'},
		component: resolve => {
			require(['@/components/nongye/NewsList'], resolve);
		}
	},
	{
		path: '/nongye/content',
		name: 'nongyeCon',
		meta: {title: '文章内容'},
		component: resolve => {
			require(['@/components/nongye/NewsContent'], resolve);
		}
	},
	{
		path: '/nmap',
		name: 'nongyeMap',
		meta: {title: '信用地图'},
		component: resolve => {
			require(['@/components/nongye/map'], resolve);
		}
	},
	{
		path: '/nlist',
		name: 'nlist',
		meta: {title: '信用地图'},
		component: resolve => {
			require(['@/components/nongye/zhuantiList.vue'], resolve);
		}
	},
	{
		path: '/ncontent',
		name: 'ncontent',
		meta: {title: '信用地图'},
		component: resolve => {
			require(['@/components/nongye/listView.vue'], resolve);
		}
	},
	{
		path: '/daolan',
		name: 'daolan',
		meta: {title: '信用地图', keepAlive: true},
		component: resolve => {
			require(['@/components/nongye/daolantu'], resolve);
		}
	},
	{
		path: '/daolan-yj',
		name: 'daolan-yj',
		meta: {title: '信用地图', keepAlive: true},
		component: resolve => {
			require(['@/components/nongye-yj/daolantu'], resolve);
		}
	},
	{
		path: '/nongye-yj',
		name: 'nongye-yj',
		meta: {title: '信用地图'},
		component: resolve => {
			require(['@/components/nongye-yj/index'], resolve);
		}
	},
	{
		path: '/jiaoyu',
		name: 'jiaoyu',
		meta: {title: '教育'},//,keepAlive:true
		component: resolve => {
			require(['@/components/jiaoyu/index'], resolve);
		}
	},
	{
		path: '/jlist',
		name: 'jlist',
		meta: {title: '教育列表', keepAlive: true},
		component: resolve => {
			require(['@/components/jiaoyu/zhuantiList'], resolve);
		}
	},
	{
		path: '/xuequfanwei',
		name: 'xuequfanwei',
		meta: {title: '学区地图'},
		component: resolve => {
			require(['@/components/jiaoyu/xiaoxue'], resolve);
		}
	},
	{
		path: '/jmap',
		name: 'jmap',
		meta: {title: '教育资源'},
		component: resolve => {
			require(['@/components/jiaoyu/map'], resolve);
		}
	},
	{
		path: '/jiaoyu/listView',
		name: 'listView',
		meta: {title: '教育详情展示'},
		component: resolve => {
			require(['@/components/jiaoyu/listView'], resolve);
		}
	},
	{
		path: '/jiaotong',
		name: 'jiaotong',
		meta: {title: '交通查询', keepAlive: true},
		component: resolve => {
			require(['@/components/jiaotong/index'], resolve);
		}
	},
	{
		path: '/smap',
		name: 'smap',
		meta: {title: '市域铁路'},
		component: resolve => {
			require(['@/components/jiaotong/map'], resolve);
		}
	},
	{
		path: '/jingpinlx',
		name: 'jingpinlx',
		meta: {title: '精品路线'},
		component: resolve => {
			require(['@/components/jingpinlx/index'], resolve);
		}
	},
	{
		path: '/standard',
		name: 'standard',
		meta: {title: '标准地图'},
		component: resolve => {
			require(['@/components/maplist/list'], resolve);
		}
	},
	{
		path: '/standardDetail',
		name: 'standardDetail',
		meta: {title: '政务地图'},
		component: resolve => {
			require(['@/components/maplist/content'], resolve);
		}
	},
	{
		path: '/meizhouyitu',
		name: 'meizhouyitu',
		meta: {title: '瓯越·每周一图'},
		component: resolve => {
			require(['@/components/maplist/meizhou/list'], resolve);
		}
	},
	{
		path: '/mcontent',
		name: 'mcontent',
		meta: {title: ''},
		component: resolve => {
			require(['@/components/maplist/meizhou/content'], resolve);
		}
	},
	{
		path: '/mzmap',
		name: 'mzmap',
		meta: {title: ''},
		component: resolve => {
			require(['@/components/maplist/meizhou/map3'], resolve);
		}
	},
	//洞头每周一图
	{
		path: '/meizhouyitu-dt',
		name: 'meizhouyitu-dt',
		meta: {title: '洞头·每周一图'},
		component: resolve => {
			require(['@/components/maplist/meizhou/dongtou/list'], resolve);
		}
	},
	{
		path: '/mzmap-dt',
		name: 'mzmap-dt',
		meta: {title: ''},
		component: resolve => {
			require(['@/components/maplist/meizhou/dongtou/map'], resolve);
		}
	},
	//永嘉每周一图
	{
		path: '/meizhouyitu-yj',
		name: 'meizhouyitu-yj',
		meta: {title: '永嘉·每周一图'},
		component: resolve => {
			require(['@/components/maplist/meizhou/yongjia/list'], resolve);
		}
	},
	{
		path: '/mzmap-yj',
		name: 'mzmap-yj',
		meta: {title: ''},
		component: resolve => {
			require(['@/components/maplist/meizhou/yongjia/map'], resolve);
		}
	},
	//乐清每周一图
	{
		path: '/meizhouyitu-yq',
		name: 'meizhouyitu-yq',
		meta: {title: '乐清·每周一图'},
		component: resolve => {
			require(['@/components/maplist/meizhou/yueqing/list'], resolve);
		}
	},
	{
		path: '/mzmap-yq',
		name: 'mzmap-yq',
		meta: {title: ''},
		component: resolve => {
			require(['@/components/maplist/meizhou/yueqing/map'], resolve);
		}
	},
	{
		path: '/tsdt',
		name: 'tsdt',
		meta: {title: '特色地图', keepAlive: true},
		component: resolve => {
			require(['@/components/maplist/tese.vue'], resolve);
		}
	},
	{
		path: '/shinei',
		name: 'shinei',
		meta: {title: '室内地图'},
		component: resolve => {
			require(['@/components/maplist/shinei.vue'], resolve);
		}
	},
	{
		path: '/shinei2',
		name: 'shinei2',
		meta: {title: ''},
		component: resolve => {
			require(['@/components/maplist/shinei2.vue'], resolve);
		}
	},
	{
		path: '/tscon',
		name: 'tscon',
		meta: {title: '特色地图'},
		component: resolve => {
			require(['@/components/maplist/tscon.vue'], resolve);
		}
	},
	{
		path: '/newsList',
		name: 'newsList',
		meta: {title: '新闻资讯'},
		component: resolve => {
			require(['@/components/news/NewsList.vue'], resolve);
		}
	},
	{
		path: '/newsContent',
		name: 'NewsContent',
		meta: {title: '新闻详细'},
		component: resolve => {
			require(['@/components/news/NewsContent.vue'], resolve);
		}
	},
	{
		path: '/cehui',
		name: 'Cehui',
		meta: {title: '测绘成果'},//,keepAlive:true
		component: resolve => {
			require(['@/components/cehui/index.vue'], resolve);
		}
	},
	{
		path: '/aboutus',
		name: 'aboutus',
		meta: {title: '关于我们'},
		component: resolve => {
			require(['@/components/aboutus/index.vue'], resolve);
		}
	}
];

//需要登录
export const needLoginRouter = [];

export const routers = [
	...appRouter, ...needLoginRouter
];
