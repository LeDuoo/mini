import api from '../../api';
const FILE_BASE_NAME = 'tmp_base64src';
const app =  getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		posterIshow: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (e) {
		var partnerUserInfo = wx.getStorageSync('partnerUserInfo');
		var that = this;
		if (partnerUserInfo) {
			this.setData({
				partnerUserInfo
			})
		} else {
			wx.reLaunch({
				url: './../partner_login/partner_login'
			})
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
		if (partnerUserInfo) {
			this.setData({
				partnerUserInfo
			})
		} else {
			wx.reLaunch({
				url: './../partner_login/partner_login'
			})
		}
		this.Junior();
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
	cancellationAction() {
		var that = this;
		wx.showModal({
			title: '系统提示',
			content: '是否注销商城',
			success(res) {
				if (res.confirm) {
					wx.clearStorageSync();
					that.setData({
						partnerUserInfo: ""
					})
					wx.reLaunch({
						url: '../user/user'
					})
				} else if (res.cancel) {

				}
			}
		})
	},
	
	/**
	 * base64图片转本地图片
	 */
	base64src(base64data, cb) {
    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
    console.log(">>>>>>>>>>>>",base64data)
		if (!format) {
		  return (new Error('ERROR_BASE64SRC_PARSE'));
		}
		var str = "tmp_base64src"+Math.random()*1000;
		const filePath = `${wx.env.USER_DATA_PATH}/${str}.${format}`;
		const buffer = wx.base64ToArrayBuffer(bodyData);
		const fsm = wx.getFileSystemManager();
		fsm.writeFile({
			filePath,
			data: buffer,
			encoding: 'binary',
			success() {
				cb(filePath);
			},
			fail() {
				return (new Error('ERROR_BASE64SRC_WRITE'));
			},
		});
	},
	/**
	 * 预览图片
	 */
	previewImage0() {
		var poster = this.data.JuniorImg;
		var urls = [];
		urls.push(poster)
		wx.previewImage({
			current: poster,
			urls,
			success(res) {

			},
			fail(res) {

			}
		})
	},
	/**
	 * 预览图片
	 */
	previewImage() {
		var poster = this.data.JuniorImg;
		var urls = [];
		urls.push(poster)
		wx.previewImage({
			current: poster,
			urls,
			success(res) {

			},
			fail(res) {

			}
		})
	},
	/**
	 * 保存图片到系统相册
	 */
	submitAction() {
		var poster = this.data.JuniorImg;
		app.picture(poster,2)
	},
	/**
	 * 获取二维码
	 */
	Junior() {
		var that = this;
		wx.request({
			url: api.apiServer + "?s=Wechat.Partner.PartnerCode",
			method: "GET",
			data: {
				unionid: that.data.partnerUserInfo.unionid
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: function (res) {
        console.log(res.data.data)
				if (res.data.code == 200) {
          var qrcode = "data:image/jpg;base64," + res.data.data;
          
					that.base64src(qrcode, res1 => {
            console.log(res1)
						that.setData({
							JuniorImg: res1
						})
					});
					that.setData({
						Junior: res.data.data
					})
				} else {

				}

			},
			fail: function (res) {


			}
		})
	},
})