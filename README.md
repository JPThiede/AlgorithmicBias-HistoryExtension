# AlgorithmicBias-HistoryExtension
A Chrome Browser extension to gather browsing habits of survey participants.


## Installation/Testing:

1. Type in "chrome://extensions" into your Chrome address bar.  
2. Switch the "Developer Mode" toggle to on.  
3. Click "Load Unpacked Extension" and navigate to the folder containing these files.  

## Proof of Concept:

This is a very early proof of concept of the extension at the moment, but right now I've shown we can extract history information from a participant's browser, as well as assign them a uniqe, randomized, and persistent ID. We have also assigned a timestamp at install time which will limit what we can query from the first 24 hour period. Non http/https traffic is ignored in the query, solving the issues that could have arisen from reporting files opened in Chrome

## Questions/Things which are unclear to me at this point:
(Many questions/uncertainties are listed in the comments of the file, but I will list them here as well)  
1.  What exactly is the process of consent supposed to be? How do we inform participants of the data collection?   
2.  How are we sending/collecting the history data? Do we send it to our database in batches at predetermined intervals? Or do we send data on the fly as the user browses? Or is it that we collect it all at the time the participant collects their compensation
  
3.  Where/how are we storing this data? Do we have a web server/database?  

## Questions Answered from IRB form: 
1. Still somewhat unclear, will seek further clarification 
2. From IRB proposal: Every 24 hours we will send browsing data for that time period. 
3. IRB form states we will have a server/database in which we will store. 

## Future Plans/TODOs:

1. Strip PII entered in text fields/logins without stripping all parameters (otherwise all YouTube and Google search traffic will be indistinguishable)  

2. Find a way to call the search function on a 24 hour cycle. Possible problem if the browser/extension is not opened at the exact time: will need to find some way to have a countdown that doesn't break if it goes negative.

3. Begin looking into details about web server/database

4. Some questions about consent still: How do we present our process to participants? What happens if consent is revoked midway through (after data is sent)? Would we then have to drop their data from our DB?
  
