# AlgorithmicBias-HistoryExtension
A Chrome Browser extension to gather browsing habits of survey participants.


## Installation/Testing:

1.) Type in "chrome://extensions" into your Chrome address bar.  
2.) Switch the "Developer Mode" toggle to on.  
3.) Click "Load Unpacked Extension" and navigate to the folder containing these files.  

## Proof of Concept:

This is a very early proof of concept of the extension at the moment, but right now I've shown we can extract history information from a participant's browser, as well as assign them a uniqe, randomized, and persistent ID.

## Questions/Things which are unclear to me at this point:
(Many questions/uncertainties are listed in the comments of the file, but I will list them here as well)  
1.) What exactly is the process of consent supposed to be? How do we inform participants of the data collection?   
2.) How are we sending/collecting the history data? Do we send it to our database in batches at predetermined intervals? Or do we send data on the fly as the user browses? Or is it that we collect it all at the time the participant collects their compensation  
3.) Where/how are we storing this data? Do we have a web server/database?  

## Future Plans/TODOs:

1.) Extension also currently reports "browsing history" of files opened in Chrome (pdfs/doc/docx): we should probably drop these from the data collection  
2.) Strip PII entered in text fields/logins without stripping all parameters (otherwise all YouTube and Google search traffic will be indistinguishable)  
3.) Confirm that the "startTime" parameter of the Chrome history search works like I assume (i.e. that is is measured in miliseconds since the date 1/1/1970 like timestamps from the JavaScript Date class)  
  
