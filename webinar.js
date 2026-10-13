/* ============================================================
 * 設定區：只需要改這裡（步驟見「設定說明.md」）
 * ============================================================ */
const CONFIG = {
  // Microsoft Forms →「收集回應」→「內嵌」，複製 <iframe> 裡 src="..." 的網址貼在這裡
  MS_FORM_EMBED_URL: "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=I1jyGf8XH0KtTo_tA1rt2r7aBaEAIBFIs87qEHGEIsVUN09WRDk5RVMwWklUNTBKQ01GN0tQOVhaMS4u&embed=true",

  // 隱私權聲明網址；留空則報名區不顯示連結
  PRIVACY_URL: "",

  EVENT: {
    // 活動日期（頁面上顯示用）
    dateLabel: "Tue 3 Nov 2026"
  }
};

/* ============================================================ */
(function(){
  const $ = id => document.getElementById(id);

  if (CONFIG.EVENT.dateLabel) $("dateLabel").textContent = CONFIG.EVENT.dateLabel;

  // 隱私權聲明
  if (CONFIG.PRIVACY_URL) {
    $("privacyLink").href = CONFIG.PRIVACY_URL;
    $("privacyWrap").hidden = false;
  }

  // 報名表：桌機內嵌，手機用按鈕開新分頁（Microsoft Forms 在手機內嵌時只顯示封面）
  if (CONFIG.MS_FORM_EMBED_URL) {
    const direct = CONFIG.MS_FORM_EMBED_URL.replace(/([?&])embed=true&?/, "$1").replace(/[?&]$/, "");
    $("mFormLink").href = direct;
    $("formLink").href = direct;
    const mobile = window.matchMedia("(max-width: 920px)");
    const loadFrame = () => {
      const frame = $("msForm");
      if (mobile.matches || frame.src) return;
      const box = frame.parentElement;
      box.classList.add("loading");
      $("formEmpty").textContent = "Loading the registration form…";
      frame.addEventListener("load", () => { box.classList.remove("loading"); $("formEmpty").hidden = true; });
      frame.src = CONFIG.MS_FORM_EMBED_URL;
      frame.hidden = false;
      $("formAlt").hidden = false;
    };
    loadFrame();
    mobile.addEventListener("change", loadFrame);
  }

  // 手機底部報名列：主視覺按鈕捲出畫面後出現，報名區或結尾區在畫面內時隱藏
  const bar = $("mbar");
  if (bar && "IntersectionObserver" in window) {
    const btn = bar.querySelector("a");
    const watch = [document.querySelector(".hero .cta"), $("register"), document.querySelector(".endcta")].filter(Boolean);
    const visible = new Set();
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));
      const heroGone = watch[0] && !visible.has(watch[0]) && watch[0].getBoundingClientRect().top < 0;
      const show = heroGone && visible.size === 0;
      bar.classList.toggle("show", show);
      bar.setAttribute("aria-hidden", show ? "false" : "true");
      btn.tabIndex = show ? 0 : -1;
    });
    watch.forEach(el => io.observe(el));
  }
})();
