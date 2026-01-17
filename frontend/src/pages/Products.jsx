import { useState, useEffect } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import api from '../api/axios';
import Table from '../components/Table';
import Modal from '../components/Modal';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        sku: '', name: '', category: '', price: '', stock_quantity: 0, supplier_id: ''
    });

    const fetchData = async () => {
        try {
            const [prodRes, suppRes] = await Promise.all([
                api.get('/products'),
                api.get('/suppliers')
            ]);
            setProducts(prodRes.data);
            setSuppliers(suppRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products', formData);
            setIsModalOpen(false);
            fetchData();
            setFormData({ sku: '', name: '', category: '', price: '', stock_quantity: 0, supplier_id: '' });
        } catch (error) {
            alert("Failed to create product");
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure?")) {
            try {
                await api.delete(`/products/${id}`);
                fetchData();
            } catch (error) {
                alert("Failed to delete product");
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Products</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex items-center">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                    type="text"
                    placeholder="Search products..."
                    className="flex-1 outline-none text-gray-700"
                />
            </div>

            {loading ? <div>Loading...</div> : (
                <Table headers={['SKU', 'Name', 'Category', 'Price', 'Stock', 'Supplier', 'Actions']}>
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.sku}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock_quantity < product.min_stock_threshold ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                    {product.stock_quantity}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.supplier?.name || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </Table>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Product">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="input" placeholder="SKU" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} required />
                    <input className="input" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    <input className="input" placeholder="Category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" className="input" placeholder="Price" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                        <input type="number" className="input" placeholder="Initial Stock" value={formData.stock_quantity} onChange={e => setFormData({ ...formData, stock_quantity: e.target.value })} />
                    </div>
                    <select
                        className="input"
                        value={formData.supplier_id}
                        onChange={e => setFormData({ ...formData, supplier_id: e.target.value })}
                        required
                    >
                        <option value="">Select Supplier</option>
                        {suppliers.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                    <button type="submit" className="w-full btn btn-primary">Create Product</button>
                </form>
            </Modal>
        </div>
    );
};

export default Products;
