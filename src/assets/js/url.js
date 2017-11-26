/**
 * Created by Administrator on 2017/11/8.
 */

var api = {};
var service_host = "http://" + window.location.host;

api.user = {};
api.label = {};
api.content = {};
api.comment = {};
api.article = {};
api.blog = {};
api.blog.info = service_host + "/admin/blog/info";
api.blog.searchInfo = service_host + "/admin/blog/searchInfo";
api.user.loginOut = service_host + "/api/user/loginout";
api.user.search = service_host + "/user/user/search";
api.label.add = service_host + "/admin/label/add";
api.label.edit = service_host + "/admin/label/edit";
api.label.search = service_host + "/admin/label/search";
api.label.remove = service_host + "/admin/label/remove";
api.content.search = service_host + "/admin/content/search";
api.content.movesearch = service_host + "/admin/content/movesearch";
api.content.hotSearch = service_host + "/admin/content/hot";
api.content.newSearch = service_host + "/admin/content/new";
api.content.info = service_host + "/admin/content/info";
api.content.keyWord = service_host + "/admin/content/keyWord";
api.content.move = service_host + "/admin/content/move";
api.content.reback = service_host + "/admin/content/reback";
api.content.remove = service_host + "/admin/content/remove";
api.content.saveImg = service_host + "/admin/content/saveImg"; // 保存图片
api.article.save = service_host + "/admin/article/save"; // 保存图片
api.article.updateLabel = service_host + "/admin/article/updateLabel"; // 更新文章类别
api.comment.add = service_host + "/comment/comment/add";
api.comment.get = service_host + "/comment/comment/get";
api.comment.getAll = service_host + "/comment/comment/getAll";
api.comment.getNew = service_host + "/comment/comment/getNew";
api.comment.remove = service_host + "/comment/comment/remove";
api.comment.del = service_host + "/comment/comment/del";
api.comment.delArticle = service_host + "/comment/comment/delArticle";
export {api}
