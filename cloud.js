// Imports the Google Cloud client library
const Vision = require('@google-cloud/vision');

var vision = require('@google-cloud/vision')({
  projectId: 'grape-spaceship-123',
  keyFilename: '/path/to/keyfile.json'
});

// Your Google Cloud Platform project ID
const projectId = 'YOUR_PROJECT_ID';

// Instantiates a client
const visionClient = Vision({
  projectId: projectId
});

// The name of the image file to annotate
const fileName = './resources/wakeupcat.jpg';

// Performs label detection on the image file
visionClient.detectLabels(fileName)
  .then((results) => {
    const labels = results[0];

    console.log('Labels:');
    labels.forEach((label) => console.log(label));
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });


// Imports the Google Cloud client library
const Vision = require('@google-cloud/vision');

// Instantiates a client
const vision = Vision();

// The path to the local image file, e.g. "/path/to/image.png"
// const fileName = '/path/to/image.png';

// Performs text detection on the local file
vision.detectText(fileName)
  .then((results) => {
    const detections = results[0];

    console.log('Text:');
    detections.forEach((text) => console.log(text));
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });


