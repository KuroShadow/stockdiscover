
var rest = require('restler');
var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost/stockdiscover';
var Db = require('mongodb').Db;
var iexists = false;
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

function firstWord(thevalue)
{
  var thewords;
  vs = thevalue.toString();
  thewords = vs.split(' ');
  return(thewords[0]);

}
function parse_stock_lookup(thestock)
{
  var thekey;
  thekey  = firstWord(thestock.Exchange) + "-" + thestock.Symbol;
  console.log(thekey);
  dbx.collection('stock').findOne({key: thekey}, function(err, doc) {
      if( doc == null ) {
          // do whatever you need to do if it's not there
         console.log("Adding " + thekey);
         var document = {key:thekey, symbol:thestock.Symbol,
                         name:thestock.Name, exchange:thestock.Exchange };
         dbx.collection('stock').insert(document, {w: 1});
      } else {
          // do whatever you need to if it is there
        console.log("Duplicate " + thekey);
      }

  });
}
