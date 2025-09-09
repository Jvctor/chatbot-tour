import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'

interface SideBarProps {
  sidebarOpen?: boolean
  setSidebarOpen?: (open: boolean) => void
  standalone?: boolean
}

const navigationItems = [
  { name: 'Clientes', href: '/clients' },
  { name: 'Operações', href: '/operations' },
  { name: 'Parceiros', href: '/parceiros' },
]


export default function SideBar({ 
  sidebarOpen: externalSidebarOpen, 
  setSidebarOpen: externalSetSidebarOpen, 
  standalone = false 
}: SideBarProps = {}) {
  const [internalSidebarOpen, setInternalSidebarOpen] = useState(false)
  const location = useLocation()
  const sidebarOpen = externalSidebarOpen ?? internalSidebarOpen
  const setSidebarOpen = externalSetSidebarOpen ?? setInternalSidebarOpen
  const navigation = navigationItems.map(item => ({
    ...item,
    current: location.pathname === item.href
  }))

  const sidebarContent = (
    <>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } bg-primary-dark`}>
        <div className="flex items-center justify-between h-16 px-4 bg-primary-darkest">
          <img
            alt="AgroSystem"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=orange&shade=600"
            className="h-8 w-auto"
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:opacity-80 transition-opacity"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-8 px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-200 ${
                item.current 
                  ? 'bg-secondary text-white' 
                  : 'text-white hover:bg-secondary hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-primary-light">
          <div className="flex items-center">
            <img
              alt=""
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              className="w-8 h-8 rounded-full"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-white">John Doe</p>
              <p className="text-xs text-white opacity-70">john@example.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:block md:w-64 bg-primary-dark">
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-4 bg-primary-darkest">
            <img
              alt="Your Company"
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
              className="h-8 w-auto"
            />
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  item.current 
                    ? 'bg-secondary text-white' 
                    : 'text-gray-300 hover:bg-secondary hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* User Profile Desktop */}
          <div className="border-t border-primary-light p-4">
            <Menu as="div" className="relative">
              <MenuButton className="w-full group flex items-center text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary">
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="w-8 h-8 rounded-full"
                />
                <div className="ml-3 text-left">
                  <p className="text-sm font-medium text-white">John Doe</p>
                  <p className="text-xs text-gray-300">john@example.com</p>
                </div>
              </MenuButton>

              <MenuItems
                transition
                className="absolute bottom-full left-0 z-10 mb-2 w-48 origin-bottom-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100"
                  >
                    Perfil
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100"
                  >
                    Configurações
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100"
                  >
                    Sair
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
      {!standalone && (
        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-primary-light px-4 py-4 shadow-sm sm:px-6 md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-white"
          >
            <span className="sr-only">Abrir sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
            Dashboard
          </div>
          <Menu as="div" className="relative">
            <MenuButton className="-m-1.5 flex items-center p-1.5">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                className="h-8 w-8 rounded-full bg-gray-50"
              />
            </MenuButton>
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <MenuItem>
                <a href="#" className="block px-3 py-1 text-sm leading-6 text-gray-900 data-focus:bg-gray-50">
                  Perfil
                </a>
              </MenuItem>
              <MenuItem>
                <a href="#" className="block px-3 py-1 text-sm leading-6 text-gray-900 data-focus:bg-gray-50">
                  Sair
                </a>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      )}
    </>
  )

  if (standalone) {
    return (
      <div className="min-h-screen bg-primary-lightest">
        {sidebarContent}
      </div>
    )
  }

  return sidebarContent
}