import api from '../../../api';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        price: 0, //总价
        invoiceIshow: false, //选择发票弹出
        invoice: {
            object_type:"",//发票类型 1普通  2增值税
            object_number:"",
            object_title:""
        },
        isDefault: false, //选择积分抵扣
        isIpx: 0, //为1 苹果X以上  
        stockState:true,//无货不让提交订单
        freight:null,
        invoiceType:{
            check:false,
            title:"无需发票"
        },//是否需要开票
        money_pledge:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        wx.setNavigationBarTitle({
            title: '确认订单'
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
        var that = this;
        var jkUserInfo = wx.getStorageSync('jkUserInfo');
        var freight = wx.getStorageSync('company').company.post_price;
        var freight_price = wx.getStorageSync('company').company.freight_price;
        var company = wx.getStorageSync('company');
        this.setData({
            jkUserInfo,
            freight,
            company,
            freight_price,
            isDefault: false,
            invoiceType:{
                check:false,
                title:"无需发票"
            },//是否需要开票
        })
        var shoppingCart = wx.getStorageSync('shoppingCart')
        if(shoppingCart){
            console.log("true",shoppingCart)
        }else{
            wx.navigateBack({
                delta: 2
              })
              
        }
        var price = 0;
        var jdPrice=0;
        var num = 0;
        for (var i = 0; i < shoppingCart.length; i++) {
            price += Number(shoppingCart[i].price_default) * Number(shoppingCart[i].goods_number);
            num += Number(shoppingCart[i].goods_number)
            if(shoppingCart[i].source==1){
                jdPrice+=Number(shoppingCart[i].price_default) * Number(shoppingCart[i].goods_number);
            }
        }
        for (var i = 0; i < shoppingCart.length; i++) {
            // price += Number(shoppingCart[i].cus_price) * Number(shoppingCart[i].goods_number);
            // num += Number(shoppingCart[i].goods_number)
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
        this.setData({
            shoppingCart,
            price,
            num,
            jdPrice
        })

        this.QueryAddress();
       // this.GetInvoice();
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
     * 发票弹出显示
     */
    invoiceAction() {
        this.setData({
            invoiceIshow: true
        })
    },
    /**
     * 是否开票
     */
    switch1Change(){
       var invoice = this.data.invoice;
       var invoiceType = this.data.invoiceType;
       if(invoiceType.check){
        invoiceType.check=false;
        invoiceType.title = "无需开票"
       }else{
         invoiceType.check=true;
       }
       this.setData({
          invoiceType
       })
    },
    /**
     * 修改发票类型
     */
    invoiceClassAction(e) {
        var value = e.detail.value;
        var invoice = this.data.invoice;
        invoice.invoice_class = value;
        if (value == 1) {
            invoice.object_type = 1
        }
        if (value == 2) {
            invoice.object_type = 2
        }
        this.setData({
            invoice
        })
    },
    /**
     * 修改发票对象
     */
    objectTypeAction(e) {
        var value = e.detail.value;
        var invoice = this.data.invoice;
        invoice.object_type = value;
        this.setData({
            invoice
        })
    },
    /**
     * 用户没有收货地址进入添加收货地址
     */
    addressRoute() {
        wx.navigateTo({
            url: '../address/address',
        })
    },
    /**
     * 获取发票信息
     */
    formSubmit(e) {
        var invoice = e.detail.value;
        if(invoice.object_type==""){
            wx.showToast({
              title: '发票类型必填',
              icon:"none",
              duration:1500
            })
        return false
    }
        if(invoice.object_title==""){
                wx.showToast({
                  title: '发票抬头必填',
                  icon:"none",
                  duration:1500
                })
            return false
        }
        if(invoice.object_type==2){
            if(invoice.object_number==""){
                wx.showToast({
                  title: '企业税号必填',
                  icon:"none",
                  duration:1500
                })
                return false
            }
          
        }
        this.setData({
            invoice,
            invoiceIshow: false,
            invoiceType:{
                check:true,
                title:"需要发票"
            },
        })
       // this.AddInvoice();
    },
    /**
     * 隐藏发票弹出框
     */
    invoiceHidden() {
        var invoice = this.data.invoice;
        var invoiceType = this.data.invoiceType;
        if(invoice.object_type!=1&&invoice.object_type!=2){
            invoiceType.check=false;
            invoiceType.title="无需发票";
        }
        this.setData({
            invoiceIshow: false,
            invoiceType
        })
    },
    /**
     * 点击下单
     */
    placeOrderAction() {
        var that = this;
        var address = this.data.address;
        if(address&&address.length>0){
            if(this.data.stockState){
                wx.showModal({
                    title: '系统提示',
                    content: '确认立即下单吗',
                    success(res) {
                        if (res.confirm) {
                            var type = 5;
                            var list = {};
                            var invoice = that.data.invoice;
                            var invoiceType = that.data.invoiceType;
                            var address = that.data.address;
                            var shoppingCart = that.data.shoppingCart;
                            // if (invoice.object_account == "" || invoice.object_account == null) {
                            //     for (var i = 0; i < address.length; i++) {
                            //         if (address[i].is_default == 1) {
                            //             invoice.object_account = address[i].receiver;
                            //         }
                            //     }
                            // }
                            for (var i = 0; i < address.length; i++) {
                                if (address[i].is_default == 1) {
                                    list.buyer_address = '' + address[i].province + address[i].city + address[i].area + (address[i].town ? address[i].town : "") + address[i].address;
                                    list.buyer_mobile = address[i].mobile;
                                    list.buyer_name = address[i].receiver;
                                }
                            }
                            list.list = [];
                            var buyer_price = 0;
                            var jkUserInfo = that.data.jkUserInfo;
                            var score_residue = jkUserInfo.score_residue; //积分
                            var status = jkUserInfo.status;//是否可用积分抵扣
                            var money_scale = jkUserInfo.money_scale;//积分抵扣比例
                            var score_value = jkUserInfo.score_value; //现金等价积分比
                            var isDefault = that.data.isDefault;
                            for (var i = 0; i < shoppingCart.length; i++) {
                                var goods = {};
                                goods.goods_id = shoppingCart[i].id;
                                goods.goods_number = shoppingCart[i].goods_number;
                                goods.goods_type = shoppingCart[i].goods_type;
                                var price = shoppingCart[i].price_default;//价格
                                var m = price*money_scale;//最大抵扣金额
                                var n = (score_residue*100)/score_value;//积分可抵扣金额
                                console.log("可用积分",score_residue,n)
                                if(isDefault){
                                    if(status==1){
                                        if(score_residue>0){
                                            var money_pledge = n>=m?m:n;
                                            console.log(n,m)
                                            //  Math.ceil((money_pledge/100)*score_value)
                                            var use_score =  (money_pledge/100)*score_value;
                                            score_residue=score_residue-use_score;
                                            console.log("抵扣了多少钱",money_pledge)
                                            console.log("用了多少积分",use_score)
                                            console.log("剩余积分",score_residue)
                                            goods.use_score=use_score;
                                        }else{
                                            goods.use_score=0;
                                        }
                                    }else{
                                        goods.use_score=0;
                                    }
                                }else{
                                    goods.use_score=0;
                                }
                               
                                list.list.push(goods)
                            
                              
                                buyer_price += shoppingCart[i].price_open * shoppingCart[i].goods_number;
                              
                            }
                            if(!invoiceType.check){
                                invoice="";
                            }
                            list.buyer_price = buyer_price;
                            console.log(list)
                            that.Add(type, list, invoice)
                        } else if (res.cancel) {

                        }
                    }
                })
            }else{
                var stockArr = that.data.stockArr;
                var str = "";
                for(var i=0;i<stockArr.length;i++){
                    str += stockArr[i]+1+',';
                }
                wx.showToast({
                    title: '第'+(str)+'个商品该地区无货',
                    icon: 'none',
                    duration: 2000
                  })  
            }
        }else{
            wx.showToast({
                title: '请填写收货地址',
                icon: 'none',
                duration: 2000
              })
        } 
    },
    /**
     * 选择积分抵扣
     */
    allAction(){
        var isDefault = this.data.isDefault;
        var jkUserInfo = this.data.jkUserInfo;
        console.log("jkUserInfo",jkUserInfo)
        var score_residue = jkUserInfo.score_residue; //积分
        var status = jkUserInfo.status;//是否可用积分抵扣
        var money_scale = jkUserInfo.money_scale;//积分抵扣比例
        var price = this.data.price;//商品总价
        var score_value = jkUserInfo.score_value; //现金等价积分比
        console.log("积分",score_residue,"积分抵扣比例",money_scale,"价格",price,"现金等价积分比",score_value)
        var m = price*money_scale;//最大抵扣金额
        var n = (score_residue*100)/score_value;//积分可抵扣金额
        console.log("最大抵扣金额",m)
        console.log("积分可抵扣金额",n)
        if(status==1){
            if(score_residue>0){
                var money_pledge = n>=m?m:n;
                console.log("抵扣了多少钱",money_pledge)
                this.setData({
                    isDefault:!isDefault,
                    money_pledge
                })
                if(!this.data.isDefault){
                    this.setData({
                        money_pledge:0
                    })
                }
            }else{
                console.log(1)
                wx.showToast({
                    title: '积分不足',
                    icon:"none",
                    duration:"1500"
                  }) 
            }
           
        }else{
            console.log(2)
            wx.showToast({
              title: '未激活会员',
              icon: 'none',
              duration: 2000
            })
        }
        
    },
    /**
     * 获取用户收货地址
     */
    QueryAddress() {
        var that = this;
        wx.request({
            url: api.jkServer + "?s=Wechat.Customer.QueryAddress",
            method: "GET",
            data: {
                unionid: that.data.jkUserInfo.wx_unionid,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    var address = res.data.data;
                    that.setData({
                        address,
                    })
                    for (var i = 0; i < address.length; i++) {
                        if (address[i].is_default == '1') {
                            var address_id = address[i].id
                        }
                    }
                    var shoppingCart = that.data.shoppingCart;
                    if (shoppingCart.length > 0) {
                        var info = []; 
                        for (var i = 0; i < shoppingCart.length; i++) {
                            if (shoppingCart[i].source == '1') {
                                var chkStockObj = {
                                    "skuId": shoppingCart[i].goods_type,
                                    "num": shoppingCart[i].goods_number
                                };
                                info.push(chkStockObj);
                            }
                        }
                        if(info.length>0&&address_id!=undefined){
                            info = JSON.stringify(info);
                            //that.CheckJdGoodsStock(info, address_id)
                        }
                       
                    }
                }
            },
            fail: function (res) {

            }
        })
    },
    /**
     * 用户下单接口
     */
    Add(type, list, invoice) {
        var arr = list;
        list = JSON.stringify(list)
        invoice = JSON.stringify(invoice)
        var score = 0;
        for(var i=0;i<arr.list.length;i++){
            score += arr.list[i].use_score
        }
        console.log("消耗总积分:::",score)
        var that = this;
        wx.request({
            url: api.jkServer + "?s=Wechat.Order.Add",
            method: "POST",
            data: {
                openid: that.data.jkUserInfo.mini_openid,
                unionid: that.data.jkUserInfo.wx_unionid,
                type,
                list,
                score
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                console.log("1")
                if (res.data.ret == 200) {
                    var out_trade_no = res.data.data.res.order_sn;
                    var body = that.data.shoppingCart[0].goods_name;
                    that.WxMiniPay(out_trade_no, body);
                    wx.removeStorage({
                        key: 'shoppingCart'
                    })
                }
            },
            fail: function (res) {

            }
        })
    },
    /**
     * 支付接口
     */
    WxMiniPay(out_trade_no, body) {
        var that = this;
        wx.request({
            url: api.jkServer + "?s=Wechat.WxPay.WxMiniPay",
            method: "POST",
            data: {
                out_trade_no,
                body:"特拱商城微信小程序支付",
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var data = res.data.data.res;
                wx.requestPayment({
                    timeStamp: data.timeStamp,
                    nonceStr: data.nonceStr,
                    package: 'prepay_id=' + data.prepay_id,
                    signType: 'MD5',
                    paySign: data.paySign,
                    success(res) {
                        
                        wx.navigateTo({
                            url: '../order_list/order_list?status=2',
                          })
                    },
                    fail(res) {
                        wx.navigateTo({
                            url: '../order_list/order_list?status=0',
                          })
                    },
                    complete(res){
                    }
                })
            },

            fail: function (res) {

            }
        })
    },
    /**
     * 检查库存
     */
    CheckJdGoodsStock(info, address_id) {
        console.log(info)
        var that = this;
        var shoppingCart = this.data.shoppingCart;
        console.log(shoppingCart);
        var infoArr =  JSON.parse(info);
        console.log(infoArr)
        wx.request({
            url: api.jkServer + "?s=Wechat.Order.CheckJdGoodsStock",
            method: "GET",
            data: {
                unionid: that.data.jkUserInfo.wx_unionid,
                info,
                address_id,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if (res.data.ret == 200) {
                    if(res.data.data.tag==1){
                        var data = res.data.data.res;
                        var msg = 0;
                        var stockArr = [];
                        for(var j=0;j<shoppingCart.length;j++){
                            for(var i=0;i<data.length;i++){
                                console.log("j",shoppingCart[j].goods_type,"i",data[i].skuId)
                                if(shoppingCart[j].goods_type==data[i].skuId){
                                    if(data[i].stockStateId!=33&&data[i].stockStateId!=39&&data[i].stockStateId!=40){
                                        // console.log(i)
                                        wx.showToast({
                                            title: '第'+(j+1)+'个商品该地区无货',
                                            icon: 'none',
                                            duration: 2000
                                          })
                                          stockArr.push(j);
                                          that.setData({
                                            stockState:false  
                                          })
                                    }
                                }
                               
                            }
                        }
                      
                        that.setData({
                            stockArr  
                          })
                    }else{
                        var title =  res.data.data.res? res.data.data.res:"服务器连接失败";
                        wx.showToast({
                            title,
                            icon: 'none',
                            duration: 2000
                          }) 
                    }
                }else{
                    var title =  res.data.msg? res.data.msg:"服务器连接失败";
                    wx.showToast({
                        title,
                        icon: 'none',
                        duration: 2000
                      })
                }
            },
            fail: function (res) {

            }
        })
    },
     /**
     * 获取默认发票
     */
    GetInvoice() {
        var that = this;
        wx.request({
            url: api.jkServer + "?s=Wechat.Order.GetInvoice",
            method: "POST",
            data: {
                unionid: that.data.jkUserInfo.wx_unionid,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if(res.data.data.tag==1){
                    that.setData({
                        invoice: {
                            object_type:res.data.data.res.object_type,
                            object_number:res.data.data.res.object_number,
                            object_title:res.data.data.res.object_title
                        },
                        invoiceType:{
                            check:false,
                            title:"无需发票"
                        }
                    })
                    
              }else if(res.data.data.tag==2){
                that.setData({
                    invoiceType:{
                        check:false,
                        title:"无需发票"
                    }
                })
              }else if(res.data.data.tag==0){
                var title =  res.data.data.res? res.data.data.res:"服务器连接失败";
                  wx.showToast({
                    title,
                    icon: 'none',
                    duration: 1000,
                  })
              }
            },
            fail: function (res) {

            }
        })
    },
     /**
     * 新增发票发票
     */
    AddInvoice() {
        var that = this;
        var object_type = that.data.invoice.object_type;
        var object_title = that.data.invoice.object_title;
        var object_number = that.data.invoice.object_number;
        if(object_type==1){
            object_number="";
        }
        wx.request({
            url: api.jkServer + "?s=Wechat.Order.AddInvoice",
            method: "POST",
            data: {
                unionid: that.data.jkUserInfo.wx_unionid,
                object_type,
                object_title,
                object_number
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {


            },
            fail: function (res) {

            }
        })
    },

})