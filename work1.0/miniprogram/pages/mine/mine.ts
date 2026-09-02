const db=wx.cloud.database()
Page({
 data:{nickname:'',avatarUrl:'',count:0},
 async onShow(){try{const r=await db.collection('purchases').count();this.setData({count:r.total});const u:any=await db.collection('users').limit(1).get();if(u.data.length)this.setData({nickname:u.data[0].nickname||'',avatarUrl:u.data[0].avatarUrl||''})}catch(e){console.error(e)}},
 chooseAvatar(e:any){this.setData({avatarUrl:e.detail.avatarUrl})},nickname(e:any){this.setData({nickname:e.detail.value})},
 async save(){try{const r:any=await db.collection('users').limit(1).get();const data={nickname:this.data.nickname,avatarUrl:this.data.avatarUrl,updatedAt:db.serverDate()};if(r.data.length)await db.collection('users').doc(r.data[0]._id).update({data});else await db.collection('users').add({data:{...data,createdAt:db.serverDate()}});wx.showToast({title:'已保存'})}catch(e){wx.showToast({title:'保存失败',icon:'none'})}},
 home(){wx.navigateBack({delta:99})},records(){wx.redirectTo({url:'/pages/records/records'})},stats(){wx.redirectTo({url:'/pages/stats/stats'})},
})
