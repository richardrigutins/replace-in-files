import { debug, getInput, info, setFailed, warning } from '@actions/core';
import {
  Encoding,
  getFiles,
  isValidEncoding,
  replaceTextInFile,
} from './utils';

async function run(): Promise<void> {
  try {
    const filesPattern = getInput('files');
    const searchText = getInput('search-text');
    const replaceText = getInput('replacement-text');
    const excludePattern = getInput('exclude');
    const inputEncoding = getInput('encoding');

    if (!isValidEncoding(inputEncoding)) {
      throw new Error(`Invalid encoding: ${inputEncoding}`);
    }

    const filePaths = await getFiles(filesPattern, excludePattern);
    if (filePaths.length === 0) {
      warning(`No files found for the given pattern.`);
      return;
    }

    info(`Found ${filePaths.length} files for the given pattern.`);
    info(`Replacing text...`);

    const encoding = inputEncoding as Encoding;
    const promises: Promise<void>[] = filePaths.map(
      async (filePath: string) => {
        debug(`Replacing text in file ${filePath}`);
        await replaceTextInFile(filePath, searchText, replaceText, encoding);
      },
    );

    await Promise.all(promises);
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
