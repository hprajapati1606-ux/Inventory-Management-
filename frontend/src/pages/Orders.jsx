import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../api/axios';
import Table from '../components/Table';
import Modal from '../components/Modal';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [orderForm, setOrderForm] = useState({ customer_id: '', items: [] });
    const [currentItem, setCurrentItem] = useState({ product_id: '', quantity: 1 });

    const fetchData = async () => {
        const [ordRes, custRes, prodRes] = await Promise.all([
            api.get('/orders'),
            api.get('/customers'),
            api.get('/products')
        ]);
        setOrders(ordRes.data);
        setCustomers(custRes.data);
        setProducts(prodRes.data);
    };

    useEffect(() => { fetchData(); }, []);

    const addItemToOrder = () => {
        if (!currentItem.product_id || currentItem.quantity <= 0) return;
        const product = products.find(p => p.id === parseInt(currentItem.product_id));
        setOrderForm(prev => ({
            ...prev,
            items: [...prev.items, { ...currentItem, product_name: product.name, price: product.price }]
        }));
        setCurrentItem({ product_id: '', quantity: 1 });
    };

    const removeItem = (index) => {
        setOrderForm(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const calculateTotal = () => {
        return orderForm.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (orderForm.items.length === 0) return alert("Add items first");

        try {
            await api.post('/orders', {
                customer_id: orderForm.customer_id,
                items: orderForm.items.map(i => ({ product_id: i.product_id, quantity: i.quantity }))
            });
            setIsModalOpen(false);
            setOrderForm({ customer_id: '', items: [] });
            fetchData();
            alert("Order created successfully!");
        } catch (error) {
            alert(error.response?.data?.detail || "Failed to create order");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Orders</h2>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary flex items-center"><Plus className="w-4 h-4 mr-2" /> New Order</button>
            </div>

            <Table headers={['Order ID', 'Customer', 'Total', 'Status', 'Date']}>
                {orders.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">#{o.id}</td>
                        <td className="px-6 py-4">{o.customer?.name}</td>
                        <td className="px-6 py-4">${o.total_amount.toFixed(2)}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${o.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    o.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                }`}>
                                {o.status}
                            </span>
                        </td>
                        <td className="px-6 py-4">{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                ))}
            </Table>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Order">
                <div className="space-y-4">
                    <select className="input" value={orderForm.customer_id} onChange={e => setOrderForm({ ...orderForm, customer_id: e.target.value })}>
                        <option value="">Select Customer</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>

                    <div className="border p-4 rounded bg-gray-50">
                        <h4 className="font-medium mb-2">Add Items</h4>
                        <div className="flex gap-2 mb-2">
                            <select className="input flex-1" value={currentItem.product_id} onChange={e => setCurrentItem({ ...currentItem, product_id: e.target.value })}>
                                <option value="">Select Product</option>
                                {products.map(p => <option key={p.id} value={p.id}>{p.name} (${p.price}) (Stock: {p.stock_quantity})</option>)}
                            </select>
                            <input type="number" className="input w-24" min="1" value={currentItem.quantity} onChange={e => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) })} />
                            <button type="button" onClick={addItemToOrder} className="btn btn-secondary">Add</button>
                        </div>

                        {orderForm.items.length > 0 && (
                            <table className="w-full text-sm mt-4">
                                <thead><tr className="text-left"><th>Product</th><th>Qty</th><th>Subtotal</th><th></th></tr></thead>
                                <tbody>
                                    {orderForm.items.map((item, idx) => (
                                        <tr key={idx} className="border-t">
                                            <td className="py-2">{item.product_name}</td>
                                            <td>{item.quantity}</td>
                                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                                            <td className="text-right">
                                                <button onClick={() => removeItem(idx)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t font-bold">
                                        <td colSpan="2" className="py-2">Total</td>
                                        <td>${calculateTotal().toFixed(2)}</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        )}
                    </div>

                    <button onClick={handleSubmit} className="w-full btn btn-primary">Submit Order</button>
                </div>
            </Modal>
        </div>
    );
};
export default Orders;
