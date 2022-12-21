var Promise = require("promise");

function fetchModel(url) {
  console.log( url );
  return new Promise(function(resolve, reject) {
    var httpReq = new XMLHttpRequest();
    // httpReq.setRequestHeader("Access-Control-Allow-Origin:","*");
    // httpReq.
    httpReq.open("GET", url);
      console.log(url);
      httpReq.onreadystatechange = function() {
        if (httpReq.readyState === 4 && httpReq.status === 200) {
          var responseObject = JSON.parse(httpReq.responseText);
          console.log( "--------------" );
          console.log( responseObject );
          console.log( "--------------" );
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
