var Promise = require("promise");

function fetchModel(url, setState) {
  console.log( url );
  return new Promise(function(resolve, reject) {
    var axios = require('axios');

    var config = {
        method: 'get',
        url: url,
        headers: { Accept: 'application/json',
        'Content-Type': 'application/json'}
    };

    axios(config)
        .then(
            (response ) => {
                // user dataga hadgalna
                setState( response.data )
                console.log( response.data )
                resolve( response.data )
            }
        )
        .catch(function (error) {
            console.log(error);
            reject( error )
        });

  });
}

export default fetchModel;
