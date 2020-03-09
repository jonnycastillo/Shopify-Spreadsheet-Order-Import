function Risk() 
{
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = ss.getActiveSheet();
  var r = s.getActiveCell().getRow();
  var c = s.getActiveCell().getColumn();
  var v = s.getRange(r,1).getValue();
 
 
    var val = v.substr(1,14);
  Logger.log(c)
  
    var url = "https://thehundreds.myshopify.com/admin/orders/"+getId(val)+".json";
    var username = "*";
    var password = "*";
    var response = UrlFetchApp.fetch(url, {"method":"get", "headers": {"Authorization": "Basic " + Utilities.base64Encode(username + ":" + password)}});
    var data = JSON.parse(response.getContentText());
    
    Logger.log(data.order.length)
    

      var tally =0
      //Logger.log(data.order.name)
      
      
      if(data.order.total_price_usd>150){tally+=.5}
      if(data.order.total_price_usd>200){tally+=.5}
      if(data.order.customer.orders_count>2){tally-=.5}
      if(data.order.gateway=='paypal'){tally-=.5}
      if( String(data.order.email).indexOf(".amazon.com")!=-1){tally-=5}else{if(String(data.order.email).indexOf(String(data.order.customer.first_name).toLowerCase())!==-1||String(data.order.email).indexOf(String(data.order.customer.last_name).toLowerCase())!==-1){tally-=0.5}else{tally+=.5}}
      try{
      if( String(data.order.email).indexOf(".amazon.com")!=-1){tally+=0}else{if(data.order.billing_address.province!==data.order.shipping_address.province){tally+=1.5}}
      }
      catch(err)
      {
        tally+=5
      }
      try{
      if( String(data.order.email).indexOf(".amazon.com")!=-1){tally+=0}else{if(data.order.billing_address.address1!==data.order.shipping_address.address1){tally+=.5}}
      }
      catch(err)
      {
        tally+=5
      }
        
        s.getRange(r,c).setValue(tally)      
      
      
}