import site from '../config/site.json';

/** @type {typeof site} */
export const siteConfig = site;

/**
 * @returns {typeof site}
 */
export function getSiteConfig() {
  return siteConfig;
}

/**
 * @returns {boolean}
 */
export function shouldShowSimulationBadges() {
  return siteConfig.show_simulation_badges !== false;
}

/**
 * @returns {number}
 */
export function getSsotCommandCount() {
  return siteConfig.ssot_command_count ?? 66;
}

/**
 * @returns {typeof siteConfig.aspirational_targets}
 */
export function getAspirationalTargets() {
  return (
    siteConfig.aspirational_targets ?? {
      bar: 84,
      ofis: 160,
      gelistirici: 218,
    }
  );
}

/**
 * @returns {string}
 */
export function getVersion() {
  return siteConfig.version;
}

/**
 * @returns {typeof siteConfig.simulation}
 */
export function getSimulation() {
  return siteConfig.simulation;
}

/**
 * @returns {string}
 */
export function getGithubRepoUrl() {
  return siteConfig.github?.repoUrl ?? 'https://github.com/UmutKorkmaz/kapitan-os';
}

/**
 * @returns {string}
 */
export function getGithubReleasesUrl() {
  return siteConfig.github?.releasesUrl ?? `${getGithubRepoUrl()}/releases/latest`;
}

export default siteConfig;