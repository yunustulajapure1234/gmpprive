# 🚀 Quick Setup Guide

## Step 1: Extract & Install
```bash
# Extract the ZIP file
# Navigate to the folder
cd gmp-salon-improved

# Install dependencies
npm install
```

## Step 2: Run Development Server
```bash
npm run dev
```

Your app will open at `http://localhost:3000`

## Step 3: Test the Booking Flow

1. Click "Book Your Service" button
2. Fill in booking details:
   - Name: Test User
   - Phone: +971 XX XXX XXXX
   - Date: Tomorrow's date
   - Time: Select from dropdown
   - Address: Test Address, Dubai
3. Click "Confirm & Add Services"
4. Browse services (Women or Men section)
5. Click "Add" on services
6. Click Cart icon (top right)
7. Review booking details
8. Click "Book via WhatsApp"
9. WhatsApp opens with pre-filled message!

## Step 4: Customize

### Update WhatsApp Number
1. Open `src/components/Cart.jsx`
2. Find: `const phone = '971528686112';`
3. Replace with your number (no + or spaces)

### Add Your Services
1. Open `src/data/services.js`
2. Add/edit services:
```javascript
{
  id: 'unique-id',
  category: 'hair', // or spa, beauty, nails, grooming, waxing
  gender: 'women', // or 'men' or 'both'
  name: 'Service Name',
  nameAr: 'اسم الخدمة',
  description: 'Description',
  descriptionAr: 'الوصف',
  price: 150,
  duration: '60 min',
  image: 'image-url'
}
```

### Change Colors
Edit `src/components/*` files - look for:
- `from-amber-500 to-yellow-600` (primary gradient)
- `from-pink-500 to-pink-600` (women accent)
- `from-gray-700 to-gray-900` (men accent)

## Step 5: Build for Production
```bash
npm run build
```

The `dist/` folder contains your production files.

## 🎯 What's Included

### Pages
- `/` - Homepage with hero and category selection
- `/women` - Women's services
- `/men` - Men's services

### Components
- `Navbar` - Navigation with cart
- `Hero` - Homepage hero section
- `BookingModal` - Date/time/address form
- `ServicesSection` - Service browsing (used in both pages)
- `Cart` - Shopping cart with WhatsApp booking
- `Footer` - Site footer
- `FloatingButtons` - Call/WhatsApp/Cart buttons

### Features
- ✅ Mandatory booking before adding services
- ✅ Separate men/women service pages
- ✅ Shopping cart with quantities
- ✅ WhatsApp booking integration
- ✅ Bilingual (English/Arabic)
- ✅ Mobile responsive
- ✅ Professional fonts

## 🔥 Pro Tips

1. **Test on Mobile**: Use Chrome DevTools responsive mode
2. **Use Real Images**: Replace placeholder images with actual service photos
3. **Update Prices**: Check all prices match your actual pricing
4. **Test WhatsApp**: Make sure message format is correct
5. **Check Translations**: Verify Arabic text is correct

## ❗ Common Issues

### npm install fails
```bash
# Try clearing cache
npm cache clean --force
npm install
```

### Port 3000 already in use
```bash
# Change port in vite.config.js
server: {
  port: 3001, // or any other port
}
```

### Images not loading
- Make sure image URLs are valid
- Use https:// URLs for external images
- Or add images to `src/assets/` and import them

## 📞 Need Help?

- Check README.md for full documentation
- Check IMPLEMENTATION_GUIDE.md for backend setup
- Email: book@gmpsalonandspa.com

## 🎉 You're Ready!

Start customizing and launch your salon booking system!
