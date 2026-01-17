import { useState, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import api from '../api/axios';
import Table from '../components/Table';
import Modal from '../components/Modal';

const Inventory = () => {
    const [movements, setMovements] = useState([]);
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ product_id: '', change_type: 'adjustment', quantity: 0, notes: '' });

    const fetchData = async () => {
        const [movRes, prodRes] = await Promise.all([
            api.get('/inventory/movements'),
            api.get('/products')
        ]);
        setMovements(movRes.data);
        setProducts(prodRes.data);
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/inventory/adjust', formData);
            setIsModalOpen(false);
            fetchData();
            setFormData({ product_id: '', change_type: 'adjustment', quantity: 0, notes: '' });
        } catch (error) {
            alert("Failed to adjust stock");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Inventory Log</h2>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary flex items-center"><ArrowLeftRight className="w-4 h-4 mr-2" /> Adjust Stock</button>
            </div>

            <Table headers={['Date', 'Product', 'Type', 'Quantity', 'Notes']}>
                {movements.map(m => (
                    <tr key={m.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{new Date(m.created_at).toLocaleString()}</td>
                        <td className="px-6 py-4 font-medium">{m.product_name}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs uppercase font-bold
                ${m.change_type === 'in' ? 'bg-green-100 text-green-800' :
                                    m.change_type === 'out' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
              `}>
                                {m.change_type}
                            </span>
                        </td>
                        <td className="px-6 py-4 font-mono">{m.quantity}</td>
                        <td className="px-6 py-4 text-gray-500">{m.notes}</td>
                    </tr>
                ))}
            </Table>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adjust Stock Manually">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select className="input" value={formData.product_id} onChange={e => setFormData({ ...formData, product_id: e.target.value })} required>
                        <option value="">Select Product</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <select className="input" value={formData.change_type} onChange={e => setFormData({ ...formData, change_type: e.target.value })}>
                        <option value="adjustment">Adjustment (Set/Add)</option>
                        <option value="in">Restock (In)</option>
                        <option value="out">Damage/Lost (Out)</option>
                    </select>
                    <p className="text-xs text-gray-500">For "Adjustment", entered quantity adds to stock (use negative to subtract).</p>
                    <input type="number" className="input" placeholder="Quantity" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })} required />
                    <textarea className="input" placeholder="Reason / Notes" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} required />
                    <button type="submit" className="w-full btn btn-primary">Submit Adjustment</button>
                </form>
            </Modal>
        </div>
    );
};
export default Inventory;
