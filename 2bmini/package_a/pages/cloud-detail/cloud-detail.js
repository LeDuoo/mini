import api from '../../../api';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		Junior: [],
		data: {
			total_profit: {
				total_profit: 0
			}
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (e) {
		wx.setNavigationBarTitle({
            title: '收益详情'
        })
		var myDate = new Date();
		var currYear = myDate.getFullYear();
		var currMonth = (myDate.getMonth() + 1) < 10 ? '0' + (myDate.getMonth() + 1) : (myDate.getMonth() + 1)
		var currDate = myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate();
		var date = '' + currYear + '-' + currMonth + '-' + currDate;
		var end_time = '' + currYear + '-' + currMonth + '-' + currDate;
		var end_time1 = '' + currYear + '-' + currMonth + '-' + currDate;
		var start_time = '' + currYear + '-' + currMonth + '-' + '01';
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
		var jkUserInfo = wx.getStorageSync('jkUserInfo');
		var that = this;
		if (jkUserInfo) {
			this.setData({
				jkUserInfo
			})
		} else {

		}
		wx.getSystemInfo({
			complete: (res) => {
				if (res.safeArea.top > 40) {
					that.setData({
						isIpx: 1
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

	},
	/**
	 * 选择查询订单开始开始时间
	 */
	bindstart(e) {
		var start_time = e.detail.value;
		this.setData({
			start_time,
			Junior: [],
			data: 0

		})
		this.Income();
	},
	/**
	 * 选择查询订单开始开始时间
	 */
	bindEnd(e) {
		var end_time = e.detail.value;
		this.setData({
			end_time,
			Junior: [],
			data: 0
		})
		this.Income();
	},
	/**
	 * 收益详情
	 */
	Income() {
		var that = this;
		wx.request({
			url: api.jkServer + "?s=Wechat.drawal.Income",
			method: "POST",
			data: {
				id: that.data.jkUserInfo.id,
				start_time: that.data.start_time,
				end_time: that.data.end_time,
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: function (res) {
				if (res.data.code == 200) {
					
					var second = res.data.data.info.second;
					var maker = res.data.data.maker;
					var stair = res.data.data.info.stair;
					console.log("data::::",res.data.data)
					console.log("data::::",res.data.data.info)
					console.log("maker::::",maker)
					var arr = [];
					if(second.length>0){
						for(var i=0;i<second.length;i++){
							second[i].type=1;
							arr.push(second[i])
						}
					}
					if(stair.length>0){
						for(var i=0;i<stair.length;i++){
							stair[i].type=2;
							arr.push(stair[i])
						}
					}
					if(maker.length>0){
						for(var i=0;i<maker.length;i++){
							maker[i].type=3;
							arr.push(maker[i])
						}
					}
					that.setData({
						Junior:arr,
						data: res.data.data
					})
					console.log("arr",arr,that.data.Junior)
				} else {
					that.setData({
						Junior: [],
						data: res.data.data
					})
				}

			},
			fail: function (res) {


			}
		})
	},
})