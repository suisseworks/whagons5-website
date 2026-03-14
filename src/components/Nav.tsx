import WhagonsLogo from './WhagonsLogo';

export default function Nav() {
  return (
    <nav>
      <a href="/" className="logo">
        <WhagonsLogo />
      </a>
      <div className="nav-r">
        <a href="#how" className="nl">Plataforma</a>
        <a href="#industries" className="nl">Industrias</a>
        <a href="#brief" className="nl">Brief</a>
        <a href="#demo" className="nd">Demo &rarr;</a>
      </div>
    </nav>
  );
}
