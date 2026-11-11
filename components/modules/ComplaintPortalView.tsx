
import React from 'react';
import { mockComplaintTickets } from '../../services/mockData';
import type { ComplaintTicket } from '../../types';

const TicketCard: React.FC<{ ticket: ComplaintTicket }> = ({ ticket }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-3">
        <p className="font-semibold text-sm text-srm-darkgray">{ticket.subject}</p>
        <p className="text-xs text-gray-500 mt-1">Patient: {ticket.patientName}</p>
        <p className="text-xs text-gray-400 mt-1">Submitted: {ticket.submitted}</p>
    </div>
);

const KanbanColumn: React.FC<{ title: string; tickets: ComplaintTicket[] }> = ({ title, tickets }) => (
    <div className="bg-gray-50 rounded-lg p-3 flex-1">
        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-1">{title} ({tickets.length})</h4>
        <div>
            {tickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)}
        </div>
    </div>
);

export const ComplaintPortalView: React.FC = () => {
    const openTickets = mockComplaintTickets.filter(t => t.status === 'Open');
    const inProgressTickets = mockComplaintTickets.filter(t => t.status === 'In Progress');
    const resolvedTickets = mockComplaintTickets.filter(t => t.status === 'Resolved');

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-srm-darkgray">Patient Complaint & Query Board</h3>
                <button className="bg-srm-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors text-sm">
                    New Ticket
                </button>
            </div>
            <div className="flex space-x-4">
                <KanbanColumn title="Open" tickets={openTickets} />
                <KanbanColumn title="In Progress" tickets={inProgressTickets} />
                <KanbanColumn title="Resolved" tickets={resolvedTickets} />
            </div>
        </div>
    );
};