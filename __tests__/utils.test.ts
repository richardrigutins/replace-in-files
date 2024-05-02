import fs from 'fs';
import path from 'path';
import {
  getFiles,
  isPositiveInteger,
  isValidEncoding,
  processInChunks,
  replaceTextInFile,
} from '../src/utils';

describe('isPositiveInteger', () => {
  it('should return true for positive integers', () => {
    expect(isPositiveInteger('1')).toBe(true);
    expect(isPositiveInteger('123')).toBe(true);
  });

  it('should return false for zero', () => {
    expect(isPositiveInteger('0')).toBe(false);
  });

  it('should return false for negative integers', () => {
    expect(isPositiveInteger('-1')).toBe(false);
  });

  it('should return false for non-integer numbers', () => {
    expect(isPositiveInteger('1.5')).toBe(false);
  });

  it('should return false for non-numeric strings', () => {
    expect(isPositiveInteger('abc')).toBe(false);
  });

  it('should return false for empty strings', () => {
    expect(isPositiveInteger('')).toBe(false);
  });

  it('should return false for whitespace strings', () => {
    expect(isPositiveInteger(' ')).toBe(false);
  });

  it('should return false for null', () => {
    expect(isPositiveInteger(null as any)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isPositiveInteger(undefined as any)).toBe(false);
  });
});

describe('isValidEncoding', () => {
  it('should return true for valid encodings', () => {
    expect(isValidEncoding('ascii')).toBe(true);
    expect(isValidEncoding('utf8')).toBe(true);
    expect(isValidEncoding('utf16le')).toBe(true);
    expect(isValidEncoding('ucs2')).toBe(true);
    expect(isValidEncoding('base64')).toBe(true);
    expect(isValidEncoding('latin1')).toBe(true);
  });

  it('should return false for invalid encodings', () => {
    expect(isValidEncoding('foo')).toBe(false);
    expect(isValidEncoding('bar')).toBe(false);
    expect(isValidEncoding('')).toBe(false);
    expect(isValidEncoding('42')).toBe(false);
    expect(isValidEncoding('true')).toBe(false);
  });
});

describe('getFiles', () => {
  it('should return an array of file paths that match the given pattern', async () => {
    const pattern = path.join(__dirname, '*.test.ts');
    const files = await getFiles(pattern);
    expect(files).toContain(path.join(__dirname, 'utils.test.ts'));
  });
});

describe('processInChunks', () => {
  it('should process an array in chunks', async () => {
    const totalItems = 999;
    const array = Array.from({ length: totalItems }, (_, i) => i);
    const func = jest.fn(async (item: number) => {
      item++;
    });
    const chunkSize = 100;

    await processInChunks(array, func, chunkSize);

    expect(func).toHaveBeenCalledTimes(totalItems);
  });

  it('should process an array with less items than chunk size', async () => {
    const array = Array.from({ length: 50 }, (_, i) => i);
    const func = jest.fn(async (item: number) => {
      item++;
    });
    const chunkSize = 100;

    await processInChunks(array, func, chunkSize);

    expect(func).toHaveBeenCalledTimes(50);
  });
});

describe('replaceTextInFile', () => {
  const testFilePath = path.join(__dirname, 'test-file.txt');
  const testFileContent = '{0}, foo, {0}!';

  beforeEach(async () => {
    await fs.promises.writeFile(testFilePath, testFileContent);
  });

  afterEach(async () => {
    await fs.promises.unlink(testFilePath);
  });

  it('should replace all instances of the given text with the given value in the file', async () => {
    await replaceTextInFile(testFilePath, '{0}', 'run'); // Replace text with special characters
    await replaceTextInFile(testFilePath, 'foo', 'test'); // Replace text with letters
    const updatedContent = await fs.promises.readFile(testFilePath, 'utf-8');
    expect(updatedContent).toBe('run, test, run!');
  });

  it('should not modify the file if the search text is not found', async () => {
    const searchText = 'nonexistent';
    const replacementText = 'replacement';
    await replaceTextInFile(testFilePath, searchText, replacementText);
    const updatedContent = await fs.promises.readFile(testFilePath, 'utf-8');
    expect(updatedContent).toBe(testFileContent);
  });

  it('should not modify the file if the search text is empty', async () => {
    const searchText = '';
    const replacementText = 'replacement';
    await replaceTextInFile(testFilePath, searchText, replacementText);
    const updatedContent = await fs.promises.readFile(testFilePath, 'utf-8');
    expect(updatedContent).toBe(testFileContent);
  });
});
