/* ============================================================
 * 設定區：只需要改這裡（步驟見「設定說明.md」）
 * ============================================================ */
const CONFIG = {
  // Microsoft Forms →「收集回應」→「內嵌」，複製 <iframe> 裡 src="..." 的網址貼在這裡
  MS_FORM_EMBED_URL: "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=I1jyGf8XH0KtTo_tA1rt2r7aBaEAIBFIs87qEHGEIsVUN09WRDk5RVMwWklUNTBKQ01GN0tQOVhaMS4u&embed=true",

  EVENT: {
    title: "Closing the Hardware-Software Gap for ISO 50001-Ready Energy Management",
    // 活動日期確定後填入，例如 "Wednesday 21 October 2026"
    dateLabel: "Tue 27 Oct 2026",
    // 開始時間（UTC）。英國 08:00：10/25 前 → "T07:00:00Z"；10/25 後 → "T08:00:00Z"（新加坡會變 16:00）
    startUtc: "2026-10-27T08:00:00Z", // 英國 08:00 GMT ＝ 新加坡 16:00
    minutes: 45,
    // 官網是公開頁面，不放 Zoom 連結（避免未報名者直接進入）；連結只寫在 EDM 裡
    note: "Your Zoom joining link will be emailed to you the day before the session."
  }
};

/* ============================================================ */
(function(){
  const $ = id => document.getElementById(id);
  const E = CONFIG.EVENT;

  if (E.dateLabel) $("dateLabel").textContent = E.dateLabel;

  if (CONFIG.MS_FORM_EMBED_URL) {
    const frame = $("msForm"), box = frame.parentElement;
    box.classList.add("loading");
    $("formEmpty").textContent = "Loading the registration form…";
    frame.addEventListener("load", () => { box.classList.remove("loading"); $("formEmpty").hidden = true; });
    frame.src = CONFIG.MS_FORM_EMBED_URL;
    frame.hidden = false;
    // 備用連結：公司網路或瀏覽器擋住內嵌表單時，讓訪客另開新分頁填寫
    $("formLink").href = CONFIG.MS_FORM_EMBED_URL.replace(/([?&])embed=true&?/, "$1").replace(/[?&]$/, "");
    $("formAlt").hidden = false;
  }

  const start = E.startUtc ? new Date(E.startUtc) : null;
  if (!start || isNaN(start)) { $("calBtns").hidden = true; return; }
  const f = d => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const s0 = f(start), s1 = f(new Date(start.getTime() + E.minutes * 60000));
  $("gcal").href = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(E.title) +
    "&dates=" + s0 + "/" + s1 + "&details=" + encodeURIComponent(E.note);
  $("icsBtn").addEventListener("click", () => {
    const ics = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Delta//Webinar//EN","METHOD:PUBLISH","BEGIN:VEVENT",
      "UID:delta-verdantix-webinar-" + s0, "DTSTAMP:" + f(new Date()), "DTSTART:" + s0, "DTEND:" + s1,
      "SUMMARY:" + E.title.replace(/,/g, "\\,"), "DESCRIPTION:" + E.note, "LOCATION:Zoom",
      "BEGIN:VALARM","TRIGGER:-PT30M","ACTION:DISPLAY","DESCRIPTION:Webinar starts in 30 minutes","END:VALARM",
      "END:VEVENT","END:VCALENDAR"].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "delta-verdantix-webinar.ics"; document.body.append(a); a.click(); a.remove();
  });
})();
