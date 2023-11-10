import { debug, getInput, info, setFailed, warning } from '@actions/core';
import {
  Encoding,
  getFiles,
  isPositiveInteger,
  isValidEncoding,
  processInChunks,
  replaceTextInFile,
} from './utils';

// Entry point for the action
async function run(): Promise<void> {
  try {
    // Get the input parameters
    const filesPattern = getInput('files');
    const searchText = getInput('search-text');
    const replaceText = getInput('replacement-text');
    const excludePattern = getInput('exclude');
    const inputEncoding = getInput('encoding');
    const maxParallelism = getInput('max-parallelism');

    // Validate the encoding
    if (!isValidEncoding(inputEncoding)) {
      throw new Error(`Invalid encoding: ${inputEncoding}`);
    }

    // Validate that maxParallelism is a positive integer
    if (!isPositiveInteger(maxParallelism)) {
      throw new Error(`Invalid max-parallelism: ${maxParallelism}`);
    }

    // Get the file paths that match the files pattern and do not match the exclude pattern
    const filePaths = await getFiles(filesPattern, excludePattern);

    // If no file paths were found, log a warning and exit
    if (filePaths.length === 0) {
      warning(`No files found for the given pattern.`);
      return;
    }

    info(`Found ${filePaths.length} files for the given pattern.`);
    info(`Replacing "${searchText}" with "${replaceText}".`);

    // Process the file paths in chunks, replacing the search text with the replace text in each file
    // This is done to avoid opening too many files at once
    const encoding = inputEncoding as Encoding;
    const chunkSize = parseInt(maxParallelism);
    await processInChunks(
      filePaths,
      async (filePath: string) => {
        info(`Replacing text in file ${filePath}`);
        await replaceTextInFile(filePath, searchText, replaceText, encoding);
      },
      chunkSize,
    );

    info(`Done!`);
  } catch (err) {
    if (err instanceof Error) {
      setFailed(err.message);
    } else {
      const errorMessage =
        'An error occurred. Run in debug mode for additional info.';
      debug(`${JSON.stringify(err)}`);
      setFailed(errorMessage);
    }
  }
}

run();
