<style lang="less" scroped>
  .aboutus{
    >h3,
    >section,
    >div{
      padding:0 10px 10px 10px;
      background:#fff;
    }
    h3{
      border-left:2px solid #409dee;
    }
    section{
      text-indent:2em;color:#777;
    }
    .tit2{
      color:#409dee;
      font-weight:bold;
    }
    .footer{
      padding:0;
      background: #0c59a3;
      color:#fff;
      display: flex;
      >div {
         flex:1;padding:10px;font-size: 12px;
        p{margin-bottom:5px;}
       }
    }
  }
</style>

<template>
  <div class="aboutus">
    <img src="@/images/about-top1.jpg" alt="">
    <h3>关于我们</h3>
    <section>天地图 温州”运行于互联网、移动通信网等公共网络，以门户网站和服务接口两种形式向公众、
      企业、专业部门、政府部门提供24小时不间断“一站式”地理信息服务。
    </section>
    <section>温州地理信息公共服务平台包括公众版、政务版、涉密版三个版本，“天地图 温州”就是公众版成果，
      是由国家测绘局主导建设的为公众、企业提供权威、可信、统一地理信息服务的大型互联网地理信息服务网站，旨在使测绘成果更好地服务大众。
    </section>
    <div  style="text-align: center;">
      <img src="@/images/about-pic1.jpg" style="margin:10px 0;" alt="" >
    </div>
    <section>各类用户可以通过“天地图 温州”的门户网站进行基于地理位置的信息浏览、查询、搜索、量算，以及路线规划等各类应用；
      也可以利用服务接口调用“天地图 温州”的地理信息服务，并利用编程接口将“天地图 温州”的服务资源嵌入到已有的各类应用系统（网站）中，
      并以“天地图 温州”的服务为支撑开展各类增值服务与应用，从而有效缓解地理信息资源开发利用中技术难度大、建设成本高、动态更新难等突出问题。
    </section>
    <section>“天地图 温州”门户网站会免费向公众提供服务企业需要利用“天地图 温州”的服务接口、API进行增值开发的，需要得到“天地图 温州”的授权。
    </section>
    <h3>建设单位</h3>
    <div class="tit2">温州市自然资源和规划局：</div>
    <!-- 底部 -->
    <div class="footer">
      <div>
        <p>主办单位：温州市自然资源和规划局</p>
        <p>地址：温州市自然资源和规划局</p>
        <p>电话：0577-88368008</p>
        <p>浙ICP备12026052号-2</p>
      </div>
      <div>
        <p>维护单位：温州市勘察测绘研究院（甲测字33002014）</p>
        <p>地址：温州市学院中路289号</p>
        <p>电话：0577-88338620</p>
        <p>电话：0577-88338620</p>
      </div>
    </div>
  </div>
</template>

<script>

</script>
