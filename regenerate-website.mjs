/**
 * Regenerate website with the new ULTIMATE template
 */
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function regenerate() {
  const submissionId = process.argv[2] || '1d55be6b-79f3-422c-a2da-bb22d2ac2bd4';
  
  console.log(`\n🔄 Regenerating website for submission: ${submissionId}\n`);
  
  // Get submission with website
  const submission = await prisma.formSubmission.findUnique({
    where: { id: submissionId },
    include: { generatedWebsite: true }
  });
  
  if (!submission) {
    console.log('❌ Submission not found');
    return;
  }
  
  if (!submission.generatedWebsite) {
    console.log('❌ No website found for this submission');
    return;
  }
  
  console.log(`📦 Business: ${submission.businessName}`);
  console.log(`📧 Email: ${submission.email}`);
  
  // Parse generated content
  const generatedContent = typeof submission.generatedContent === 'string'
    ? JSON.parse(submission.generatedContent)
    : submission.generatedContent;
  
  // Get colors from website
  const colors = {
    primary: submission.generatedWebsite.primaryColor,
    secondary: submission.generatedWebsite.secondaryColor,
    accent: submission.generatedWebsite.accentColor
  };
  
  console.log(`🎨 Colors:`, colors);
  
  // Parse additional images
  const additionalImages = submission.additionalImages 
    ? (typeof submission.additionalImages === 'string' 
        ? JSON.parse(submission.additionalImages) 
        : submission.additionalImages)
    : [];
  
  console.log(`🖼️ Additional images: ${additionalImages.length}`);
  
  // Dynamically import the template generator
  const { premiumTemplateGenerator } = await import('./services/template-generator.service.ts');
  
  // Generate new website files
  console.log('\n⚡ Generating with ULTIMATE template...\n');
  
  const generatedWebsite = await premiumTemplateGenerator.generate({
    businessName: submission.businessName,
    content: generatedContent,
    colors: colors,
    logoUrl: submission.logoUrl || undefined,
    heroImageUrl: submission.heroImageUrl || undefined,
    additionalImages: additionalImages,
    contactInfo: {
      email: submission.email,
      phone: submission.phone || undefined,
      address: submission.address || undefined,
      social: submission.socialLinks ? JSON.parse(submission.socialLinks) : undefined
    }
  });
  
  // Save files
  const siteDir = path.join(process.cwd(), 'generated-sites', submissionId);
  
  // Ensure directory exists
  if (!fs.existsSync(siteDir)) {
    fs.mkdirSync(siteDir, { recursive: true });
  }
  
  // Write files
  for (const [filename, content] of Object.entries(generatedWebsite)) {
    const filePath = path.join(siteDir, filename);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`   ✅ ${filename} (${content.length.toLocaleString()} bytes)`);
  }
  
  console.log(`\n✨ Website regenerated successfully!`);
  console.log(`📁 Files saved to: ${siteDir}`);
  console.log(`🔗 Preview: http://localhost:3000/api/preview/${submissionId}`);
  
  await prisma.$disconnect();
}

regenerate().catch(console.error);
