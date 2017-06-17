var spreadsheet = {
  
  getActiveSheet: function(sheetID){
    this.sheet = SpreadsheetApp.openById(sheetID).getActiveSheet();
    return this.sheet;
  },
  getLastRow: function(sheet){
    var lastRow = sheet.getLastRow();
    return lastRow;
  },
  getRootID: function(sheet){
    var rootID = DriveApp.getRootFolder().getId();
    sheet.appendRow([rootID, "My Drive", rootID,100]);
  },
  getLastValue: function(sheet){
    var lastCell = sheet.getRange(this.getLastRow(sheet), sheet.getLastColumn());
    return lastCell;
  },
  getExistingSheetData: function(sheet,token){
    var lastCell = this.getLastValue(sheet);
    var lastModifiedDate = lastCell.getValue().toFixed();
    this.allDriveFileIDs = spreadsheet.util.transpose(sheet.getRange(1, 1,this.getLastRow(sheet)).getDisplayValues());
    return this.getActivityReport(sheet,lastModifiedDate,token);
  },
  getActivityReport: function(sheet,lastModifiedDate,previousToken){
    var lastRow = this.getLastRow(sheet);
    var result = function(previousToken){
      return AppsActivity.Activities.list({
        'source': 'drive.google.com',
        'drive.ancestorId': 'root',
        'fields': 'activities(combinedEvent(primaryEventType,eventTimeMillis,target,move))',
        'groupingStrategy': 'none',
        'pageToken':previousToken
      });
    }();
    var token = result.nextPageToken;
    this.filterActivities(sheet,result.activities,lastModifiedDate);
    while (token){
      var newResult = result(token);
      var activities = newResult.activities;
      var token = newResult.nextPageToken;
      this.filterActivities(sheet,activities,lastModifiedDate);
    }
    var data = listAllUsers(sheet,2,lastRow);
    return {data:data};
    
  },
  filterActivities: function(sheet,array,lastModifiedDate){
    //eventTypes are events that we care to track because they signify a change to the Drive structure.
    var eventTypes = "trash move rename upload";
    var cleanArray = array.filter(function(eventData){
      return (eventData.combinedEvent.eventTimeMillis > lastModifiedDate && (eventTypes.indexOf(eventData.combinedEvent.primaryEventType) >= 0));
    }).forEach(function (value){
      this.modifySpreadsheetDriveData(sheet,value.combinedEvent);
    },this);
    this.getLastValue(sheet).setValue(spreadsheet.util.getTime());
    return;
  },
  modifySpreadsheetDriveData: function(sheet,driveFile){
    var sheet = sheet;
    var driveIDArray = this.allDriveFileIDs;
    var driveEventType = driveFile.primaryEventType;
    var driveFileChange = {
      'getExistingFileRange': function(driveFile){
        return driveIDArray.indexOf(driveFile.target.id) + 1;
      },
      'move': function (driveFile) {
        var row = this.getExistingFileRange(driveFile);
        sheet.getRange(row,3).setValue(driveFile.move.addedParents[0].id);
        return;
      },
      'trash': function (driveFile) {
        var row = this.getExistingFileRange(driveFile);
        var action = (this.getExistingFileRange(driveFile) > 0) ? sheet.deleteRow(row) : false;
        return;
      },
      'rename': function (driveFile) {
        var row = this.getExistingFileRange(driveFile);
        sheet.getRange(row,2).setValue(driveFile.rename.newTitle);
        return;
      },
      'upload': function (driveFile) {
        Logger.log(driveFile);
        sheet.appendRow([driveFile.target.id,driveFile.target.name,driveFile.move.addedParents[0].id]);
        return;
      }
    };
    return driveFileChange[driveEventType](driveFile);
  }
}

spreadsheet.util = {
  getTime: function(){
    var date = new Date();
    var nonce = Math.floor((date.getTime())).toString();
    return nonce;
  },
  arrayWrapper: function(){
    return new Array();
  },
  transpose: function(input){
    var flattened = [];
    var inputLength = input.length;
    for (var i = 0; i < inputLength; ++i) {
      var current = input[i];
      var currentLength = current.length;
      for (var j = 0; j < currentLength; ++j)
        flattened.push(current[j]);
    }
    return flattened;
  },
  extend: function (dest) {
    var sources = Array.prototype.slice.call(arguments, 1);
    sources.forEach(function (source) {
      Object.keys(source).forEach(function (key) {
        dest[key] = source[key];
      });
    });
    return dest;
  },
}