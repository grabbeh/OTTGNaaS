// Imports the Google Cloud client library
const Vision = require('@google-cloud/vision');

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

// Imports the Google Cloud client libraries
const Storage = require('@google-cloud/storage');
const Vision = require('@google-cloud/vision');

// Instantiates clients
const storage = Storage();
const vision = Vision();

// The name of the bucket where the file resides, e.g. "my-bucket"
// const bucketName = 'my-bucket';

// The path to the file within the bucket, e.g. "path/to/image.png"
// const fileName = 'path/to/image.png';

// Performs text detection on the remote file
vision.detectText(storage.bucket(bucketName).file(fileName))
  .then((results) => {
    const detections = results[0];

    console.log('Text:');
    detections.forEach((text) => console.log(text));
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });
