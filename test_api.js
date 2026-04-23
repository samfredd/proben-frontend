const axios = require('axios');
axios.get('http://localhost:5000/subscriptions', { headers: { "Authorization": "Bearer TEST" } })
  .catch(err => {
    // console.log(err.response);
  });
