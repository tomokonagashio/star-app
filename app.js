// 七宗町神渕の座標
const LAT = 35.5775;
const LON = 137.0748;

// 現在時刻の更新
function updateTime() {
  const now = new Date();
  const timeStr = now.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  document.getElementById('current-time').textContent = timeStr;
}

// 月の満ち欠け計算
function getMoonPhase() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  let y = year;
  let m = month;
  if (m < 3) { y--; m += 12; }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) +
              Math.floor(30.6001 * (m + 1)) +
              day + b - 1524.5;
  const daysSinceNew = (jd - 2451549.5) % 29.53058867;
  const phase = daysSinceNew < 0
    ? daysSinceNew + 29.53058867
    : daysSinceNew;

  let phaseName = '';
  let phaseEmoji = '';

  if (phase < 1.85) {
    phaseName = '新月'; phaseEmoji = '🌑';
  } else if (phase < 7.38) {
    phaseName = '三日月'; phaseEmoji = '🌒';
  } else if (phase < 9.22) {
    phaseName = '上弦の月'; phaseEmoji = '🌓';
  } else if (phase < 14.77) {
    phaseName = '十三夜'; phaseEmoji = '🌔';
  } else if (phase < 16.61) {
    phaseName = '満月'; phaseEmoji = '🌕';
  } else if (phase < 22.15) {
    phaseName = '十六夜'; phaseEmoji = '🌖';
  } else if (phase < 23.99) {
    phaseName = '下弦の月'; phaseEmoji = '🌗';
  } else if (phase < 29.53) {
    phaseName = '有明月'; phaseEmoji = '🌘';
  }

  const illumination = Math.round(
    50 * (1 - Math.cos((phase / 29.53058867) * 2 * Math.PI))
  );

  document.getElementById('moon-phase').textContent =
    `${phaseEmoji} ${phaseName}（照度: 約${illumination}%）`;

  return { phase, illumination };
}

// 日の出・日の入り計算
function getSunTimes() {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now - new Date(now.getFullYear(), 0, 0)) / 86400000
  );

  const declination = -23.45 * Math.cos(
    (2 * Math.PI / 365) * (dayOfYear + 10)
  );
  const latRad = LAT * Math.PI / 180;
  const decRad = declination * Math.PI / 180;

  const hourAngle = Math.acos(
    -Math.tan(latRad) * Math.tan(decRad)
  ) * 180 / Math.PI;

  const sunrise = 12 - hourAngle / 15 + (LON - 135) / 15;
  const sunset  = 12 + hourAngle / 15 + (LON - 135) / 15;

  const toTimeStr = (h) => {
    const hh = Math.floor(h);
    const mm = Math.round((h - hh) * 60);
    return `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
  };

  document.getElementById('sunrise').textContent =
    `☀️ 日の出: ${toTimeStr(sunrise)}`;
  document.getElementById('sunset').textContent =
    `🌇 日の入り: ${toTimeStr(sunset)}`;
}

// 今夜のおすすめ天体
function getStarList() {
  const month = new Date().getMonth() + 1;
  const starsByMonth = {
    1:  ['オリオン座 ⭐ 冬の代表星座', 'おうし座（プレアデス星団）', 'ふたご座', 'カシオペヤ座', '冬の大三角（ベテルギウス・シリウス・プロキオン）'],
    2:  ['オリオン座 ⭐ 最も見やすい時期', 'おおいぬ座（シリウス）', '冬の大三角', 'ふたご座', 'こいぬ座'],
    3:  ['しし座（登ってくる）', 'オリオン座（西へ沈む）', 'おとめ座', '冬の大三角（まだ見える）', 'うみへび座'],
    4:  ['しし座 ⭐ 春の主役', 'おとめ座（スピカ）', 'うしかい座（アークトゥルス）', '春の大曲線', 'からす座'],
    5:  ['おとめ座（スピカ）', 'うしかい座', 'かんむり座', '春の大三角', 'りょうけん座'],
    6:  ['さそり座 ⭐ 夏の見どころ', '春の大三角（まだ見える）', 'ヘルクレス座', 'へびつかい座', '天の川（見え始め）'],
    7:  ['さそり座 ⭐ 最も見やすい時期', '夏の大三角（ベガ・デネブ・アルタイル）', '天の川 ⭐ 最高の季節', 'いて座（天の川の中心方向）', 'へびつかい座'],
    8:  ['夏の大三角 ⭐', '天の川 ⭐ 絶好の観測期', 'さそり座', 'いて座', 'ペルセウス座流星群（8月中旬）🌠'],
    9:  ['夏の大三角（まだ見える）', '秋の四辺形（ペガスス座）', 'アンドロメダ銀河 🌌', '天の川（秋口まで）', 'みずがめ座'],
    10: ['ペガスス座', 'アンドロメダ銀河 🌌', 'カシオペヤ座', 'おひつじ座', 'ふたご座（夜明け前）'],
    11: ['カシオペヤ座 ⭐', 'アンドロメダ銀河 🌌', 'ペルセウス座', 'おうし座（プレアデス）', 'オリオン座（夜半過ぎ）'],
    12: ['オリオン座（登ってくる）', 'おうし座（プレアデス）', 'カシオペヤ座', 'ふたご座流星群（12月中旬）🌠', '冬の大三角'],
  };

  const stars = starsByMonth[month] || ['季節の星座をお楽しみください'];
  const ul = document.getElementById('star-list');
  ul.innerHTML = '';
  stars.forEach(star => {
    const li = document.createElement('li');
    li.textContent = '✨ ' + star;
    ul.appendChild(li);
  });
}

// 観測のヒント
function getObservationTip() {
  const { illumination } = getMoonPhase();
  let tip = '';

  if (illumination < 25) {
    tip = '🌑 月が暗く、絶好の星空観測日和です！天の川もよく見えるかも。';
  } else if (illumination < 50) {
    tip = '🌒 月明かりは少なめ。明るい星や星座はよく見えます。';
  } else if (illumination < 75) {
    tip = '🌔 月が明るめです。月が沈む深夜以降が観測のチャンス！';
  } else {
    tip = '🌕 満月に近く月が明るいです。月の観察に最適な夜です！';
  }

  tip += '\n\n📍 七宗町は光害が少なく、条件が良ければ天の川も見えます！';
  document.getElementById('observation-tip').textContent = tip;
}

// 月の出・月の入り
function getMoonRiseSet() {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now - new Date(now.getFullYear(), 0, 0)) / 86400000
  );
  const moonAge = (dayOfYear % 29.53);
  const moonRise = (moonAge / 29.53) * 24;
  const moonSet  = (moonRise + 12) % 24;

  const toTimeStr = (h) => {
    const hh = Math.floor(h) % 24;
    const mm = Math.round((h - Math.floor(h)) * 60);
    return `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
  };

  document.getElementById('moon-rise').textContent =
    `🌙 月の出: ${toTimeStr(moonRise)}（概算）`;
  document.getElementById('moon-set').textContent =
    `🌛 月の入り: ${toTimeStr(moonSet)}（概算）`;
}

// 簡易AR機能
function startAR() {
  // iOSの場合は許可が必要
  if (window.DeviceOrientationEvent) {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13以上
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            activateAR();
          } else {
            alert('モーションセンサーの許可が必要です。\n設定→Safari→モーションと画面の向きをオンにしてください。');
          }
        })
        .catch(error => {
          // ユーザーのジェスチャーが必要なためリトライ
          alert('もう一度「ARを起動する」をタップしてください。');
        });
    } else {
      // Android等
      activateAR();
    }
  } else {
    alert('このデバイスはARに対応していません。');
  }
}

function activateAR() {
  document.getElementById('ar-display').style.display = 'block';
  document.getElementById('ar-btn').textContent = '🔴 AR起動中';
  document.getElementById('ar-btn').style.background =
    'linear-gradient(135deg, #ff6b6b, #ee5a24)';
  window.addEventListener('deviceorientation', handleOrientation, true);
}

// 方角を文字に変換
function getDirectionName(alpha) {
  if (alpha === null || alpha === undefined) return '--';
  const dirs = ['北','北北東','北東','東北東','東','東南東','南東','南南東',
                 '南','南南西','南西','西南西','西','西北西','北西','北北西'];
  const index = Math.round(alpha / 22.5) % 16;
  return dirs[index];
}

// 方角と仰角から星座を推定
function getConstellation(direction, altitude) {
  const month = new Date().getMonth() + 1;

  if (altitude > 60) {
    return '天頂付近 ✨ 頭上の星座を探してみよう！';
  }

  if (direction === '南' || direction === '南南東' || direction === '南南西') {
    if (month >= 6 && month <= 8) return '🦂 さそり座（南の空）';
    if (month >= 9 && month <= 11) return '♑ やぎ座（南の空）';
    if (month >= 12 || month <= 2) return '🐂 おうし座（南の空）';
    if (month >= 3 && month <= 5) return '♍ おとめ座（南の空）';
  }

  if (direction === '東' || direction === '東南東' || direction === '東北東') {
    if (month >= 6 && month <= 8) return '🦅 わし座・アルタイル（東の空）';
    if (month >= 9 && month <= 11) return '🐟 うお座（東の空）';
    if (month >= 12 || month <= 2) return '♊ ふたご座（東の空）';
    if (month >= 3 && month <= 5) return '🦁 しし座（東の空）';
  }

  if (direction === '西' || direction === '西南西' || direction === '西北西') {
    if (month >= 6 && month <= 8) return '🌸 うしかい座（西の空）';
    if (month >= 9 && month <= 11) return '🦁 しし座（西の空）';
    if (month >= 12 || month <= 2) return '🦅 わし座（西の空）';
    if (month >= 3 && month <= 5) return '♊ ふたご座（西の空）';
  }

  if (direction === '北' || direction === '北北東' || direction === '北北西') {
    return '⭐ カシオペヤ座・北極星（北の空）';
  }

  return '✨ スマホをゆっくり動かしてみてください！';
}

// センサーの値を処理
function handleOrientation(event) {
  const alpha = event.alpha;
  const beta  = event.beta;

  const direction = getDirectionName(alpha);
  const altitude  = Math.round(Math.abs(beta));
  const constellation = getConstellation(direction, altitude);

  document.getElementById('ar-direction').textContent =
    `🧭 方角: ${direction}（${Math.round(alpha)}°）`;
  document.getElementById('ar-altitude').textContent =
    `📐 仰角: ${altitude}°`;
  document.getElementById('ar-constellation').textContent =
    constellation;
}

// 初期化
function init() {
  updateTime();
  getMoonPhase();
  getSunTimes();
  getStarList();
  getObservationTip();
  getMoonRiseSet();

  // 1秒ごとに時刻更新
  setInterval(updateTime, 1000);
}

window.onload = init;
