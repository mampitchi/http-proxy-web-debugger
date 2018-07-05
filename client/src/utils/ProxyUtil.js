export default class ProxyUtil {

    static getHeadersString(headersObj) {
        let out = '';

        for (let headerName in headersObj) {
            let headerValue = headersObj[headerName]
            out += `${headerName}: ${headerValue}\n`
        }

        return out
    }

    static rawRequest(request) {
        return `${request.method} ${request.url} HTTP/${request.httpVersion}\n${ProxyUtil.getHeadersString(request.headers)}\n${request.body}`  
    }

    static rawResponse(response) {
        return `HTTP/${response.httpVersion} ${response.statusCode} OK\n${ProxyUtil.getHeadersString(response.headers)}${typeof response.body !== "undefined" ? `\n${response.body}` : ``}`
    }

    static filter = (needle, requests) => {
        return requests.filter(obj => {
            let haystack = ProxyUtil.rawRequest(obj.request) + "\n" + ProxyUtil.rawResponse(obj.response)
            return haystack.indexOf(needle) !== -1
        })
    } 
    
}   