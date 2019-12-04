const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    mode:'add',
    identityarray: ['车票', '住宿发票', '文体用品', '市内交通','餐饮'],
    idindex:0,//必须渲染一下这个要不渲染不出来
    identity:'车票',
    input1: '姓名或人数',
    inputlocate:'地点',
    date:new Date(),
    input2: '2020-1-01',
    input3: 0,
  },

  onLoad:function(options){
    this.setData({
      mode:options.mode
    })
    if(this.data.mode=='modify'){
      console.log(app.globalData.singlebill._id)
      var identity=app.globalData.singlebill.identity
      var idindex=0;
      for (var i=0;i<this.data.identityarray.length;i++){
        if (identity == this.data.identityarray[i]){
          idindex=i;break;
        }
      }
      this.setData({
        idindex: idindex,
        identity: identity,
        input1: app.globalData.singlebill.name,
        inputlocate: app.globalData.singlebill.locate,
        date: app.globalData.singlebill.date,
        input2: app.globalData.singlebill.date,
        input3: app.globalData.singlebill.price,
      })
      console.log(this.data)
    }
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log(this.data.identityarray[e.detail.value])
    if (e.detail.value != 0 && e.detail.value != 1){
      this.setData({
        input1: '',
        inputlocate: '',
      })
    }
    this.setData({
      idindex: e.detail.value,
      identity: this.data.identityarray[e.detail.value]
    })
  },

  input1:function(e){
    this.setData({ input1: e.detail.value })
  },

  bindDateChange: function (e) {
    console.log('date发送选择改变，携带值为', e.detail.value)
    console.log(e.detail.value)
    this.setData({
      date: e.detail.value,
      input2: e.detail.value
    })
  },

  inputlocate: function (e) {
    this.setData({ inputlocate: e.detail.value })
  },

  input3: function (e) {
    this.setData({ input3: e.detail.value })
  },

  submit:function(){
    var that=this
    wx.showModal({
      title: '提示',
      content: '确认提交账单?',
      success: function (res) {
        if (res.confirm) {
          console.log('提交记账信息')
          if(that.data.mode=='add'){
            wx.cloud.callFunction({
              name:'addBill',
              data:{
                team:app.globalData.userinfo.team,
                identity:that.data.identity,
                name:that.data.input1,
                date:that.data.input2,
                price:that.data.input3,
                locate:that.data.inputlocate
              },
              success: function (ret) {
                wx.showToast({
                  title: '记录成功',
                  icon:'success',
                  duration:1000
                })
                wx.navigateBack({})
              },
              fail: console.error
            })
          }
          else{
            wx.cloud.callFunction({
              name: 'modifyBill',
              data: {
                doc:app.globalData.singlebill._id,
                team: app.globalData.userinfo.team,
                identity: that.data.identity,
                name: that.data.input1,
                date: that.data.input2,
                price: that.data.input3,
                locate: that.data.inputlocate
              },
              success: function (ret) {
                wx.showToast({
                  title: '修改成功',
                  icon: 'success',
                  duration: 1000
                })
                wx.navigateBack({})
              },
              fail: console.error
            })
          }
        }
      }
    })
  }

})
