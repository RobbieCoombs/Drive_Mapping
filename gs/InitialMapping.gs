function getFileCollection(){
  var sheet = this.spreadsheet.getActiveSheet();
  function ListDriveFiles() {
    var lastRow_initially = this.spreadsheet.getLastRow(sheet);
    var scriptProperties = PropertiesService.getUserProperties();
    var FolderToken = scriptProperties.getProperty('TOKEN_FOLDER');
    var folders = (FolderToken == null) ? DriveApp.searchFolders('"me" in owners and trashed = false') : DriveApp.continueFolderIterator(FolderToken); 
    
    var d = new Date();  //timer
    var t0 = d.getTime();
    var token;
    
    while (folders.hasNext()){
      var currentFolder = folders.next();
      var currentFolderID = currentFolder.getId();
      var currentFolderName = currentFolder.getName();
      var currentFolderParent = getParent(currentFolder);
      var i = 0;
      //If you just want to map your folders, then comment out from here...
//      var files = currentFolder.getFiles();
//      while (files.hasNext()) {
//        var i = i + 1;
//        var file = files.next();  
//        var id=file.getId();
//        var fileName = file.getName();
//        var fileParent = currentFolderID;
//        sheet.appendRow([id, fileName, currentFolderID,0]);
//      }
      //.....to here
      sheet.appendRow([currentFolderID, currentFolderName, currentFolderParent,(Math.ceil(i/5)*5)]);//Rounding up to nearest 5 for better presentation  
      var d1 = new Date();
      var t1 = d1.getTime();
      if (t1-t0>350000) {
        var lastRow_afterwards = this.spreadsheet.getLastRow(sheet);
        this.spreadsheet.getLastValue(sheet).setValue(this.spreadsheet.util.getTime());
        var somethingFucked = this.listAllUsers(sheet,lastRow_initially,lastRow_afterwards);
        scriptProperties.setProperty('Folder_Token', folders.getContinuationToken());
        return {data:somethingFucked,relaunch:"continue"};
      }
    }
    var rootFiles = DriveApp.getRootFolder().getFiles(); //We have to also get all root files
    while (rootFiles.hasNext()) {
      var file = rootFiles.next();  
      var id=file.getId();
      var fileName = file.getName();
      var fileParent = currentFolderID;
      sheet.appendRow([id, fileName, currentFolderID,0]);
    }
    scriptProperties.deleteProperty('Folder_Token');
    var lastRow_afterwards = this.spreadsheet.getLastRow(sheet);
    this.spreadsheet.getLastValue(sheet).setValue(this.spreadsheet.util.getTime());
    var somethingFucked = this.listAllUsers(sheet,lastRow_initially,lastRow_afterwards);
    return {data:somethingFucked};
  }
  
  function getParent(item){
    var parent = item.getParents();
    if (parent.hasNext()){
      var parentId=parent.next().getId();
      return parentId;
    }
    else{
      return;
    }
  }
  
  return ListDriveFiles();
};