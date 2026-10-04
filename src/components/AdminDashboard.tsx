import React, { useState, useEffect } from 'react';
import { X, Lock, ShieldCheck, Clock, MapPin, RefreshCw, AlertCircle, Send, CheckCircle2, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { Order, OrderStatus, NotificationLog } from '../types/index.ts';

const STATUS_OPTIONS: OrderStatus[] = [
  'New',
  'Verification pending',
  'Verified',
  'Accepted',
  'Preparing',
  'Out for delivery',
  'Delivered',
  'Cancelled',
  'Rejected'
];

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    adminToken,
    setAdminToken,
    compliance,
    refreshCompliance
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'compliance' | 'notifications'>('orders');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusNotes, setStatusNotes] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Compliance Config Form State
  const [configForm, setConfigForm] = useState({
    serviceWindowStart: '23:00',
    serviceWindowEnd: '05:00',
    minLegalAge: 21,
    maxBottlesPerOrder: 3,
    licenseNumber: 'FL-III/2026/MUM-WZ-8849',
    jurisdiction: 'Maharashtra State Excise Delivery Notification',
    serviceEnabled: true,
    isSimulatedOpenForTesting: false
  });
  const [savingConfig, setSavingConfig] = useState(false);
  const [configSavedSuccess, setConfigSavedSuccess] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [testChannel, setTestChannel] = useState<'WHATSAPP' | 'SMS' | 'EMAIL'>('WHATSAPP');
  const [testMsg, setTestMsg] = useState('Dispatch Hub Alert: Temperature sensor check verified in Zone BKC-01.');
  const [sendingTest, setSendingTest] = useState(false);

  // Sync compliance settings to form
  useEffect(() => {
    if (compliance) {
      setConfigForm({
        serviceWindowStart: compliance.serviceWindowStart,
        serviceWindowEnd: compliance.serviceWindowEnd,
        minLegalAge: compliance.minLegalAge,
        maxBottlesPerOrder: compliance.maxBottlesPerOrder,
        licenseNumber: compliance.licenseNumber,
        jurisdiction: compliance.jurisdiction,
        serviceEnabled: compliance.serviceEnabled,
        isSimulatedOpenForTesting: Boolean(compliance.isSimulatedOpenForTesting)
      });
    }
  }, [compliance]);

  // Fetch orders and notifications when admin is open and authenticated
  const fetchOrders = async () => {
    if (!adminToken) return;
    try {
      setLoadingOrders(true);
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchNotifications = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/notifications', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error('Failed to fetch notifications:', e);
    }
  };

  useEffect(() => {
    if (isAdminOpen && adminToken) {
      fetchOrders();
      fetchNotifications();
    }
  }, [isAdminOpen, adminToken]);

  if (!isAdminOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || 'Invalid credentials');
        setIsLoggingIn(false);
        return;
      }

      setAdminToken(data.token);
      sessionStorage.setItem('nocturne_admin_token', data.token);
      setPassword('');
    } catch (err: any) {
      setLoginError('Authentication server unreachable.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setAdminToken(null);
    sessionStorage.removeItem('nocturne_admin_token');
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (!adminToken) return;
    setUpdatingOrderId(orderId);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus, notes: statusNotes })
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(updated);
        }
        setStatusNotes('');
        fetchNotifications();
      }
    } catch (e) {
      console.error('Status update failed:', e);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleSaveCompliance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    setSavingConfig(true);
    setConfigSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(configForm)
      });

      if (res.ok) {
        await refreshCompliance();
        setConfigSavedSuccess(true);
        setTimeout(() => setConfigSavedSuccess(false), 2500);
      }
    } catch (e) {
      console.error('Failed to save compliance rules:', e);
    } finally {
      setSavingConfig(false);
    }
  };

  const handleSendTestAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    setSendingTest(true);

    try {
      const res = await fetch('/api/admin/simulate-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ channel: testChannel, message: testMsg })
      });

      if (res.ok) {
        await fetchNotifications();
      }
    } catch (e) {
      console.error('Test notification failed:', e);
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-dialog-title"
        className="relative flex h-[92vh] w-full max-w-5xl flex-col rounded-2xl border border-[#242630] bg-[#0c0d10] text-[#f4efe6] shadow-2xl overflow-hidden"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-[#181a20] px-6 py-4 bg-[#08090a]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d4af37]/10 text-[#d4af37]">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h2 id="admin-dialog-title" className="text-base font-bold text-[#f4efe6]">
                Operator Dispatch & Compliance Console
              </h2>
              <span className="text-[11px] text-[#8e887d]">
                Licensed Partner Hub · Protected Operations
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {adminToken && (
              <button
                onClick={handleLogout}
                className="text-xs text-[#8e887d] hover:text-white px-2 py-1 rounded"
              >
                Logout
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="rounded-lg p-1.5 text-[#8e887d] hover:bg-[#181a20] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* --- IF NOT AUTHENTICATED: LOGIN SCREEN --- */}
        {!adminToken ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 rounded-xl border border-[#1e2029] bg-[#121318] p-6">
              <div className="text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                  Cellar Dispatcher Access
                </span>
                <p className="mt-1 text-xs text-[#8e887d]">
                  Enter operator passcode to manage nocturnal orders and excise controls.
                </p>
              </div>

              {loginError && (
                <div className="rounded border border-red-500/30 bg-red-950/20 p-2 text-xs text-red-300">
                  {loginError}
                </div>
              )}

              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Passcode (Default: nocturne2026)"
                  className="w-full rounded-lg border border-[#242630] bg-[#0c0d10] px-3.5 py-2.5 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full rounded-lg bg-[#d4af37] py-2.5 text-xs font-semibold text-[#0c0d10] hover:bg-[#e8ca74] disabled:opacity-50"
              >
                {isLoggingIn ? 'Authenticating...' : 'Enter Operator Console'}
              </button>

              <div className="text-[11px] text-[#736e65] text-center pt-2">
                Demo Key: <code className="text-[#e8ca74]">nocturne2026</code>
              </div>
            </form>
          </div>
        ) : (
          /* --- AUTHENTICATED TABS VIEW --- */
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-[#181a20] bg-[#0c0d10] px-6 text-xs font-medium">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3 px-4 border-b-2 transition-colors ${
                  activeTab === 'orders'
                    ? 'border-[#d4af37] text-[#d4af37] font-semibold'
                    : 'border-transparent text-[#8e887d] hover:text-[#f4efe6]'
                }`}
              >
                Live Orders Queue ({orders.length})
              </button>

              <button
                onClick={() => setActiveTab('compliance')}
                className={`py-3 px-4 border-b-2 transition-colors ${
                  activeTab === 'compliance'
                    ? 'border-[#d4af37] text-[#d4af37] font-semibold'
                    : 'border-transparent text-[#8e887d] hover:text-[#f4efe6]'
                }`}
              >
                Compliance & Delivery Rules
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-3 px-4 border-b-2 transition-colors ${
                  activeTab === 'notifications'
                    ? 'border-[#d4af37] text-[#d4af37] font-semibold'
                    : 'border-transparent text-[#8e887d] hover:text-[#f4efe6]'
                }`}
              >
                Notification Log ({notifications.length})
              </button>

              <button
                onClick={() => {
                  fetchOrders();
                  fetchNotifications();
                }}
                className="ml-auto flex items-center gap-1 py-3 text-xs text-[#8e887d] hover:text-white"
                title="Refresh data"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            {/* TAB 1: ORDERS MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="flex flex-1 overflow-hidden">
                {/* Orders List */}
                <div className="w-full md:w-1/2 border-r border-[#181a20] overflow-y-auto p-4 space-y-3">
                  {loadingOrders ? (
                    <div className="py-12 text-center text-xs text-[#8e887d]">
                      Loading live orders...
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="py-12 text-center text-xs text-[#8e887d]">
                      No orders currently recorded.
                    </div>
                  ) : (
                    orders.map((order) => {
                      const isSelected = selectedOrder?.id === order.id;
                      return (
                        <div
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className={`rounded-xl border p-4 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#d4af37] bg-[#14151b]'
                              : 'border-[#1e2029] bg-[#101116] hover:border-[#2b2e3b]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-[#d4af37]">
                              {order.id}
                            </span>
                            <span className="rounded bg-[#1c1d25] px-2 py-0.5 text-[10px] font-semibold text-[#f4efe6]">
                              {order.status}
                            </span>
                          </div>

                          <div className="mt-2 text-xs font-semibold text-[#f4efe6]">
                            {order.customer.fullName}
                          </div>

                          <div className="mt-1 text-[11px] text-[#8e887d]">
                            {order.customer.addressLine1}, {order.customer.pincode}
                          </div>

                          <div className="mt-2 flex items-center justify-between text-[11px] border-t border-[#181a20] pt-2">
                            <span className="text-[#8e887d]">
                              {order.items.length} item(s) · {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="font-mono font-bold text-[#f4efe6] tabular-nums">
                              ₹{order.totalAmount.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Selected Order Detail & Status Transition Pane */}
                <div className="hidden md:flex flex-1 flex-col justify-between overflow-y-auto p-6 bg-[#090a0d]">
                  {selectedOrder ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-[#181a20] pb-4">
                        <div>
                          <span className="font-mono text-sm font-bold text-[#d4af37]">
                            Order #{selectedOrder.id}
                          </span>
                          <p className="text-xs text-[#8e887d]">
                            Placed {new Date(selectedOrder.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-[#8e887d] uppercase block">Current Status</span>
                          <span className="rounded bg-[#1c1d25] px-2.5 py-1 text-xs font-bold text-[#d4af37]">
                            {selectedOrder.status}
                          </span>
                        </div>
                      </div>

                      {/* Customer & Verification info */}
                      <div className="rounded-xl border border-[#1e2029] bg-[#121318] p-4 text-xs space-y-2">
                        <div className="font-semibold text-[#f4efe6]">
                          Customer & Compliance Record:
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[#b3ada2]">
                          <div><strong>Name:</strong> {selectedOrder.customer.fullName}</div>
                          <div><strong>Phone:</strong> {selectedOrder.customer.phone}</div>
                          <div><strong>Email:</strong> {selectedOrder.customer.email}</div>
                          <div><strong>Destination:</strong> {selectedOrder.customer.addressLine1} ({selectedOrder.customer.pincode})</div>
                        </div>
                        <div className="border-t border-[#181a20] pt-2 text-[11px] text-[#8e887d]">
                          <strong>ID Protocol:</strong> {selectedOrder.verificationMethod} · Doorstep physical verification mandatory
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <h4 className="text-xs font-semibold text-[#f4efe6] mb-2 uppercase tracking-wider">
                          Consignment Contents ({selectedOrder.items.length})
                        </h4>
                        <div className="space-y-2">
                          {selectedOrder.items.map((it, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between rounded-lg border border-[#181a20] bg-[#121318] p-3 text-xs"
                            >
                              <div>
                                <span className="font-semibold text-[#f4efe6]">{it.productName}</span>
                                <span className="text-[#8e887d] ml-2">({it.volume})</span>
                              </div>
                              <div className="font-mono text-[#f4efe6] tabular-nums">
                                {it.quantity} x ₹{it.unitPrice.toLocaleString('en-IN')} = ₹{it.totalPrice.toLocaleString('en-IN')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status Update Actions */}
                      <div className="border-t border-[#181a20] pt-4">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#d4af37] mb-2">
                          Transition Order Status
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {STATUS_OPTIONS.map((st) => (
                            <button
                              key={st}
                              onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                              disabled={updatingOrderId === selectedOrder.id || selectedOrder.status === st}
                              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                selectedOrder.status === st
                                  ? 'bg-[#d4af37] text-[#0c0d10]'
                                  : 'border border-[#242630] bg-[#121318] text-[#b3ada2] hover:text-[#f4efe6] hover:bg-[#181a20]'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>

                        <div>
                          <input
                            type="text"
                            value={statusNotes}
                            onChange={(e) => setStatusNotes(e.target.value)}
                            placeholder="Add dispatcher note (e.g. Courier Mohan assigned, temperature checked)"
                            className="w-full rounded-lg border border-[#242630] bg-[#121318] px-3 py-2 text-xs text-[#f4efe6] placeholder-[#5a564f] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-[#8e887d]">
                      Select an order from the left to view customer credentials and update dispatch status.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: COMPLIANCE CONFIGURATION */}
            {activeTab === 'compliance' && (
              <form onSubmit={handleSaveCompliance} className="flex-1 overflow-y-auto p-6 space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-base font-bold text-[#f4efe6]">
                    Configurable Legal Compliance Engine
                  </h3>
                  <p className="mt-1 text-xs text-[#8e887d]">
                    Update legal delivery hours, age restrictions, and statutory parameters. Changes enforce immediate hard locks across the store.
                  </p>
                </div>

                {configSavedSuccess && (
                  <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/20 p-3 text-xs text-emerald-300">
                    Compliance settings updated and synchronized across all active client sessions.
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#d1cbbe] mb-1">
                      Service Window Start (e.g. 23:00)
                    </label>
                    <input
                      type="text"
                      required
                      value={configForm.serviceWindowStart}
                      onChange={(e) => setConfigForm({ ...configForm, serviceWindowStart: e.target.value })}
                      className="w-full rounded-lg border border-[#242630] bg-[#121318] px-3.5 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#d1cbbe] mb-1">
                      Service Window End (e.g. 05:00)
                    </label>
                    <input
                      type="text"
                      required
                      value={configForm.serviceWindowEnd}
                      onChange={(e) => setConfigForm({ ...configForm, serviceWindowEnd: e.target.value })}
                      className="w-full rounded-lg border border-[#242630] bg-[#121318] px-3.5 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#d1cbbe] mb-1">
                      Minimum Legal Purchasing Age
                    </label>
                    <select
                      value={configForm.minLegalAge}
                      onChange={(e) => setConfigForm({ ...configForm, minLegalAge: Number(e.target.value) })}
                      className="w-full rounded-lg border border-[#242630] bg-[#121318] px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                    >
                      <option value={21}>21 Years (Spirits / Wine)</option>
                      <option value={25}>25 Years (Strict Maharashtra / Haryana Mandate)</option>
                      <option value={18}>18 Years (Beer & Mild Wine)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#d1cbbe] mb-1">
                      Maximum Bottles Per Order
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={configForm.maxBottlesPerOrder}
                      onChange={(e) => setConfigForm({ ...configForm, maxBottlesPerOrder: Number(e.target.value) })}
                      className="w-full rounded-lg border border-[#242630] bg-[#121318] px-3.5 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#d1cbbe] mb-1">
                    State Excise Retail License Number
                  </label>
                  <input
                    type="text"
                    value={configForm.licenseNumber}
                    onChange={(e) => setConfigForm({ ...configForm, licenseNumber: e.target.value })}
                    className="w-full rounded-lg border border-[#242630] bg-[#121318] px-3.5 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div className="space-y-3 border-t border-[#181a20] pt-4">
                  <label className="flex items-center gap-3 text-xs text-[#f4efe6] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configForm.serviceEnabled}
                      onChange={(e) => setConfigForm({ ...configForm, serviceEnabled: e.target.checked })}
                      className="rounded border-[#242630] bg-[#121318] text-[#d4af37] focus:ring-0"
                    />
                    <span>Service Active (Uncheck for immediate Dry Day / statutory lockdown)</span>
                  </label>

                  <label className="flex items-center gap-3 text-xs text-[#e8ca74] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configForm.isSimulatedOpenForTesting}
                      onChange={(e) => setConfigForm({ ...configForm, isSimulatedOpenForTesting: e.target.checked })}
                      className="rounded border-[#242630] bg-[#121318] text-[#d4af37] focus:ring-0"
                    />
                    <span>Simulated Window (Testing / Reviewer Daytime Evaluation Mode)</span>
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingConfig}
                    className="rounded-lg bg-[#d4af37] px-6 py-2.5 text-xs font-semibold text-[#0c0d10] hover:bg-[#e8ca74] disabled:opacity-50"
                  >
                    {savingConfig ? 'Saving Settings...' : 'Save Compliance Configuration'}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: NOTIFICATIONS DISPATCH AUDIT */}
            {activeTab === 'notifications' && (
              <div className="flex flex-1 flex-col overflow-hidden p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#f4efe6]">
                    Operator Messaging & Notification Stream
                  </h3>
                  <p className="mt-1 text-xs text-[#8e887d]">
                    Automated SMS, Email, and WhatsApp dispatch alerts to operators and customers. Customer information is masked in logs.
                  </p>
                </div>

                {/* Test Notification Simulator */}
                <form onSubmit={handleSendTestAlert} className="rounded-xl border border-[#1e2029] bg-[#121318] p-4 flex flex-col sm:flex-row gap-3 items-end">
                  <div className="w-full sm:w-40">
                    <label className="block text-[11px] text-[#8e887d] mb-1">Channel</label>
                    <select
                      value={testChannel}
                      onChange={(e) => setTestChannel(e.target.value as any)}
                      className="w-full rounded-lg border border-[#242630] bg-[#0c0d10] px-3 py-2 text-xs text-[#f4efe6] focus:outline-none"
                    >
                      <option value="WHATSAPP">WhatsApp</option>
                      <option value="SMS">SMS Gateway</option>
                      <option value="EMAIL">Email SMTP</option>
                    </select>
                  </div>

                  <div className="flex-1 w-full">
                    <label className="block text-[11px] text-[#8e887d] mb-1">Message Payload</label>
                    <input
                      type="text"
                      value={testMsg}
                      onChange={(e) => setTestMsg(e.target.value)}
                      className="w-full rounded-lg border border-[#242630] bg-[#0c0d10] px-3 py-2 text-xs text-[#f4efe6] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sendingTest}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#d4af37] px-4 py-2 text-xs font-semibold text-[#0c0d10] hover:bg-[#e8ca74] shrink-0"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Test</span>
                  </button>
                </form>

                {/* Notification Logs */}
                <div className="flex-1 overflow-y-auto space-y-2 border border-[#181a20] rounded-xl p-4 bg-[#08090a]">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#8e887d]">
                      No notification events recorded yet.
                    </div>
                  ) : (
                    notifications.map((log) => (
                      <div
                        key={log.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-[#181a20] bg-[#0e1014] p-3 text-xs gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold ${
                              log.type === 'WHATSAPP'
                                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                                : log.type === 'SMS'
                                ? 'bg-blue-950/40 text-blue-400 border border-blue-800/40'
                                : 'bg-purple-950/40 text-purple-400 border border-purple-800/40'
                            }`}
                          >
                            {log.type}
                          </span>
                          <span className="text-[#f4efe6]">{log.message}</span>
                        </div>

                        <div className="flex items-center gap-4 text-[11px] text-[#8e887d] shrink-0 font-mono">
                          <span>{log.recipient}</span>
                          <span>{new Date(log.sentAt).toLocaleTimeString()}</span>
                          <span className="text-emerald-400 font-bold">{log.status}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
