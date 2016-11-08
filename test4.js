var rest = require('restler');
rest.get('http://dev.markitondemand.com/Api/v2/Lookup?Input="A"').on('complete', function(result) {
  if (result instanceof Error) {
    console.log('Error:', result.message);
    this.retry(5000); // try again after 5 sec
  } else {
    console.log(result);
    console.log(result.LookupResultList.LookupResult);
  }
});
