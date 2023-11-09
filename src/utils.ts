import fs from 'fs';
import { glob } from 'glob';

const encodings = [
  'ascii',
  'utf8',
  'utf16le',
  'ucs2',
  'base64',
  'latin1',
] as const;

export type Encoding = (typeof encodings)[number];

/**
 * Checks if the given encoding is supported.
 * @param encoding The encoding to check.
 * @returns `true` if the encoding is valid, `false` otherwise.
 */
export function isValidEncoding(encoding: string): boolean {
  return encodings.includes(encoding as Encoding);
}

/**
 * Returns an array of file paths that match the given pattern.
 * @param filesPattern The file path or glob pattern to search for.
 * @param exclude An optional glob pattern to exclude from the search.
 * @returns A Promise that resolves to an array of file paths.
 * @throws An error if there is an error getting the files.
 */
export async function getFiles(
  filesPattern: string,
  exclude?: string,
): Promise<string[]> {
  try {
    return await glob(filesPattern, { ignore: exclude });
  } catch (error) {
    throw new Error(`Error getting files: ${error}`);
  }
}

/**
 * Processes an array in chunks, applying a given function to each item.
 * @param array The array to process.
 * @param func The function to apply to each item.
 * @param chunkSize The number of items to process at a time.
 * @returns A Promise that resolves when all items have been processed.
 */
export async function processInChunks<T>(
  array: T[],
  func: (item: T) => Promise<void>,
  chunkSize: number,
): Promise<void> {
  // Split the array into chunks
  const chunks = Array(Math.ceil(array.length / chunkSize))
    .fill(0)
    .map((_, index) => index * chunkSize)
    .map(begin => array.slice(begin, begin + chunkSize));

  // Process each chunk
  for (const chunk of chunks) {
    await Promise.all(chunk.map(func));
  }
}

/**
 * Replaces all instances of the given text with the given value in the file.
 * @param filePath The path of the file to modify.
 * @param searchText The string to search for.
 * @param replacementText The string to replace the search text with.
 * @param encoding The encoding of the file.
 * @returns A Promise that resolves when the file has been modified.
 * @throws An error if there is an error reading or saving the file.
 */
export async function replaceTextInFile(
  filePath: string,
  searchText: string,
  replacementText: string,
  encoding: Encoding = 'utf8',
): Promise<void> {
  // Don't do anything if the search text is empty
  if (!searchText) {
    return;
  }

  const fileContent = await readFileContent(filePath, encoding);
  const updatedContent = fileContent.replace(searchText, replacementText);
  await saveFileContent(filePath, updatedContent);
}

/**
 * Reads the content of the file at the given path.
 * @param filePath The path of the file to read.
 * @param encoding The encoding of the file.
 * @returns A Promise that resolves to the content of the file as a string.
 * @throws An error if there is an error reading the file.
 */
async function readFileContent(
  filePath: string,
  encoding: Encoding,
): Promise<string> {
  try {
    const fileContentBuffer = await fs.promises.readFile(filePath, encoding);
    return fileContentBuffer.toString();
  } catch (error) {
    throw new Error(`Error reading file content: ${error}`);
  }
}

/**
 * Saves the given content to the file at the given path.
 * @param filePath The path of the file to save.
 * @param content The content to save to the file.
 * @returns A Promise that resolves when the file has been saved.
 * @throws An error if there is an error saving the file.
 */
async function saveFileContent(
  filePath: string,
  content: string,
): Promise<void> {
  try {
    await fs.promises.writeFile(filePath, content);
  } catch (error) {
    throw new Error(`Error saving file content: ${error}`);
  }
}
