document.addEventListener("DOMContentLoaded", () => {
  const gradients = [
    { name: "Cornflower Breeze", chance: 28, image: "cornflower.png" },
    { name: "Tropic Rise", chance: 15, image: "tropic.png" },
    { name: "Cyanide Frost", chance: 14, image: "cyanide.png" },
    { name: "Nautic Frost", chance: 13, image: "nautic.png" },
    { name: "Icestone", chance: 8, image: "icestone.png" },
    { name: "Dakratade", chance: 8, image: "dakratade.png" },
    { name: "Ember Ashes", chance: 5, image: "ember.png" },
    { name: "Gummy Worm", chance: 5, image: "gummy.png" },
    { name: "Eclipse", chance: 2.5, image: "eclipse.png" }
  ];

  const infinityEye = { name: "Infinity Eye", image: "infinity.png" };
  const eternalRay = { name: "Eternal Ray", image: "eternal.png" };

  let totalPacksOpened = 0;
  let revealedCards = [];
  let claimedEternalRay = false;
  let hasInfinityEye = false;
  let eclipseCount = 0;

  const usedCodes = new Set();
  let prototypeActiveUntil = null;
  let fulleclipseNext = false;
  let eternaleyePending = false;

  const openBtn = document.getElementById("openBtn");
  const codeBtn = document.getElementById("codeBtn");
  const codeInput = document.getElementById("codeInput");
  const overlay = document.getElementById("ripOverlay");
  const wrapper = document.getElementById("packWrapper");

  openBtn.onclick = openPack;
  codeBtn.onclick = applyCode;

  function rollGradient() {
    const eclipseBoost = prototypeActiveUntil && Date.now() < prototypeActiveUntil ? 2 : 1;
    const adjustedGradients = gradients.map(g => {
      return g.name === "Eclipse" ? { ...g, chance: g.chance * eclipseBoost } : g;
    });

    const totalChance = adjustedGradients.reduce((sum, g) => sum + g.chance, 0);
    const rand = Math.random() * totalChance;
    let cumulative = 0;
    for (let g of adjustedGradients) {
      cumulative += g.chance;
      if (rand < cumulative) return g;
    }
    return adjustedGradients[0];
  }

  function spinForInfinityEye() {
    if (totalPacksOpened < 3) return null;
    let chance = 0.01;
    if (prototypeActiveUntil && Date.now() < prototypeActiveUntil) chance *= 2;
    return totalPacksOpened % 5 === 0 && Math.random() < chance ? infinityEye : null;
  }

  function openPack() {
    totalPacksOpened++;
    overlay.classList.remove("hidden");
    wrapper.innerHTML = "";
    wrapper.classList.add("hidden");
    revealedCards = [];

    setTimeout(() => {
      overlay.classList.add("hidden");
      const pack = [];

      for (let i = 0; i < 7; i++) {
        let card;
        if (fulleclipseNext) {
          card = gradients.find(g => g.name === "Eclipse");
          fulleclipseNext = false;
        } else {
          card = rollGradient();
        }

        if (card.name === "Eclipse") eclipseCount++;
        if (card.name === "Infinity Eye") hasInfinityEye = true;

        pack.push(card);
      }

      const special = spinForInfinityEye();
      if (special) {
        pack.push(special);
        hasInfinityEye = true;
      }

      if (eternaleyePending && Math.random() < 0.001) {
        pack.push(infinityEye);
        pack.push(eternalRay);
        claimedEternalRay = true;
        hasInfinityEye = true;
        eternaleyePending = false;
      }

      revealedCards = pack;
      displayFullPack();
      checkEternalRayUnlock();
    }, 1500);
  }

  function displayFullPack() {
    wrapper.classList.remove("hidden");
    revealedCards.forEach(card => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<img src="${card.image}" alt="${card.name}" />`;
      wrapper.appendChild(div);
    });
  }

  function applyCode() {
    const code = codeInput.value.trim().toLowerCase();
    if (usedCodes.has(code)) {
      alert("Code already used.");
      return;
    }

    switch (code) {
      case "prototype":
        prototypeActiveUntil = Date.now() + 15 * 60 * 1000;
        alert("Prototype activated: Eclipse and Infinity Eye boosted for 15 minutes.");
        break;
      case "fulleclipse":
        fulleclipseNext = true;
        alert("Next pack will contain a guaranteed Eclipse.");
        break;
      case "eternaleye":
        eternaleyePending = true;
        alert("Eternal Eye activated: 0.1% chance to get Infinity Eye and Eternal Ray next pack.");
        break;
      default:
        alert("Invalid code.");
        return;
    }

    usedCodes.add(code);
    codeInput.value = "";
  }

  function checkEternalRayUnlock() {
    const claimBtnId = "claimEternalBtn";
    let claimBtn = document.getElementById(claimBtnId);

    if (hasInfinityEye && eclipseCount >= 2 && !claimedEternalRay) {
      if (!claimBtn) {
        claimBtn = document.createElement("button");
        claimBtn.id = claimBtnId;
        claimBtn.textContent = "Claim Eternal Ray";
        claimBtn.style.marginTop = "20px";
        claimBtn.onclick = () => {
          claimedEternalRay = true;
          showEternalRay();
          claimBtn.remove();
        };
        document.body.appendChild(claimBtn);
      }
    }
  }

  function showEternalRay() {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<img src="${eternalRay.image}" alt="${eternalRay.name}" />`;
    wrapper.appendChild(div);
  }
});
