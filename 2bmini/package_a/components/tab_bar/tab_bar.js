Component({
  properties: {
        idx: {
            type: Number,
            value: 0
        }
    },
    data: {
        tabBar: [
        {
          "current": 0,
          "pagePath": "../../pages/index/index",
          "text": "首页",
          "iconClass":"icon-shouye",
          "iconTopClass":""
        },
        {
          "current": 0,
          "pagePath": "../../pages/category/category",
          "text": "分类",
          "iconClass":"icon-caidan-",
          "iconTopClass":""
        },
        {
          "current": 0,
          "pagePath": "../../../pages/index/index",
          "text": "特拱",
          "iconClass":"icon-shangchengda",
          "iconTopClass":"" //add-action

        },
        {
          "current": 0,
          "pagePath": "../../pages/cart/cart",
          "text": "购物车",
          "iconClass":"icon-gouwucheman",
          "iconTopClass":""
        },
        {
          "current": 0,
          "pagePath": "../../pages/user/user",
          "text": "我的",
          "iconClass":"icon-wodedangxuan",
          "iconTopClass":""
        },
      ]
    },
    observers: {
      "idx": function (id) {
        var otabbar = this.data.tabBar;
        otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
        otabbar[id]['current'] = 1;
        this.setData({ tabBar: otabbar});
      }
    },
    methods: {
      goToTab: function(e){
        var url = e.currentTarget.dataset.url;
        var index = e.currentTarget.dataset.index;
        console.log(index)
        var otabbar = this.data.tabBar;
        console.log("otabbar",otabbar)
        if(index==2){
          wx.switchTab({
            url: '../../../pages/index/index?id='+index
          })
        }else{
          wx.redirectTo({
            url:url+'?id='+index
          })
        }
       
      }
    }
});