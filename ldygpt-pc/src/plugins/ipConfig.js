var baseURL = {
    basicApi: ''
}
switch (process.env.srconfig) {
    case 'test': //测试环境
        // 基础服务
        baseURL.basicApi = 'http://106.14.207.68:80'
        break;
    case 'pro': //生产环境
        // 基础服务
        baseURL.basicApi = 'http://storeserver.muyusi.com:1026'
        break;
    default:
        // 基础服务
        baseURL.basicApi = 'http://127.0.0.1:8080'
        break;
}
module.exports = baseURL;
