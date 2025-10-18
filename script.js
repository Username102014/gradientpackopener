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

      if (Math.random() < 0.01) {
        pack.push(infinityEye);
        hasInfinityEye = true;
      }

      if (Math.random() < 0.001 || (summervibesActiveUntil && Date.now() < summervibesActiveUntil && Math.random() < 0.0001)) {
        pack.push(eternalRay);
        claimedEternalRay = true;
      }
    }

    revealedCards = pack;
    displayFullPack();
    checkEternalRayUnlock();
  }, 2000); // 2-second overlay
}
