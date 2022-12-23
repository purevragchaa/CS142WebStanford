var Promise = require("Promise");

/**
  * FetchModel - Fetch a model from the web server.
  *     url - string - The URL to issue the GET request.
  * Returns: a Promise that should be filled
  * with the response of the GET request parsed
  * as a JSON object and returned in the property
  * named "data" of an object.
  * If the requests has an error the promise should be
  * rejected with an object contain the properties:
  *    status:  The HTTP response status
  *    statusText:  The statusText from the xhr request
  *
*/


function fetchModel(url) {
  return new Promise(function(resolve, reject) {
    var httpReq = new XMLHttpRequest();
    httpReq.open("GET", url);
    httpReq.onreadystatechange = function() {
      if (httpReq.readyState === 4 && httpReq.status === 200) {
        var responseObject = JSON.parse(httpReq.responseText);
        resolve({data: responseObject});
      }
      if (httpReq.status === 400 || httpReq.status === 500) {
        reject({status: 501, statusText: "Not Implemented"});
      }
    }
    httpReq.send();
  });
}

export default fetchModel;
