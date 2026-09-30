/**
 * Image Export Service - Renders high resolution ad creative graphics using HTML Canvas
 * and handles direct PNG download.
 */
export function downloadAdCreativeAsPng({ productName, headline, callToAction, platform, imageUrl }) {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Standard 1080x1080 high-res square post format
      canvas.width = 1080;
      canvas.height = 1080;

      // Draw Gradient Backdrop
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(0.5, '#1e1b4b');
      gradient.addColorStop(1, '#090d16');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1080);

      // Decorative lighting radial circles
      const glowGrad = ctx.createRadialGradient(540, 300, 50, 540, 300, 600);
      glowGrad.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, 1080, 1080);

      const mainImage = new Image();
      mainImage.crossOrigin = 'Anonymous';
      
      mainImage.onload = () => {
        // Draw image frame in upper center area
        const imgSize = 640;
        const imgX = (1080 - imgSize) / 2;
        const imgY = 100;

        // Shadow behind image
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetY = 15;

        // Rounded Image Frame
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(imgX, imgY, imgSize, imgSize, 24);
        ctx.clip();
        ctx.drawImage(mainImage, imgX, imgY, imgSize, imgSize);
        ctx.restore();

        ctx.shadowColor = 'transparent';

        // Brand Pill Badge
        ctx.fillStyle = 'rgba(99, 102, 241, 0.9)';
        ctx.beginPath();
        ctx.roundRect(imgX, imgY + imgSize - 50, 220, 44, 22);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText((platform || 'ADFORGE AI').toUpperCase(), imgX + 110, imgY + imgSize - 21);

        // Product Name Label
        ctx.textAlign = 'center';
        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 24px "Inter", sans-serif';
        ctx.fillText(productName ? productName.toUpperCase() : 'ADFORGE CREATIVE', 540, 780);

        // Headline Text (Wrap if long)
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 42px "Plus Jakarta Sans", sans-serif';
        const words = (headline || 'High-Converting Creative').split(' ');
        let line = '';
        let currentY = 835;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > 900 && n > 0) {
            ctx.fillText(line, 540, currentY);
            line = words[n] + ' ';
            currentY += 50;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 540, currentY);

        // CTA Button Graphic
        const btnW = 320;
        const btnH = 68;
        const btnX = (1080 - btnW) / 2;
        const btnY = Math.min(currentY + 35, 980);

        const btnGrad = ctx.createLinearGradient(btnX, btnY, btnX + btnW, btnY);
        btnGrad.addColorStop(0, '#6366f1');
        btnGrad.addColorStop(1, '#ec4899');
        ctx.fillStyle = btnGrad;

        ctx.beginPath();
        ctx.roundRect(btnX, btnY, btnW, btnH, 34);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(callToAction || 'Shop Now', 540, btnY + 43);

        // Export PNG
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${(productName || 'ad_creative').toLowerCase().replace(/\s+/g, '_')}_ad_creative.png`;
        link.href = dataUrl;
        link.click();
        resolve(true);
      };

      mainImage.onerror = () => {
        // Fallback if cross-origin image fails to load
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(headline || 'Ad Creative Generated', 540, 540);
        
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'ad_creative.png';
        link.href = dataUrl;
        link.click();
        resolve(true);
      };

      mainImage.src = imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
    } catch (err) {
      console.error('Image export failed:', err);
      reject(err);
    }
  });
}
