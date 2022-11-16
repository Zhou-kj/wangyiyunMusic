// pages/search/search.js
import request from '../../utils/request'
let isSend = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeHolderContent: '',
    hotList: [],
    searchContent: '',
    searchList: [],
    historyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getInitData()
  },

  async getInitData() {
    let placeHolderData = await request('/search/default')
    let hotListData = await request('/search/hot/detail')
    let historyList = wx.getStorageSync('searchHistory')
    if (historyList) {
      this.setData({
        historyList
      })
    }
    this.setData({
      placeHolderContent: placeHolderData.data.showKeyword,
      hotList: hotListData.data
    })
  },

  handleInputChange(event) {
    console.log(isSend)
    this.setData({
      searchContent: event.detail.value.trim()
    })
    if (isSend) {
      return
    }
    isSend = true
    setTimeout( () => {
      isSend = false
      this.getSearchList()
    }, 300)
  },

  async getSearchList() {
    if (!this.data.searchContent) {
      this.setData({
        searchList: []
      })
      return
    }
    let searchListData = await request('/search', {keywords: this.data.searchContent, limit: 10})
    let {searchContent, historyList} = this.data
    this.setData({
      searchList: searchListData.result.songs
    })
    if (historyList.indexOf(searchContent) !== -1) {
      historyList.splice(historyList.indexOf(searchContent), 1)
    }
    historyList.unshift(searchContent)
    this.setData({
      historyList
    })
    wx.setStorageSync('searchHistory', historyList)
  },

  handleClear() {
    this.setData({
      searchContent: '',
      searchList: []
    })
  },

  handleDelete() {
    wx.showModal({
      content: '确认删除历史记录？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            historyList: []
          })
          wx.removeStorageSync('searchHistory')
        }
      }
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
  onShareAppMessage() {

  }
})