import api from '../../api';
import * as echarts from '../../ec-canvas/echarts';
var initChart = null;
var initChart1 = null;
var initChart2 = null;
var initChart3 = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: function (canvas, width, height,dpr) {
        initChart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr 
        });
        canvas.setChart(initChart);
        return initChart;
      }
    },
    ec1: {
      onInit: function (canvas, width, height,dpr) {
        initChart1 = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr 
        });
        canvas.setChart(initChart1);
        return initChart1;
      }
    },
    ec2: {
      onInit: function (canvas, width, height,dpr) {
        initChart2 = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr 
        });
        canvas.setChart(initChart2);
        return initChart2;
      }
    },
    ec3: {
      onInit: function (canvas, width, height,dpr) {
        initChart3 = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr 
        });
        canvas.setChart(initChart3);
        return initChart3;
      }
    },
    firstData: {

    },
    date: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var myDate = new Date();
    //获取当前年
    var year = myDate.getFullYear();
    //获取当前月
    var month = myDate.getMonth() + 1;
    this.setData({
      year,
      month
    })
    var userInfo = wx.getStorageSync('userInfo');
    var currYear = (new Date()).getFullYear();
    var currMonth = ((new Date()).getMonth() + 1) < 10 ? '0' + ((new Date()).getMonth() + 1) : ((new Date()).getMonth() + 1)
    var currDate = (new Date()).getDate() < 10 ? '0' + (new Date()).getDate() : (new Date()).getDate();
    var date = '' + currYear + '-' + currMonth + '-' + currDate;
    var enddate = '' + currYear + '-' + currMonth + '-' + currDate;
    this.setData({
      date,
      userInfo,
      enddate
    })
    this.QueryOrderProfit()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 返回上一页
   */
  returnRouter(){
    wx.navigateBack({
      url:"-1"
    })
  },
  /**
   * 进入提现记录页面
   */
  cashapplylistRouter(){
  
    wx.navigateTo({
      url: '../cash-apply-list/cash-apply-list',
    })
  },
  /**
   * 修改时间
   */
  bindDateChange(e){
    var date = e.detail.value;
    var year = e.detail.value.split("-")[0];
    var month = e.detail.value.split("-")[1]; 
    this.setData({
       date,
       year,
       month 
    })
     this.QueryOrderProfit();
  },
  /**
   * 获取用户表格
   */
  QueryOrderProfit() {
    var nowMonth = this.data.year + '-' +  this.data.month;
    var that = this;
    wx.request({
      url: api.apiServer + "?s=Wechat.Order.QueryOrderProfit",
      method: "GET",
      data: {
        unionid:that.data.userInfo.unionid,//  oOOoY5_H6SI2EPhNVqhixLdyn8X4,
        stime: nowMonth
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.ret==200){
          if(res.data.data.tag==1){
            that.setData({
              firstData: res.data
            })
            setTimeout(()=>{
              that.initChartOption();
            },500)
            setTimeout(()=>{
              that.initChartOption1();
            },1000)
            setTimeout(()=>{
              that.initChartOption2();
            },1500)
            setTimeout(()=>{
              that.initChartOption3();
            },2000)
          }else if(res.data.data.tag==0){
              wx.showToast({
                title: res.data.data.res,
                icon:"none",
                duration:2000
              })  
              setTimeout(()=>{
                wx.navigateBack({
                  url:"-1"
                })
              },2001)
          }else{
            that.setData({
              firstData: res.data
            })
            setTimeout(()=>{
              that.initChartOption();
            },500)
            setTimeout(()=>{
              that.initChartOption1();
            },1000)
            setTimeout(()=>{
              that.initChartOption2();
            },1500)
            setTimeout(()=>{
              that.initChartOption3();
            },2000)
          }
         
        
        }
       
      },
      fail: function (res) {

      }
    })
  },
  /**
   * 往期收益
   */
  initChartOption: function () {
    var dataInfo = this.data.firstData.data;
    initChart.setOption({
        tooltip: { //聚焦触发的效果，详情可参见。全局设置
          // trigger: 'axis',
        },
        title:{
          show:true,
          text:"往期收益图",
          textStyle:{
          fontWeight:"normal",
           color:"#1E90FF",
           fontSize:"16"
          },
          left:"center",
          top:"0"
        },
        xAxis: {
          type: 'category',
          axisLine: { //表示坐标轴是否显示
            show: false
          },
          axisLabel: {
            color: "#1B9AF1",
          },
          splitLine: { //表示分割线属性设置
            show: false
          },
          data: dataInfo.X,

        },
        yAxis: {
          type: 'value',
          axisLine: { //表示坐标轴是否显示
            show: false
          },
          splitLine: { //表示分割线属性设置
            show: false
          },
          axisLabel: {
            show: false
          },
          axisTick: { //y轴刻度线
            show: false
          },
        },
        series: [{
            type: 'bar',
            barGap: '-100%',
            silent: true,
            data: dataInfo.max_income, //数组最大值的  作为背景
            itemStyle: {
              normal: {
                color: '#E2EFFF',
                barBorderRadius: [5, 5, 0, 0],
              }
            }
          },
          {
            name: '收益',
            type: 'bar',
            data: dataInfo.daySaleDay,

            itemStyle: {
              normal: {
                color: '#34BFA3',
                barBorderRadius: [5, 5, 0, 0],

              }
            }
          },
        ],
        grid: {
          left: '2.5%',
          right: '2.5%',
          bottom: '2%',
          top: "3%",
          containLabel: true
        }
      }

    );
  },
  /**
   * 采购成本、毛利
   */
  initChartOption1: function () {
    var dataInfo = this.data.firstData.data;
    initChart1.setOption({
        tooltip: { //聚焦触发的效果，详情可参见。全局设置
          trigger: 'axis',
        },
        // legend: {},
        title: {
          text: "（采购成本、毛利)",
          x: 'center',
          y: "90%",
          textStyle: { //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
            fontSize: 12,
            fontStyle: 'normal',
            fontWeight: 'normal',
          },
        },
        // tooltip: {
        //   trigger: 'item',
        //   formatter: "",
        //   position:{right: '20%', top:0}
        // },
        xAxis: {
          type: 'category',
          axisLine: { //表示坐标轴是否显示
            show: false
          },
          axisLabel: {
            color: "#1B9AF1",
          },
          splitLine: { //表示分割线属性设置
            show: false
          },
          data: dataInfo.X,

        },
        yAxis: [{
          type: 'value',
          axisLine: { //表示坐标轴是否显示
            show: false
          },
          splitLine: { //表示分割线属性设置
            show: false
          },
          axisLabel: {
            show: false
          },
          axisTick: { //y轴刻度线
            show: false
          },
        }, {
          type: 'value',
          axisLine: { //表示坐标轴是否显示
            show: false
          },
          splitLine: { //表示分割线属性设置
            show: false
          },
          axisLabel: {
            show: false
          },
          axisTick: { //y轴刻度线
            show: false
          },
        }],
        series: [{
          name: '毛利',
          type: 'line', //折线图
          yAxisIndex: 1,
          // smooth: 0.5,
          // symbol: 'none',
          data: dataInfo.profitArrDay //销售-采购
        }, {
          name: '成本',
          type: 'bar',
          data: dataInfo.costArrDay,
          itemStyle: {
            normal: {
              color: '#34BFA3',
              barBorderRadius: [5, 5, 0, 0],

            }
          }
        }, ],
        grid: {
          left: '2.5%',
          right: '2.5%',
          bottom: '10%',
          top: "5%",
          containLabel: true
        }
      }

    );
  },
  /**
   * 佣金
   */
  initChartOption2: function () {
    var dataInfo = this.data.firstData.data;
    initChart2.setOption({
        tooltip: {
          trigger: 'item',
          formatter: "{b}:  {c} ({d}%)",
          position:{right: '20%', top:0}
        },
        grid: {
          left: '1.5%',
          right: '2.5%',
          bottom: '10%',
          top: "3%",
          containLabel: true
        },
        legend: {
          orient: 'vertical',
          x: 'right',
          y: "bottom",
          left: "38%",
          data: ['月利润', '佣金'],
        },
        series: [{
          // name: '总金额',
          type: 'pie',
          center: ['60%', '50%'], //设置饼图位置
          radius: ['25%', '40%'],
          color:['#1E90FF', '#FF6347'],
          avoidLabelOverlap: false,
          label: {
           
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              formatter: "{d}%",
              textStyle: {
                fontSize: '10',
                fontWeight: 'bold',

              }
            }
          },
          labelLine: {
              show: false
          },
          data: [{
              value: dataInfo.monthData.monthProfit,
              name: '月利润'
            },
            {
              value: dataInfo.monthData.commission,
              name: '佣金'
            },

          ]
        }],
      }

    );
  },
    /**
   * 售后统计
   */
  initChartOption3: function () {
    var dataInfo = this.data.firstData.data;
    initChart3.setOption({
        title:{
          show:true,
          text:"售后",
          textStyle:{
          fontWeight:"normal",
           color:"#1E90FF",
           fontSize:"16"
          },
          left:"center",
          top:"0"
        },
        tooltip: { //聚焦触发的效果，详情可参见。全局设置
          // trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          axisLine: { //表示坐标轴是否显示
            show: false
          },
          axisLabel: {
            color: "#1B9AF1",
          },
          splitLine: { //表示分割线属性设置
            show: false
          },
          data: dataInfo.X,

        },
        yAxis: {
          type: 'value',
          axisLine: { //表示坐标轴是否显示
            show: false
          },
          splitLine: { //表示分割线属性设置
            show: false
          },
          axisLabel: {
            show: false
          },
          axisTick: { //y轴刻度线
            show: false
          },
        },
        series: [{
            type: 'bar',
            barGap: '-100%',
            silent: true,
            data: dataInfo.max_income, //数组最大值的  作为背景
            itemStyle: {
              normal: {
                color: '#E2EFFF',
                barBorderRadius: [5, 5, 0, 0],
              }
            }
          },
          {
            name: '售后',
            type: 'bar',
            data: dataInfo.afterArrDay,

            itemStyle: {
              normal: {
                color: '#34BFA3',
                barBorderRadius: [5, 5, 0, 0],

              }
            }
          },
        ],
        grid: {
          left: '2.5%',
          right: '2.5%',
          bottom: '2%',
          top: "3%",
          containLabel: true
        }
      }

    );
  },
  /**
   * 提现
   */
  profitCashAction(){
    var money = this.data.firstData.data.allData.allProfitNoCash;
   wx.navigateTo({
     url: '../profitCash/profitCash?money='+money,
   })
    return false
    var cashMoney = "300";
    this.ProfitCash(cashMoney);
  },
  /**
   * 提现接口 废弃
   */
  ProfitCash(cashMoney){
    var that = this;
    wx.request({
      url: api.apiServer + "?s=Wechat.Order.ProfitCash",
      method: "POST",
      data: {
        unionid: that.data.userInfo.unionid,
        cashMoney,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
      
      },
      fail: function (res) {

      }
    })
  }

})