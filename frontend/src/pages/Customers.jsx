import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../api/axios';
import Table from '../components/Table';
import Modal from '../components/Modal';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

    const fetchCustomers = async () => {
        const res = await api.get('/customers');
        setCustomers(res.data);
    };

    useEffect(() => { fetchCustomers(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post('/customers', formData);
        setIsModalOpen(false);
        fetchCustomers();
        setFormData({ name: '', email: '', phone: '', address: '' });
    };

    const handleDelete = async (id) => {
        if (confirm("Delete customer?")) {
            await api.delete(`/customers/${id}`);
            fetchCustomers();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Customers</h2>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary flex items-center"><Plus className="w-4 h-4 mr-2" /> Add Customer</button>
            </div>
            <Table headers={['Name', 'Email', 'Phone', 'Address', 'Actions']}>
                {customers.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{c.name}</td>
                        <td className="px-6 py-4">{c.email}</td>
                        <td className="px-6 py-4">{c.phone}</td>
                        <td className="px-6 py-4">{c.address}</td>
                        <td className="px-6 py-4">
                            <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                        </td>
                    </tr>
                ))}
            </Table>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Customer">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="input" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    <input className="input" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    <input className="input" placeholder="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    <textarea className="input" placeholder="Address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                    <button type="submit" className="w-full btn btn-primary">Save</button>
                </form>
            </Modal>
        </div>
    );
};
export default Customers;
