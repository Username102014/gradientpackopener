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

  const bonusCards = [
    { name: "Smooth Atlas", chance: 2.5, image: "smooth.png" },
    { name: "Nautical Ember", chance: 5, image: "nauter.png" },
    { name: "Ecliptic Frost", chance: 3.5, image: "ecliff.png" },
    { name: "Lavender Wash", chance: 15, image: "lavender.png" },
    { name: "Aurora", chance: 20, image: "aurora.png" }
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
  let eternaleyeNextPack = false;
  let summervibesActiveUntil = null;
  let summervibesUses = 0;

  const openBtn = document.getElementById("openBtn");
  const codeBtn = document.getElementById("codeBtn");
  const codeInput = document.getElementById("codeInput");
  const overlay = document.getElementById("ripOverlay");
  const wrapper = document.getElementById("packWrapper");

  openBtn.onclick = openPack;
  codeBtn.onclick = applyCode;

  function rollGradient() {
    const eclipseBoost = prototypeActiveUntil && Date.now() < prototypeActiveUntil ? 2 : 1;
    let pool = gradients.map(g => {
      return g.name === "Eclipse" ? { ...g, chance: g.chance * eclipseBoost } : g;
    });

    if (summervibesActiveUntil && Date.now() < summervibesActiveUntil) {
      pool = pool.concat(bonusCards);
    }

    const totalChance = pool.reduce((sum, g) => sum + g.chance, 0);
    const rand = Math.random() * totalChance;
    let cumulative = 0;
    for (let g of pool) {
      cumulative += g.chance;
      if (rand < cumulative) return g;
    }
    return pool[0];
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

      if (eternaleyeNextPack) {
        pack.push(infinityEye);
        pack.push(eternalRay);
        claimedEternalRay = true;
        hasInfinityEye = true;
        eternaleyeNextPack = false;
      } else {
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

        // ✅ Updated Infinity Eye logic: 1% chance per pack
        const infinityEyeRoll = Math.random();
        if (infinityEyeRoll < 0.01) {
          pack.push(infinityEye);
          hasInfinityEye = true;
        }

        // Eternal Ray logic
        if (
          Math.random() < 0.001 ||
          (summervibesActiveUntil &&
            Date.now() < summervibesActiveUntil &&
            Math.random() < 0.0001)
        ) {
          pack.push(eternalRay);
          claimedEternalRay = true;
        }
      }

      revealedCards = pack;
      displayFullPack();
      checkEternalRayUnlock();
    }, 2000);
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

    if (code !== "summervibes" && usedCodes.has(code)) {
      alert("Code already used.");
      return;
    }

    switch (code) {
      case "prototype":
        prototypeActiveUntil = Date.now() + 15 * 60 * 1000;
        alert("Prototype activated: Eclipse and Infinity Eye boosted for 15 minutes.");
        usedCodes.add(code);
        break;
      case "fulleclipse":
        fulleclipseNext = true;
        alert("Next pack will contain a guaranteed Eclipse.");
        usedCodes.add(code);
        break;
      case "eternaleye":
        eternaleyeNextPack = true;
        alert("Next pack will contain ONLY Infinity Eye and Eternal Ray.");
        usedCodes.add(code);
        break;
      case "summervibes":
        if (summervibesUses >= 3) {
          alert("Summervibes code has already been used 3 times.");
          return;
        }
        summervibesUses++;
        summervibesActiveUntil = Date.now() + 10 * 60 * 1000;
        alert("Summervibes activated: Bonus cards and 0.01% Eternal Ray chance for 10 minutes.");
        break;
      default:
        alert("Invalid code.");
        return;
    }

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



