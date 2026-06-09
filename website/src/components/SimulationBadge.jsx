import siteConfig from '../config/site.json';

export default function SimulationBadge({ variant = 'pill' }) {
  const { simulation } = siteConfig;
  return (
    <span
      className={`sim-badge sim-badge--${variant}`}
      title={simulation.disclaimer}
      aria-label={simulation.disclaimer}
    >
      <span className="ldot" />
      {simulation.badge}
    </span>
  );
}