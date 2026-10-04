import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './server/db.ts';
import { isCurrentlyInOperatingHours, validateOrderEligibility } from './server/compliance.ts';
import { performPrivacyPreservingAgeCheck } from './server/verification.ts';
import { sendOrderNotifications } from './server/notifications.ts';
import { paymentsProvider } from './server/payments.ts';
import { OrderStatus } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADMIN_TOKEN = process.env.ADMIN_SESSION_TOKEN || 'nocturne_operator_auth_sess_991823';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nocturne2026';

function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }
  const token = authHeader.split(' ')[1];
  if (token !== ADMIN_TOKEN) {
    return res.status(403).json({ error: 'Forbidden: Invalid administrative credentials' });
  }
  next();
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // --- Public Compliance & Hours API ---
  app.get('/api/compliance', (_req, res) => {
    const config = db.getCompliance();
    const isOpen = isCurrentlyInOperatingHours(config);
    res.json({
      ...config,
      isOpenNow: isOpen,
      currentTime: new Date().toISOString(),
      displayWindow: `${config.serviceWindowStart} to ${config.serviceWindowEnd}`
    });
  });

  // --- Products Catalog (Only accessible after age verification in client) ---
  app.get('/api/products', (_req, res) => {
    const products = db.getProducts();
    res.json(products);
  });

  app.get('/api/products/:id', (req, res) => {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  // --- Age Verification Endpoint ---
  app.post('/api/verify-age', (req, res) => {
    const { fullName, birthYear, provider, acceptedTerms, postalCode } = req.body;
    if (!birthYear || typeof birthYear !== 'number') {
      return res.status(400).json({ error: 'Valid birth year is required for verification.' });
    }

    const result = performPrivacyPreservingAgeCheck({
      fullName: fullName || 'Verified Patron',
      birthYear,
      provider: provider || 'DigiLocker_API',
      postalCode,
      acceptedTerms: Boolean(acceptedTerms)
    });

    if (!result.success) {
      return res.status(403).json(result);
    }

    res.json(result);
  });

  // --- Order Creation Endpoint (With strict legal & hours enforcement) ---
  app.post('/api/orders', (req, res) => {
    const { customer, items, verificationToken, legalAffirmationAccepted, verificationMethod } = req.body;

    if (!customer || !customer.fullName || !customer.phone || !customer.addressLine1 || !customer.pincode) {
      return res.status(400).json({ error: 'Incomplete delivery customer information.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }

    if (!legalAffirmationAccepted) {
      return res.status(400).json({ error: 'Legal affirmation of drinking age and courier ID check agreement required.' });
    }

    // Run compliance rules engine
    const eligibility = validateOrderEligibility(
      customer.pincode,
      items,
      Boolean(legalAffirmationAccepted),
      Boolean(verificationToken)
    );

    if (!eligibility.eligible) {
      return res.status(400).json({
        error: 'Order could not be accepted due to legal/compliance restrictions.',
        reasons: eligibility.reasons,
        eligibility
      });
    }

    // Calculate financials
    const subtotal = items.reduce((sum: number, it: any) => sum + (it.totalPrice || it.unitPrice * it.quantity), 0);
    const exciseTax = Math.round(subtotal * 0.10); // Standard excise VAT simulation
    const deliveryFee = subtotal >= 20000 ? 0 : 500;
    const totalAmount = subtotal + exciseTax + deliveryFee;

    const compliance = db.getCompliance();

    const order = db.createOrder({
      customer,
      items,
      subtotal,
      exciseTax,
      deliveryFee,
      totalAmount,
      status: 'New',
      verificationStatus: verificationToken ? 'Verified' : 'Pending Courier Verification',
      verificationToken: verificationToken || undefined,
      verificationMethod: verificationMethod || 'Statutory Affirmation + Doorstep ID Match',
      legalAffirmationAccepted: true,
      deliveryWindow: `${compliance.serviceWindowStart} – ${compliance.serviceWindowEnd} (Nocturnal Express)`,
      operatorNotes: 'Order received. Dispatched to sommelier packing station.'
    });

    // Send notifications to operator and customer
    const notifications = sendOrderNotifications(order);

    res.status(201).json({
      success: true,
      order,
      notifications
    });
  });

  app.get('/api/orders/:id', (req, res) => {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    // Return sanitized customer info for public tracking
    res.json({
      id: order.id,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      deliveryWindow: order.deliveryWindow,
      verificationStatus: order.verificationStatus,
      totalAmount: order.totalAmount,
      itemsCount: order.items.length,
      destinationCity: order.customer.city,
      destinationPincode: order.customer.pincode
    });
  });

  // --- Payment Abstraction Endpoints ---
  app.get('/api/payments/config', (_req, res) => {
    res.json(paymentsProvider.getGatewayConfig());
  });

  app.post('/api/payments/initiate', async (req, res) => {
    try {
      const result = await paymentsProvider.initiatePayment(req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Payment initiation failed' });
    }
  });

  app.post('/api/payments/verify', async (req, res) => {
    try {
      const result = await paymentsProvider.verifyPayment(req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Payment verification failed' });
    }
  });

  // --- Admin Authentication & Dashboard Endpoints (Protected) ---
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      return res.json({
        token: ADMIN_TOKEN,
        user: { role: 'operator', name: 'Master Cellar Dispatcher' }
      });
    }
    res.status(401).json({ error: 'Invalid administrative passcode' });
  });

  app.get('/api/admin/orders', adminAuthMiddleware, (_req, res) => {
    const orders = db.getOrders();
    res.json(orders);
  });

  app.patch('/api/admin/orders/:id/status', adminAuthMiddleware, (req, res) => {
    const { status, notes } = req.body;
    const allowedStatuses: OrderStatus[] = [
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

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid order status transition' });
    }

    const updated = db.updateOrderStatus(req.params.id, status, notes);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Trigger notification on status update
    sendOrderNotifications(updated);

    res.json(updated);
  });

  app.get('/api/admin/settings', adminAuthMiddleware, (_req, res) => {
    const compliance = db.getCompliance();
    res.json(compliance);
  });

  app.put('/api/admin/settings', adminAuthMiddleware, (req, res) => {
    const updated = db.updateCompliance(req.body);
    res.json(updated);
  });

  app.get('/api/admin/notifications', adminAuthMiddleware, (_req, res) => {
    const logs = db.getNotificationLogs();
    res.json(logs);
  });

  app.post('/api/admin/simulate-alert', adminAuthMiddleware, (req, res) => {
    const { channel, message } = req.body;
    const log = db.addNotificationLog({
      orderId: 'SYS_TEST',
      type: channel || 'WHATSAPP',
      recipient: '+91 98200 00000',
      message: message || 'Test notification from Nocturne Dispatch Hub',
      status: 'DELIVERED'
    });
    res.json({ success: true, log });
  });

  // --- Serve Frontend ---
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Nocturne Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Nocturne Server] Startup failed:', err);
  process.exit(1);
});
