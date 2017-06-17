# Drive_Mapping
For the creation of a vis.js network map to display your Google Drive structure.  Be default this will map both files and folders, but can easily be set to just map folders.  I've created this in some spare time but could readily be extended into a powerful administrative tool.

![network map example](https://github.com/RobbieCoombs/Drive_Mapping/blob/master/assets/img/Drive_Map480p.gif)


## Setup

#### Create a Google Developer Console oAuth client ID
You'll need to create a project in the Developer Console, obtain a oAuth Client ID, and take note of that for the install below.  I'm not 100% certain if it's necessary, I'll test this later and ammend the documentation if it's not.
Your Client ID can be retrieved from your project in the Google
Developer Console, https://console.developers.google.com

#### Repo Files Setup
1. Create a new Google Sheet
2. In the Sheet add the following column headings "this_id", "this_name", "parent_id", "node_count", "lastRunTime"
3. In the Sheet go Tools > Script editor
4. Copy the 4 .gs files from the gs folder into the App Script
5. Line 4 of Utility.gs, enter the ID of the Google Sheet you just created.
6. Publish > Deploy as Executible, copy the ScriptID.
7. Open index.html from repo.
8. Line 143, enter your Client ID
8. Line 333, paste the ScriptID.

#### Optional Setup
By default this will map both your Folders and Files in Drive.  Because of the size of my personal Drive this works for me, but if you think yours will cause issues, in 'InitialMapping.gs' on Line 19 I've added a comment on how to remove the Files so it only maps Folders.  Again, depending on the size of your Drive this map be necessary.  I don't have enough content to test under fat Drive conditions.

## Script Runtime Flow
When you authorise the app, it will talk to your App Script and see if it's the first time you've run this app before.  It does this by having a look at the Google Sheet the App Script is attached to and seeing if there's stuff there already.

#### If there's no entries in the Sheet it does the following
1. Adds your Drive Root ID to the top of the Sheet.
2. Begins the Drive API to start mapping your Drive to the Sheet.  This will take a long time, but will store a token in the App Script in case it times out.  When the mapping finishes, the token is deleted and a timestamp is made in column E to show when it was last run.
4. Then Apps Script turns the Sheet into JSON and sends it back to the client side to create the network map.


#### If there are entries in the Sheet it does the following
1. Looks for a token to see if the mapping finished.  If there's one, it continues the mapping as per above.
2. If there's no token it will then run the Activity API, looking for specified Drive activity which has occured since the last time the app was run.
3. It will then update the Sheet rows based on what kind of Drive activity has occured since (deletion, moved, renamed etc).  
4. Once this has finished, Apps Script turns the Sheet into JSON and sends it back to the clientside.

For an Australian government client I've created a script which does something similar to this but with a Google Groups directory as well.  If people are interested I might do a re-write of that and upload it here also.  Another App Script I've written is an enterprise Drive security script that rolls over a Drive structure and transfers all content from the original owners to a master/admin account.  It needs a re-write before I'd upload it here, but if people are interested I might commit the time.


This is all because of the hard work of the vis.js team.  All credit goes to them, and I encourage you to contribute back to the repo.  Feel free to contact me here or via robbie.coombs@VerveEd.com, there's no copyright or anything here.  Go nuts.
