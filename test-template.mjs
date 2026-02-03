// Quick test for the new premium template generator
import { premiumTemplateGenerator } from './services/template-generator.service';

const testInput = {
  businessName: 'Sunrise Bakery',
  content: {
    hero: {
      headline: 'Artisan Breads & Pastries',
      subheadline: 'Fresh baked goods made with love every morning.',
      ctaPrimary: 'Order Now',
      ctaSecondary: 'View Menu'
    },
    services: [
      { title: 'Fresh Bread', description: 'Artisan sourdough baked daily.' },
      { title: 'Pastries', description: 'Croissants and danishes.' },
      { title: 'Custom Cakes', description: 'Beautiful cakes for events.' }
    ],
    about: {
      headline: 'Baking With Passion Since 1985',
      paragraphs: ['We have been the heart of our community.']
    },
    testimonials: [
      { quote: 'The best croissants!', author: 'Sarah M.', role: 'Customer' }
    ],
    cta: {
      headline: 'Ready to Taste the Difference?',
      subheadline: 'Visit us today',
      buttonText: 'Contact Us'
    }
  },
  colors: {
    primary: '#D97706',
    secondary: '#92400E',
    accent: '#FCD34D'
  },
  contactInfo: {
    email: 'hello@sunrisebakery.com',
    phone: '(555) 123-4567',
    address: '123 Main Street'
  }
};

async function test() {
  try {
    const files = await premiumTemplateGenerator.generate(testInput);
    console.log('\n✅ Template generated successfully!');
    console.log('\nFiles created:');
    Object.keys(files).forEach(f => {
      console.log(`  - ${f} (${files[f].length} chars)`);
    });
    
    // Check for GSAP inclusion
    const hasGSAP = files['index.html'].includes('gsap');
    console.log('\n🎬 GSAP Animations:', hasGSAP ? '✓ Included' : '✗ Missing');
    
    // Check for Inter font
    const hasInterFont = files['index.html'].includes('Inter');
    console.log('🔤 Inter Font:', hasInterFont ? '✓ Included' : '✗ Missing');
    
    // Check for floating shapes
    const hasFloatingShapes = files['index.html'].includes('floating-shapes');
    console.log('✨ Floating Shapes:', hasFloatingShapes ? '✓ Included' : '✗ Missing');
    
    // Check for cursor glow
    const hasCursorGlow = files['index.html'].includes('cursor-glow');
    console.log('💫 Cursor Glow:', hasCursorGlow ? '✓ Included' : '✗ Missing');
    
    // Check CSS for modern features
    const hasGradients = files['styles.css'].includes('linear-gradient');
    console.log('🌈 Gradients:', hasGradients ? '✓ Included' : '✗ Missing');
    
    console.log('\n🎉 New STUNNING template is ready!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

test();
