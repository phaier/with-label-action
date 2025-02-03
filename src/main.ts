import { getOctokit, context } from '@actions/github';
import { getInput, setFailed, setOutput, info } from '@actions/core';

(async () => {
  try {
    const token = getInput('github-token');
    const targetLabel = getInput('target-label');

    const commitSha = context.sha;
    const owner = context.repo.owner;
    const repo = context.repo.repo;

    const octokit = getOctokit(token);

    // 対象コミットに関連する Pull Request を取得する
    const { data: pullRequests } = await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
      owner: owner,
      repo: repo,
      commit_sha: commitSha,
      /*
      mediaType: {
        previews: ['groot'] // プレビュー API が必要な場合に指定
      }
        */
    });

    if (pullRequests.length === 0) {
      info('このコミットに関連する Pull Request は見つかりませんでした。');
      setOutput('pr_has_label', 'false');
      return;
    }

    const pr = pullRequests[0];
    info(`PR #${pr.number} が見つかりました。`);

    const hasLabel = pr.labels.some((label) => label.name === targetLabel);
    info(`PR に "${targetLabel}" ラベルが付与されているか: ${hasLabel}`);

    setOutput('pr_has_label', hasLabel ? 'true' : 'false');
  } catch (error) {
    setFailed(`Action 実行中にエラーが発生しました: ${(error as Error).message}`);
  }
})();
