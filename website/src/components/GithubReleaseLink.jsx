import { getGithubRepoUrl, getGithubReleasesUrl } from '../lib/siteConfig.js';

export default function GithubReleaseLink({
  children,
  className,
  style,
  variant = 'releases',
  ...rest
}) {
  const href = variant === 'repo' ? getGithubRepoUrl() : getGithubReleasesUrl();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </a>
  );
}