import fs from 'fs';
import { storage } from 'pkgcloud';
import config from '../../config/storage';

const { CONTAINER_NAME, STORAGE_PROVIDER } = process.env;
const clientConfig = config[STORAGE_PROVIDER];

let client;

try {
  client = storage.createClient({
    provider: 'amazon',
    ...clientConfig,
  });
} catch (e) {
  // eslint-disable-next-line no-console
  console.error(
    'Cloud storage failed to initialize. \
    Upload/download operations will throw error. \
    More details: ',
    e,
  );
}

function assertClientInitialized() {
  if (!client) throw new Error('Cloud storage client not initialized');
}

function upload(localPath, remotePath) {
  assertClientInitialized();
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(localPath);
    const writeStream = client.upload({
      container: CONTAINER_NAME,
      remote: remotePath,
    });
    writeStream.on('error', reject);
    writeStream.on('success', resolve);
    readStream.pipe(writeStream);
  });
}

function download(remotePath) {
  assertClientInitialized();
  return client.download({ container: CONTAINER_NAME, remote: remotePath });
}

function buildRemotePath(fileName, { directoryPath, namePrefix }) {
  const path = directoryPath ? `${directoryPath}/` : '';
  const name = namePrefix ? `${namePrefix}-${fileName}` : fileName;
  return `${path}${name}`;
}

async function uploadFile(file, pathOptions) {
  if (file && file.size) {
    const { path: localImagePath, originalname: localImageName } = file;
    const remoteImagePath = buildRemotePath(localImageName, pathOptions);
    await upload(localImagePath, remoteImagePath);
    return remoteImagePath;
  }
  return null;
}

module.exports = {
  client,
  download,
  upload,
  buildRemotePath,
  uploadFile,
};
