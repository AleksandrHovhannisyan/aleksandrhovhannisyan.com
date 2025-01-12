import childProcess from 'node:child_process';

export default function getBuildInfo() {
  // Credit: https://stackoverflow.com/a/34518749/5323344
  const latestGitCommitHash = childProcess.execSync(`git rev-parse HEAD`).toString().trim();
  const now = new Date();
  const timeZone = 'CST';
  const buildTime = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone,
  }).format(now);
  return {
    // Can't use timeZoneName option together with dateStyle, so interpolate manually
    time: {
      raw: now.toISOString(),
      formatted: `${buildTime} ${timeZone}`,
    },
    hash: latestGitCommitHash,
  };
}
