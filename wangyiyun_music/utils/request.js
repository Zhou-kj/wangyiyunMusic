import config from './config'

export default (url, data={}, method='GET') => {
 return new Promise ((resolve, reject) => {
  wx.request({
    url: config.host + url,
    data,
    method,
    header: {
      cookie: wx.getStorageSync('cookies')?wx.getStorageSync('cookies'):''
    },
    success: (res) => {
      console.log(res)
      if (data.isLogin) {
        wx.setStorage({
          key: 'cookies',
          data: 'MUSIC_U=ea11282e0b31266898caace6b8d6c250493f9c413f95c9dd7581bf2bcc123c2b993166e004087dd39bf1bde45e4640b9f56fcf0b885e0875f2131e58efea5d0ac9f81724e3ccb609d4dbf082a8813684'
        })
      }
      console.log('请求成功！')
      resolve(res.data)
    },
    fail: (err) => {
      console.log('请求失败！')
      reject(err)
    }
  })
 })
}