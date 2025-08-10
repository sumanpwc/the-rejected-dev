import cron from 'node-cron';
import { generateSitemapFile } from '../controllers/sitemapController';

export const startSitemapCron = () => {
  // Runs every day at 2:00 AM server time
  cron.schedule('0 2 * * *', async () => {
    console.log('⏰ Running scheduled sitemap update...');
    try {
      await generateSitemapFile();
      console.log('✅ Sitemap updated successfully by cron.');
    } catch (error) {
      console.error('❌ Sitemap cron job failed:', error);
    }
  });
};
