import api from '../../api';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		page:1,
		Junior:[],
		data:{
			total_profit:{
				total_profit:0
			}
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (e) {
		var myDate = new Date();
		var currYear = myDate.getFullYear();
		var currMonth = (myDate.getMonth() + 1) < 10 ? '0' + (myDate.getMonth() + 1) : (myDate.getMonth() + 1)
		var currDate = myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate();
		var date = '' + currYear + '-' + currMonth + '-' + currDate;
		var end_time = '' + currYear + '-' + currMonth + '-' + currDate;
		var end_time1 = '' + currYear + '-' + currMonth + '-' + currDate;
		var start_time = '' + currYear + '-' + currMonth + '-' +'01';
		this.setData({
		  start_time,
		  end_time,
		  end_time1
		})
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
		var partnerUserInfo = wx.getStorageSync('partnerUserInfo');
		var that = this;
        if(partnerUserInfo){
            this.setData({
                partnerUserInfo 
            })
        }else{
            wx.reLaunch({
                url: './../partner_login/partner_login'
              })
		}  
		wx.getSystemInfo({
			complete: (res) => {
				if(res.safeArea.top>40){
					that.setData({
					  isIpx:1
					})
				}
			}
		  })
		  that.setData({
			Junior: "",
			data: ""
		})
		  this.Income();
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
		var page = this.data.page;
		page++;
		this.setData({
			page
		})
		this.Income();
	},
	/**
	 * 选择查询订单开始开始时间
	 */
	bindstart(e){
		var start_time = e.detail.value;
		this.setData({
			page:1,
			start_time,
			Junior:[],
			data:0
		})
		this.Income();
	},
		/**
	 * 选择查询订单结束时间
	 */
	bindEnd(e){
		var end_time = e.detail.value;
		this.setData({
			page:1,
			end_time,
			Junior:[],
			data:0
		})
		this.Income();
	},
	/**
	 * 收益详情
	 */
	Income(){
		var that = this;
        wx.request({
            url: api.apiServer + "?s=Wechat.drawal.Income",
            method: "POST",
            data: {
				id:that.data.partnerUserInfo.id,
				start_time:that.data.start_time,
				end_time:that.data.end_time,
				page:that.data.page,
				type:1
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
			   var list = that.data.Junior;
			   var Junior = [...list,...res.data.data.order]
			   if(res.data.code==200){
					that.setData({
						Junior,
						data:res.data.data
					})
			   }else{
				that.setData({
					Junior:[],
					data:res.data.data
				})
			   }

            },
            fail: function (res) {
             

            }
        })
	},
})