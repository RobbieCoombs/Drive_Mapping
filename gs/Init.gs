function init(){
  var pageToken = pageToken || undefined;
  var sheet = Object.create(spreadsheet).getActiveSheet();
  var sheetLength = sheet.getLastRow();
  if (sheetLength > 1){
    var spreadsheetData = (PropertiesService.getScriptProperties().getProperty('Folder_Token')) ? getFileCollection() : spreadsheet.getExistingSheetData(sheet,pageToken);
    return spreadsheetData
  }
  else{
    return addRootID(sheet);
  }
}

function addRootID(sheet){
  spreadsheet.getRootID(sheet);
  return getFileCollection();
}

