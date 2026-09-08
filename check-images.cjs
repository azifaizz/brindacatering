const https = require('https');

const urls = [
  "https://firebasestorage.googleapis.com/v0/b/brindhacaterings.firebasestorage.app/o/idly.png?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/brindhacaterings.firebasestorage.app/o/dosa.png?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/brindhacaterings.firebasestorage.app/o/masaldosa.png?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/brindhacaterings.firebasestorage.app/o/meduvada.png?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/brindhacaterings.firebasestorage.app/o/venpongal.png?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/brindhacaterings.firebasestorage.app/o/uthappam.png?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/brindhacaterings.firebasestorage.app/o/Paniyaram.png?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/brindhacaterings.firebasestorage.app/o/poorimasala.png?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/brindhacaterings.firebasestorage.app/o/Highlightswedding.png?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/brindhacaterings.firebasestorage.app/o/Highlightsfamily.png?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/brindhacaterings.firebasestorage.app/o/highlightscorporate.png?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/brindhacaterings.firebasestorage.app/o/highlightscustom.png?alt=media"
];

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (e) => {
      resolve({ url, status: 'Error: ' + e.message });
    });
  });
}

async function run() {
  for (const url of urls) {
    const res = await checkUrl(url);
    if (res.status !== 200) {
      console.log(`❌ BROKEN: ${res.status} - ${url.split('/o/')[1].split('?')[0]}`);
    } else {
      console.log(`✅ OK: ${url.split('/o/')[1].split('?')[0]}`);
    }
  }
}

run();
