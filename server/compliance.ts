import { ComplianceConfig, OrderItem } from '../src/types/index.ts';
import { db } from './db.ts';

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
  currentHour: number;
  isOpenNow: boolean;
  windowString: string;
}

export function isCurrentlyInOperatingHours(config: ComplianceConfig, simulatedDate?: Date): boolean {
  if (config.isSimulatedOpenForTesting) {
    return true;
  }

  if (!config.serviceEnabled) {
    return false;
  }

  const now = simulatedDate || new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentDecimal = hours + minutes / 60;

  const [startH, startM] = config.serviceWindowStart.split(':').map(Number);
  const [endH, endM] = config.serviceWindowEnd.split(':').map(Number);
  const startDecimal = startH + (startM || 0) / 60;
  const endDecimal = endH + (endM || 0) / 60;

  // Window crossing midnight (e.g. 23:00 to 05:00)
  if (startDecimal > endDecimal) {
    return currentDecimal >= startDecimal || currentDecimal < endDecimal;
  }

  // Standard window within same day (e.g. 20:00 to 23:30)
  return currentDecimal >= startDecimal && currentDecimal < endDecimal;
}

export function validateOrderEligibility(
  pincode: string,
  items: OrderItem[],
  ageConfirmed: boolean,
  hasVerificationToken: boolean
): EligibilityResult {
  const config = db.getCompliance();
  const reasons: string[] = [];
  const isOpen = isCurrentlyInOperatingHours(config);

  if (!config.serviceEnabled) {
    reasons.push(config.maintenanceReason || 'Service is temporarily suspended under statutory directive or maintenance.');
  }

  if (!isOpen) {
    reasons.push(
      `Deliveries are only legally permitted during the nocturnal service window (${config.serviceWindowStart} to ${config.serviceWindowEnd}). Please schedule during active hours.`
    );
  }

  if (!config.permittedPincodes.includes(pincode.trim())) {
    reasons.push(
      `Pincode ${pincode} is outside our licensed excise delivery jurisdiction. Current authorized zones include South Mumbai, Bandra, BKC, and Lower Parel.`
    );
  }

  const totalBottles = items.reduce((sum, item) => sum + item.quantity, 0);
  if (totalBottles > config.maxBottlesPerOrder) {
    reasons.push(
      `Excise regulations limit orders to a maximum of ${config.maxBottlesPerOrder} bottles per customer per nocturnal delivery cycle. You have ${totalBottles} bottles in your cart.`
    );
  }

  if (!ageConfirmed && !hasVerificationToken) {
    reasons.push(`Statutory age requirement (${config.minLegalAge}+) must be formally affirmed.`);
  }

  return {
    eligible: reasons.length === 0,
    reasons,
    currentHour: new Date().getHours(),
    isOpenNow: isOpen,
    windowString: `${config.serviceWindowStart} – ${config.serviceWindowEnd}`
  };
}
