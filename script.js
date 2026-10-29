const $ = id => document.getElementById(id);
const navMenu = $("navMenu");
$("menuToggle").addEventListener("click", () => navMenu.classList.toggle("open"));
navMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navMenu.classList.remove("open")));
$("year").textContent = new Date().getFullYear();

$("searchInput").addEventListener("input", () => {
 const q = $("searchInput").value.trim().toLowerCase(); let count = 0;
 document.querySelectorAll(".ekskul-card").forEach(card => { const ok = `${card.dataset.name} ${card.innerText}`.toLowerCase().includes(q); card.hidden = !ok; if(ok) count++; });
 $("emptyState").hidden = count !== 0;
});

const accounts = [];
for(let i=1;i<=5;i++) accounts.push({username:`siswa0${i}`,password:`EksploraS0${i}!`,role:"Siswa / Anggota",org:"Pramuka",name:`Siswa ${i}`});
const orgs = [{org:"Pramuka",key:"pramuka",pass:"Pra"},{org:"PMR",key:"pmr",pass:"PMR"},{org:"Paskibra",key:"paskibra",pass:"Pas"},{org:"Basket",key:"basket",pass:"Bas"},{org:"Seni Tari",key:"tari",pass:"Tar"},{org:"Bola Voli",key:"voli",pass:"Vol"}];
orgs.forEach(o=>{accounts.push({username:`ketua_${o.key}`,password:`Ketua${o.pass}01!`,role:"Ketua Ekstrakurikuler",org:o.org,name:`Ketua ${o.org}`});accounts.push({username:`pembina_${o.key}`,password:`Bina${o.pass}01!`,role:"Guru Pembina",org:o.org,name:`Pembina ${o.org}`});});
accounts.push({username:"admin_sekolah",password:"AdminEks01!",role:"Admin Sekolah",org:"Semua organisasi",name:"Admin Sekolah"},{username:"admin_operator",password:"Operator01!",role:"Admin Sekolah",org:"Semua organisasi",name:"Admin Operator"});
let accountNames={};
try { accountNames=JSON.parse(localStorage.getItem("eksploraAccountNames"))||{}; } catch(e) { accountNames={}; }
accounts.forEach(a=>{if(accountNames[a.username]) a.name=accountNames[a.username];});

const defaultData = {
 orgs:[
  {name:"Pramuka",category:"Kepemimpinan",quota:40,coach:"Pembina Pramuka",schedule:"Sabtu, 15.30 WITA",location:"Lapangan sekolah"},
  {name:"PMR",category:"Kemanusiaan",quota:30,coach:"Pembina PMR",schedule:"Jumat, 14.00 WITA",location:"Ruang UKS"},
  {name:"Paskibra",category:"Kedisiplinan",quota:30,coach:"Pembina Paskibra",schedule:"Rabu, 15.00 WITA",location:"Lapangan sekolah"},
  {name:"Basket",category:"Olahraga",quota:24,coach:"Pembina Basket",schedule:"Selasa, 15.30 WITA",location:"Lapangan basket"},
  {name:"Seni Tari",category:"Seni & Budaya",quota:25,coach:"Pembina Seni Tari",schedule:"Kamis, 15.00 WITA",location:"Aula sekolah"},
  {name:"Bola Voli",category:"Olahraga",quota:24,coach:"Pembina Bola Voli",schedule:"Senin, 15.30 WITA",location:"Lapangan voli"}
 ],
 members: accounts.filter(a=>a.role==="Siswa / Anggota").map((a,i)=>({name:a.name,username:a.username,kelas:`${i+1}A`,org:"Pramuka",status:"Diterima"})),
 registrations:[], attendance:[], announcements:[{title:"Selamat datang di EKSPLORA",message:"Silakan cek jadwal kegiatan dan informasi dari pembina.",org:"Semua organisasi",date:new Date().toISOString().slice(0,10)}],
 documentation:[], certificates:[]
};
function loadData(){try{return JSON.parse(localStorage.getItem("eksploraData"))||structuredClone(defaultData)}catch(e){return JSON.parse(JSON.stringify(defaultData))}}
let data=loadData(), currentUser=null, currentTab="Ringkasan";
function save(){localStorage.setItem("eksploraData",JSON.stringify(data))}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function openModal(role){$("modalBackdrop").hidden=false;$("loginFields").hidden=false;$("appDashboard").hidden=true;$("modalTitle").textContent=role?`Masuk sebagai ${role}`:"Masuk ke EKSPLORA";$("modalDescription").textContent=role?`Gunakan akun demo dengan peran ${role}.`:"Masukkan username dan kata sandi akun demo."; $("loginUsername").value="";$("loginPassword").value="";$("loginError").textContent="";$("accountList").hidden=true;$("loginUsername").focus()}
document.querySelectorAll(".role-card").forEach(b=>b.addEventListener("click",()=>openModal(b.dataset.role)));
document.querySelectorAll('a[href="#akses"]').forEach(a=>a.addEventListener("click",()=>{}));
function closeModal(){$("modalBackdrop").hidden=true}
$("modalClose").addEventListener("click",closeModal);
$("modalBackdrop").addEventListener("click",e=>{if(e.target===$("modalBackdrop"))closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});

$("showAccounts").addEventListener("click",()=>{
 const box=$("accountList");box.hidden=!box.hidden;
 if(!box.hidden) box.innerHTML=`<b>Akun demo tersedia</b><p>Username dan kata sandi di bawah hanya untuk demonstrasi.</p><div class="account-scroll">${accounts.map(a=>`<div class="account-line"><span><b>${esc(a.username)}</b><small>${esc(a.role)} · ${esc(a.org)}</small></span><button data-user="${esc(a.username)}" class="use-account">Pilih</button></div>`).join("")}</div>`;
 box.querySelectorAll(".use-account").forEach(btn=>btn.addEventListener("click",()=>{const a=accounts.find(x=>x.username===btn.dataset.user);$("loginUsername").value=a.username;$("loginPassword").value=a.password;$("loginError").textContent="";}));
});
$("loginButton").addEventListener("click",login);
$("loginPassword").addEventListener("keydown",e=>{if(e.key==="Enter")login()});
$("loginUsername").addEventListener("keydown",e=>{if(e.key==="Enter")login()});
function login(){
 const u=$("loginUsername").value.trim(),p=$("loginPassword").value;
 const a=accounts.find(x=>x.username===u&&x.password===p);
 if(!a){$("loginError").textContent="Username atau kata sandi tidak sesuai. Coba pilih akun demo.";return}
 currentUser=a;$("loginFields").hidden=true;$("appDashboard").hidden=false;$("modalTitle").textContent="Dashboard EKSPLORA";$("modalDescription").textContent="Kelola aktivitas ekstrakurikuler sesuai peranmu.";
 $("welcomeUser").textContent=`Halo, ${a.name}!`;$("userRoleLabel").textContent=`${a.role} · ${a.org}`;renderDashboard("Ringkasan");
}
$("switchAccount").addEventListener("click",()=>openModal());
function allowedOrgs(){return currentUser.role==="Admin Sekolah"?data.orgs.map(o=>o.name):[currentUser.org]}
function visibleMembers(){return currentUser.role==="Admin Sekolah"?data.members:data.members.filter(m=>m.org===currentUser.org)}
function renderDashboard(tab){
 currentTab=tab;const role=currentUser.role;
 let tabs=["Ringkasan","Jadwal","Pendaftaran","Presensi","Pengumuman","Anggota","Dokumentasi","Sertifikat","Laporan","Profil"];
 if(role==="Siswa / Anggota") tabs=["Ringkasan","Jadwal","Daftar Ekskul","Presensi Saya","Pengumuman","Profil","Dokumentasi","Sertifikat"];
 if(role==="Ketua Ekstrakurikuler") tabs=["Ringkasan","Jadwal","Anggota","Presensi","Pengumuman","Dokumentasi","Sertifikat","Laporan","Profil"];
 if(role==="Guru Pembina") tabs=["Ringkasan","Jadwal","Pendaftaran","Presensi","Pengumuman","Anggota","Dokumentasi","Sertifikat","Laporan","Profil"];
 $("dashboardNav").innerHTML=tabs.map(t=>`<button class="dash-tab ${t===tab?"active":""}" data-tab="${t}">${t}</button>`).join("");
 $("dashboardNav").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>renderDashboard(b.dataset.tab)));
 const content=$("dashboardContent");
 const orgs=data.orgs.filter(o=>allowedOrgs().includes(o.name));
 const members=visibleMembers();
 const canManage=["Admin Sekolah","Guru Pembina","Ketua Ekstrakurikuler"].includes(role);
 const admin=role==="Admin Sekolah",student=role==="Siswa / Anggota";
 let html="";
 if(tab==="Ringkasan"){
  html=`<div class="mini-stats"><div><b>${student?members.filter(m=>m.username===currentUser.username).length:members.length}</b><span>${student?"Profil anggota":"Anggota dalam cakupanmu"}</span></div><div><b>${orgs.length}</b><span>Organisasi</span></div><div><b>${data.registrations.filter(r=>orgs.some(o=>o.name===r.org)&&r.status==="Menunggu").length}</b><span>Pendaftaran menunggu</span></div><div><b>${data.announcements.filter(n=>n.org==="Semua organisasi"||orgs.some(o=>o.name===n.org)).length}</b><span>Pengumuman</span></div></div>
  <div class="dash-section-title"><h3>Jadwal kegiatan</h3><span>Informasi terbaru</span></div>${scheduleTable(orgs)}
  <div class="dash-section-title"><h3>Pengumuman terbaru</h3></div>${announcementList(orgs)}
  <div class="dash-section-title"><h3>Aksi cepat</h3></div><div class="quick-actions">${(student?["Daftar Ekskul","Jadwal","Profil"]:["Pendaftaran","Presensi","Pengumuman","Laporan"]).map(t=>`<button class="quick-btn" data-quick="${t}">${t} ↗</button>`).join("")}</div>`;
 } else if(tab==="Jadwal"){
  html=`<div class="dash-section-title"><h3>Jadwal kegiatan</h3><span>Lokasi dan waktu latihan</span></div>${admin||role==="Guru Pembina"?`<form id="scheduleForm" class="inline-form"><label>Organisasi<select name="org">${orgs.map(o=>`<option>${esc(o.name)}</option>`).join("")}</select></label><label>Jadwal<input name="schedule" required placeholder="Contoh: Sabtu, 15.30 WITA"></label><label>Lokasi<input name="location" required placeholder="Lokasi kegiatan"></label><button class="btn primary">Simpan jadwal</button></form>`:""}${scheduleTable(orgs)}`;
 } else if(tab==="Daftar Ekskul"||tab==="Pendaftaran"){
  if(student){html=`<div class="dash-section-title"><h3>Daftar ekstrakurikuler</h3><span>Pilih kegiatan yang diminati</span></div><div class="activity-choices">${data.orgs.map(o=>{let count=data.members.filter(m=>m.org===o.name&&m.status==="Diterima").length;let reg=data.registrations.find(r=>r.username===currentUser.username&&r.org===o.name&&r.status!=="Ditolak");return `<article><div><b>${esc(o.name)}</b><small>${esc(o.schedule)} · ${count}/${o.quota} anggota</small></div><button class="btn ${reg?"secondary":"primary"} small-btn" data-register="${esc(o.name)}" ${reg||count>=o.quota?"disabled":""}>${reg?esc(reg.status):count>=o.quota?"Kuota penuh":"Daftar"}</button></article>`}).join("")}</div>`}
  else {html=`<div class="dash-section-title"><h3>Permohonan pendaftaran</h3><span>Setujui atau tolak permohonan</span></div><div class="table-wrap"><table><thead><tr><th>Nama</th><th>Organisasi</th><th>Tanggal</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${data.registrations.filter(r=>orgs.some(o=>o.name===r.org)).map((r,i)=>`<tr><td>${esc(r.name)}<small>${esc(r.username)}</small></td><td>${esc(r.org)}</td><td>${esc(r.date)}</td><td><span class="status ${r.status==="Diterima"?"ok":r.status==="Ditolak"?"no":"wait"}">${esc(r.status)}</span></td><td>${r.status==="Menunggu"&&canManage?`<button class="table-action" data-approve="${i}">Terima</button> <button class="table-action danger" data-reject="${i}">Tolak</button>`:"—"}</td></tr>`).join("")||`<tr><td colspan="5">Belum ada pendaftaran.</td></tr>`}</tbody></table></div>`}
 } else if(tab==="Presensi"||tab==="Presensi Saya"){
  const rows=data.attendance.filter(a=>orgs.some(o=>o.name===a.org)&&(student?a.username===currentUser.username:true));
  html=`<div class="dash-section-title"><h3>${student?"Presensi saya":"Presensi anggota"}</h3><span>Rekap kehadiran</span></div>${canManage?`<form id="attendanceForm" class="inline-form"><label>Anggota<select name="username">${members.map(m=>`<option value="${esc(m.username)}">${esc(m.name)} — ${esc(m.org)}</option>`).join("")}</select></label><label>Tanggal<input name="date" type="date" value="${new Date().toISOString().slice(0,10)}" required></label><label>Status<select name="status"><option>Hadir</option><option>Izin</option><option>Sakit</option><option>Alpa</option></select></label><button class="btn primary">Catat presensi</button></form>`:""}<div class="table-wrap"><table><thead><tr><th>Nama</th><th>Organisasi</th><th>Tanggal</th><th>Status</th></tr></thead><tbody>${rows.map(a=>`<tr><td>${esc(a.name)}</td><td>${esc(a.org)}</td><td>${esc(a.date)}</td><td><span class="status ${a.status==="Hadir"?"ok":"wait"}">${esc(a.status)}</span></td></tr>`).join("")||`<tr><td colspan="4">Belum ada data presensi.</td></tr>`}</tbody></table></div>`;
 } else if(tab==="Pengumuman"){
  html=`<div class="dash-section-title"><h3>Pengumuman</h3><span>Informasi kegiatan</span></div>${canManage?`<form id="announcementForm" class="inline-form"><label>Judul<input name="title" required placeholder="Judul pengumuman"></label><label>Organisasi<select name="org">${(admin?["Semua organisasi",...orgs.map(o=>o.name)]:orgs.map(o=>o.name)).map(o=>`<option>${esc(o)}</option>`).join("")}</select></label><label>Isi pengumuman<input name="message" required placeholder="Tulis informasi singkat"></label><button class="btn primary">Terbitkan</button></form>`:""}${announcementList(orgs)}`;
 } else if(tab==="Anggota"){
  html=`<div class="dash-section-title"><h3>Data anggota</h3><span>${members.length} data dalam cakupan akses</span></div>${admin||role==="Guru Pembina"?`<form id="memberForm" class="inline-form"><label>Nama anggota<input name="name" required placeholder="Nama lengkap"></label><label>Username<input name="username" required placeholder="Username unik"></label><label>Kelas<input name="kelas" required placeholder="Contoh: X A"></label><label>Organisasi<select name="org">${orgs.map(o=>`<option>${esc(o.name)}</option>`).join("")}</select></label><button class="btn primary">Tambah anggota</button></form>`:""}<div class="table-wrap"><table><thead><tr><th>Nama</th><th>Username</th><th>Kelas</th><th>Organisasi</th><th>Status</th></tr></thead><tbody>${members.map(m=>`<tr><td>${esc(m.name)}</td><td>${esc(m.username)}</td><td>${esc(m.kelas)}</td><td>${esc(m.org)}</td><td><span class="status ok">${esc(m.status)}</span></td></tr>`).join("")||`<tr><td colspan="5">Belum ada anggota.</td></tr>`}</tbody></table></div>`;
 } else if(tab==="Dokumentasi"){
  html=`<div class="dash-section-title"><h3>Dokumentasi kegiatan</h3><span>Catatan dan tautan foto kegiatan</span></div>${canManage?`<form id="docForm" class="inline-form"><label>Nama kegiatan<input name="title" required placeholder="Nama kegiatan"></label><label>Organisasi<select name="org">${orgs.map(o=>`<option>${esc(o.name)}</option>`).join("")}</select></label><label>Tanggal<input name="date" type="date" value="${new Date().toISOString().slice(0,10)}" required></label><label>Tautan foto (opsional)<input name="url" type="url" placeholder="https://..."></label><label>Catatan<input name="note" placeholder="Ringkasan kegiatan"></label><button class="btn primary">Tambah dokumentasi</button></form>`:""}<div class="content-cards">${data.documentation.filter(d=>orgs.some(o=>o.name===d.org)).map(d=>`<article class="content-card"><span class="service-icon">▧</span><h4>${esc(d.title)}</h4><p>${esc(d.org)} · ${esc(d.date)}</p><small>${esc(d.note||"Tidak ada catatan tambahan")}</small>${d.url?`<a href="${esc(d.url)}" target="_blank" rel="noopener">Buka foto ↗</a>`:""}</article>`).join("")||"<p class='muted'>Belum ada dokumentasi. Tambahkan kegiatan pertama.</p>"}</div>`;
 } else if(tab==="Sertifikat"){
  html=`<div class="dash-section-title"><h3>Sertifikat dan prestasi</h3><span>Catatan pencapaian anggota</span></div>${canManage?`<form id="certForm" class="inline-form"><label>Nama anggota<input name="name" required placeholder="Nama anggota"></label><label>Prestasi/sertifikat<input name="title" required placeholder="Contoh: Juara 2 lomba"></label><label>Organisasi<select name="org">${orgs.map(o=>`<option>${esc(o.name)}</option>`).join("")}</select></label><label>Tanggal<input name="date" type="date" value="${new Date().toISOString().slice(0,10)}" required></label><button class="btn primary">Catat prestasi</button></form>`:""}<div class="content-cards">${data.certificates.filter(c=>orgs.some(o=>o.name===c.org)&&( !student || c.name===currentUser.name)).map(c=>`<article class="content-card"><span class="service-icon">✦</span><h4>${esc(c.title)}</h4><p>${esc(c.name)} · ${esc(c.org)}</p><small>${esc(c.date)}</small><button class="table-action" data-certificate="${esc(c.title)}|${esc(c.name)}|${esc(c.org)}|${esc(c.date)}">Cetak bukti ↗</button></article>`).join("")||"<p class='muted'>Belum ada catatan sertifikat atau prestasi.</p>"}</div>`;
 } else if(tab==="Laporan"){
  html=`<div class="dash-section-title"><h3>Laporan dan statistik</h3><span>Data ringkasan sesuai hak akses</span></div><div class="mini-stats"><div><b>${members.length}</b><span>Anggota</span></div><div><b>${data.attendance.filter(a=>orgs.some(o=>o.name===a.org)&&a.status==="Hadir").length}</b><span>Presensi hadir</span></div><div><b>${data.registrations.filter(r=>orgs.some(o=>o.name===r.org)).length}</b><span>Total pendaftaran</span></div><div><b>${data.documentation.filter(d=>orgs.some(o=>o.name===d.org)).length}</b><span>Dokumentasi</span></div></div><div class="report-actions"><button class="btn primary" id="exportCsv">Unduh laporan CSV / Excel</button><button class="btn secondary" id="printReport">Cetak / Simpan PDF</button></div><p class="muted">Pilih cetak lalu gunakan opsi “Simpan sebagai PDF” di dialog cetak browser.</p>${scheduleTable(orgs)}`;
 } else if(tab==="Profil"){
  const mine=student?members.find(m=>m.username===currentUser.username):null;
  html=`<div class="dash-section-title"><h3>Profil pengguna</h3><span>Informasi akun yang sedang aktif</span></div><div class="profile-card"><div class="profile-avatar">${esc((currentUser.name||"E").charAt(0).toUpperCase())}</div><div><h3>${esc(currentUser.name)}</h3><p>${esc(currentUser.role)}</p><span class="status ok">${esc(currentUser.org)}</span></div></div><form id="profileForm" class="inline-form"><label>Nama tampilan<input name="name" required value="${esc(currentUser.name)}"></label><label>Organisasi${student?"":" (sesuai penugasan)"}<input value="${esc(currentUser.org)}" disabled></label>${student?`<label>Kelas<input name="kelas" value="${esc(mine?.kelas||"")}"></label>`:""}<button class="btn primary">Simpan profil demo</button></form><p class="muted">Perubahan profil demo tersimpan di browser ini. Fitur ganti kata sandi tidak disertakan.</p>`;
 }
 content.innerHTML=html;
 bindForms();
 content.querySelectorAll("[data-quick]").forEach(b=>b.addEventListener("click",()=>renderDashboard(b.dataset.quick)));
 content.querySelectorAll("[data-register]").forEach(b=>b.addEventListener("click",()=>{const org=b.dataset.register;data.registrations.push({name:currentUser.name,username:currentUser.username,org,date:new Date().toISOString().slice(0,10),status:"Menunggu"});save();renderDashboard("Daftar Ekskul")}));
 content.querySelectorAll("[data-approve]").forEach(b=>b.addEventListener("click",()=>{const list=data.registrations.filter(r=>orgs.some(o=>o.name===r.org));const r=list[Number(b.dataset.approve)];if(!r)return;r.status="Diterima";if(!data.members.some(m=>m.username===r.username&&m.org===r.org))data.members.push({name:r.name,username:r.username,kelas:"Belum diisi",org:r.org,status:"Diterima"});save();renderDashboard("Pendaftaran")}));
 content.querySelectorAll("[data-reject]").forEach(b=>b.addEventListener("click",()=>{const list=data.registrations.filter(r=>orgs.some(o=>o.name===r.org));const r=list[Number(b.dataset.reject)];if(r)r.status="Ditolak";save();renderDashboard("Pendaftaran")}));
 content.querySelectorAll("[data-certificate]").forEach(b=>b.addEventListener("click",()=>{const [title,name,org,date]=b.dataset.certificate.split("|");const w=window.open("","_blank");if(!w){alert("Izinkan pop-up untuk mencetak bukti prestasi.");return}w.document.write(`<html><head><title>Bukti Prestasi EKSPLORA</title><style>body{font-family:Arial;text-align:center;padding:60px;color:#123c72}article{border:8px double #2166b1;padding:50px}h1{font-size:34px}p{color:#333}</style></head><body><article><h1>EKSPLORA</h1><h2>SERTIFIKAT / CATATAN PRESTASI</h2><p>Diberikan kepada</p><h2>${esc(name)}</h2><p>Atas pencapaian</p><h3>${esc(title)}</h3><p>Organisasi: ${esc(org)} · Tanggal: ${esc(date)}</p><p>Dokumen demo — bukan sertifikat resmi sekolah.</p></article><script>window.print()<\/script></body></html>`);w.document.close()}));
 const exportBtn=$("exportCsv");if(exportBtn)exportBtn.addEventListener("click",exportReport);
 const printBtn=$("printReport");if(printBtn)printBtn.addEventListener("click",()=>window.print());
}
function scheduleTable(orgs){return `<div class="table-wrap"><table><thead><tr><th>Ekstrakurikuler</th><th>Jadwal</th><th>Lokasi</th><th>Kuota</th><th>Anggota</th></tr></thead><tbody>${orgs.map(o=>`<tr><td><b>${esc(o.name)}</b><small>${esc(o.coach)}</small></td><td>${esc(o.schedule)}</td><td>${esc(o.location)}</td><td>${o.quota}</td><td>${data.members.filter(m=>m.org===o.name&&m.status==="Diterima").length}/${o.quota}</td></tr>`).join("")||`<tr><td colspan="5">Belum ada jadwal.</td></tr>`}</tbody></table></div>`}
function announcementList(orgs){const list=data.announcements.filter(n=>n.org==="Semua organisasi"||orgs.some(o=>o.name===n.org));return `<div class="announcement-list">${list.map(n=>`<article><span class="announcement-mark">✦</span><div><b>${esc(n.title)}</b><p>${esc(n.message)}</p><small>${esc(n.org)} · ${esc(n.date)}</small></div></article>`).join("")||"<p class='muted'>Belum ada pengumuman.</p>"}</div>`}
function bindForms(){
 const sf=$("scheduleForm");if(sf)sf.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(sf),o=data.orgs.find(x=>x.name===f.get("org"));o.schedule=f.get("schedule");o.location=f.get("location");save();renderDashboard("Jadwal")});
 const af=$("attendanceForm");if(af)af.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(af),m=data.members.find(x=>x.username===f.get("username"));if(!m){alert("Tambahkan anggota terlebih dahulu.");return}data.attendance.push({username:m.username,name:m.name,org:m.org,date:f.get("date"),status:f.get("status")});save();renderDashboard("Presensi")});
 const nf=$("announcementForm");if(nf)nf.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(nf);data.announcements.unshift({title:f.get("title"),org:f.get("org"),message:f.get("message"),date:new Date().toISOString().slice(0,10)});save();renderDashboard("Pengumuman")});
 const mf=$("memberForm");if(mf)mf.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(mf);if(data.members.some(m=>m.username===f.get("username"))){alert("Username anggota sudah digunakan.");return}data.members.push({name:f.get("name"),username:f.get("username"),kelas:f.get("kelas"),org:f.get("org"),status:"Diterima"});save();renderDashboard("Anggota")});
 const df=$("docForm");if(df)df.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(df);data.documentation.unshift({title:f.get("title"),org:f.get("org"),date:f.get("date"),url:f.get("url"),note:f.get("note")});save();renderDashboard("Dokumentasi")});
 const cf=$("certForm");if(cf)cf.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(cf);data.certificates.unshift({name:f.get("name"),username:"",title:f.get("title"),org:f.get("org"),date:f.get("date")});save();renderDashboard("Sertifikat")});
 const pf=$("profileForm");if(pf)pf.addEventListener("submit",e=>{e.preventDefault();const f=new FormData(pf);const oldName=currentUser.name;const newName=f.get("name").trim();if(!newName){alert("Nama tidak boleh kosong.");return}currentUser.name=newName;accountNames[currentUser.username]=newName;localStorage.setItem("eksploraAccountNames",JSON.stringify(accountNames));const account=accounts.find(a=>a.username===currentUser.username);if(account)account.name=newName;data.members.filter(m=>m.username===currentUser.username).forEach(m=>{m.name=newName;if(f.get("kelas"))m.kelas=f.get("kelas")});data.registrations.filter(r=>r.username===currentUser.username).forEach(r=>r.name=newName);data.attendance.filter(a=>a.username===currentUser.username).forEach(a=>a.name=newName);data.certificates.filter(c=>c.username===currentUser.username).forEach(c=>c.name=newName);save();$("welcomeUser").textContent=`Halo, ${currentUser.name}!`;renderDashboard("Profil")});
}
function exportReport(){
 const orgs=data.orgs.filter(o=>allowedOrgs().includes(o.name)),rows=[["Jenis data","Nama","Organisasi","Tanggal/Jadwal","Status/Detail"]];
 visibleMembers().forEach(m=>rows.push(["Anggota",m.name,m.org,m.kelas,m.status]));
 data.attendance.filter(a=>orgs.some(o=>o.name===a.org)).forEach(a=>rows.push(["Presensi",a.name,a.org,a.date,a.status]));
 data.registrations.filter(r=>orgs.some(o=>o.name===r.org)).forEach(r=>rows.push(["Pendaftaran",r.name,r.org,r.date,r.status]));
 orgs.forEach(o=>rows.push(["Jadwal",o.name,o.location,o.schedule,`Kuota ${o.quota}`]));
 const csv="\uFEFF"+rows.map(row=>row.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(",")).join("\r\n");
 const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="laporan-eksplora.csv";a.click();URL.revokeObjectURL(url);
}
