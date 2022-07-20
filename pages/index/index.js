// pages/index/index.js
var util = require('../../utils/util.js')
var app = getApp();

var xiaojuedingArr = require('../../utils/xiaojueding.js')
wx.setStorageSync('all', xiaojuedingArr);
wx.setStorageSync('num', 100);

function randomsort(a, b) {
   return Math.random() > .5 ? -1 : 1;
}

var page = {
   data: {
      size:{ //转盘大小可配置
         w:599,
         h:600
      },
      xiaojuedingArr: xiaojuedingArr.sort(randomsort),
      s_awards: '？',//结果

      //画布--------------------------------
      canvasWidth: 400,
      canvasHeight: 650,
      showCanvasFlag: false,

      colorArr: [
         '#fe6f68',
         '#ffb973',
         '#ffd972',
         '#e6f58c',
         '#91f8f5',
         '#95b3f3',
         '#bca2e9'
      ],
      fontArr: ['italic', 'oblique', 'normal'],
      sizeArr: [12, 14, 16, 18, 20, 22, 24, 26, 28],
   },
   //接收当前转盘初始化时传来的参数
   getData(e){
      this.setData({
         awardsConfig: e.detail,
      })
   },
   //接收当前转盘结束后的答案选项
   getAwards(e) {
      this.setData({ 
         s_awards: e.detail.end ? "？" : e.detail.s_awards,
      })
   },
   //开始转
   startZhuan(e) {
      this.setData({
          zhuanflg: e.detail ? true : false
      })
   },


   onLoad: function (options) {
      console.log('=========onload============');
      this.zhuanpan = this.selectComponent("#zhuanpan");
   },
   
   //点击切换转盘选项
   xiaojueding(e) {
      var that = this, idx = e.currentTarget.dataset.idx, xiaojuedingArr = that.data.xiaojuedingArr;
      if (!that.data.zhuanflg) {
         for (let x in xiaojuedingArr) {
            if (idx == x && xiaojuedingArr[x].option != that.data.awardsConfig.option) {
               that.zhuanpan.switchZhuanpan(xiaojuedingArr[x]);//切换当前转盘数据选项 
               return;
            }
         }
      }
   },
   
   onShow: function (e) {
      console.log('============onShow============');
      var that = this, switchTab = wx.getStorageSync('switchTab'), all = wx.getStorageSync('all'), xiaojuedingArr = that.data.xiaojuedingArr;

      //判断从热门小决定 还是个人小决定跳转过来的 还是编辑页面跳过来的
      all = app.globalData.defaultJueding ? xiaojuedingArr : app.globalData.myJueding ? all : xiaojuedingArr;
      
      
      //跳转过来的
      if (!util.isNull(switchTab)) {
         wx.showLoading({
            title: '加载中',
         })
         switchTab = switchTab == '00' ? '0' : switchTab;
         setTimeout(function () {
            for (let i in all) {
               if (all[i].id == switchTab) {
                  that.zhuanpan.switchZhuanpan(all[i], true);//切换当前转盘数据选项 
                  that.setData({
                     zhuanflg:false
                  })
                  break;
               }
            }
            wx.hideLoading();
         }, 500)
      }
   },

   //数组随机取出一个数
   arrayRandomTakeOne: function (array) {
      var index = Math.floor((Math.random() * array.length + 1) - 1);
      return array[index];
   }
}
Page(page);