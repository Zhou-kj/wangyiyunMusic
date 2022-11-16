// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../utils/request'
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    song: {},
    musicId: '',
    musicLink: '',
    currentTime: '00:00',
    durationTime: '00:00',
    currentWidth: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let musicId = options.musicId
    this.setData({
      musicId: musicId
    })
    this.getMusicInfo(musicId)
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      this.setData({
        isPlay: true
      })
    }
    this.backgroundAudioMannager = wx.getBackgroundAudioManager()
    this.backgroundAudioMannager.onPlay(() => {
      this.changePlayState(true) 
      appInstance.globalData.musicId = musicId
    })
    this.backgroundAudioMannager.onPause(() => {
      this.changePlayState(false)
    })
    this.backgroundAudioMannager.onStop(() => {
      this.changePlayState(false)
    })
    this.backgroundAudioMannager.onEnded(() => {
      PubSub.publish('switchType', 'next')
      this.setData({
        currentWidth: 0,
        currentTime: '00:00'
      })
    })
    this.backgroundAudioMannager.onTimeUpdate(() => {
      let currentTime = moment(this.backgroundAudioMannager.currentTime * 1000).format('mm:ss')
      let currentWidth = this.backgroundAudioMannager.currentTime / this.backgroundAudioMannager.duration * 450
      this.setData({
        currentTime,
        currentWidth
      })
    })
  },

  changePlayState(isPlay) {
    this.setData({
      isPlay
    })
    appInstance.globalData.isMusicPlay = isPlay
  },

  async getMusicInfo(musicId) {
    let songData = await request('/song/detail', {ids: musicId})
    let durationTime = moment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song: songData.songs[0],
      durationTime
    })
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },

  musicPlay() {
    let isPlay = !this.data.isPlay
    let {musicId, musicLink} = this.data
    this.musicControl(isPlay, musicId, musicLink)
  },

  async musicControl(isPlay, musicId, musicLink) {
    if (isPlay) {
      if (!musicLink) {
        let musicLinkData = await request('/song/url', {id: musicId})
        musicLink = musicLinkData.data[0].url
        this.setData({
          musicLink
        })
      }
      this.backgroundAudioMannager.src = musicLink
      this.backgroundAudioMannager.title = this.data.song.name
    } else {
      this.backgroundAudioMannager.pause()
    }
  },

  handleSwitch(event) {
    let type = event.currentTarget.id
    this.backgroundAudioMannager.stop()
    PubSub.subscribe('musicId', (msg, musicId) => {
      this.getMusicInfo(musicId)
      this.musicControl(true, musicId)
      PubSub.unsubscribe('musicId')
    })
    PubSub.publish('switchType', type)
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