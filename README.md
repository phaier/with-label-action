# @phaier/with-label-action

GitHub Actions to check whether a pull request has the label.

## Inputs

### `github-token`

**Required** The GitHub token to use for authentication.

### `target-label`

**Required** The label to check for.

## Outputs

### `pr_has_label`

Whether the pull request has the label. `true` if it has the label, `false` otherwise.

## Example usage

```yaml
name: test
on:
  push:
    branches:
      - main

jobs:
  check_label:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
    outputs:
      pr_has_label: ${{ steps.check.outputs.pr_has_label }}
    steps:
      - uses: actions/checkout@v4
      - name: Check PR Label
        id: check
        uses: phaier/with-label-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          target-label: 'CI Test'

  process:
    needs: check_label
    runs-on: ubuntu-latest
    if: needs.check_label.outputs.pr_has_label == 'true'
    steps:
      - name: 対象 PR の処理を実行
        run: echo "対象の PR に 'CI Test' が付与されているため、処理を実行します。"
```
