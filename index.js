const request = require('request');

class ProxyManager{
    constructor(proxiesInfo){
        this.proxies = proxiesInfo;
        this.selectedProxy = -1;
    }
    testProxy(proxyInfo, testRequest = request) {
        return new Promise((resolve) => {
            testRequest = request.defaults({ 'proxy': 'http://' + proxyInfo });
            testRequest.get('http://ip-api.com/json', (err, res, body) => {
                try {
                    if (err) {
                        resolve({ "success": false, "error": err });
                    }
                    body = JSON.parse(body);
                    resolve({ "success": true, "content": body.query, "request":testRequest });
                } catch (err) {
                    resolve({ "success": false, "error": err });
                }
            });
        });
    }
    async initProxies(){
        var requests = [];
        var errors = [];
        for (var i of this.proxies) {
            var result = await this.testProxy(i);
            if (result.success){
                requests.push(result.request);
            } else {
                errors.push(i);
            }
        }
        return {requests:requests, errors:errors};
    }
    async changeProxy(test=false){
        if (this.proxies.length == 0){
            throw new Error('No proxy installed! Please add at least 1 proxy');
        }
        this.selectedProxy +=1;
        if (this.proxies.length == this.selectedProxy){
            this.selectedProxy = 0;
        }
        if (test){
            await this.testProxy(this.proxies[this.selectedProxy]);
        }
    }
    addProxies(proxiesInfo){
        for (var i of proxiesInfo){
            var flag = true;
            for (var j of this.proxies){
                if (i == j){
                    flag = false;
                    break;
                }
            }
            if (flag){
                this.proxies.push(i);
            }
        }
    }
};
module.exports = ProxyManager;