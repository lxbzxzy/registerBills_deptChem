const app = getApp()
const db = wx.cloud.database()
Page({
  onShareAppMessage: function () {
    return {
      title: '报销登录界面',
      path: '/pages/login/index'
    }
  },

  data:{
    input1:'',
    input2:'',
    wxId:'',
    wxlogin:false,
    team:''
  },
  //输入框函数
  input1:function(e){
    this.setData({input1:e.detail.value})
  },
  input2: function (e) {
    this.setData({input2: e.detail.value })
  },
  //先确认微信登录
  onLoad:function(){
    wx.showToast({
      title: '查询中',
      icon:'loading',
      duration:500
    })
    var that=this;//回调中不能使用this
    wx.cloud.callFunction({
      name:'directLogin',
      success: function (res) {
        var info=res.result.data
        console.log(info.length)
        if(info.length!=0){
          app.globalData.userinfo=info[0]
          that.setData({
            wxlogin:true,
            team:info[0].team
          })
        }
      },
    })
  },

  login:function(){
    db.collection('admin').where({
      team:this.data.input1,
      financeName:this.data.input2
    }).get().then(res=>{
      console.log(res.data)
      if(res.data.length>0){
        app.globalData.userinfo=res.data[0]
        console.log(app.globalData.userinfo)
        wx.showToast({
          title: '登录成功',
          icon:'success',
          duration:800
        })
        wx.cloud.callFunction({
          name:'registerOpenId',
          data:{
            team: app.globalData.userinfo.team,
            name:app.globalData.userinfo.financeName
          },
          success: function (ret) {
            wx.redirectTo({
              url: '/pages/register/info/index',
            })
          },
          fail: console.error
        })
      }
      else{
        wx.showToast({
          title: '查询失败',
          icon: 'loading',
          duration: 800
        })
      }
    })
  },

  wxlogin:function(){
    wx.redirectTo({
      url: '/pages/register/info/index',
    })
  },

  debind:function(){
    this.setData({
      wxlogin:false
    })
  }

})
