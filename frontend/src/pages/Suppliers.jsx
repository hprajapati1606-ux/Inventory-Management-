import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../api/axios';
import Table from '../components/Table';
import Modal from '../components/Modal';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', contact_person: '', email: '', phone: '', address: '' });

    const fetchSuppliers = async () => {
        const res = await api.get('/suppliers');
        setSuppliers(res.data);
    };

    useEffect(() => { fetchSuppliers(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post('/suppliers', formData);
        setIsModalOpen(false);
        fetchSuppliers();
        setFormData({ name: '', contact_person: '', email: '', phone: '', address: '' });
    };

    const handleDelete = async (id) => {
        if (confirm("Delete supplier?")) {
            await api.delete(`/suppliers/${id}`);
            fetchSuppliers();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Suppliers</h2>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary flex items-center"><Plus className="w-4 h-4 mr-2" /> Add Supplier</button>
            </div>
            <Table headers={['Name', 'Contact', 'Email', 'Phone', 'Actions']}>
                {suppliers.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{s.name}</td>
                        <td className="px-6 py-4">{s.contact_person}</td>
                        <td className="px-6 py-4">{s.email}</td>
                        <td className="px-6 py-4">{s.phone}</td>
                        <td className="px-6 py-4">
                            <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                        </td>
                    </tr>
                ))}
            </Table>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Supplier">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="input" placeholder="Company Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    <input className="input" placeholder="Contact Person" value={formData.contact_person} onChange={e => setFormData({ ...formData, contact_person: e.target.value })} />
                    <input className="input" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    <input className="input" placeholder="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    <textarea className="input" placeholder="Address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                    <button type="submit" className="w-full btn btn-primary">Save</button>
                </form>
            </Modal>
        </div>
    );
};
export default Suppliers;
