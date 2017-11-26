var AuthUtil = {
  isLogin: function () {
    var user = window.sessionStorage.getItem('user')
    if (user == null || user === 'null') {
      return false
    } else {
      return true
    }
  }
}

var StorageUtil = {
  storeString: function (key, value) {
    window.sessionStorage.setItem(key, value)
  },
  storeObject: function (key, object) {
    window.sessionStorage.setItem(key, JSON.stringify(object))
  },
  getString: function (key) {
    return window.sessionStorage.getItem(key)
  },
  getObject: function (key) {
    return JSON.parse(window.sessionStorage.getItem(key))
  },
  removeObject: function (key) {
    window.sessionStorage.removeItem(key)
  }
}
// 上传图片
// commitImg (file) {
//   var img = {}
//   var reader = new FileReader()
//   reader.readAsDataURL(file)
//   reader.onload = function () {
//     img.file = this.result
//     Ajax.post(api.content.saveImg, img, (data) => {
//       console.log(123)
//     })
//   }
// },
export { AuthUtil, StorageUtil }
