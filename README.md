# Drive_Mapping
For the creation of a vis.js network map to display your Google Drive structure

##Script Runtime Flow
When you open index.html and authorise it, it will have a chat with the Google Apps Script you specify (see install notes), and see if it's the first time you've run this before.  It does this by having a look at the Google Sheet you specify (see install notes), and seeing if there's stuff there already.

###If there's no entries in the Sheet it does the following
1. Add Root ID to the top of the Sheet
2. Begins the Drive API to start mapping your Drive to the Sheet.  This will take a long time, but will store a token in the App Script in case it times out.  When the mapping finishes the token is deleted and a timestamp is made in column E to show when it was run.
4. Once this has finished, Apps Script turns the Sheet into JSON and sends it back to the clientside.


###If there are entries in the Sheet it does the following
1. Looks for a token to see if the mapping finished.  If there's one, it continues the mapping.
2. If there's no token it will then run the Activity API, looking for specified Drive activity which has occured since the last timestamp in column E.
3. It will then update the Sheet entries based on what kind of activity occured (deletion, moved, renamed etc).  
4. Once this has finished, Apps Script turns the Sheet into JSON and sends it back to the clientside.

##Create a Google Developer Console oAuth client ID
You'll need to create a project in the Developer Console, obtain a oAuth Client ID, and take note of that for the install below.  I'm not 100% certain if it's necessary, I'll test this later and ammend the documentation if it's not.

Your Client ID can be retrieved from your project in the Google
Developer Console, https://console.developers.google.com

##Install
1. Create a new Google Sheet
2. In the Sheet add the following column headings "this_id", "this_name", "parent_id", "node_count", "lastRunTime"
3. In the Sheet go Tools > Script editor
4. Copy the 4 .gs files from the gs folder into the App Script
5. Line 1 of Init.gs, enter the ID of the Google Sheet you just made
6. Publish > Deploy as Executible, copy the ScriptID.
7. Open index.html from repo.
8. Line 143, enter your Client ID
8. Line 333, paste the ScriptID.

This is all because of the hard work of the vis.js team.  All credit goes to them, and I encourage you to contribute back to the repo. 
