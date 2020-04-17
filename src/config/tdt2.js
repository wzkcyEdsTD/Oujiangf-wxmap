export let jiaoyuConfig = {
  outFields:[
    'tdt.DBO.教育.FEATUREGUID',
    'tdt.DBO.教育.FCODE',
    'tdt.DBO.教育.NAME',
    'tdt.DBO.教育.ADDRESS',
    'tdt.DBO.教育.TYPE',
    'tdt.DBO.教育.WEBSITE',
    'tdt.DBO.教育.TAG',
    'tdt.DBO.教育.SUMMARY',
    'tdt.DBO.教育.secondCheck',
    'tdt.DBO.教育.HOTSPOT',
    'tdt.DBO.教育.AREA',
    'tdt.DBO.教育.PHONE',
    'tdt.DBO.教育.BXXZ',
    'tdt.DBO.教育.DEFINING_TAG',
    'tdt.DBO.教育.SJFW',
    'tdt.DBO.教育.SZXZJD',
    'tdt.DBO.教育.YZBM',
    'tdt.DBO.教育.JDTSDH',
    'tdt.DBO.教育.HONOR',
    'tdt.DBO.教育.XQF',
    'tdt.dbo.t_base_photo.ServerUrl',
    'tdt.dbo.t_base_photo.SmallLocation',
    'tdt.dbo.t_base_photo.Location',
    'tdt.dbo.t_base_photo.Name'
  ],
  replace:function (obj) {
    let attributes = obj.attributes;
    obj.attributes = JSON.parse(JSON.stringify(attributes).replace(/tdt\.DBO\.教育\.|tdt.dbo.t_base_photo\./gi,''));
  }
}

export let nongyeConfig = {
  outFields1:[
    'tdt.DBO.景区景点.FEATUREGUID',
    'tdt.DBO.景区景点.FCODE',
    'tdt.DBO.景区景点.NAME',
    'tdt.DBO.景区景点.ADDRESS',
    'tdt.DBO.景区景点.PHONE',
    'tdt.DBO.景区景点.WEBSITE',
    'tdt.DBO.景区景点.SUMMARY',
    'tdt.DBO.景区景点.OPENTIME',
    'tdt.DBO.景区景点.PRICE',
    'tdt.DBO.景区景点.WAY',
    'tdt.DBO.景区景点.FEATURE',
    'tdt.DBO.景区景点.USINGTIME',
    'tdt.DBO.景区景点.ACCOMMODATION',
    'tdt.DBO.景区景点.SPECIALITY',
    'tdt.DBO.景区景点.TAG',
    'tdt.DBO.景区景点.POPULATION',
    'tdt.DBO.景区景点.ACREAGE',
    'tdt.DBO.景区景点.PRICE',
    'tdt.DBO.景区景点.WAY',
    'tdt.DBO.景区景点.TRANSPORTATION',
    'tdt.DBO.景区景点.AREA',
    'tdt.DBO.景区景点.GRADE',
    'tdt.DBO.景区景点.RANGE',
    'tdt.DBO.景区景点.MONTH',
    'tdt.DBO.景区景点.STYLE',
    'tdt.DBO.景区景点.PRICE_number',
    'tdt.DBO.景区景点.HOTSPOT',
    'tdt.DBO.景区景点.TYPE',
    'tdt.DBO.景区景点.DEFINING_TAG',
    'tdt.dbo.t_base_photo.ServerUrl',
    'tdt.dbo.t_base_photo.SmallLocation',
    'tdt.dbo.t_base_photo.Location',
    'tdt.dbo.t_base_photo.Name'
  ],
  outFields2:[
    'tdt.DBO.餐饮.FEATUREGUID',
    'tdt.DBO.餐饮.FCODE',
    'tdt.DBO.餐饮.NAME',
    'tdt.DBO.餐饮.ADDRESS',
    'tdt.DBO.餐饮.PHONE',
    'tdt.DBO.餐饮.WEBSITE',
    'tdt.DBO.餐饮.SUMMARY',
    'tdt.DBO.餐饮.OPENTIME',
    'tdt.DBO.餐饮.PRICE',
    'tdt.DBO.餐饮.SIZE',
    'tdt.DBO.餐饮.FEATURE',
    'tdt.DBO.餐饮.WHETHER_ACCOM',
    'tdt.DBO.餐饮.ACCOMMODATION',
    'tdt.DBO.餐饮.SPECIALITY',
    'tdt.DBO.餐饮.TAG',
    'tdt.DBO.餐饮.AREA',
    'tdt.DBO.餐饮.HOTSPOT',
    'tdt.DBO.餐饮.HANCY',
    'tdt.DBO.餐饮.PROMOTION',
    'tdt.DBO.餐饮.PRICE_number',
    'tdt.DBO.餐饮.DEFINING_TAG',
    'tdt.dbo.t_base_photo.ServerUrl',
    'tdt.dbo.t_base_photo.SmallLocation',
    'tdt.dbo.t_base_photo.Location',
    'tdt.dbo.t_base_photo.Name'
  ],
  outFields3:[
    'tdt.DBO.消费.FEATUREGUID',
    'tdt.DBO.消费.FCODE',
    'tdt.DBO.消费.NAME',
    'tdt.DBO.消费.ADDRESS',
    'tdt.DBO.消费.PHONE',
    'tdt.DBO.消费.WEBSITE',
    'tdt.DBO.消费.SUMMARY',
    'tdt.DBO.消费.OPENTIME',
    'tdt.DBO.消费.TAG',
    'tdt.DBO.消费.AREA',
    'tdt.DBO.消费.HOTSPOT',
    'tdt.DBO.消费.DEFINING_TAG',
    'tdt.dbo.t_base_photo.ServerUrl',
    'tdt.dbo.t_base_photo.SmallLocation',
    'tdt.dbo.t_base_photo.Location',
    'tdt.dbo.t_base_photo.Name'
  ],
  outFields4:[
    'tdt.DBO.住宿.FEATUREGUID',
    'tdt.DBO.住宿.FCODE',
    'tdt.DBO.住宿.NAME',
    'tdt.DBO.住宿.ADDRESS',
    'tdt.DBO.住宿.PHONE',
    'tdt.DBO.住宿.WEBSITE',
    'tdt.DBO.住宿.SUMMARY',
    'tdt.DBO.住宿.TAG',
    'tdt.DBO.住宿.AREA',
    'tdt.DBO.住宿.HOTSPOT',
    'tdt.DBO.住宿.PRICE_number',
    'tdt.DBO.住宿.WECHAT',
    'tdt.DBO.住宿.PRICE',
    'tdt.DBO.住宿.FEATURE',
    'tdt.DBO.住宿.DEFINING_TAG',
    'tdt.dbo.t_base_photo.ServerUrl',
    'tdt.dbo.t_base_photo.SmallLocation',
    'tdt.dbo.t_base_photo.Location',
    'tdt.dbo.t_base_photo.Name'
  ],
  outFields5:[
    'tdt.DBO.乡村振兴示范带范围面.FEATUREGUID',
    'tdt.DBO.乡村振兴示范带范围面.FCODE',
    'tdt.DBO.乡村振兴示范带范围面.NAME',
    'tdt.DBO.乡村振兴示范带范围面.FANWEI',
    'tdt.DBO.乡村振兴示范带范围面.AREA',
    'tdt.DBO.乡村振兴示范带范围面.SUMMARY',
    'tdt.DBO.乡村振兴示范带范围面.HOTSPOT',
    'tdt.DBO.乡村振兴示范带范围面.SHAPE',
    'tdt.DBO.乡村振兴示范带范围面.DEFINING_TAG',
    'tdt.dbo.t_base_photo.ServerUrl',
    'tdt.dbo.t_base_photo.SmallLocation',
    'tdt.dbo.t_base_photo.Location',
    'tdt.dbo.t_base_photo.Name'
  ],
  outFields6:[
    'tdt.DBO.永嘉农事活动.FEATUREGUID',
    'tdt.DBO.永嘉农事活动.FCODE',
    'tdt.DBO.永嘉农事活动.NAME',
    'tdt.DBO.永嘉农事活动.DATE',
    'tdt.DBO.永嘉农事活动.ADDRESS',
    'tdt.DBO.永嘉农事活动.SUMMARY',
    'tdt.DBO.永嘉农事活动.HOTSPOT',
    'tdt.DBO.永嘉农事活动.TAG',
    'tdt.DBO.永嘉农事活动.DEFINING_TAG',
    'tdt.dbo.t_base_photo.ServerUrl',
    'tdt.dbo.t_base_photo.SmallLocation',
    'tdt.dbo.t_base_photo.Location',
    'tdt.dbo.t_base_photo.Name'
  ],
  outFields7:['*'],
  outFields8:[
    'tdt.DBO.休闲.FEATUREGUID',
    'tdt.DBO.休闲.FCODE',
    'tdt.DBO.休闲.NAME',
    'tdt.DBO.休闲.ADDRESS',
    'tdt.DBO.休闲.PHONE',
    'tdt.DBO.休闲.WEBSITE',
    'tdt.DBO.休闲.OPENTIME',
    'tdt.DBO.休闲.HOTSPOT',
    'tdt.DBO.休闲.THEME',
    'tdt.DBO.休闲.PRICE',
    'tdt.DBO.休闲.ACCOMMODATION',
    'tdt.DBO.休闲.CATERING',
    'tdt.DBO.休闲.SPECIALITY',
    'tdt.DBO.休闲.TAG',
    'tdt.DBO.休闲.HOTSPOT',
    'tdt.DBO.休闲.SUMMARY',
    'tdt.DBO.休闲.DEFINING_TAG',
    'tdt.dbo.t_base_photo.ServerUrl',
    'tdt.dbo.t_base_photo.SmallLocation',
    'tdt.dbo.t_base_photo.Location',
    'tdt.dbo.t_base_photo.Name'
  ],
  outFields9:[
    'tdt.DBO.旅游线路.FEATUREGUID',
    'tdt.DBO.旅游线路.FCODE',
    'tdt.DBO.旅游线路.NAME',
    'tdt.DBO.旅游线路.HOTSPOT',
    'tdt.DBO.旅游线路.AREA',
    'tdt.DBO.旅游线路.ADDRESS',
    'tdt.DBO.旅游线路.SUMMARY',
    'tdt.DBO.旅游线路.ROUTE',
    'tdt.DBO.旅游线路.TAG',
    'tdt.DBO.旅游线路.DEFINING_TAG',
    'tdt.dbo.t_base_photo.ServerUrl',
    'tdt.dbo.t_base_photo.SmallLocation',
    'tdt.dbo.t_base_photo.Location',
    'tdt.dbo.t_base_photo.Name'
  ],
  nameConfig:['景区景点','餐饮','消费','住宿','乡村振兴示范带范围面','永嘉农事活动','农业旅游','休闲','旅游线路'],
  replace:function (obj) {
    let attributes = obj.attributes;
    obj.attributes = JSON.parse(JSON.stringify(attributes).replace(/tdt\.DBO\..*?\.|tdt.dbo.t_base_photo\./gi,''));
  }
}

export let nConfig2 = {

}
/*
tdt.DBO.景区景点.OBJECTID ( type: esriFieldTypeOID , alias: OBJECTID )
tdt.DBO.景区景点.FEATUREGUID ( type: esriFieldTypeString , alias: 永久固定码 , length: 32 )
tdt.DBO.景区景点.FCODE ( type: esriFieldTypeString , alias: 分类代码 , length: 32 )
tdt.DBO.景区景点.NAME ( type: esriFieldTypeString , alias: 名称 , length: 64 )
tdt.DBO.景区景点.ADDRESS ( type: esriFieldTypeString , alias: 地址 , length: 255 )
tdt.DBO.景区景点.PHONE ( type: esriFieldTypeString , alias: 电话 , length: 254 )
tdt.DBO.景区景点.WEBSITE ( type: esriFieldTypeString , alias: 网址 , length: 254 )
tdt.DBO.景区景点.STYLENAME ( type: esriFieldTypeString , alias: 符号化字段 , length: 20 )
tdt.DBO.景区景点.UPDATESTATUS ( type: esriFieldTypeString , alias: 更新类型 , length: 1 )
tdt.DBO.景区景点.REMARK ( type: esriFieldTypeString , alias: 备注 , length: 255 )
tdt.DBO.景区景点.SUMMARY ( type: esriFieldTypeString , alias: 简介 , length: 2000 )
tdt.DBO.景区景点.OPENTIME ( type: esriFieldTypeString , alias: 开放时间 , length: 50 )
tdt.DBO.景区景点.PRICE ( type: esriFieldTypeString , alias: 价格 , length: 255 )
tdt.DBO.景区景点.WAY ( type: esriFieldTypeString , alias: 购票途径 , length: 255 )
tdt.DBO.景区景点.FEATURE ( type: esriFieldTypeString , alias: 特色 , length: 255 )
tdt.DBO.景区景点.USINGTIME ( type: esriFieldTypeString , alias: 耗时 , length: 50 )
tdt.DBO.景区景点.ACCOMMODATION ( type: esriFieldTypeString , alias: 周边住宿 , length: 255 )
tdt.DBO.景区景点.CATERING ( type: esriFieldTypeString , alias: 周边餐饮 , length: 255 )
tdt.DBO.景区景点.SPECIALITY ( type: esriFieldTypeString , alias: 周边特产 , length: 255 )
tdt.DBO.景区景点.USOURCE ( type: esriFieldTypeString , alias: 数据来源 , length: 250 )
tdt.DBO.景区景点.TAG ( type: esriFieldTypeString , alias: 标签 , length: 255 )
tdt.DBO.景区景点.POPULATION ( type: esriFieldTypeString , alias: 人口 , length: 255 )
tdt.DBO.景区景点.ACREAGE ( type: esriFieldTypeString , alias: 面积 , length: 2000 )
tdt.DBO.景区景点.COLL_INCOME ( type: esriFieldTypeString , alias: 村集体收入 , length: 255 )
tdt.DBO.景区景点.PER_INCOME ( type: esriFieldTypeString , alias: 村民人均收入 , length: 255 )
tdt.DBO.景区景点.HONOR ( type: esriFieldTypeString , alias: 荣誉 , length: 2000 )
tdt.DBO.景区景点.SHORTNAME ( type: esriFieldTypeString , alias: 简称 , length: 64 )
tdt.DBO.景区景点.TITLE ( type: esriFieldTypeString , alias: 称号 , length: 255 )
tdt.DBO.景区景点.TIME ( type: esriFieldTypeString , alias: 时间 , length: 2000 )
tdt.DBO.景区景点.TRANSPORTATION ( type: esriFieldTypeString , alias: 交通 , length: 2000 )
tdt.DBO.景区景点.SECONDARYNAME ( type: esriFieldTypeString , alias: 二级名称 , length: 254 )
tdt.DBO.景区景点.AREA ( type: esriFieldTypeString , alias: AREA , length: 254 )
tdt.DBO.景区景点.GRADE ( type: esriFieldTypeString , alias: 等级 , length: 255 )
tdt.DBO.景区景点.RANGE ( type: esriFieldTypeString , alias: 范围 , length: 2000 )
tdt.DBO.景区景点.ORIGIN ( type: esriFieldTypeString , alias: 库体来源 , length: 254 )
tdt.DBO.景区景点.FSCALE ( type: esriFieldTypeSmallInteger , alias: 要素显示的最小比例尺 )
tdt.DBO.景区景点.MONTH ( type: esriFieldTypeString , alias: 时令 , length: 2000 )
tdt.DBO.景区景点.STYLE ( type: esriFieldTypeString , alias: 筛选类型 , length: 255 )
tdt.DBO.景区景点.PRICE_number ( type: esriFieldTypeSmallInteger , alias: 均价 )
tdt.DBO.景区景点.HOTSPOT ( type: esriFieldTypeSmallInteger , alias: 热点 )
tdt.DBO.景区景点.TYPE ( type: esriFieldTypeString , alias: 类型 , length: 100 )
tdt.DBO.景区景点.PHOTO ( type: esriFieldTypeString , alias: 照片 , length: 2000 )
tdt.DBO.景区景点.VR ( type: esriFieldTypeString , alias: 全景 , length: 255 )
tdt.DBO.景区景点.Shape ( type: esriFieldTypeGeometry , alias: Shape )*/
