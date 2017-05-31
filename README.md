# OTTGNaaS
Online Terms to Graphic Novels as a Service

1. Use Google Cloud API to identify text in images (https://cloud.google.com/vision/)
2. Get overall bounding box (on basis that above tool appears to identify text in smaller blocks rather than on basis of entire text area)
3. Use Cloudinary to overlay whitespace over text using bounding boxes, and then replace with text from online terms (http://cloudinary.com/documentation/node_image_manipulation#overlays_underlays_and_watermarks)
3A. Or potentially use canvas and clearRect() method to create clear squares on text boxes
4. ....
5. Profit!!
