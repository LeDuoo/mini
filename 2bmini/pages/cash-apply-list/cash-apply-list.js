import api from '../../api';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		page:1,
		Examine:[]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (e) {
		var userInfo = wx.getStorageSync('userInfo');
		var that = this;
        if(userInfo){
            this.setData({
                userInfo 
            })
        }else{
          
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
		this.setData({
			Examine:""
		})
		this.Examine();
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
		this.setData({page})
		this.Examine();
	},
	/**
	 * 查看审核失败原因
	 */
	showAction(e){
		var id = e.currentTarget.dataset.id;
		var Examine = this.data.Examine;
		for(var i=0;i<Examine.length;i++){
			if(Examine[i].remark){
				Examine[i].show=0;
				if(id==Examine[i].id){
					Examine[i].show=1;
				}
			}
		}
		this.setData({Examine})
	},
	/**
	 * 提现列表接口
	 */
	Examine(){
		var that = this;
        wx.request({
            url: api.apiServer + "?s=Wechat.drawal.Examine",
            method: "POST",
            data: {
				id:that.data.userInfo.system_user_id,
				page:that.data.page
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
			   var Examine = res.data.data;
			   var list = that.data.Examine;
			   for(var i =0;i<Examine.length;i++){
					Examine[i].show =0;
			   }
			   Examine = [...list,...Examine];
			   if(res.data.code==200){
					that.setData({
						Examine
					})
			   }else{
					wx.showToast({
					  title: '暂无提现记录',
					  icon:"none",
					  duration:2000
					})
			   }
            },
            fail: function (res) {
            }
        })
	},
})