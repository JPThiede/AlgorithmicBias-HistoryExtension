# AlgorithmicBias-HistoryExtension
A Chrome Browser extension to gather browsing habits of survey participants.


## Installation/Testing:

1. Type in "chrome://extensions" into your Chrome address bar.  
2. Switch the "Developer Mode" toggle to on.  
3. Click "Load Unpacked Extension" and navigate to the folder containing these files.  

** We can publish the extension to the Chrome Extension Marketplace easily once it is ready for deployment

## Proof of Concept:

This is a very early proof of concept of the extension at the moment, but right now I've shown we can:
1. Extract history information from a participant's browser.
2. Assign them a uniqe, randomized, and persistent ID. 
3. We have also assigned a timestamp at install time which will limit what we can query from the first 24 hour period. 
4. Non http/https traffic is ignored in the query, solving the issues that could have arisen from reporting files opened in Chrome.
5. 24 Hour cycle solution is in place: on a timer check if 24 have passed, and if true trigger query and send data.

## Questions/Things which are unclear to me at this point:
(Many questions/uncertainties are listed in the comments of the file, but I will list them here as well)  
1.  What exactly is the process of consent supposed to be? How do we inform participants of the data collection?   
2.  How are we sending/collecting the history data? Do we send it to our database in batches at predetermined intervals? Or do we send data on the fly as the user browses? Or is it that we collect it all at the time the participant collects their compensation
  
3.  Where/how are we storing this data? Do we have a web server/database?  

## Questions Answered from IRB form: 
1. Still somewhat unclear, will seek further clarification 
2. From IRB proposal: Every 24 hours we will send browsing data for that time period. 
3. IRB form states we will have a server/database in which we will store. I've gotten access to the server now.

## TODOs For 6/5/2019:

1. Handle cases of consent revocation: Exclude all traffic between pause and resume of collection, and also provide means for users to specify domains which they want excluded from the collection 

* Mostly complete at this stage: 
* We can pause the collection, and later resume it. Anything visited within that time will be excluded. (It is still retrieved by chrome.history.search, but we will simple not send/store them: the result from the query are cleared once the callback funtion completes)
* We have a button to prompt users to indicate specific webpages or domains that they wish to be excluded from our collection.

2. Work through issues with sending data to the remote server and figure out what, if any, applications it needs to be running.

*  I have not currently worked through this, but from early digging: 
*  It may need to implement http(s), so we can send to server using POST requests? 


## Future Plans:

1. Strip PII entered in text fields/logins without stripping all parameters (otherwise all YouTube and Google search traffic will be indistinguishable)  

2. Some questions about consent still: How do we present our process to participants? Do we have a script already prepared that informs participatnts? What happens if consent is revoked midway through (after data is sent)? Would we then have to drop their data from our DB?  

3. Will need to dig into how to handle compensation. According to IRB proposal: we will be giving our gift cards for participation, I will need to figure out a method for automating the generation of these (how to pay, how to programattically create, etc.) Amazon provides an API for this: https://developer.amazon.com/amazon-incentives-api

4. Details about web server/database to be ironed out. Will need access to something to test extension XHR (Cross-Origin http Request) features. It should be relatively simple based on my early reading. 



