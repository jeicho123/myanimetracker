import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'

import All from './pages/All.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import Popular from './pages/Popular.jsx'
import Watched from './pages/Watched.jsx'
import Airing from './pages/Airing.jsx'
import Watching from './pages/Watching.jsx'
import PlanToWatch from './pages/PlanToWatch.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <All />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/popular",
    element: <Popular />,
  },
  {
    path: "/airing",
    element: <Airing />,
  },
  {
    path: "/watched",
    element: <Watched />,
  },
  {
    path: "/watching",
    element: <Watching />,
  },
  {
    path: "/plantowatch",
    element: <PlanToWatch />,
  },
])

createRoot(document.getElementById('root')).render(

    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  
)
