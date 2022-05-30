const childProcess = require('child_process');

const getBuildInfo = () => {
  // https://stackoverflow.com/a/34518749/5323344
  const latestGitCommitHash = childProcess.execSync('git rev-parse --short HEAD').toString().trim();
  const now = new Date();
  const timeZone = 'UTC';
  const buildTime = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
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
};

module.exports = getBuildInfo;
