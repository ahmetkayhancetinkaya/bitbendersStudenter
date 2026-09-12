import { Link, NavLink, Outlet } from 'react-router-dom'
import { moduleIds, modules } from '../config/modules'

export default function AppShell() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus() }}>İçeriğe geç</a>
      <aside className="sidebar">
        <Link className="brand" to="/">KampüsKit<span>.</span></Link>
        <nav aria-label="Araçlar">
          <NavLink to="/app" end>Ana panel</NavLink>
          {moduleIds.map(id => (
            <NavLink key={id} to={'/app/' + id}>{modules[id].title}</NavLink>
          ))}
        </nav>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span>Öğrenci yaşamı toolkit</span>
          <span className="badge">Proje iskeleti</span>
        </header>
        <main id="main-content" tabIndex={-1}><Outlet /></main>
      </div>
    </div>
  )
}
