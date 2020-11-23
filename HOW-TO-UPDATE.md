# How-to-update 10.12.19

## Requirements
* Windows 7+/10 (import only works on windows)
* Photoshop CC (necessary for new tracks on trackmap and new seasons)
* Android device (necessary for apk and amazon import)
* git: https://git-scm.com/downloads (upload changes to github)
* Github account (https://github.com/ for commits of your changes) into this repo
* NodeJS https://nodejs.org/en/download/ (running trackmap server & import)
* dutscher will brief you for:
  * TF.zip for import unpack this in "C:/" (import scripts)
  * www.imgur.com (image hoster, ask for credentials)
  * ftp credentials (to get the changes live)

## Preparation
* unzip the TF.zip to "C:/#TFunpacker"
* run "npm run npmInstall"
* run "grunt #checkImport"

## 1.Trackmap-gfx repo	
* $ git clone https://github.com/dutscher/trialstrackmap-gfx.git

## 2.Screenshots needed
* Season Transition "Season Begin"
* Startline of new track
* Platin medal on trackmap centered, each per each

## 3.Photoshop tasks
* Season
  * use previous "/seasons/42.resolution.jpg" as mask and include the new
  * save image as jpg, the name of new image should like this "./seasons/43.brake-up.jpg"
  * use 50% compression (the new image should be 15KB)
* Trackmap
  * open "/map-psd/map.5.7.0-petrol-falls.psd"
  * insert screenshot of centered new track
  // motog5 image: 1920x1080 -> 1280x720
  // motog8 image: 2280x1080 -> 1267x600
  * toggle the visiblity to get it mapped to the big map
  * mask it, fully black mask, and unmask only visible new track
  * merge if done to one layer
  * save image as jpg, the name of new image should like this "./map/trackmap.2.180224.en.jpg" (trackmap.WORLD.YEAR MONTH DAY.LANG.jpg)
  * use 50% compression (round about should the jpg be 1,54MB)
  * save the .psd
* Trackmap path
  * in the same psd is a hidden layer group
  * assign the pathes in vector mask
  * use a 30px black brush and paint on the path
  * deactivate the vector mask
  * paint the tier colors at its bounds
  * save the .psd
  * save with for web "STRG+SHIFT+ALT+S"
    * scale down to 320x320 (world 2, see in "./database/media/gfx.json" which dimension u need) 
    * save image as jpg, the name should be "./map/trackmap.2.180224.path.min.jpg"
  * hide group layer "track path" and save .psd
 
## 4.Deployment into trackmap-gfx repo
* Commit the image changes and push to master
  * $ git add .
  * $ git commit -m "newest season and tracks added"
  * $ git push
* Upload the compressed images to www.imgur.com
  * notice direct urls "https://i.imgur.com/J8rLK29.jpg"
* Upload Startline images
  * use www.imgur.com
  * add uploaded images to startlines
  * notice the "Direct link", you will need this for the next step
* Changes for gfx in repo trackmap
  * go into file "./database/media/gfx.json"
  * change for trackmap "src" property "https://i.imgur.com/J8rLK29.jpg" => "#1/J8rLK29.jpg"
  * add the path image to "srcTrackfinder" "#1/MZjlZMS.jpg"
		
## 5.Repo changes for tracks and deploy
* clone repo
  * $ git clone https://github.com/dutscher/trialstrackmap.git
  * $ cd trialstrackmap
  * $ npm install

## 6.Import newest data to trackmap repo
* look into game which version is the actual one
  * start app, go to options (gear in the top/left corner next to "Village")
  * in the right/bottom corner stands "5.8.3"
  * go into file "./package.json" the change version to "5.8.3"
* be sure your device is connected via adb! (see Preparation)
* start import tasks:
  * $ npm run grunt import1GameDataPhone
  * $ npm run grunt import2GameDataS3
  * $ npm run grunt import3DoUnpacking
  * $ npm run grunt import4DoPackagesToOneDir
  * $ npm run grunt import5ConvertOri2Json
  * $ npm run grunt import6GameDataViaJson
    * add unreleased tracks to "./database/i18n/en.json"
      * new track get a new id
      * also add the new tracks with their new id's to "./database/trackdata/ids.json"
      * make sure the world id is right (1: seymore and lotz, 2: petrol falls)
  * $ npm run grunt #startImportI18N
    * now we have to add the changes from "./build/import/i18n/*.json" to "./database/i18n/*.json"
    * use diff function for every language and add the new tracks (nothing more)
  * now compare 
    * "./build/import/parts.json" with "./database/trackdata/parts.json"
    * "./build/import/times.json" with "./database/trackdata/times.json"
    * "./build/import/tiers.json" with "./database/trackdata/tiers.json"
  * add the above uploaded startlines into "./database/trackdata/startlines.json"
    * ```,"291": "dasdasdd.jpg", without "https://i.imgur.com/"```
* start server
  * $ npm run serve
    * open in browser "http://localhost:8001/locations.html"
  * click on every new track on the star on the medal (the location is copied into the clipboard)      * insert the clipboard data into "./database/trackdata/coords.json"
    * now we have to categorize the tracks
      * create a new track category in "./database/categories.json"
      * choose a color in hexcode
    * add for every track in "./database/trackdata/categories.json" the categories

## 7.Commit, deploy and upload via ftp
* Commit the changes and push to master
  * $ git add .
  * $ git commit -m "newest track infos added"
  * $ git push
* run final deploy task: $ npm run #finalDeploy
* upload "./dist" dir to the ftp (see Requirements)

## 8.Tell dutscher what you did :D
