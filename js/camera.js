// Love in Lagos: "Take photo" camera for sign-up and the profile page.
// Opens the real camera (getUserMedia), shows a live preview, lets you retake, then sends the picture through the same
// readPh() as "Choose photo", so the image check, resizing and saving are exactly the same. If the camera is blocked or
// missing it says why and offers to choose a photo or use the phone's own camera app instead.
const CAM = { s: null, mode: "p", face: "user", shot: null };
const camOK = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) && window.isSecureContext !== false;
function camStop() { try { CAM.s && CAM.s.getTracks().forEach(t => t.stop()); } catch (e) {} CAM.s = null; }
function camClose() { camStop(); document.querySelectorAll(".camov").forEach(e => e.remove()); }
const camSt = t => { const e = document.getElementById("camst"); if (e) { e.textContent = t || ""; e.hidden = !t; } };
const camBtns = h => { const e = document.getElementById("camb"); if (e) e.innerHTML = h; };
function camOpen(mode) {
  camClose(); CAM.mode = mode; CAM.shot = null;
  const o = document.createElement("div"); o.className = "ov camov";
  o.innerHTML = `<div class="md camm"><button class="x" onclick="camClose()" aria-label="Close">✕</button><h2 class="at">Take a photo</h2><p class="sub as">Centre your face, then tap the round button.</p><div class="camv"><video id="camvid" autoplay playsinline muted></video><img id="camimg" alt="Your photo" hidden><div id="camst" class="camst">Starting camera…</div></div><div id="camb" class="camb"></div><input id="camf" type="file" accept="image/*" capture="user" hidden onchange="camFile(this)"></div>`;
  o.onclick = e => { if (e.target === o) camClose(); };
  document.body.appendChild(o); camStart();
}
function camFail(msg, noRetry) {
  camStop(); camSt(msg);
  camBtns(`<button class="btn o" onclick="camClose()">Close</button>${noRetry ? "" : '<button class="btn o" onclick="camStart()">Try again</button>'}<button class="btn o" onclick="document.getElementById(\'camf\').click()">📱 Use phone camera</button><button class="btn" onclick="camPick()">Choose a photo</button>`);
}
function camPick() { const m = CAM.mode; camClose(); const i = document.getElementById(m === "s" ? "phf" : "ppf"); if (i) i.click(); }
async function camStart() {
  const v = document.getElementById("camvid"); if (!v) return;
  document.getElementById("camimg").hidden = true; v.hidden = false; camBtns("");
  if (!camOK()) return camFail("The camera can't be opened in this browser or connection. You can use your phone's camera app or choose a photo instead.", 1);
  camSt("Starting camera… tap Allow if your browser asks.");
  try {
    camStop();
    const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: CAM.face, width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false });
    if (!document.getElementById("camvid")) { s.getTracks().forEach(t => t.stop()); return; } // closed while the permission box was open
    CAM.s = s; v.srcObject = s; v.classList.toggle("mir", CAM.face === "user");
    await v.play().catch(() => {}); camSt("");
    let multi = false; try { multi = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === "videoinput").length > 1; } catch (e) {}
    camBtns(`<button class="btn o" onclick="camClose()">Cancel</button><button class="btn shut" onclick="camSnap()" aria-label="Take photo"></button>${multi ? '<button class="btn o" onclick="camFlip()">🔄 Flip</button>' : ""}`);
  } catch (e) {
    const n = e && e.name;
    camFail(n === "NotAllowedError" || n === "SecurityError" ? "Camera permission was denied. Allow camera access for this site in your browser settings, then tap Try again."
      : n === "NotFoundError" || n === "OverconstrainedError" ? "No camera was found on this device."
      : n === "NotReadableError" ? "The camera is being used by another app. Close it and tap Try again."
      : "The camera couldn't start.");
  }
}
function camFlip() { CAM.face = CAM.face === "user" ? "environment" : "user"; camStart(); }
function camSnap() {
  const v = document.getElementById("camvid"); if (!v || !v.videoWidth) return toast("The camera isn't ready yet");
  const w = v.videoWidth, h = v.videoHeight, s = Math.min(w, h), c = document.createElement("canvas"); c.width = c.height = Math.min(s, 1024);
  const x = c.getContext("2d"); if (CAM.face === "user") { x.translate(c.width, 0); x.scale(-1, 1); } // match the mirrored preview
  x.drawImage(v, (w - s) / 2, (h - s) / 2, s, s, 0, 0, c.width, c.height);
  c.toBlob(b => {
    if (!b) return toast("Couldn't take the photo. Try again.");
    CAM.shot = new File([b], "camera.jpg", { type: "image/jpeg" });
    const im = document.getElementById("camimg"); im.src = URL.createObjectURL(b); im.hidden = false; v.hidden = true; camStop();
    camBtns('<button class="btn o" onclick="camStart()">↺ Retake</button><button class="btn" onclick="camUse()">Use this photo</button>');
  }, "image/jpeg", .92);
}
const camFile = el => readPh(el.files[0], camDone);
const camUse = () => { if (CAM.shot) readPh(CAM.shot, camDone); };
function camDone(d) {
  camClose();
  if (CAM.mode === "s") { phd = d; const e = document.getElementById("php"); if (e) e.innerHTML = `<img src="${d}" alt="">`; toast("Photo ready ✅"); }
  else api("PUT", "/me", { photo: d }).then(u => { me = u; render(1); toast("Photo saved ✅"); }).catch(e => toast(e.message));
}
