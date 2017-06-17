MasterGroupArray = function (){
  var self = this;
  this.nodes = [];
  this.edges = [];
}
edgeConnection = function(){
  var self = this;
  this.to = "";
  this.from = "";
}
nodeConnection = function(){
  var self = this;
  this.id = null;
  this.label = null;
  this.title = null;
  this.group = 0;
}

listAllUsers = function(sheet,startingRow,finishingRow) {
  var sheetArrayValues = sheet.getRange(startingRow,1,(finishingRow - startingRow),4).getDisplayValues();
  var formattedArray = listAllGroups(sheetArrayValues);
  return formattedArray;
}
var groupArray = new MasterGroupArray();

listAllGroups = function(sheetArrayValues) {
  if (sheetArrayValues.length) {
    for(i=0;i<sheetArrayValues.length;i++){
      var currentSheetRow = sheetArrayValues[i];
      var currentGroup = new nodeConnection();
      currentGroup.id = currentSheetRow[0];
      currentGroup.label = currentSheetRow[1];
      currentGroup.title = currentSheetRow[1];
      currentGroup.group = currentSheetRow[3];
      createEdgeObject(currentSheetRow[0],currentSheetRow[2]);
      groupArray.nodes.push(currentGroup);
    }
  } else {
    return "It's all gone horribly wrong!";
  }
  return groupArray;
}

createEdgeObject= function(toGroup, fromGroup){
  var group = new edgeConnection();
  try {
    group.to = toGroup;
    group.from = fromGroup;
  } catch(err) {
    Logger.log(err.lineNumber + ' - ' + err);
    return false;
  }
  groupArray.edges.push(group);
  
  return group;
}