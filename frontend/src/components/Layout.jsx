import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
};

export default Layout;
