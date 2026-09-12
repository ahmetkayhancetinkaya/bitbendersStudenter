import { Link } from 'react-router-dom'
import { moduleIds, modules } from '../config/modules'

export default function ModuleLinks() {
  return (
    <div className="module-grid">
      {moduleIds.map(id => (
        <Link className="module-card" key={id} to={'/app/' + id}>
          <h2>{modules[id].title}</h2>
          <p>{modules[id].description}</p>
          <span>Sayfa taslağını aç →</span>
        </Link>
      ))}
    </div>
  )
}
