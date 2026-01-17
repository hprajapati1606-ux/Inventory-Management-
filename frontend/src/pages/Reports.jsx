import { FileText, Download, BarChart2 } from 'lucide-react';

const ReportCard = ({ title, description, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div>
            <div className="flex items-center mb-4">
                <div className={`p-3 ${color} text-white rounded-lg mr-3`}>
                    <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            </div>
            <p className="text-gray-500 text-sm mb-6">{description}</p>
        </div>
        <button
            className="flex items-center justify-center w-full py-2 px-4 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => alert('Export functionality coming soon!')}
        >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
        </button>
    </div>
);

const Reports = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Reports Center</h2>
            <p className="text-gray-600 mb-8">Generate and download detailed reports for your inventory and sales.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ReportCard
                    title="Inventory Summary"
                    description="Current stock levels, total valuation, and low stock alerts overview."
                    icon={FileText}
                    color="bg-blue-500"
                />
                <ReportCard
                    title="Sales Performance"
                    description="Total revenue, order volume, and top-selling products analysis."
                    icon={BarChart2}
                    color="bg-green-500"
                />
                <ReportCard
                    title="Supplier Report"
                    description="Purchase history, supplier fulfillment rates, and lead times."
                    icon={FileText}
                    color="bg-purple-500"
                />
                <ReportCard
                    title="Customer Activity"
                    description="New customer acquisition, frequent buyers, and order history."
                    icon={FileText}
                    color="bg-orange-500"
                />
            </div>
        </div>
    );
};

export default Reports;
