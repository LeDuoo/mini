import api from '../../../api';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isIpx:0,
		partnerUserInfo:{sure_profit:0},
		flag:1,

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (e) {
		wx.setNavigationBarTitle({
            title: '提现'
        })
		var jkUserInfo = wx.getStorageSync('jkUserInfo');
        this.setData({
			jkUserInfo,
			num:e.money
        })
		var that = this;
		wx.getSystemInfo({
			complete: (res) => {
				if(res.safeArea.top>40){
					that.setData({
					  isIpx:1
					})
				}
			}
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
	onShow: function (e) {
		
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
     * 注销
     */
    cancellationAction(){
        var that = this;
        wx.showModal({
            title: '系统提示',
            content: '是否注销商城',
            success(res) {
                if (res.confirm) {
                    wx.clearStorageSync();
                    that.setData({
                        partnerUserInfo:""
                    })
                    wx.reLaunch({
                        url: '../../../pages/user/user'
                    })
                } else if (res.cancel) {

                }
            }
        }) 
	},
	/**
	 * 提现按钮
	 */
	formSubmit(e){
		var sure_profit = this.data.num;
		var val =  e.detail.value
		var user_name =val.user_name;
		var mobile =val.mobile;
		var money =val.money;
		var payment =val.payment;
		if (user_name == '') {
            wx.showToast({
                title: '收款人姓名必填',
                icon: 'none',
                duration: 1000
            })
            return false;
        }
		if (mobile == '') {
            wx.showToast({
                title: '联系电话必填',
                icon: 'none',
                duration: 1000
            })
            return false;
		}
		var reg = /^1[3456789]\d{9}$/;
        if(!reg.test(mobile)){
            wx.showToast({
                title: '您输入的手机号有误',
                icon: 'none',
                duration: 1000
            })
            return false; 
        }
		if (money == '') {
            wx.showToast({
                title: '提现金额必填',
                icon: 'none',
                duration: 1000
            })
            return false;
		}
		if (money <= 0) {
            wx.showToast({
                title: '提现金额必须大于0',
                icon: 'none',
                duration: 1000
            })
            return false;
		}
		if (parseInt(money) > parseInt(sure_profit)) {
            wx.showToast({
                title: '提现金额不能大于可提现总额',
                icon: 'none',
                duration: 1000
            })
            return false;
		}
		if (payment == '') {
            wx.showToast({
                title: '收款方式必填',
                icon: 'none',
                duration: 1000
            })
            return false;
		}
		if(this.data.flag==0){
			wx.showToast({
                title: '请不要频繁提交',
                icon: 'none',
                duration: 1000
            })
            return false;
		}
        this.Withdrawal(user_name,mobile,money,payment);
	},
	/**
	 * 提现接口
	 */
	Withdrawal(user_name,mobile,money,payment){
		var that = this;
        wx.request({
            url: api.jkServer+"?s=Wechat.drawal.Withdrawal",
            method: "POST",
            data: {
				id:that.data.jkUserInfo.id,
				user_name,
				mobile,
				money,
				payment
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
				console.log(res)
			   if(res.data.code==200){
				   that.setData({
						flag:0
				   })
				//    wx.hideLoading();
				   wx.showToast({
					 title: '申请已提交',
					 icon:"none",
					 duration:1000
				   })
					setTimeout(()=>{
						that.setData({
							flag:1
					   })	
					   wx.navigateTo({
						 url: '../cash-apply-list/cash-apply-list',
					   })
					},1000)
			   }else{
			
			   }

            },
            fail: function (res) {

            }
        })
	},
})