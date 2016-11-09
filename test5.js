var rest = require('restler');

discover_stock();
return;

function discover_stock()
{
  for(var i = "A".charCodeAt(0);i <= "Z".charCodeAt(0);i++) {
  	retrieve_stock_letter(String.fromCharCode(i));
  }


}

function retrieve_stock_letter(theletter)
{

console.log("Processing " + theletter);
rest.get('http://dev.markitondemand.com/Api/v2/Lookup?Input="' + theletter + '"').on('complete', function(result) {
  if (result instanceof Error) {
    console.log('Error:', result.message);
    this.retry(5000); // try again after 5 sec
    return;
    }
  console.log("Process Result");
  process_result(result);
  });
}

function process_result(theresult)
{
  console.log("Processing Result");
  cnt = theresult.LookupResultList.LookupResult.length;
  console.log(cnt);
   for(i = 0;i < cnt;i++){
     parse_stock_lookup(theresult.LookupResultList.LookupResult[i]);
   }

}
function parse_stock_lookup(thestock)
{
      console.log(thestock)
      console.log(thestock.Name)
      console.log(thestock.Exchange)
      console.log(thestock.Symbol)


}
