import xmlBeautify from 'xml-beautifier'
import JSONFormatter from 'json-fmt'

const fmt = new JSONFormatter(JSONFormatter.PRETTY);

export default class ProxyUtil {

    static getHeadersString(headersObj) {
        let out = '';

        for (let headerName in headersObj) {
            let headerValue = headersObj[headerName]
            out += `${headerName}: ${headerValue}\n`
        }

        return out
    }

    static getContentType(headersObj) {
        let contentType = headersObj['content-type'] || headersObj['Content-Type'] || undefined

        if (typeof contentType !== 'undefined') {
            return contentType.split(";")[0]
        } else {
            return null
        }
    }

    static beautifyBody(headersObj, content) {
        let contentType = ProxyUtil.getContentType(headersObj)

        if (contentType !== null) {
            switch (contentType) {
                case "text/xml": 
                    return xmlBeautify(content)
                case "application/json":
                    fmt.reset()
                    fmt.append(content)
                    return fmt.flush()
                default:
                    return content
            }
        } else {
            return content;
        }
    }

    static rawRequest(request) {
        return `${request.method} ${request.url} HTTP/${request.httpVersion}\n${ProxyUtil.getHeadersString(request.headers)}${typeof request.body !== "undefined" ? `\n${ProxyUtil.beautifyBody(request.headers, request.body)}` : ``}`  
    }

    static rawResponse(response) {
        return `HTTP/${response.httpVersion} ${response.statusCode} OK\n${ProxyUtil.getHeadersString(response.headers)}${typeof response.body !== "undefined" ? `\n${ProxyUtil.beautifyBody(response.headers, response.body)}` : ``}`
    }

    static filter = (needle, requests) => {
        return requests.filter(obj => {
            let haystack = ProxyUtil.rawRequest(obj.request) + "\n" + ProxyUtil.rawResponse(obj.response)
            return haystack.indexOf(needle) !== -1
        })
    } 
    
}   