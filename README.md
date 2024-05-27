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

- `max-parallelism`:
(Optional) The maximum number of files that will be processed in parallel. This can be used to control the performance impact of the operation on the system. It should be a positive integer. Defaults to `10`.

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
    max-parallelism: 10

# Replace all the occurrences of '{0}' with '42' in the README.md file
- name: Replace single file
  uses: richardrigutins/replace-in-files@v2
  with:
    files: 'README.md'
    search-text: '{0}'
    replacement-text: '42'
```

## Development

### Update the Action Code

The [`src/`](./src/) directory contains the source code that will be run when
the action is invoked.

After making changes to the action code, make sure to run the following command
to run all tests, lint the code, and build the final JavaScript action code:

```bash
npm run all
```

> This step is important! It will run [`ncc`](https://github.com/vercel/ncc) to
> build the final JavaScript action code with all dependencies included. If you
> do not run this step, the action will not work correctly when it is used in a
> workflow. This step also includes the `--license` option for `ncc`, which will
> create a license file for all of the production node modules used in your
> project.

### Publishing a New Release

This project includes a helper script, [`script/release`](./script/release)
designed to streamline the process of tagging and pushing new releases for
GitHub Actions.

GitHub Actions allows users to select a specific version of the action to use,
based on release tags. This script simplifies this process by performing the
following steps:

1. **Retrieving the latest release tag:** The script starts by fetching the most
   recent release tag by looking at the local data available in your repository.
1. **Prompting for a new release tag:** The user is then prompted to enter a new
   release tag. To assist with this, the script displays the latest release tag
   and provides a regular expression to validate the format of the new tag.
1. **Tagging the new release:** Once a valid new tag is entered, the script tags
   the new release.
1. **Pushing the new tag to the remote:** Finally, the script pushes the new tag
   to the remote repository. From here, you will need to create a new release in
   GitHub and users can easily reference the new tag in their workflows.

To use the script, run the following command:

```bash
./script/release
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
