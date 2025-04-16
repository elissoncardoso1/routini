import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex bg-gray-100">
      <aside className="w-72 bg-gray-900 text-white p-4">
        <Sidebar />
      </aside>
      <div className="flex-1 flex flex-col">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  )
} 