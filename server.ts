import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { db } from './server/db.ts';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- API ROUTES ---

// 1. Products
app.get('/api/products', (req: Request, res: Response) => {
  try {
    const { category, search, featured, trending, bestSeller, newArrival, activeOnly } = req.query;
    const products = db.getProducts({
      category: category as string,
      search: search as string,
      featured: featured === 'true',
      trending: trending === 'true',
      bestSeller: bestSeller === 'true',
      newArrival: newArrival === 'true',
      activeOnly: activeOnly === 'true',
    });
    res.json({ success: true, count: products.length, products });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    const reviews = db.getReviews(product.id);
    res.json({ success: true, product, reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/products', (req: Request, res: Response) => {
  try {
    const { name, price } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ success: false, error: 'Product name and price are required' });
    }
    const saved = db.saveProduct(req.body);
    res.json({ success: true, product: saved });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  try {
    const saved = db.saveProduct({ ...req.body, id: req.params.id });
    res.json({ success: true, product: saved });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  try {
    const deleted = db.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Categories
app.get('/api/categories', (_req: Request, res: Response) => {
  try {
    const categories = db.getCategories();
    res.json({ success: true, categories });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/categories', (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Category name is required' });
    }
    const saved = db.saveCategory(req.body);
    res.json({ success: true, category: saved });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/categories/:id', (req: Request, res: Response) => {
  try {
    const deleted = db.deleteCategory(req.params.id);
    res.json({ success: deleted });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Orders
app.get('/api/orders', (req: Request, res: Response) => {
  try {
    const { status, search, customerId } = req.query;
    const orders = db.getOrders({
      status: status as string,
      search: search as string,
      customerId: customerId as string,
    });
    res.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const { customerName, phone, email, city, address, postalCode, items } = req.body;
    if (!customerName || !phone || !city || !address || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please complete all required fields (Name, Phone, City, Address, and Cart items)',
      });
    }

    const result = db.createOrder(req.body);
    res.json({ success: true, order: result.order });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  try {
    const { status, trackingNumber, courier, paymentStatus, note } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }
    const updated = db.updateOrderStatus(req.params.id, status, {
      trackingNumber,
      courier,
      paymentStatus,
      note,
    });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, order: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/orders/:id/cancel', (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
      return res.status(400).json({
        success: false,
        error: `Order cannot be cancelled because it is already ${order.orderStatus.toLowerCase()}.`,
      });
    }
    const updated = db.updateOrderStatus(req.params.id, 'Cancelled', {
      note: `Cancelled by customer/admin. Reason: ${reason || 'Customer request'}`,
    });
    res.json({ success: true, order: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Coupons
app.get('/api/coupons', (_req: Request, res: Response) => {
  try {
    const coupons = db.getCoupons();
    res.json({ success: true, coupons });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/coupons/validate', (req: Request, res: Response) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ valid: false, message: 'Please enter a coupon code' });
    }
    const validation = db.validateCoupon(code, Number(subtotal) || 0);
    res.json(validation);
  } catch (error: any) {
    res.status(500).json({ valid: false, message: error.message });
  }
});

app.post('/api/coupons', (req: Request, res: Response) => {
  try {
    const { code, discountValue } = req.body;
    if (!code || discountValue === undefined) {
      return res.status(400).json({ success: false, error: 'Coupon code and discount value required' });
    }
    const saved = db.saveCoupon(req.body);
    res.json({ success: true, coupon: saved });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/coupons/:id', (req: Request, res: Response) => {
  try {
    const deleted = db.deleteCoupon(req.params.id);
    res.json({ success: deleted });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Customers & Users
app.get('/api/customers', (req: Request, res: Response) => {
  try {
    const role = (req.query.role as 'customer' | 'admin' | 'staff') || undefined;
    const users = db.getUsers(role);
    res.json({ success: true, users });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.patch('/api/customers/:id/block', (req: Request, res: Response) => {
  try {
    const { blocked } = req.body;
    const user = db.toggleUserBlock(req.params.id, blocked);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Reviews
app.get('/api/reviews', (req: Request, res: Response) => {
  try {
    const { productId } = req.query;
    const reviews = db.getReviews(productId as string);
    res.json({ success: true, reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/reviews', (req: Request, res: Response) => {
  try {
    const { productId, userName, rating, comment } = req.body;
    if (!productId || !userName || !rating || !comment) {
      return res.status(400).json({ success: false, error: 'Missing required review fields' });
    }
    const rev = db.addReview({
      productId,
      userName,
      rating: Number(rating),
      comment,
      verifiedPurchase: true,
    });
    res.json({ success: true, review: rev });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. Inventory Logs
app.get('/api/inventory', (req: Request, res: Response) => {
  try {
    const logs = db.getInventoryLogs(req.query.productId as string);
    res.json({ success: true, logs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 8. Website Settings & Customization
app.get('/api/settings', (_req: Request, res: Response) => {
  try {
    const settings = db.getSettings();
    res.json({ success: true, settings });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/settings', (req: Request, res: Response) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 9. Dashboard Analytics & Reports
app.get('/api/stats', (_req: Request, res: Response) => {
  try {
    const stats = db.getDashboardStats();
    res.json({ success: true, stats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 10. Auth routes (Customer & Admin)
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    const user = db.getUserById(email);
    if (!user) {
      // Auto register demo customer if not found
      if (role !== 'admin') {
        const newUser = db.registerUser(email.split('@')[0], email, '+91 99999 88888', 'customer');
        return res.json({ success: true, user: newUser, token: `tok_${Date.now()}` });
      }
      return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, error: 'This account has been suspended. Please contact support.' });
    }

    res.json({ success: true, user, token: `tok_${user.id}_${Date.now()}` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }
    const user = db.registerUser(name, email, phone || '');
    res.json({ success: true, user, token: `tok_${user.id}_${Date.now()}` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 11. Image upload mock / data helper
app.post('/api/upload', (req: Request, res: Response) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, error: 'Image data required' });
    }
    // Return provided image data URL or placeholder
    res.json({ success: true, url: image });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- VITE MIDDLEWARE SETUP ---
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Trend Bazar Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
