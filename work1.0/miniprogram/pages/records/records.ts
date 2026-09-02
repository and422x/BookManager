const db = wx.cloud.database()
Page({
  data:{startDate:'',endDate:'',rows:[] as any[],total:'0.00'},
  onShow(){this.search()},
  setStart(e:any){this.setData({startDate:e.detail.value});this.search()}, setEnd(e:any){this.setData({endDate:e.detail.value});this.search()},
  async search(){
    try { let q:any = {}; const cmd=db.command
      if(this.data.startDate&&this.data.endDate) q.purchaseDate=cmd.gte(this.data.startDate).and(cmd.lte(this.data.endDate)); else if(this.data.startDate) q.purchaseDate=cmd.gte(this.data.startDate); else if(this.data.endDate) q.purchaseDate=cmd.lte(this.data.endDate)
      const res=await db.collection('purchases').where(q).orderBy('purchaseDate','desc').limit(100).get(); const p:any={deposit:'预订',balance:'补款',full:'全款'}
      const rows=(res.data as any[]).map(r=>({...r,amount:(r.amountCents/100).toFixed(2),paymentText:p[r.paymentType]||r.paymentType}))
      this.setData({rows,total:(rows.reduce((s,r)=>s+r.amountCents,0)/100).toFixed(2)})
    } catch(e){console.error(e)}
  },
  edit(e:any){wx.navigateTo({url:`/pages/edit/edit?id=${e.currentTarget.dataset.id}`})}, add(){wx.navigateTo({url:'/pages/edit/edit'})},
  home(){wx.navigateBack({delta:99})}, stats(){wx.redirectTo({url:'/pages/stats/stats'})}, mine(){wx.redirectTo({url:'/pages/mine/mine'})},
})
