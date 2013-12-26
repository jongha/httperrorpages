var fs = require('fs');
var path = require('path');
var output = path.join(__dirname, '../output');

// codes from http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
// descriptions from https://support.google.com/webmasters/answer/40132?hl=en
var STATUS_TABLE = {
    400: ['Bad Request',  'The server didn\'t understand the syntax of the request.'],
    401: ['Not authorized',  'The request requires authentication. The server might return this response for a page behind a login.'],
    402: ['Payment Required',  ''],
    403: ['Forbidden',  ''],
    404: ['Not Found',  'The server can\'t find the requested page. For instance, the server often returns this code if the request is for a page that doesn\'t exist on the server.'],
    405: ['Method Not Allowed',  'The method specified in the request is not allowed.'],
    406: ['Not Acceptable',  'The requested page can\'t respond with the content characteristics requested.'],
    407: ['Proxy Authentication Required',  'This status code is similar 401 (Not authorized); but specifies that the requestor has to authenticate using a proxy. When the server returns this response, it also indicates the proxy that the requestor should use.'],
    408: ['Request Timeout',  'The server timed out waiting for the request.'],
    409: ['Conflict',  'The server encountered a conflict fulfilling the request. The server must include information about the conflict in the response. The server might return this code in response to a PUT request that conflicts with an earlier request, along with a list of differences between the requests.'],
    410: ['Gone',  'The server returns this response when the requested resource has been permanently removed. It is similar to a 404 (Not found) code, but is sometimes used in the place of a 404 for resources that used to exist but no longer do. If the resource has permanently moved, you should use a 301 to specify the resource\'s new location.'],
    411: ['Length Required',  'The server won\'t accept the request without a valid Content-Length header field.'],
    412: ['Precondition Failed',  'The server doesn\'t meet one of the preconditions that the requestor put on the request.'],
    413: ['Request Entity Too Large',  'The server can\'t process the request because it is too large for the server to handle.'],
    414: ['Request-URI Too Long',  'The requested URI (typically, a URL) is too long for the server to process.'],
    415: ['Unsupported Media Type',  'The request is in a format not support by the requested page.'],
    416: ['Requested Range Not Satisfiable',  'The server returns this status code if the request is for a range not available for the page.'],
    417: ['Expectation Failed',  'The server can\'t meet the requirements of the Expect request-header field.'],
    500: ['Internal Server Error',  'The server encountered an error and can\'t fulfill the request.'],
    501: ['Not Implemented',  'The server doesn\'t have the functionality to fulfill the request. For instance, the server might return this code when it doesn\'t recognize the request method.'],
    502: ['Bad Gateway',  'The server was acting as a gateway or proxy and received an invalid response from the upstream server.'],
    503: ['Service Unavailable',  'The server is currently unavailable (because it is overloaded or down for maintenance). Generally, this is a temporary state.'],
    504: ['Gateway Timeout',  'The server was acting as a gateway or proxy and didn\'t receive a timely request from the upstream server.'],
    505: ['HTTP Version Not Supported',  'The server doesn\'t support the HTTP protocol version used in the request.']
};

fs.mkdir(output, function(error) {
  if(error && error.code !== 'EEXIST') {
    return;
  }
});

var generate_page = function(output, data, filename) {
  'use strict';
  
  fs.writeFile(path.join(output, filename + '.html'), data, function(error) {
    if (error) {
      throw error;
    }
  });
};

fs.readFile(path.join(__dirname, 'template.html'), function (err, data) {
  if (err) {
    throw err;
  }

  for(var code in STATUS_TABLE) {
    var _data = data.toString()
        .replace(/{{code}}/gi, code)
        .replace(/{{message}}/gi, STATUS_TABLE[code][0])
        .replace(/{{description}}/gi, STATUS_TABLE[code][1]);

    generate_page(output, _data, code);
  }
});