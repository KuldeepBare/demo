import { Product, Order, ComplianceConfig, NotificationLog } from '../src/types/index.ts';

// Initial realistic demonstration catalog
// Clearly labeled as demonstration data under current excise permit rules
const initialProducts: Product[] = [
  {
    id: 'whisky-01',
    name: 'The Macallan 18 Double Cask Single Malt',
    category: 'whisky',
    subCategory: 'Single Malt Scotch',
    origin: 'Speyside, Scotland',
    abv: 43.0,
    volume: '700ml',
    price: 36500,
    inStock: true,
    stockCount: 6,
    description: 'A matured Highland single malt aged in handcrafted sherry seasoned oak casks from America and Europe. Rich amber notes of dried fruit, ginger, and toffee.',
    tastingNotes: ['Dried Apricot', 'Warm Ginger', 'Toffee', 'Orange Zest', 'Spiced Oak'],
    pairing: 'Artisanal dark single-origin chocolate, aged Comté',
    servingTemp: '16°C – 18°C (Neat or with one hand-carved ice sphere)',
    curatorNotes: 'Allocated reserve lot. Certified legal excise stamp batch #SC-8921.',
    image: '/src/assets/images/product_single_malt_whisky_1791090787382.jpg',
    maxPerOrder: 2,
    exciseCode: 'EX-SPEY-18-MUM'
  },
  {
    id: 'whisky-02',
    name: 'Hibiki Japanese Harmony Whisky',
    category: 'whisky',
    subCategory: 'Japanese Blended Whisky',
    origin: 'Hakushu & Yamazaki, Japan',
    abv: 43.0,
    volume: '700ml',
    price: 18200,
    inStock: true,
    stockCount: 11,
    description: 'A luminous harmony of at least 10 malt and grain whiskies, meticulously married to create a full orchestra of flavors and aromas.',
    tastingNotes: ['Rose', 'Lychee', 'Hint of Rosemary', 'Mature Woodiness', 'White Chocolate'],
    pairing: 'Smoked salmon crudo, mild soft cheeses',
    servingTemp: 'Serve in a crystal highball with premium Japanese soda or over a carved crystal rock.',
    curatorNotes: 'Iconic 24-faceted decanter symbolizing the 24 seasons of the Japanese lunar calendar.',
    image: '/src/assets/images/product_single_malt_whisky_1791090787382.jpg',
    maxPerOrder: 2,
    exciseCode: 'EX-SUNT-HIB-09'
  },
  {
    id: 'whisky-03',
    name: 'Lagavulin 16 Year Old Islay Single Malt',
    category: 'whisky',
    subCategory: 'Peated Islay Malt',
    origin: 'Islay, Scotland',
    abv: 43.0,
    volume: '750ml',
    price: 14500,
    inStock: true,
    stockCount: 9,
    description: 'The king of Islay. Deep, dry and exceptionally peaty with intensely smoky aromas, balanced with sweet iodine and deep dried fruit richness.',
    tastingNotes: ['Intense Peat Smoke', 'Iodine & Sea Spray', 'Black Tea', 'Vanilla Malt'],
    pairing: 'Roquefort or Stilton blue cheese, salted dark truffles',
    servingTemp: 'Room temperature with 2 drops of mineral water.',
    curatorNotes: 'A classic late-night digestif favorite for seasoned connoisseurs.',
    image: '/src/assets/images/product_single_malt_whisky_1791090787382.jpg',
    maxPerOrder: 2,
    exciseCode: 'EX-ISLAY-16-04'
  },
  {
    id: 'gin-01',
    name: 'Monkey 47 Schwarzwald Dry Gin',
    category: 'gin',
    subCategory: 'Artisanal Botanical Gin',
    origin: 'Black Forest, Germany',
    abv: 47.0,
    volume: '500ml',
    price: 6800,
    inStock: true,
    stockCount: 14,
    description: 'Distilled with 47 predominantly hand-picked regional botanicals infused in soft Black Forest spring water. Complex, floral, peppery, and piney.',
    tastingNotes: ['Lingonberry', 'Black Forest Pine', 'Citrus Peel', 'Sage', 'Cardamom'],
    pairing: 'Mediterranean light tonic, fresh twist of pink grapefruit and kaffir lime leaf',
    servingTemp: 'Chill to 6°C over dense artisan ice cubes.',
    curatorNotes: 'Limited small-batch apothecary bottle with Portuguese natural cork ring.',
    image: '/src/assets/images/product_artisanal_gin_1791090799773.jpg',
    maxPerOrder: 2,
    exciseCode: 'EX-GIN-M47-11'
  },
  {
    id: 'gin-02',
    name: 'Hapusa Himalayan Reserve Craft Gin',
    category: 'gin',
    subCategory: 'Small Batch Himalayan Gin',
    origin: 'Goa & Himalayas, India',
    abv: 43.0,
    volume: '750ml',
    price: 3950,
    inStock: true,
    stockCount: 18,
    description: 'Crafted using wild Himalayan juniper berries (Hapusa) harvested at altitude, alongside turmeric, mango, coriander seeds, and Gondhoraj lime.',
    tastingNotes: ['Alpine Pine Juniper', 'Earthy Turmeric', 'Gondhoraj Lime', 'Spiced Pepper'],
    pairing: 'Dry tonic, fresh sprig of rosemary or slice of dried green apple',
    servingTemp: '8°C with a large clear sphere.',
    curatorNotes: 'Locally celebrated Indian botanical distillation. Copper pot still certified.',
    image: '/src/assets/images/product_artisanal_gin_1791090799773.jpg',
    maxPerOrder: 3,
    exciseCode: 'EX-IND-HAP-20'
  },
  {
    id: 'wine-01',
    name: 'Château Margaux Premier Grand Cru Classé 2017',
    category: 'wine',
    subCategory: 'Bordeaux Premier Cru',
    origin: 'Margaux, Bordeaux, France',
    abv: 13.5,
    volume: '750ml',
    price: 78000,
    inStock: true,
    stockCount: 3,
    description: 'A monument of finesse, elegance, and aromatic purity. Velvety tannins carrying blackcurrant, cedar, violets, and subtle graphite.',
    tastingNotes: ['Crushed Blackberry', 'Violet Petals', 'Cedarwood', 'Graphite', 'Fine Tobacco'],
    pairing: 'Pan-seared tenderloin with truffle reduction, dry aged ribeye',
    servingTemp: '17°C (Decanted for 45 minutes prior to enjoyment)',
    curatorNotes: 'Cellared under continuous 14°C / 70% humidity temperature control. Shipped in isothermal packaging.',
    image: '/src/assets/images/product_reserve_vintage_wine_1791090810434.jpg',
    maxPerOrder: 1,
    exciseCode: 'EX-BDX-MARG-17'
  },
  {
    id: 'wine-02',
    name: 'Dom Pérignon Vintage Brut Champagne',
    category: 'wine',
    subCategory: 'Prestige Cuvée Champagne',
    origin: 'Épernay, Champagne, France',
    abv: 12.5,
    volume: '750ml',
    price: 28500,
    inStock: true,
    stockCount: 8,
    description: 'Only produced in exceptional harvest years. An exquisite interplay of crystalline minerality, toasted brioche, white flowers, and citrus vitality.',
    tastingNotes: ['White Peach', 'Toasted Brioche', 'Almond Flakes', 'Chalky Minerality', 'Lemon Zest'],
    pairing: 'Oysters, Sevruga caviar, crispy duck, aged parmesan crisps',
    servingTemp: '8°C – 10°C in wide tulip glassware.',
    curatorNotes: 'Delivered pre-chilled in Nocturne thermal sleeves upon request.',
    image: '/src/assets/images/product_reserve_vintage_wine_1791090810434.jpg',
    maxPerOrder: 2,
    exciseCode: 'EX-CHAMP-DOM-02'
  },
  {
    id: 'tequila-01',
    name: 'Clase Azul Reposado Tequila',
    category: 'tequila',
    subCategory: 'Artisanal Reposado Agave',
    origin: 'Jalisco, Mexico',
    abv: 40.0,
    volume: '750ml',
    price: 24500,
    inStock: true,
    stockCount: 5,
    description: 'Slow-cooked in traditional masonry ovens and aged for 8 months in American whiskey casks. Hand-painted artisanal ceramic decanter with bell topper.',
    tastingNotes: ['Agave Nectar', 'Candied Orange Peel', 'Vanilla Bean', 'Toasted Hazelnut'],
    pairing: 'Dark spiced chocolate, artisanal cured meats',
    servingTemp: 'Sip neat at 18°C from a crystal tulip snifter.',
    curatorNotes: 'Individually sculpted by Mexican Mazahua artisans.',
    image: '/src/assets/images/product_single_malt_whisky_1791090787382.jpg',
    maxPerOrder: 2,
    exciseCode: 'EX-TEQ-AZUL-05'
  },
  {
    id: 'vodka-01',
    name: 'Beluga Gold Line Noble Russian Vodka',
    category: 'vodka',
    subCategory: 'Ultra-Premium Siberian Vodka',
    origin: 'Mariinsk, Siberia',
    abv: 40.0,
    volume: '700ml',
    price: 13500,
    inStock: true,
    stockCount: 7,
    description: 'A masterpiece created through a 90-day resting process. Unmatched velvety softness infused with extracts of wild rice and rhodiola rosea.',
    tastingNotes: ['Crisp Clean Grain', 'Subtle Vanilla', 'White Pepper Finish', 'Silk Texture'],
    pairing: 'Caviar on blinis, pickled cornichons, smoked sturgeon',
    servingTemp: 'Freezer chilled at -2°C to 2°C.',
    curatorNotes: 'Comes with a special brass hammer and brush to break the wax seal.',
    image: '/src/assets/images/product_artisanal_gin_1791090799773.jpg',
    maxPerOrder: 2,
    exciseCode: 'EX-VOD-BELG-01'
  },
  {
    id: 'beer-01',
    name: 'Westvleteren XII Trappist Ale Reserve (Pack of 3)',
    category: 'beer',
    subCategory: 'Abbey Trappist Quad',
    origin: 'Vleteren, Belgium',
    abv: 10.2,
    volume: '3 x 330ml',
    price: 4900,
    inStock: true,
    stockCount: 12,
    description: 'Consistently rated among the finest beers in the world. Brewed exclusively by the monks of the Abbey of Saint Sixtus. Dark, complex, and unctuous.',
    tastingNotes: ['Dark Fig', 'Belgian Candi Sugar', 'Raisin', 'Toffee', 'Malt Complexity'],
    pairing: 'Aged Gouda, roast game, spiced bread',
    servingTemp: '12°C – 14°C in a Trappist chalice.',
    curatorNotes: 'Rare monastic allocation. Must not be served excessively chilled.',
    image: '/src/assets/images/product_reserve_vintage_wine_1791090810434.jpg',
    maxPerOrder: 2,
    exciseCode: 'EX-BELG-WEST-12'
  },
  {
    id: 'cocktail_kits-01',
    name: 'The Nocturne Speakeasy Old Fashioned Kit',
    category: 'cocktail_kits',
    subCategory: 'Curated Nightlife Bar Set',
    origin: 'Curated by Nocturne Sommeliers',
    abv: 38.5,
    volume: 'Bespoke Kit',
    price: 6200,
    inStock: true,
    stockCount: 15,
    description: 'Everything required to craft 8 bar-grade Old Fashioneds: Woodford Reserve Bourbon (375ml), Angostura & Blood Orange bitters, demerara Gomme syrup, Luxardo cherries, and carved crystal cocktail sphere molds.',
    tastingNotes: ['Caramelized Orange', 'Rich Oak', 'Warm Spices', 'Bittersweet Cocoa'],
    pairing: 'Charcuterie board, roasted salted pecans',
    servingTemp: 'Build directly over crystal ice sphere.',
    curatorNotes: 'Includes engraved bar spoon and jigger for discerning mixologists.',
    image: '/src/assets/images/hero_nocturne_lounge_1791090773416.jpg',
    maxPerOrder: 2,
    exciseCode: 'EX-KIT-NOCT-01'
  }
];

// Initial compliance configuration based on legal late-night delivery mandate
let complianceConfig: ComplianceConfig = {
  serviceWindowStart: '23:00', // 11:00 PM
  serviceWindowEnd: '05:00',   // 5:00 AM
  minLegalAge: 21,
  jurisdiction: 'Maharashtra State Excise Delivery Notification & Compliant Cellar Protocol',
  licenseNumber: 'FL-III/2026/MUM-WZ-8849 (Licensed Partner Hub)',
  maxBottlesPerOrder: 3,
  permittedPincodes: ['400001', '400005', '400020', '400021', '400026', '400050', '400051', '400052', '400054', '400056', '400069'],
  permittedNeighborhoods: [
    'South Mumbai (Colaba, Fort, Marine Lines, Malabar Hill)',
    'Bandra West (Pali Hill, Carter Road, Bandstand)',
    'Bandra Kurla Complex (BKC Luxury Residences)',
    'Juhu & Santacruz West',
    'Lower Parel & Worli Sea Face'
  ],
  mandatoryPhysicalIdCheckAtDoor: true,
  serviceEnabled: true,
  isSimulatedOpenForTesting: false
};

// Initial realistic demonstration orders for the admin dashboard
let orders: Order[] = [
  {
    id: 'NCT-80419',
    customer: {
      fullName: 'Vikramaditya Singhania',
      phone: '+91 98201 44521',
      email: 'vikram.singhania@heritagegroup.in',
      addressLine1: 'Penthouse A, Samudra Mahal, Worli Sea Face',
      city: 'Mumbai',
      pincode: '400018',
      deliveryNotes: 'Discreet bell, concierge has gate pre-clearance.'
    },
    items: [
      {
        productId: 'whisky-01',
        productName: 'The Macallan 18 Double Cask Single Malt',
        category: 'whisky',
        volume: '700ml',
        unitPrice: 36500,
        quantity: 1,
        totalPrice: 36500
      }
    ],
    subtotal: 36500,
    exciseTax: 3650,
    deliveryFee: 500,
    totalAmount: 40650,
    status: 'Out for delivery',
    createdAt: new Date(Date.now() - 38 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    verificationStatus: 'Verified',
    verificationToken: 'TKN_DL_98a72b0c3f4e_MUM21',
    verificationMethod: 'Authorized Age-Token + Doorstep Physical ID Validation',
    legalAffirmationAccepted: true,
    deliveryWindow: '11:00 PM – 5:00 AM (Late Night Express)',
    operatorNotes: 'Temperature-controlled insulated hardcase #04. Dispatcher: Mohan K.'
  },
  {
    id: 'NCT-80420',
    customer: {
      fullName: 'Rhea Oberoi',
      phone: '+91 98192 11843',
      email: 'rhea.oberoi@creativestudios.com',
      addressLine1: 'Flat 902, Horizon Tower, Pali Hill, Bandra West',
      city: 'Mumbai',
      pincode: '400050',
      deliveryNotes: 'Call upon arrival at tower gate.'
    },
    items: [
      {
        productId: 'gin-01',
        productName: 'Monkey 47 Schwarzwald Dry Gin',
        category: 'gin',
        volume: '500ml',
        unitPrice: 6800,
        quantity: 1,
        totalPrice: 6800
      },
      {
        productId: 'wine-02',
        productName: 'Dom Pérignon Vintage Brut Champagne',
        category: 'wine',
        volume: '750ml',
        unitPrice: 28500,
        quantity: 1,
        totalPrice: 28500
      }
    ],
    subtotal: 35300,
    exciseTax: 3530,
    deliveryFee: 400,
    totalAmount: 39230,
    status: 'Preparing',
    createdAt: new Date(Date.now() - 19 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    verificationStatus: 'Verified',
    verificationToken: 'TKN_IDCENTRAL_c190f84_MUM25',
    verificationMethod: 'Authorized Age-Token (DOB >= 21+)',
    legalAffirmationAccepted: true,
    deliveryWindow: '11:00 PM – 5:00 AM (Late Night Express)',
    operatorNotes: 'Pre-chill Champagne sleeve requested. Assigned to Sommelier Cellar Team B.'
  },
  {
    id: 'NCT-80421',
    customer: {
      fullName: 'Kabir Varma',
      phone: '+91 98450 78219',
      email: 'kabir.varma@fintechventures.io',
      addressLine1: 'B-1402, Signia Isles, G Block, Bandra Kurla Complex',
      city: 'Mumbai',
      pincode: '400051',
      deliveryNotes: 'Please ring Apt 1402 directly.'
    },
    items: [
      {
        productId: 'cocktail_kits-01',
        productName: 'The Nocturne Speakeasy Old Fashioned Kit',
        category: 'cocktail_kits',
        volume: 'Bespoke Kit',
        unitPrice: 6200,
        quantity: 1,
        totalPrice: 6200
      }
    ],
    subtotal: 6200,
    exciseTax: 620,
    deliveryFee: 350,
    totalAmount: 7170,
    status: 'New',
    createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    verificationStatus: 'Verified',
    verificationToken: 'TKN_VERIFY_e4891ac3',
    verificationMethod: 'Authorized Zero-Knowledge Age Token',
    legalAffirmationAccepted: true,
    deliveryWindow: '11:00 PM – 5:00 AM (Late Night Express)',
    operatorNotes: 'Awaiting dispatch assignment.'
  }
];

let notificationLogs: NotificationLog[] = [
  {
    id: 'notif-01',
    orderId: 'NCT-80419',
    type: 'WHATSAPP',
    recipient: '+91 98201 44521',
    message: 'Nocturne Reserve: Order NCT-80419 is out for delivery with Sommelier Courier Mohan K. Please keep government photo ID ready.',
    sentAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    status: 'DELIVERED'
  },
  {
    id: 'notif-02',
    orderId: 'NCT-80420',
    type: 'SMS',
    recipient: '+91 98192 11843',
    message: 'Nocturne Reserve: Your late-night cellar order NCT-80420 has been verified and is being packaged under temperature control.',
    sentAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    status: 'DELIVERED'
  }
];

export const db = {
  getProducts(): Product[] {
    return initialProducts;
  },
  getProductById(id: string): Product | undefined {
    return initialProducts.find(p => p.id === id);
  },
  getOrders(): Order[] {
    return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  getOrderById(id: string): Order | undefined {
    return orders.find(o => o.id === id);
  },
  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
    const newId = `NCT-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();
    const newOrder: Order = {
      ...orderData,
      id: newId,
      createdAt: now,
      updatedAt: now
    };
    orders.unshift(newOrder);
    return newOrder;
  },
  updateOrderStatus(orderId: string, status: Order['status'], notes?: string): Order | null {
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    if (notes) {
      order.operatorNotes = notes;
    }
    return order;
  },
  getCompliance(): ComplianceConfig {
    return { ...complianceConfig };
  },
  updateCompliance(partial: Partial<ComplianceConfig>): ComplianceConfig {
    complianceConfig = { ...complianceConfig, ...partial };
    return { ...complianceConfig };
  },
  addNotificationLog(log: Omit<NotificationLog, 'id' | 'sentAt'>): NotificationLog {
    const newLog: NotificationLog = {
      ...log,
      id: `notif-${Math.random().toString(36).substring(2, 9)}`,
      sentAt: new Date().toISOString()
    };
    notificationLogs.unshift(newLog);
    return newLog;
  },
  getNotificationLogs(): NotificationLog[] {
    return notificationLogs;
  }
};
