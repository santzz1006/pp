/* =========================================
   PESQUISA PREMIADA — checkout.js
   ========================================= */

"use strict";

/* ─── PRICING ─────────────────────────────── */
const PRICE_BASE = 27.90;
const PRICE_X2   = 15.00;
const PRICE_BONUS = 10.00;

/* ─── STATE ──────────────────────────────── */
const state = {
  addonX2: false,
  addonBonus: false,
  total: PRICE_BASE,
  formValid: false,
  pixExpireSeconds: 900, // 15 min
};

/* ─── DOM REFS ───────────────────────────── */
const dom = {
  countdownTimer: document.getElementById("countdownTimer"),
  addonX2: document.getElementById("addonX2"),
  addonBonus: document.getElementById("addonBonus"),
  addonX2Label: document.getElementById("addonX2Label"),
  addonBonusLabel: document.getElementById("addonBonusLabel"),
  rowX2: document.getElementById("rowX2"),
  rowBonus: document.getElementById("rowBonus"),
  totalPrice: document.getElementById("totalPrice"),
  fullName: document.getElementById("fullName"),
  email: document.getElementById("email"),
  cpf: document.getElementById("cpf"),
  nameError: document.getElementById("nameError"),
  emailError: document.getElementById("emailError"),
  cpfError: document.getElementById("cpfError"),
  finalizeBtn: document.getElementById("finalizeBtn"),
  btnLoading: document.getElementById("btnLoading"),
  btnText: document.querySelector(".btn-text"),
  formCard: document.getElementById("formCard"),
  pixCard: document.getElementById("pixCard"),
  pixAmountDisplay: document.getElementById("pixAmountDisplay"),
  pixCodeInput: document.getElementById("pixCodeInput"),
  copyBtn: document.getElementById("copyBtn"),
  copyIcon: document.getElementById("copyIcon"),
  copyText: document.getElementById("copyText"),
  pixExpireTimer: document.getElementById("pixExpireTimer"),
  notifStack: document.getElementById("notifStack"),
};

/* ─── HELPERS ────────────────────────────── */
function formatBRL(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function padTwo(n) {
  return String(n).padStart(2, "0");
}

/* ─── PRICE LOGIC ────────────────────────── */
function updatePrice() {
  let total = PRICE_BASE;
  if (state.addonX2) total += PRICE_X2;
  if (state.addonBonus) total += PRICE_BONUS;
  state.total = total;

  dom.totalPrice.textContent = formatBRL(total);

  // Animate flash
  dom.totalPrice.style.opacity = "0.4";
  setTimeout(() => { dom.totalPrice.style.opacity = "1"; }, 160);

  // Show/hide addon rows
  dom.rowX2.classList.toggle("hidden", !state.addonX2);
  dom.rowBonus.classList.toggle("hidden", !state.addonBonus);
}

/* ─── ADDON CHECKBOXES ───────────────────── */
function initAddons() {
  dom.addonX2.addEventListener("change", () => {
    state.addonX2 = dom.addonX2.checked;
    dom.addonX2Label.classList.toggle("checked", state.addonX2);
    updatePrice();
  });

  dom.addonBonus.addEventListener("change", () => {
    state.addonBonus = dom.addonBonus.checked;
    dom.addonBonusLabel.classList.toggle("checked", state.addonBonus);
    updatePrice();
  });

  // Clicking the label anywhere toggles checkbox
  [dom.addonX2Label, dom.addonBonusLabel].forEach((label) => {
    label.addEventListener("click", (e) => {
      if (e.target.tagName === "INPUT") return; // native handled
    });
  });
}

/* ─── VALIDATION ─────────────────────────── */
function validateEmail() {
  const val = dom.email.value.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid = regex.test(val);
  dom.email.classList.toggle("invalid", !valid && val !== "");
  dom.email.classList.toggle("valid", valid);
  dom.emailError.classList.toggle("hidden", valid || val === "");
  return valid;
}

function validateName() {
  const val = dom.fullName.value.trim();
  const valid = val.length >= 3 && val.includes(" ");
  dom.fullName.classList.toggle("invalid", !valid && val !== "");
  dom.fullName.classList.toggle("valid", valid);
  dom.nameError.classList.toggle("hidden", valid || val === "");
  return valid;
}

/**
 * Real CPF validation using digit-verification algorithm.
 */
function validateCPF() {
  let cpf = dom.cpf.value.replace(/\D/g, "");

  if (cpf.length !== 11) {
    showCPFError();
    return false;
  }

  // Reject all-same-digit CPFs (e.g. 111.111.111-11)
  if (/^(\d)\1+$/.test(cpf)) {
    showCPFError();
    return false;
  }

  // First digit verification
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf[9])) {
    showCPFError();
    return false;
  }

  // Second digit verification
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf[10])) {
    showCPFError();
    return false;
  }

  dom.cpf.classList.remove("invalid");
  dom.cpf.classList.add("valid");
  dom.cpfError.classList.add("hidden");
  return true;
}

function showCPFError() {
  const val = dom.cpf.value.trim();
  if (val === "") {
    dom.cpf.classList.remove("invalid");
    dom.cpfError.classList.add("hidden");
    return;
  }
  dom.cpf.classList.add("invalid");
  dom.cpf.classList.remove("valid");
  dom.cpfError.classList.remove("hidden");
}

/* CPF mask */
function maskCPF(value) {
  const digits = value.replace(/\D/g, "").substring(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

function checkFormValidity() {
  const valid = validateName() && validateEmail() && validateCPF();
  state.formValid = valid;
  dom.finalizeBtn.disabled = !valid;
  return valid;
}

function initFormValidation() {
  dom.fullName.addEventListener("blur", () => { validateName(); checkFormValidity(); });
  dom.email.addEventListener("blur", () => { validateEmail(); checkFormValidity(); });
  dom.cpf.addEventListener("blur", () => { validateCPF(); checkFormValidity(); });

  dom.fullName.addEventListener("input", () => {
    if (dom.fullName.classList.contains("invalid")) { validateName(); checkFormValidity(); }
  });
  dom.email.addEventListener("input", () => {
    if (dom.email.classList.contains("invalid")) { validateEmail(); checkFormValidity(); }
    checkFormValidity();
  });
  dom.cpf.addEventListener("input", () => {
    dom.cpf.value = maskCPF(dom.cpf.value);
    if (dom.cpf.classList.contains("invalid") || dom.cpf.value.length === 14) {
      validateCPF();
      checkFormValidity();
    }
  });
}

/* ─── PIX GENERATION ─────────────────────── */
/**
 * generatePixPayment()
 * Replace the simulated block below with a real API call.
 * Expected API response:
 *   { qrCodeImage: "base64...", pixCode: "00020126..." }
 */
async function generatePixPayment() {
  showLoading(true);

  try {
    // Agora o fetch aponta para o SEU mini-servidor, não para a Pagap
    const response = await fetch("/api/pix", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // APAGAMOS O x-api-key DAQUI! O Frontend não tem mais a chave.
      },
      body: JSON.stringify({
        amount: state.total,
        customer_name: dom.fullName.value.trim(),
        customer_email: dom.email.value.trim(),
        customer_document: dom.cpf.value.replace(/\D/g, ""),
        customer_phone: "11999999999", // Mantivemos o telefone fixo para evitar erro da Pagap
        items: [
          {
            name: "Acesso Pesquisa Premiada",
            quantity: 1,
            price: state.total,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || `Erro HTTP ${response.status}`);
    }

    const pixCode = data.pix_copy_paste || data.pix_qrcode;
    const qrImageSrc = data.pix_qrcode_image ? data.pix_qrcode_image : null;

    showLoading(false);
    displayPixPayment(pixCode, qrImageSrc);
  } catch (error) {
    console.error("[generatePixPayment] Erro ao gerar pagamento PIX:", error);
    showLoading(false);
    alert("Ocorreu um erro ao gerar o PIX. Por favor, verifique suas informações e tente novamente.");
  }
}

function generateFakeUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function fakeChecksum() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

function showLoading(loading) {
  dom.btnText.classList.toggle("hidden", loading);
  dom.btnLoading.classList.toggle("hidden", !loading);
  dom.finalizeBtn.disabled = loading;
}

function displayPixPayment(pixCode, qrImageSrc) {
  dom.pixCodeInput.value = pixCode;
  dom.pixAmountDisplay.textContent = formatBRL(state.total);

  // If real QR image available, render it
  if (qrImageSrc) {
    const qrWrap = document.getElementById("qrCodeWrap");
    qrWrap.innerHTML = `<img src="${qrImageSrc}" alt="QR Code PIX" style="width:100%;height:100%;object-fit:contain;border-radius:8px;" />`;
  }

  dom.formCard.classList.add("hidden");
  dom.pixCard.classList.remove("hidden");
  dom.pixCard.scrollIntoView({ behavior: "smooth", block: "start" });

  startPixExpireTimer();
}

/* ─── COPY PIX CODE ──────────────────────── */
function initCopyButton() {
  dom.copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(dom.pixCodeInput.value);
      dom.copyIcon.className = "ri-check-line";
      dom.copyText.textContent = "Copiado!";
      dom.copyBtn.classList.add("copied");
      setTimeout(() => {
        dom.copyIcon.className = "ri-file-copy-line";
        dom.copyText.textContent = "Copiar";
        dom.copyBtn.classList.remove("copied");
      }, 2500);
    } catch {
      // Fallback
      dom.pixCodeInput.select();
      document.execCommand("copy");
    }
  });
}

/* ─── COUNTDOWN TIMER ────────────────────── */
function startCountdown() {
  let seconds = 10 * 60; // 10 minutes

  function tick() {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    dom.countdownTimer.textContent = `${padTwo(m)}:${padTwo(s)}`;

    if (seconds <= 60) dom.countdownTimer.classList.add("urgent");
    else dom.countdownTimer.classList.remove("urgent");

    if (seconds <= 0) {
      dom.countdownTimer.textContent = "00:00";
      return;
    }
    seconds--;
    setTimeout(tick, 1000);
  }

  tick();
}

/* ─── PIX EXPIRE TIMER ───────────────────── */
function startPixExpireTimer() {
  state.pixExpireSeconds = 900;

  function tick() {
    const m = Math.floor(state.pixExpireSeconds / 60);
    const s = state.pixExpireSeconds % 60;
    dom.pixExpireTimer.textContent = `${padTwo(m)}:${padTwo(s)}`;

    if (state.pixExpireSeconds <= 0) {
      dom.pixExpireTimer.textContent = "Expirado";
      return;
    }
    state.pixExpireSeconds--;
    setTimeout(tick, 1000);
  }

  tick();
}

/* ─── LIVE NOTIFICATIONS ─────────────────── */
const notifData = [
  { name: "Carlos M.", action: "acabou de ativar e sacou", value: "R$200" },
  { name: "Ana Lima", action: "recebeu", value: "R$350 em avaliações" },
  { name: "João P.", action: "sacou", value: "R$150 via Pix" },
  { name: "Mariana S.", action: "acabou de ativar e ganhou", value: "R$425" },
  { name: "Rafael G.", action: "sacou", value: "R$300 via Pix" },
  { name: "Fernanda T.", action: "recebeu", value: "R$180 em avaliações" },
  { name: "Lucas B.", action: "acabou de ativar e sacou", value: "R$500" },
  { name: "Camila R.", action: "recebeu", value: "R$270" },
  { name: "Marcos P.", action: "sacou", value: "R$310,00", via: "via Pix" },
  { name: "Letícia Silva", action: "recebeu", value: "R$125,50", via: "em avaliações" },
  { name: "Bruno K.", action: "completou", value: "5 avaliações", via: "e recebeu bônus" },
  { name: "Amanda T.", action: "sacou", value: "R$480,25", via: "via Pix" },
  { name: "Roberto C.", action: "recebeu", value: "R$210,00", via: "em avaliações" },
  { name: "Júlia F.", action: "atingiu", value: "a meta", via: "e sacou R$350" },
  { name: "Gabriel M.", action: "sacou", value: "R$195,00", via: "via Pix" },
  { name: "Bianca R.", action: "recebeu", value: "R$340,80", via: "em avaliações" },
  { name: "Victor S.", action: "completou", value: "10 avaliações", via: "e desbloqueou saque" },
  { name: "Camila V.", action: "sacou", value: "R$520,00", via: "via Pix" },
  { name: "Leonardo D.", action: "recebeu", value: "R$175,00", via: "em avaliações" },
  { name: "Isabela M.", action: "sacou", value: "R$265,40", via: "via Pix" },
  { name: "Felipe N.", action: "completou", value: "5 avaliações", via: "e recebeu bônus" },
  { name: "Larissa P.", action: "recebeu", value: "R$410,00", via: "em avaliações" },
  { name: "Ricardo Alves", action: "sacou", value: "R$630,00", via: "via Pix" },
  { name: "Tatiane S.", action: "atingiu", value: "a meta", via: "e sacou R$400" },
  { name: "Eduardo K.", action: "recebeu", value: "R$290,50", via: "em avaliações" },
  { name: "Priscila O.", action: "sacou", value: "R$145,00", via: "via Pix" },
  { name: "Vinícius R.", action: "completou", value: "10 avaliações", via: "e desbloqueou saque" },
  { name: "Carolina B.", action: "recebeu", value: "R$380,20", via: "em avaliações" },
  { name: "Daniel F.", action: "sacou", value: "R$415,00", via: "via Pix" },
  { name: "Aline G.", action: "recebeu", value: "R$155,75", via: "em avaliações" },
  { name: "Marcelo T.", action: "atingiu", value: "a meta", via: "e sacou R$600" },
  { name: "Renata L.", action: "sacou", value: "R$275,00", via: "via Pix" },
  { name: "Igor M.", action: "completou", value: "5 avaliações", via: "e recebeu bônus" },
  { name: "Sabrina C.", action: "recebeu", value: "R$490,00", via: "em avaliações" },
  { name: "Tiago V.", action: "sacou", value: "R$335,80", via: "via Pix" },
  { name: "Nathalia S.", action: "recebeu", value: "R$225,40", via: "em avaliações" },
  { name: "Alexandre P.", action: "completou", value: "10 avaliações", via: "e desbloqueou saque" },
  { name: "Flávia N.", action: "sacou", value: "R$540,00", via: "via Pix" },
  { name: "Gustavo B.", action: "atingiu", value: "a meta", via: "e sacou R$450" },
  { name: "Luiza M.", action: "recebeu", value: "R$198,00", via: "em avaliações" },
  { name: "Matheus R.", action: "sacou", value: "R$250,50", via: "via Pix" },
  { name: "Bruna F.", action: "completou", value: "5 avaliações", via: "e recebeu bônus" },
  { name: "Pedro H.", action: "recebeu", value: "R$315,00", via: "em avaliações" },
  { name: "Jessica T.", action: "sacou", value: "R$180,00", via: "via Pix" },
  { name: "Caio S.", action: "atingiu", value: "a meta", via: "e sacou R$700" },
  { name: "Mayara L.", action: "recebeu", value: "R$440,25", via: "em avaliações" },
  { name: "Henrique O.", action: "sacou", value: "R$395,00", via: "via Pix" },
  { name: "Raquel M.", action: "completou", value: "10 avaliações", via: "e desbloqueou saque" },
  { name: "Samuel V.", action: "recebeu", value: "R$260,80", via: "em avaliações" },
  { name: "Letícia B.", action: "sacou", value: "R$510,00", via: "via Pix" },
  { name: "Vitor G.", action: "completou", value: "5 avaliações", via: "e recebeu bônus" },
  { name: "Bárbara N.", action: "recebeu", value: "R$135,50", via: "em avaliações" },
  { name: "Arthur C.", action: "sacou", value: "R$285,00", via: "via Pix" },
  { name: "Mariana P.", action: "atingiu", value: "a meta", via: "e sacou R$380" },
  { name: "Lucas F.", action: "recebeu", value: "R$370,00", via: "em avaliações" },
  { name: "Talita S.", action: "sacou", value: "R$460,00", via: "via Pix" },
  { name: "João V.", action: "completou", value: "10 avaliações", via: "e desbloqueou saque" },
  { name: "Fernanda L.", action: "recebeu", value: "R$205,75", via: "em avaliações" },
  { name: "Guilherme R.", action: "sacou", value: "R$155,00", via: "via Pix" },
  { name: "Amanda M.", action: "atingiu", value: "a meta", via: "e sacou R$800" },
  { name: "Rafael C.", action: "recebeu", value: "R$425,00", via: "em avaliações" },
  { name: "Thais F.", action: "sacou", value: "R$345,50", via: "via Pix" },
  { name: "Thiago S.", action: "completou", value: "5 avaliações", via: "e recebeu bônus" },
  { name: "Milena R.", action: "recebeu", value: "R$295,00", via: "em avaliações" },
  { name: "Diego T.", action: "sacou", value: "R$580,00", via: "via Pix" },
  { name: "Gabriela O.", action: "atingiu", value: "a meta", via: "e sacou R$420" },
  { name: "Rodrigo B.", action: "recebeu", value: "R$185,25", via: "em avaliações" },
  { name: "Camila N.", action: "sacou", value: "R$240,00", via: "via Pix" },
  { name: "Leandro P.", action: "completou", value: "10 avaliações", via: "e desbloqueou saque" },
  { name: "Juliana M.", action: "recebeu", value: "R$365,80", via: "em avaliações" },
  { name: "Carlos F.", action: "sacou", value: "R$475,00", via: "via Pix" },
  { name: "Luana V.", action: "atingiu", value: "a meta", via: "e sacou R$550" },
  { name: "Marcelo S.", action: "recebeu", value: "R$140,50", via: "em avaliações" },
  { name: "Aline T.", action: "sacou", value: "R$325,00", via: "via Pix" },
  { name: "Fábio R.", action: "completou", value: "5 avaliações", via: "e recebeu bônus" },
  { name: "Tatiana C.", action: "recebeu", value: "R$455,00", via: "em avaliações" },
  { name: "Bruno M.", action: "sacou", value: "R$170,00", via: "via Pix" },
  { name: "Carolina S.", action: "atingiu", value: "a meta", via: "e sacou R$300" },
  { name: "Eduardo L.", action: "recebeu", value: "R$280,25", via: "em avaliações" },
  { name: "Isabella G.", action: "sacou", value: "R$505,00", via: "via Pix" },
  { name: "Victor H.", action: "completou", value: "10 avaliações", via: "e desbloqueou saque" },
  { name: "Larissa N.", action: "recebeu", value: "R$215,80", via: "em avaliações" },
  { name: "Fernando O.", action: "sacou", value: "R$390,00", via: "via Pix" },
  { name: "Natália P.", action: "atingiu", value: "a meta", via: "e sacou R$650" },
  { name: "Daniel C.", action: "recebeu", value: "R$330,00", via: "em avaliações" },
  { name: "Beatriz M.", action: "sacou", value: "R$165,50", via: "via Pix" },
  { name: "Marcos V.", action: "completou", value: "5 avaliações", via: "e recebeu bônus" },
  { name: "Priscila T.", action: "recebeu", value: "R$485,00", via: "em avaliações" },
  { name: "Renato S.", action: "sacou", value: "R$295,00", via: "via Pix" },
  { name: "Silvia R.", action: "atingiu", value: "a meta", via: "e sacou R$480" },
  { name: "Gustavo L.", action: "recebeu", value: "R$150,25", via: "em avaliações" },
  { name: "Marina B.", action: "sacou", value: "R$435,00", via: "via Pix" },
  { name: "Alex F.", action: "completou", value: "10 avaliações", via: "e desbloqueou saque" },
  { name: "Bruna C.", action: "recebeu", value: "R$355,80", via: "em avaliações" },
  { name: "Lucas O.", action: "sacou", value: "R$220,00", via: "via Pix" },
  { name: "Jessica S.", action: "atingiu", value: "a meta", via: "e sacou R$390" },
  { name: "Pedro M.", action: "recebeu", value: "R$270,50", via: "em avaliações" },
  { name: "Amanda F.", action: "sacou", value: "R$530,00", via: "via Pix" },
  { name: "Tiago R.", action: "completou", value: "5 avaliações", via: "e recebeu bônus" },
  { name: "Vanessa V.", action: "recebeu", value: "R$190,00", via: "em avaliações" },
  { name: "André P.", action: "sacou", value: "R$360,00", via: "via Pix" },
  { name: "Letícia C.", action: "atingiu", value: "a meta", via: "e sacou R$750" },
  { name: "Matheus N.", action: "recebeu", value: "R$405,25", via: "em avaliações" },
  { name: "Camila L.", action: "sacou", value: "R$130,00", via: "via Pix" },
  { name: "Felipe T.", action: "completou", value: "10 avaliações", via: "e desbloqueou saque" },
  { name: "Juliana R.", action: "recebeu", value: "R$245,80", via: "em avaliações" },
  { name: "Guilherme O.", action: "sacou", value: "R$465,00", via: "via Pix" },
  { name: "Ana P.", action: "atingiu", value: "a meta", via: "e sacou R$500" }
];

let notifIndex = 0;

function showNotifications() {
  function fire() {
    const data = notifData[notifIndex % notifData.length];
    notifIndex++;

    const el = document.createElement("div");
    el.className = "notif";
    el.innerHTML = `
      <div class="notif-icon"><i class="ri-user-line"></i></div>
      <p class="notif-text"><strong>${data.name}</strong> ${data.action} <strong>${data.value}</strong></p>
    `;
    dom.notifStack.appendChild(el);

    setTimeout(() => {
      el.classList.add("out");
      setTimeout(() => el.remove(), 350);
    }, 4500);

    setTimeout(fire, 5500);
  }

  setTimeout(fire, 3000);
}

/* ─── FINALIZE BUTTON ────────────────────── */
function initFinalizeButton() {
  dom.finalizeBtn.addEventListener("click", () => {
    if (!checkFormValidity()) return;
    generatePixPayment();
  });
}

/* ─── TRANSPARENCY MODAL ─────────────────── */
function initTransparencyModal() {
  const overlay = document.getElementById("transpOverlay");
  const closeBtn = document.getElementById("transpClose");

  // Show after 500ms
  setTimeout(() => {
    overlay.classList.add("show");
  }, 500);

  // Close on button click
  closeBtn.addEventListener("click", () => {
    overlay.classList.remove("show");
  });

  // Close on overlay backdrop click (outside modal)
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("show");
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("show")) {
      overlay.classList.remove("show");
    }
  });
}

/* ─── INIT ───────────────────────────────── */
function init() {
  updatePrice();
  initAddons();
  initFormValidation();
  initFinalizeButton();
  initCopyButton();
  startCountdown();
  showNotifications();
  initTransparencyModal();
}

document.addEventListener("DOMContentLoaded", init);
