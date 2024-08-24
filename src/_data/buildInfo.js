import { getLatestGitCommitHash } from '../../config/utils.js';

export default function getBuildInfo() {
  const latestGitCommitHash = getLatestGitCommitHash('long');
  const now = new Date();
  const timeZone = 'UTC';
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
