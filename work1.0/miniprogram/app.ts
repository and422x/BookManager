App<IAppOption>({
  globalData: { openid: '', cloudReady: false },
  onLaunch() {
    if (!wx.cloud) return
    wx.cloud.init({ traceUser: true })
    this.globalData.cloudReady = true
    wx.cloud.callFunction({ name: 'login' }).then((res: any) => {
      this.globalData.openid = res.result?.openid || ''
    }).catch(console.error)
  },
})
