# OTTGNaaS
Online Terms to Graphic Novels as a Service

![example](/demo.PNG)

Work in progress to detect existing speech bubbles in graphic novels and replace with terms and conditions. At present URL and related image data, and a URL to a privacy policy are hard-coded in `/src/servers.js`. Running the below commands will start a server at `localhost:2000` where the results can be found.

You will need to insert keys for Google's Cloud Vision API and Image Search API in the /config folder. Also, node-canvas has issues with node 7 and above (or maybe it's just me!), and so Babel is used to get access to `async/await` (as they are only available in node 7.6.0 and above). Browserify bundles ./public/js/main for the browser.

`npm run babel`

`npm run browserify`

`node ./compiled/server`

TO DO:

- [ ] Replace Google Cloud Vision API with Tesseract.js
- [ ] More gracefully match length of terms snippet with size of speech bubble
- [ ] Develop front end to allow people to generate pages by submitting URL of image and conditions (and submit result for storage potentially)
