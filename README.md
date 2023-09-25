# Replace in files

This GitHub Action allows you to find and replace text in files by matching a string.

It can be useful for automating repetitive tasks such as updating version numbers, replacing placeholders, or modifying configuration files during deployment.

## Features

- Specify the files to be searched using a glob pattern. You can also specify files to be excluded from the search.
- Find and replace all the occurrences of a string in the repository files.
- Supports different file encodings, including UTF-8, UTF-16, and ASCII.
- Works on every platform that supports JavaScript actions, including Linux, macOS, and Windows.

## Inputs

- `files`:
(**Required**) The files to be searched. It can be the path to a single file, or a glob pattern matching one or more files (e.g. `**/*.txt`).

- `replacement-text`:
(**Required**) The text that will replace the matched text.

- `search-text`:
(**Required**) The text that will be replaced.

- `encoding`:
(Optional) The encoding of the files to be searched. The following values are supported: `utf8`, `utf16le`, `latin1`, `ascii`, `base64`, `hex`. Defaults to `utf8`.

- `exclude`:
(Optional) The files to be excluded from the search. It can be the path to a file or a glob pattern matching one or more files (e.g. `**/*.md`). Defaults to an empty string.

## Example usage

```yaml
# Replace all the occurrences of 'hello' with 'world' in all the txt files, 
# excluding the node_modules folder
- name: Replace multiple files
  uses: richardrigutins/replace-in-files@v2
  with:
    files: '**/*.txt'
    search-text: 'hello'
    replacement-text: 'world'
    exclude: 'node_modules/**'
    encoding: 'utf8'

# Replace all the occurrences of '{0}' with '42' in the README.md file
- name: Replace single file
  uses: richardrigutins/replace-in-files@v2
  with:
    files: 'README.md'
    search-text: '{0}'
    replacement-text: '42'
```

## Contributing

Contributions are welcome! Here are some ways you can contribute:

- Report bugs and suggest new features by creating an issue.
- Improve the documentation by submitting a pull request.
- Fix bugs or implement new features by submitting a pull request.

Before submitting a pull request, please make sure that your changes are consistent with the project's coding style and that all tests pass. To build and run all the tests and linters, run the following command:
  
```bash
npm run all
```

Be sure to also include the updated `dist` folder in your pull request.
