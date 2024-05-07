const express = require('express');
// const multer = require('multer');
const path = require('path');
const fs = require('fs');
const piexif = require('piexifjs');
const cors = require('cors');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/**
 * API to add tags to an image
 * @param {string} imagePath - The path to the image
 * @param {string[]} tags - The tags to add to the image
 * @returns {string} - A message indicating the success or failure of the operation
 */
app.post('/api/tag/*', (req, res) => {
  const tags = req.body.tags;
  const imagePath = req.params[0];
  const filepath = path.join(__dirname, imagePath);

  // Read the JPEG file
  let jpeg = fs.readFileSync(filepath);
  let data = jpeg.toString('binary');

  // Define custom metadata
  let zeroth = {};
  let exif = {};
  let gps = {};

  zeroth[piexif.ImageIFD.Make] = 'Custom Make';
  exif[piexif.ExifIFD.DateTimeOriginal] = '2022:01:01 00:00:00';
  exif[piexif.ExifIFD.DateTimeOriginal] = '2022:01:01 00:00:00';
  // Add file tags
  exif[piexif.ExifIFD.UserComment] = tags;

  // Combine the metadata
  let exifObj = { '0th': zeroth, Exif: exif, GPS: gps };

  // Dump the metadata into bytes
  let exifbytes = piexif.dump(exifObj);

  // Insert the metadata into the original image data
  let newData = piexif.insert(exifbytes, data);

  // Convert the modified data back to binary
  let newJpeg = Buffer.from(newData, 'binary');

  // Overwrite the existing image file with the modified data
  fs.writeFileSync(filepath, newJpeg);

  res.send('Tags added successfully');
});

/**
 * API to upload an image
 * @param {string} name - The name of the project
 * @param {string} data - The base64 encoded image data
 * @returns {string} - A message indicating the success or failure of the operation
 */
app.post('/api/upload/:name', (req, res) => {
  const base64String = req.body.data;
  const { name } = req.params;

  const base64Image = base64String.split(';base64,').pop();
  const buffer = Buffer.from(base64Image, 'base64');

  const filename = `myImage-${Date.now()}.jpeg`;
  const filepath = path.join(__dirname, `public/uploads/${name}`, filename);

  // Ensure the uploads directory exists
  fs.mkdirSync(path.dirname(filepath), { recursive: true });

  fs.writeFile(filepath, buffer, (err) => {
    if (err) {
      console.error(err); // Log the error
      res.send('An error occurred while uploading the image');
    } else {
      res.send({
        name: filename,
        path: `public/uploads/${name}/${filename}`,
      });
    }
  });
});

/**
 * API to delete an image
 * @param {string} name - The name of the project
 * @param {string} filename - The name of the image file
 * @returns {string} - A message indicating the success or failure of the operation
 */
app.get('/api/project', (req, res) => {
  const folderPath = './public/uploads';
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      res.send('An error occurred while reading the project folder');
    } else {
      res.send(files);
    }
  });
});

app.get('/api/projects', (req, res) => {
  const folderPath = './public/uploads';
  fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      res.send('An error occurred while reading the project folders');
    } else {
      const folders = files
        .filter((file) => file.isDirectory())
        .map((file, i) => {
          const projectPath = `${folderPath}/${file.name}`;
          const stats = fs.statSync(projectPath);
          let images = [];

          try {
            images = fs.readdirSync(projectPath).map((image, j) => {
              const stats = fs.statSync(`${projectPath}/${image}`);
              return {
                id: j + 1,
                name: image,
                thumbnail: `/uploads/${file.name}/${image}`,
                image: `${projectPath}/${image}`,
                tags: readTagsFromImage(`${projectPath}/${image}`),
                timecreated: stats.birthtime.toISOString(),
                timeupdated: stats.mtime.toISOString(),
              };
            });
          } catch (err) {
            console.error(`Failed to read directory at ${projectPath}`);
          }
          return {
            id: i + 1,
            name: file.name,
            timecreated: stats.birthtime.toISOString(),
            timeupdated: stats.mtime.toISOString(),
            path: projectPath,
            frames: images,
            thumbnail: images.length > 0 ? images[0].path : '',
          };
        });
      res.send(folders);
    }
  });
});

/**
 * API to delete an image
 * @param {string} name - The name of the project
 * @param {string} filename - The name of the image file
 * @returns {string} - A message indicating the success or failure of the operation
 */
app.post('/api/project', (req, res) => {
  const { name } = req.body;

  const projectPath = `./public/uploads/${name}`;
  fs.mkdir(projectPath, (err) => {
    if (err) {
      res.send('An error occurred while creating the project folder');
    } else {
      const stats = fs.statSync(projectPath);
      // get count of projects
      const uploadPath = './public/uploads';
      const files = fs.readdirSync(uploadPath);
      const i = files.length;
      const project = {
        id: i + 1,
        name: name,
        timecreated: stats.birthtime.toISOString(),
        timeupdated: stats.mtime.toISOString(),
        path: projectPath,
        frames: [],
        thumbnail: '',
      };
      // Project folder created successfully
      res.send(project);
    }
  });
});

/**
 * API to delete an image
 * @param {string} name - The name of the project
 * @param {string} filename - The name of the image file
 * @returns {string} - A message indicating the success or failure of the operation
 */
app.delete('/api/project/:name', (req, res) => {
  const { name } = req.params;
  const folderPath = `./public/uploads/${name}`;
  fs.rmdir(folderPath, { recursive: true }, (err) => {
    if (err) {
      res.send('An error occurred while deleting the project folder');
    } else {
      res.send('Project folder deleted successfully');
    }
  });
});

/**
 * API to delete an image
 * @param {string} name - The name of the project
 * @param {string} filename - The name of the image file
 * @returns {string} - A message indicating the success or failure of the operation
 */
app.get('/api/tag/*', (req, res) => {
  const imagePath = req.params[0];
  const filepath = path.join(__dirname, imagePath);
  console.log('filePath', filepath);
  const tags = readTagsFromImage(imagePath);
  res.send(tags);
});

function readTagsFromImage(imagePath) {
  // Read the JPEG file
  let jpeg = fs.readFileSync(imagePath);
  let data = jpeg.toString('binary');

  // Extract the metadata from the image
  let exifObj = piexif.load(data);

  // Extract the custom metadata
  let tags = exifObj.Exif[piexif.ExifIFD.UserComment];

  return tags ? tags.split(',') : [];
}

const port = 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
