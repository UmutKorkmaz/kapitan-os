/** Hash-aware anchor — mirrors legacy src/Shell.jsx Link(). */
export default function Link({ to, children, className, style, ...rest }) {
  const onClick = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    if (window.location.hash === '#' + to) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = to;
    }
  };

  return (
    <a href={'#' + to} onClick={onClick} className={className} style={style} {...rest}>
      {children}
    </a>
  );
}