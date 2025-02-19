import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'

import App from './pages/App.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import Popular from './pages/Popular.jsx'
import Watched from './pages/Watched.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
    path: "/watched",
    element: <Watched />,
  },
])

createRoot(document.getElementById('root')).render(

    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  
)
