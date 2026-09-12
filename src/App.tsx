import { HashRouter, Route, Routes } from 'react-router-dom'
import type { ComponentType } from 'react'
import AppShell from './components/AppShell'
import { moduleIds } from './config/modules'
import type { ModuleId } from './config/modules'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import NotFoundPage from './pages/NotFoundPage'
import InternshipsPage from './features/internships'
import NotesPage from './features/notes'
import MarketplacePage from './features/marketplace'
import BudgetPage from './features/budget'
import PlacesPage from './features/places'
import HousingPage from './features/housing'
import RoommatesPage from './features/roommates'
import ClubsPage from './features/clubs'
import CalendarPage from './features/calendar'
import CrowdPage from './features/crowd'

const featurePages: Record<ModuleId, ComponentType> = {
  stajlar: InternshipsPage,
  notlar: NotesPage,
  pazar: MarketplacePage,
  butce: BudgetPage,
  mekanlar: PlacesPage,
  evler: HousingPage,
  'oda-arkadasi': RoommatesPage,
  kulupler: ClubsPage,
  takvim: CalendarPage,
  yogunluk: CrowdPage,
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          {moduleIds.map(id => {
            const Page = featurePages[id]
            return <Route key={id} path={id} element={<Page />} />
          })}
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  )
}
