// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    navId: '',
    videoList: [],
    videoId: '',
    videoUpdateTime: [],
    isTriggered: false,
    isShowLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo){
      this.getVideoGroupListData()
    } else {
      wx.showModal({
        title: '登录提示',
        content: '还未登录请先登录',
        showCancel: false,
        confirmText: '去登录',
        success: () => {
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }
      })
    }
  },
  
  async getVideoGroupListData() {
    let videoGroupListData = await request('/video/group/list')
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      navId: videoGroupListData.data[0].id
    })
    this.getVideoList(this.data.navId)
  },
  async getVideoList(navId) {
    let videoListData = await request('/video/group', {id: navId})
    if (this.data.isShowLoading){
      wx.hideLoading()
      this.setData({
        isShowLoading: false
      })
    }
    let index = 0
    let videoListTemp = Array.from(videoListData.datas).map(item => {
      item.id = index++
      return item
    })
    this.setData({
      videoList: videoListTemp,
      isTriggered: false
    })
  },

  changeNav(event) {
    let navId = event.currentTarget.id
    this.setData({
      navId: navId * 1,
      videoList: [],
      isShowLoading: true
    })
    wx.showLoading({
      title: '正在加载',
    })
    this.getVideoList(this.data.navId)
  },
  handlePlay(event) {
    let isPlay = this.data.videoId === event.currentTarget.id
    let vid = event.currentTarget.id
    // this.vid !== vid && this.videoContext && this.videoConext.stop()
    // this.vid = vid
    this.setData({
      videoId: vid
    })
    this.videoContext = wx.createVideoContext(vid)
    if (!isPlay) {
      this.videoContext.playCount = 0
    } else {
      this.videoContext.playCount++
    }
    console.log(this.videoContext.playCount)
    let {videoUpdateTime} = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === vid)
    if (videoItem && !isPlay) {
      console.log('///',this.videoContext.playCount)
      this.videoContext.seek(videoItem.currentTime)
    }
    if (this.videoContext.playCount % 2 === 0) {
      console.log('bf')
      this.videoContext.play()
    } else {
      this.videoContext.pause()
      console.log('zt')
    }
    // this.videoContext.play()
  },
  handleTimeUpdate(event) {
    let videoTimeObj = {vid: event.currentTarget.id, currentTime: event.detail.currentTime}
    let {videoUpdateTime} = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
    if (videoItem) {
      videoItem.currentTime = event.detail.currentTime
    } else {
      videoUpdateTime.push(videoTimeObj)
    }
    this.setData({
      videoUpdateTime
    })
  },
  handleEnded(event) {
    let {videoUpdateTime} = this.data
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.id === event.currentTarget.id), 1)
    this.setData({
      videoUpdateTime
    })
  },
  handleRefresher() {
    this.getVideoList(this.data.navId)
  },
  async handleLower() {
    let videoList = this.data.videoList
    let page = videoList.length / 8
    let navId = this.data.navId
    let videoListData = await request('/video/group', {id: navId, offset: ++page})
    let index = videoList.length
    let videoListTemp = Array.from(videoListData.datas).map(item => {
      item.id = index++
      return item
    })
    videoList.push(...videoListTemp)
    this.setData({
      videoList
    })
  },

  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage({from}) {
    // console.log(from)
    if (from === 'button') {
      return {
        title: '来自button的转发',
        page: '/pages/video/video',
        imageUrl: '/static/images/logo.png'
      } 
    } else {
      return {
        title: '来自menu的转发',
        page: '/pages/video/video',
        imageUrl: '/static/images/logo.png'
      } 
    }
  }
})