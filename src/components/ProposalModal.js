import React, { useEffect, useMemo, useState } from 'react';
import { PROPOSAL_STORAGE_PREFIX } from '../utils/apiUtils';

const defaultProposal = (title) =>
  `Hello,\n\nI’m interested in working on "${title}". I have strong experience delivering high-quality web/mobile apps on time and within budget. I can start right away and keep you updated with clear milestones.\n\nLooking forward to discussing details.\n\nBest regards,\nZameer Ahmed`;

const ProposalModal = ({
  open,
  onClose,
  onSubmit,
  projectId,
  projectTitle,
  budgetDisplay,
  initialAmount = 250,
  initialPeriod = 5
}) => {
  const storageKey = useMemo(() => `${PROPOSAL_STORAGE_PREFIX}${projectId}`, [projectId]);
  const [amount, setAmount] = useState(initialAmount);
  const [period, setPeriod] = useState(initialPeriod);
  const [proposal, setProposal] = useState(defaultProposal(projectTitle));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Load saved draft on open
  useEffect(() => {
    if (!open) return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.proposal) setProposal(parsed.proposal);
        if (parsed?.amount) setAmount(parsed.amount);
        if (parsed?.period) setPeriod(parsed.period);
      } else {
        setProposal(defaultProposal(projectTitle));
        setAmount(initialAmount);
        setPeriod(initialPeriod);
      }
    } catch {
      // ignore
    }
  }, [open, storageKey, projectTitle, initialAmount, initialPeriod]);

  // Persist on change (debounced light)
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ proposal, amount, period }));
      } catch {}
    }, 250);
    return () => clearTimeout(t);
  }, [open, storageKey, proposal, amount, period]);

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        amount: Number(amount),
        period: Number(period),
        description: proposal
      });
      onClose?.();
    } catch (e) {
      setError(e?.message || 'Failed to place bid');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40" 
        onClick={submitting ? undefined : onClose}
      ></div>

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Place a Bid</h3>
            <button
              onClick={onClose}
              disabled={submitting}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div>
              <div className="text-sm text-gray-500">Project</div>
              <div className="font-medium text-gray-900">{projectTitle}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-sm text-gray-500 block mb-1">Proposal</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={6}
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                />
                <div className="mt-1 text-xs text-gray-400">Saved automatically</div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Bid Amount</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Delivery (days)</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                  />
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-xs">
                  <div className="text-gray-500">Budget</div>
                  <div className="font-medium text-gray-900">{budgetDisplay}</div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              disabled={submitting}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`btn-primary ${submitting ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {submitting ? 'Submitting...' : 'Submit Bid'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalModal;