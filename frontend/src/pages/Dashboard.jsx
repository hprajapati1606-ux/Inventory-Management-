import { useEffect, useState } from 'react';
import { Package, DollarSign, AlertTriangle, ShoppingCart } from 'lucide-react';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center overflow-hidden">
        <div className={`p-4 rounded-full ${color} text-white mr-4 flex-shrink-0`}>
            <Icon className="w-6 h-6" />
        </div>
        <div className="min-w-0">
            <p className="text-sm text-gray-500 font-medium truncate">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800 truncate" title={value}>{value}</h3>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/reports/dashboard');
                setStats(response.data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
                setError(err.message || "Failed to load");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!stats || error) return (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded">
            <h3 className="font-bold">Error loading stats</h3>
            <p>{error || "Unknown error occurred"}</p>
        </div>
    );

    const data = [
        { name: 'Products', value: stats.total_products },
        { name: 'Low Stock', value: stats.low_stock_items },
        { name: 'Orders', value: stats.total_orders },
        { name: 'Pending', value: stats.pending_orders },
    ];

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Stats Value"
                    value={`$${stats.total_stock_value.toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-green-500"
                />
                <StatCard
                    title="Total Products"
                    value={stats.total_products}
                    icon={Package}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Low Stock Items"
                    value={stats.low_stock_items}
                    icon={AlertTriangle}
                    color="bg-orange-500"
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.total_revenue.toLocaleString()}`}
                    icon={ShoppingCart}
                    color="bg-purple-500"
                />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Overview</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3B82F6" barSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
