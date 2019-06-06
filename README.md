# AlgorithmicBias-HistoryExtension
A Chrome Browser extension to gather browsing habits of survey participants.


## Installation/Testing:

1. Type in "chrome://extensions" into your Chrome address bar.  
2. Switch the "Developer Mode" toggle to on.  
3. Click "Load Unpacked Extension" and navigate to the folder containing these files.  

## Current Features

1. Extract history information from a participant's browser.
2. Assign them a uniqe, randomized, and persistent ID. 
3. We have also assigned a timestamp at install time which will limit what we can query from the first 24 hour period. 
4. Non http/https traffic is ignored in the query, solving the issues that could have arisen from reporting files opened in Chrome.
5. 24 Hour cycle solution is in place: on a timer check if 24 have passed, and if true trigger query and send data.
6. Ability to pause all collection: items visited within that time will not be included in data collection
7. Ability to exclude certain domains/webpages from the collection


## TODOs for 6/12/2019:

1. Spin up an http server that will handle POST requests on our remote server
2. Facilitate communication between app and http server
3. Begin looking into Amazon incentives API
4. (Extra) Button/option to exclude the page currently in focus 

## Future Plans:

1. Strip PII entered in text fields/logins without stripping all parameters (otherwise all YouTube and Google search traffic will be indistinguishable)  

2. Some questions about consent still: How do we present our process to participants? Do we have a script already prepared that informs participatnts?

3. Will need to dig into how to handle compensation. According to IRB proposal: we will be giving our gift cards for participation, I will need to figure out a method for automating the generation of these (how to pay, how to programattically create, etc.) Amazon provides an API for this: https://developer.amazon.com/amazon-incentives-api





