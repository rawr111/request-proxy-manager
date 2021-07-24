const ProxyManager = require('../index');
var proxies = [

];
const pm = new ProxyManager(proxies);

(async ()=>{
    var result = await pm.initProxies();
    console.log(`${result.requests.length} working proxies!`);
    console.log(result);
})();
