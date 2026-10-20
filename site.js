const APK_URL = 'https://expo.dev/accounts/kattote/projects/skillsync-mobile/builds/5601d4fb-cb7f-4b18-b3d8-79a79b1804ca';

// Refresh an older installed landing page when its new worker becomes active.
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  const hadController = Boolean(navigator.serviceWorker.controller);
  let refreshed = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController && !refreshed) {
      refreshed = true;
      location.reload();
    }
  });
  navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' })
    .then(registration => registration.update())
    .catch(() => {});
}

document.querySelectorAll('[data-apk-link]').forEach((link) => {
  link.href = APK_URL;
});

const qrImage = document.querySelector('#apkQr');
const qrLoading = document.querySelector('#qrLoading');
if (qrImage) {
  const qrUrl = new URL('https://api.qrserver.com/v1/create-qr-code/');
  qrUrl.search = new URLSearchParams({ size: '320x320', margin: '8', data: APK_URL });
  qrImage.src = qrUrl.toString();
  qrImage.addEventListener('load', () => { if (qrLoading) qrLoading.hidden = true; });
  qrImage.addEventListener('error', () => {
    if (qrLoading) qrLoading.textContent = 'A QR-kód most nem töltődött be. Használd a letöltési linket.';
  });
}

const toggle=document.querySelector('.menu-toggle');if(toggle){toggle.addEventListener('click',()=>{const nav=document.querySelector('.site-header nav');if(!nav)return;const open=nav.dataset.open==='true';nav.dataset.open=String(!open);nav.style.display=open?'none':'flex';nav.style.position='absolute';nav.style.top='60px';nav.style.right='18px';nav.style.zIndex='9';nav.style.padding='18px';nav.style.borderRadius='14px';nav.style.background='#fff';nav.style.boxShadow='0 10px 35px #3332';nav.style.alignItems='flex-start';nav.style.flexDirection='column';});}
