export let jiaoyuConfig = {
  outFields:[
    '*'
  ],
  replace:function (obj) {
    let attributes = obj.attributes;
    obj.attributes = JSON.parse(JSON.stringify(attributes).replace(/tdt\.DBO\.教育\.|tdt.dbo.t_base_photo\./gi,''));
  }
}

export let nongyeConfig = {
  outFields1:[
    '*'
  ],
  outFields2:[
    '*'
  ],
  outFields3:[
    '*'
  ],
  outFields4:[
    '*'
  ],
  outFields5:[
    '*'
  ],
  outFields6:[
    '*'
  ],
  outFields7:['*'],
  outFields8:[
    '*'
  ],
  outFields9:[
    '*'
  ],
  nameConfig:['景区景点','餐饮','消费','住宿','观光旅游_ZT','永嘉农事活动','农业旅游','休闲','旅游线路'],//乡村振兴示范带范围面
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
