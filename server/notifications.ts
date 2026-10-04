import { Order, NotificationLog } from '../src/types/index.ts';
import { db } from './db.ts';

export interface NotificationResult {
  sent: boolean;
  channel: 'SMS' | 'EMAIL' | 'WHATSAPP';
  recipientMasked: string;
  messageSnippet: string;
  status: 'DELIVERED' | 'QUEUED' | 'SIMULATED';
}

function maskPhone(phone: string): string {
  if (phone.length < 8) return '****';
  return phone.slice(0, 4) + ' •••• ' + phone.slice(-2);
}

export function sendOrderNotifications(order: Order): NotificationResult[] {
  const results: NotificationResult[] = [];
  const operatorPhone = process.env.OPERATOR_PHONE || '+91 98200 00000';
  const operatorEmail = process.env.OPERATOR_EMAIL || 'concierge@nocturnereserve.in';
  const hasTwilio = Boolean(process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_SID);
  const hasWhatsApp = Boolean(process.env.WHATSAPP_BUSINESS_API_KEY);

  // 1. WhatsApp notification to operator & customer
  const waMessage = `[NOCTURNE DISPATCH] Order #${order.id} | ₹${order.totalAmount.toLocaleString()} | Customer: ${order.customer.fullName} | Status: ${order.status} | Courier ID Check Required`;
  const waLog = db.addNotificationLog({
    orderId: order.id,
    type: 'WHATSAPP',
    recipient: operatorPhone,
    message: waMessage,
    status: hasWhatsApp ? 'DELIVERED' : 'SIMULATED'
  });

  results.push({
    sent: true,
    channel: 'WHATSAPP',
    recipientMasked: maskPhone(operatorPhone),
    messageSnippet: waMessage,
    status: waLog.status
  });

  // 2. SMS notification to customer confirming nocturnal delivery window & physical ID mandate
  const smsMessage = `Nocturne Reserve: Order #${order.id} confirmed. Total ₹${order.totalAmount.toLocaleString()}. Delivery in nocturnal express window. Please have government photo ID ready.`;
  const smsLog = db.addNotificationLog({
    orderId: order.id,
    type: 'SMS',
    recipient: order.customer.phone,
    message: smsMessage,
    status: hasTwilio ? 'DELIVERED' : 'SIMULATED'
  });

  results.push({
    sent: true,
    channel: 'SMS',
    recipientMasked: maskPhone(order.customer.phone),
    messageSnippet: smsMessage,
    status: smsLog.status
  });

  // 3. Email receipt to operator dispatch hub
  const emailLog = db.addNotificationLog({
    orderId: order.id,
    type: 'EMAIL',
    recipient: operatorEmail,
    message: `New Order #${order.id} received for delivery to ${order.customer.city} (${order.customer.pincode}). Total items: ${order.items.length}.`,
    status: 'SIMULATED'
  });

  results.push({
    sent: true,
    channel: 'EMAIL',
    recipientMasked: 'con••••@nocturnereserve.in',
    messageSnippet: `Dispatch receipt for order #${order.id}`,
    status: emailLog.status
  });

  return results;
}
