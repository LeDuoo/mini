import api from './api';
App({
  globalData: {
    c_id: 0
  },
  picture(poster, type) {
    console.log(poster)
    wx.getSetting({
      success(res1) {
        if (res1.authSetting['scope.writePhotosAlbum'] != undefined && !res1.authSetting['scope.writePhotosAlbum']) {
          console.log("111111111111")
          wx.openSetting({
            success(res2) {
              console.log("成功res2", res2)
              // res.authSetting = {
              //   "scope.userInfo": true,
              //   "scope.userLocation": true
              // }
            },
            fail(res2) {
              console.log("失败res2", res2)
            }
          })
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(res6) {
              console.log("res6成功", res6)
              if (type == 1) {
                wx.downloadFile({
                  url: poster,
                  success(res7) {
                    console.log("res7", res)
                    if (res7.statusCode == 200) {
                      var filePath = res.tempFilePath;
                      wx.saveImageToPhotosAlbum({
                        filePath,
                        success(res8) {
                          wx.showToast({
                            title: '已保存到系统相册可以去发图啦~',
                            icon: 'none',
                            duration: 1000
                          })
                        },
                        fail(res8) {

                        }
                      })
                    }
                  }
                })
              } else {
                wx.saveImageToPhotosAlbum({
                  filePath:poster,
                  success(res8) {
                    wx.showToast({
                      title: '已保存到系统相册可以去发图啦~',
                      icon: 'none',
                      duration: 1000
                    })
                  },
                  fail(res8) {

                  }
                })
              }


            }
          })
        } else {
          console.log("222222222")
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              if (type == 1) {
                wx.downloadFile({
                  url: poster,
                  success(res9) {
                    console.log("res9", res9)
                    if (res9.statusCode == 200) {
                      var filePath = res9.tempFilePath;
                      wx.saveImageToPhotosAlbum({
                        filePath,
                        success(res10) {
                          wx.showToast({
                            title: '已保存到系统相册可以去发图啦~',
                            icon: 'none',
                            duration: 1000
                          })
                        },
                        fail(res10) {
      
                        }
                      })
                    }
                  },
                  fail(res10) {
                    console.log(res10)
                  }
                })
              }else{
                wx.saveImageToPhotosAlbum({
                  filePath:poster,
                  success(res10) {
                    wx.showToast({
                      title: '已保存到系统相册可以去发图啦~',
                      icon: 'none',
                      duration: 1000
                    })
                  },
                  fail(res10) {
    
                  }
                })
              }
            }
          })
        
        


        }
      },
      fail(res11) {
        console.log(res11)

      }
    })
  },
  onLaunch: function () {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调

    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
    // 获取用户信息
    //更新用户缓存信息
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      wx.request({
        url: api.apiServer + "?s=Wechat.Auth.GetCustomerInfo",
        method: "GET",
        data: {
          unionid: userInfo.wx_unionid
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {

          if (res.data.data.tag == 1) {
            var userInfo = res.data.data.res;
            wx.setStorage({
              data: userInfo,
              key: 'userInfo',
            })
          } else {
            wx.showToast({
              title: res.data.data.res,
              icon: "none",
              duration: 2000
            })
            wx.clearStorage();
          }
        },
        fail: function (res) {

        }
      })
    } else {

    }
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})