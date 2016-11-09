
var rest = require('restler');
var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost/stockdiscover';
var Db = require('mongodb').Db;

var dbx = new Db('stockdiscover', new Server('localhost',27017));
var db = dbx.open();
discover_stock();
return;

function discover_stock()
{
  var ttw_add = 10000;
  var ttw = ttw_add;
  for(var i = "A".charCodeAt(0);i <= "Z".charCodeAt(0);i++) {
  	setTimeout(retrieve_stock_letter,ttw,String.fromCharCode(i));
    ttw = ttw + ttw_add;
  }


}

function retrieve_stock_letter(theletter)
{
setTimeout(retrieve_stock_letter,1000*10*60,theletter);
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
  console.log(theresult)
  cnt = theresult.LookupResultList.LookupResult.length;
  console.log(cnt);
   for(i = 0;i < cnt;i++){
     parse_stock_lookup(theresult.LookupResultList.LookupResult[i]);
   }

}
function parse_stock_lookup(thestock)
{

      thekey = thestock.Exchange + "-" + thestock.Symbol;
      existing = dbx.collection('stock').find( {key: thekey} );
      console.log('Existing ' + existing.count)
      if (existing.count > 0){
        console(console.log("Duplicate " + thekey));
        return;
      }
      console.log("Adding " + thekey);
      var document = {key:thekey, symbol:thestock.Symbol, name:thestock.Name, exchange:thestock.Exchange };
      dbx.collection('stock').insert(document, {w: 1}, function(err, records){
});

}
