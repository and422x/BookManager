const db = wx.cloud.database()
Component({
  data: { monthText: '', total: '0.00', count: 0, recent: [] as any[] },
  lifetimes: { attached() { this.loadData() } },
  pageLifetimes: { show() { this.loadData() } },
  methods: {
    async loadData() {
      const now = new Date(), next = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01`
      this.setData({ monthText: `${now.getFullYear()}年${now.getMonth()+1}月` })
      try {
        const res = await db.collection('purchases').where({ purchaseDate: db.command.gte(fmt(now)).and(db.command.lt(fmt(next))) }).orderBy('purchaseDate','desc').get()
        const rows = res.data as any[], cents = rows.reduce((s,r) => s + Number(r.amountCents||0), 0)
        this.setData({ total:(cents/100).toFixed(2), count:rows.length, recent:rows.slice(0,5).map(this.formatRow) })
      } catch (e) { console.error(e) }
    },
    formatRow(r:any) { return {...r, amount:(r.amountCents/100).toFixed(2), paymentText:({deposit:'预订',balance:'补款',full:'全款'} as any)[r.paymentType]||r.paymentType} },
    add(){ wx.navigateTo({url:'/pages/edit/edit'}) }, goRecords(){wx.navigateTo({url:'/pages/records/records'})},
    goStats(){wx.navigateTo({url:'/pages/stats/stats'})}, goMine(){wx.navigateTo({url:'/pages/mine/mine'})},
  },
})
