function getId(val) {
 
    var url = "https://thehundreds.myshopify.com/admin/orders.json?name="+val+"&status=any&fields=id";
    var username = "*";
    var password = "*";
    var response = UrlFetchApp.fetch(url, {"method":"get", "headers": {"Authorization": "Basic " + Utilities.base64Encode(username + ":" + password)}});
    var data = JSON.parse(response.getContentText());
    Utilities.sleep(500);
    return data.orders[0].id.toPrecision();
  
    // s.getRange(i+2,9).setValue(data.orders[0].id.toPrecision());
  
 
}


function getOrders() {
 var ss = SpreadsheetApp.getActiveSpreadsheet();
  var today = new Date();
  var yesterday = new Date();
  var month = new Array();
  month[0] = "Jan ";
  month[1] = "Feb ";
  month[2] = "Mar ";
  month[3] = "Apr ";
  month[4] = "May ";
  month[5] = "Jun ";
  month[6] = "Jul ";
  month[7] = "Aug ";
  month[8] = "Sept ";
  month[9] = "Oct ";
  month[10] = "Nov ";
  month[11] = "Dec ";
  
  var day = today.getDate();
  yesterday.setDate(day-1);
  today.setDate(day);
  
  
  var totalSheets = ss.getNumSheets();
  var lastSheet = ss.getSheets()[totalSheets-1];// !! () and -1 because if 3 sheets, last sheet is [2]
  var lastSheetName = lastSheet.getName();
  var s = ss.getSheetByName(lastSheetName);
  //Logger.log(lastSheetName+" "+month[today.getMonth()]+today.getDate());
 
 //USE IF STATEMENT TO FIND THE PREVIOUS DAY AND GET THE FIRST ID THEN GATHER ALL ORDERS SINCE THEN AND PASTE THEM INTO A NEW SHEET TITLED BY TODAY'S DATE
  
  if(lastSheetName !== month[today.getMonth()]+(today.getDate()))
  {
    var newSheet = ss.insertSheet(month[today.getMonth()]+(today.getDate()))
  }
  else
  {
   var newSheet= s;
  } 

// INSERT NUMBER OF ROWS HERE TOTALING data.orders.length - FOR WHILE data.orders.length > 1 utilities sleep(500)

   var r = s.getRange(1,1).getValue();
   Logger.log(r)
  
    var val = r.substr(1,14);
  Logger.log(getId(val));
  
    var url = "https://thehundreds.myshopify.com/admin/orders.json?since_id="+getId(val)+"&status=any&limit=250";
    var username = "*";
    var password = "*";
    var response = UrlFetchApp.fetch(url, {"method":"get", "headers": {"Authorization": "Basic " + Utilities.base64Encode(username + ":" + password)}});
    var data = JSON.parse(response.getContentText());
  Logger.log(data.orders[0].discount_codes)
  
  
  
  if(data.orders.length > 1)
  {
    
    newSheet.insertRowsBefore(1, data.orders.length)
    
    for(j=0;j<data.orders.length;j++)
    {
      newSheet.getRange(j+1,1).setValue(data.orders[j].name)
      newSheet.getRange(j+1,2).setValue(data.orders[j].id)
      newSheet.getRange(j+1,3).setValue(data.orders[j].created_at.substr(0,10))
      newSheet.getRange(j+1,4).setValue(data.orders[j].customer.first_name+" "+data.orders[j].customer.last_name )
      if( data.orders[j].line_items[0].requires_shipping){newSheet.getRange(j+1,5).setValue(data.orders[j].shipping_lines[0].title )}else{newSheet.getRange(j+1,5).setValue('Not Available')}
      newSheet.getRange(j+1,6).setValue(data.orders[j].total_price_usd)
      newSheet.getRange(j+1,7).setValue(data.orders[j].email)
      newSheet.getRange(j+1,8).setValue(data.orders[j].customer.orders_count)
      newSheet.getRange(j+1,9).setValue(data.orders[j].financial_status)
      newSheet.getRange(j+1,10).setValue(data.orders[j].discount_codes)
      var everySku="";
      for(k=0;k<data.orders[j].line_items.length;k++) 
      {
        
        everySku+=data.orders[j].line_items[k].sku+";";
      
      }
      newSheet.getRange(j+1,11).setValue(everySku);
      
      
    }
    
    
  Utilities.sleep(500);
    
  }
  
  newSheet.getDataRange().sort({column: 1, ascending: false});
    
}