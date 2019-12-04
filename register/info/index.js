const app = getApp()
const db = wx.cloud.database()
Page({
  data:{
    basicInfo:{},
    billsInfo:[]
  },

  addbill:function(){
    console.log('add')
    wx.navigateTo({
      url: '/pages/register/modify/index?mode=add',
    })
  },
  
  //载入支队和发票信息
  onShow:function(){
    this.setData({
      basicInfo:app.globalData.userinfo
    })
    console.log(this.data.basicInfo)
    db.collection('bill').where({
      team:this.data.basicInfo.team
    }).orderBy('date', 'desc').get().then(res=>{
      console.log(res.data)
      this.setData({
        billsInfo:res.data
      })
    })
  },

  modify: function (e) {
    var index = e.currentTarget.dataset.index;
    app.globalData.singlebill = this.data.billsInfo[index]
    wx: wx.navigateTo({
      url: '/pages/register/modify/index?mode=modify',
    })
  },
  
  deletebill: function (e) {
    var index = e.currentTarget.dataset.index;
    var doc = this.data.billsInfo[index]._id;
    var that=this;
    wx.showModal({
      title: '提示',
      content: '确认删除账单?',
      success: function (res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'deleteBill',
            data: {
              doc: doc
            },
            success: function (ret) {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1000
              })
              that.onShow()
            },
            fail: console.error
          })
        }
      }
    })
  },
  
})
