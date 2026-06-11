// --- إعدادات الربط بقاعدة بيانات Supabase ---
const supabaseUrl = window.SUPABASE_URL;
const supabaseAnonKey = window.SUPABASE_ANON_KEY;
// بناء الاتصال المباشر بالسيرفر
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
const studentPromptOverlay = document.getElementById("studentPromptOverlay");


    const STORAGE_KEYS = {
      catalog: "edu-platform-catalog-v4",
      students: "edu-platform-student-records-v2",
      currentStudent: "edu-platform-current-student-v2",
      adminAuth: "edu-platform-admin-auth-v1",
      whitelist: "edu-platform-student-whitelist-v1",
    };

    const DEFAULT_VIDEO_URL = "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ?rel=0";

    const GRADE_META = [
      { id: 1, label: "الصف الأول", badge: "١", icon: "star", gradient: "from-[#5FE1FF] via-[#B7F8FF] to-[#F5FEFF]" },
      { id: 2, label: "الصف الثاني", badge: "٢", icon: "rocket", gradient: "from-[#FFE45E] via-[#FFF0A8] to-[#FFFBE6]" },
      { id: 3, label: "الصف الثالث", badge: "٣", icon: "pencil", gradient: "from-[#A6EE6A] via-[#D9F7B9] to-[#F8FFF0]" },
      { id: 4, label: "الصف الرابع", badge: "٤", icon: "sun", gradient: "from-[#FF9C6E] via-[#FFD2AF] to-[#FFF2E8]" },
      { id: 5, label: "الصف الخامس", badge: "٥", icon: "rainbow", gradient: "from-[#FF6DB2] via-[#FFC9E4] to-[#FFF1F8]" },
      { id: 6, label: "الصف السادس", badge: "٦", icon: "trophy", gradient: "from-[#8A92FF] via-[#D2D7FF] to-[#F1F3FF]" },
    ];

    const LOWER_PRIMARY_SUBJECTS = [
      { key: "arabic", label: "اللغة العربية" },
      { key: "math", label: "الرياضيات" },
      { key: "english", label: "اللغة الإنجليزية" },
      { key: "islamic", label: "التربية الإسلامية" },
    ];

    const UPPER_PRIMARY_SUBJECTS = [
      { key: "arabic", label: "اللغة العربية" },
      { key: "math", label: "الرياضيات" },
      { key: "islamic", label: "التربية الإسلامية" },
      { key: "english", label: "اللغة الإنجليزية" },
      { key: "social", label: "الدراسات الاجتماعية" },
      { key: "technology", label: "التكنولوجيا" },
    ];

    const QUESTION_LIBRARY = {
      arabic: [
        {
          text: 'أي كلمة تبدأ بحرف "م"؟',
          options: ["مدرسة", "قلم", "بيت", "شجرة"],
          correctIndex: 0,
        },
        {
          text: "أي كلمة نستخدمها عند الترحيب؟",
          options: ["مرحبا", "نوم", "غيمة", "رمل"],
          correctIndex: 0,
        },
      ],
      math: [
        {
          text: "كم يساوي 2 + 3 ؟",
          options: ["4", "5", "6", "7"],
          correctIndex: 1,
        },
        {
          text: "كم عدد أضلاع المثلث؟",
          options: ["2", "3", "4", "5"],
          correctIndex: 1,
        },
      ],
      english: [
        {
          text: "أي حرف يأتي بعد A ؟",
          options: ["B", "C", "D", "E"],
          correctIndex: 0,
        },
        {
          text: 'ما معنى "Hello"؟',
          options: ["مع السلامة", "مرحبا", "كتاب", "لعبة"],
          correctIndex: 1,
        },
      ],
      islamic: [
        {
          text: "ما اسم كتاب المسلمين؟",
          options: ["القرآن الكريم", "المجلة", "القصة", "الدفتر"],
          correctIndex: 0,
        },
        {
          text: "كم عدد الصلوات المفروضة في اليوم؟",
          options: ["3", "4", "5", "6"],
          correctIndex: 2,
        },
      ],
      social: [
        {
          text: "في أي مكان نعيش جميعًا؟",
          options: ["الوطن", "المحفظة", "الملعب", "القلم"],
          correctIndex: 0,
        },
        {
          text: "من يساعد في تنظيم المرور؟",
          options: ["الشرطي", "الخباز", "النجار", "الرسام"],
          correctIndex: 0,
        },
      ],
      technology: [
        {
          text: "أي جهاز نستخدمه للكتابة على الحاسوب؟",
          options: ["لوحة المفاتيح", "الكرة", "المسطرة", "الكتاب"],
          correctIndex: 0,
        },
        {
          text: "أين تظهر الصور والنصوص؟",
          options: ["الشاشة", "الحقيبة", "الكرسي", "القلم"],
          correctIndex: 0,
        },
      ],
      generic: [
        {
          text: "اختر الإجابة الصحيحة",
          options: ["الخيار الأول", "الخيار الثاني"],
          correctIndex: 0,
        },
      ],
    };

    const state = {
      currentView: "home",
      selectedGradeId: null,
      selectedSubjectId: null,
      answers: [],
      resultShown: false,
      videoFinished: false,
      adminGradeId: 1,
      adminSubjectId: null,
      adminTab: "content",
      currentStudentKey: localStorage.getItem(STORAGE_KEYS.currentStudent) || "",
    };

    const homeView = document.getElementById("homeView");
    const gradeView = document.getElementById("gradeView");
    const quizView = document.getElementById("quizView");
    const adminView = document.getElementById("adminView");
    const gradesGrid = document.getElementById("gradesGrid");
    const breadcrumb = document.getElementById("breadcrumb");
    const pageHeading = document.getElementById("pageHeading");
    const backButton = document.getElementById("backButton");
    const homeButton = document.getElementById("homeButton");
    const studentBadge = document.getElementById("studentBadge");
    const studentNameInput = document.getElementById("studentNameInput");
    const studentGradeInput = document.getElementById("studentGradeInput");
    const studentPromptError = document.getElementById("studentPromptError");
    const saveStudentNameButton = document.getElementById("saveStudentNameButton");

    let catalog = null;

    function createId(prefix = "id") {
      return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    }

    function deepClone(value) {
      return JSON.parse(JSON.stringify(value));
    }

    function escapeHtml(value) {
      return String(value ?? "").replace(/[&<>"']/g, (character) => {
        const map = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        };
        return map[character];
      });
    }

    function normalizeName(value) {
      return String(value || "")
        .trim()
        .replace(/\s+/g, " ") 
        .replace(/[أإآ]/g, "ا") 
        .replace(/ة/g, "ه") 
        .replace(/ى/g, "ي") 
        .replace(/[\u064B-\u065F]/g, "") 
        .toLowerCase();
    }

    function isDirectVideo(url) {
      return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url || "");
    }
    
    function normalizeYoutubeUrl(url) {
      try {
        // موتور ذكي (Regex) لاصطياد الـ ID من أي رابط يوتيوب (عادي، شورتس، لايف، موبايل)
        const match = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/);
        
        if (match && match[1]) {
          // تحويله لرابط Embed آمن للأطفال (بدون كوكيز وبدون اقتراحات قنوات أخرى في النهاية)
          return `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0`;
        }
        return url; // لو مش رابط يوتيوب، هيرجعه زي ما هو
      } catch (error) {
        return url;
      }
    }

    function subjectIconFromKey(key, label) {
      const combined = `${key} ${label}`;
      if (combined.includes("arabic") || combined.includes("العربية")) return "book";
      if (combined.includes("math") || combined.includes("الرياضيات")) return "calculator";
      if (combined.includes("english") || combined.includes("الإنجليزية")) return "abc";
      if (combined.includes("islamic") || combined.includes("الإسلامية")) return "moon";
      if (combined.includes("social") || combined.includes("الاجتماعية")) return "globe";
      if (combined.includes("technology") || combined.includes("التكنولوجيا")) return "robot";
      return "book";
    }

    function buildSeedQuestions(key, gradeId) {
      const source = QUESTION_LIBRARY[key] || QUESTION_LIBRARY.generic;
      return source.map((item, index) => ({
        id: createId(`q-${gradeId}-${key}-${index}`),
        text: item.text,
        options: [...item.options],
        correctIndex: item.correctIndex,
      }));
    }

    function buildDefaultSubjects(gradeId) {
      const templates = gradeId <= 3 ? LOWER_PRIMARY_SUBJECTS : UPPER_PRIMARY_SUBJECTS;
      return templates.map((subject) => ({
        id: createId(`subject-${gradeId}`),
        key: subject.key,
        label: subject.label,
        icon: subjectIconFromKey(subject.key, subject.label),
        videoUrl: DEFAULT_VIDEO_URL,
        questions: buildSeedQuestions(subject.key, gradeId),
      }));
    }

    function buildDefaultCatalog() {
      return {
        grades: GRADE_META.map((grade) => ({
          id: grade.id,
          label: grade.label,
          badge: grade.badge,
          icon: grade.icon,
          gradient: grade.gradient,
          subjects: buildDefaultSubjects(grade.id),
        })),
      };
    }

    function normalizeQuestion(question) {
      const options = Array.isArray(question?.options) ? question.options.map((item) => String(item ?? "")) : [];
      const safeOptions = options.length >= 2 ? options : ["الخيار الأول", "الخيار الثاني"];
      const correctIndex = Number(question?.correctIndex);
      return {
        id: question?.id || createId("q"),
        text: String(question?.text ?? "سؤال جديد"),
        options: safeOptions,
        correctIndex: Number.isInteger(correctIndex) && correctIndex >= 0 && correctIndex < safeOptions.length ? correctIndex : 0,
      };
    }

    function normalizeSubject(subject) {
      const label = String(subject?.label ?? "مادة جديدة");
      const key = String(subject?.key ?? createId("subject-key"));
      return {
        id: subject?.id || createId("subject"),
        key,
        label,
        icon: subject?.icon || subjectIconFromKey(key, label),
        videoUrl: String(subject?.videoUrl || DEFAULT_VIDEO_URL),
        questions: Array.isArray(subject?.questions) ? subject.questions.map(normalizeQuestion) : [],
      };
    }

    function normalizeCatalog(rawCatalog) {
      const seeded = buildDefaultCatalog();
      if (!rawCatalog || !Array.isArray(rawCatalog.grades)) {
        return seeded;
      }

      return {
        grades: GRADE_META.map((gradeMeta) => {
          const rawGrade = rawCatalog.grades.find((item) => Number(item?.id) === gradeMeta.id);
          return {
            id: gradeMeta.id,
            label: gradeMeta.label,
            badge: gradeMeta.badge,
            icon: gradeMeta.icon,
            gradient: gradeMeta.gradient,
            subjects: Array.isArray(rawGrade?.subjects) ? rawGrade.subjects.map(normalizeSubject) : seeded.grades.find((item) => item.id === gradeMeta.id).subjects,
          };
        }),
      };
    }

    async function loadCatalogFromDB() {
      try {
        const { data, error } = await supabaseClient.from('platform_metadata').select('data').eq('key', 'catalog').single();
        if (error || !data || !data.data || !data.data.grades) {
          return buildDefaultCatalog();
        }
        return data.data;
      } catch (error) {
        return buildDefaultCatalog();
      }
    }

    async function persistCatalog() {
      try {
        await supabaseClient.from('platform_metadata').upsert({ key: 'catalog', data: catalog });
      } catch (error) {
        console.error("خطأ في الحفظ السحابي:", error);
      }
    }
    function loadStudentStore() {
      try {
        const rawValue = localStorage.getItem(STORAGE_KEYS.students);
        return rawValue ? JSON.parse(rawValue) : {};
      } catch (error) {
        return {};
      }
    }
    function saveStudentStore(store) {
      localStorage.setItem(STORAGE_KEYS.students, JSON.stringify(store));
    }

    // --- دوال الاتصال بقاعدة بيانات Supabase ---
    async function checkStudentEligibilityFromDB(name, gradeId, secretCode) {
      try {
        const { data, error } = await supabaseClient.from('students_whitelist')
          .select('*')
          .eq('grade_id', Number(gradeId))
          .eq('secret_code', String(secretCode).trim());

        if (error) throw error;
        if (!data || data.length === 0) return false;

        const normalizedInput = normalizeName(name);
        const isMatch = data.some(student => 
          normalizeName(student.name) === normalizedInput
        );

        return isMatch;
      } catch (err) {
        console.error("خطأ في الاتصال بقاعدة البيانات:", err);
        return false;
      }
    }
    async function fetchWhitelistFromDB() {
      try {
        const { data, error } = await supabaseClient.from('students_whitelist').select('*').order('grade_id', { ascending: true });
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error("خطأ في جلب الصلاحيات:", err);
        return [];
      }
    }
    function ensureStudentRecord(name, gradeId = null) {
      const normalized = normalizeName(name);
      const store = loadStudentStore();
      if (!store[normalized]) {
        store[normalized] = {
          name: String(name).trim(),
          score: 0,
          awarded: {},
          gradeId: gradeId ? Number(gradeId) : null,
        };
      } else {
        store[normalized].name = String(name).trim();
        if (gradeId) {
          store[normalized].gradeId = Number(gradeId);
        }
      }
      saveStudentStore(store);
      return normalized;
    }

    function getCurrentStudentRecord() {
      const store = loadStudentStore();
      return store[state.currentStudentKey] || null;
    }

    function getCurrentStudentAuthorizedGradeId() {
      const record = getCurrentStudentRecord();
      if (!record || !record.name || !record.gradeId) {
        return null;
      }
      // نكتفي برقم الصف المحفوظ محلياً (تم التحقق منه مسبقاً)
      return Number(record.gradeId);
    }

    function isCurrentStudentAuthorized() {
      return getCurrentStudentAuthorizedGradeId() !== null;
    }

    function triggerShake(element) {
      if (!element) return;
      element.classList.remove("shake-input");
      void element.offsetWidth;
      element.classList.add("shake-input");
    }

    function isAdminAuthenticated() {
      return localStorage.getItem(STORAGE_KEYS.adminAuth) === "1";
    }

    function getGradeById(gradeId) {
      return catalog.grades.find((grade) => grade.id === Number(gradeId));
    }

    function getSubjectById(gradeId, subjectId) {
      return getGradeById(gradeId)?.subjects.find((subject) => String(subject.id) === String(subjectId)) || null;
    }

    function getSelectedGrade() {
      return getGradeById(state.selectedGradeId);
    }

    function getSelectedSubject() {
      return getSubjectById(state.selectedGradeId, state.selectedSubjectId);
    }

    function getAdminGrade() {
      return getGradeById(state.adminGradeId);
    }

    function getAdminSubject() {
      const grade = getAdminGrade();
      return grade?.subjects.find((subject) => subject.id === state.adminSubjectId) || null;
    }

    function renderStudentBadge() {
      const record = getCurrentStudentRecord();
      if (!record || !isCurrentStudentAuthorized() || state.currentView === "admin") {
        studentBadge.className = "hidden";
        studentBadge.innerHTML = "";
        return;
      }

      studentBadge.className = "relative overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-kidYellow via-white to-kidOrange/25 px-4 py-3 shadow-float ring-2 ring-white/60";
      studentBadge.innerHTML = `
        <div class="absolute -left-3 -top-3 h-12 w-12 rounded-full bg-kidPink/15 blur-xl"></div>
        <div class="relative flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/85 text-2xl shadow-sm">⭐</div>
          <div class="text-right">
            <p class="text-xs font-black text-kidInk/70">الطالب</p>
            <p class="text-lg font-black text-kidInk">${escapeHtml(record.name)}</p>
            <p class="text-sm font-black text-kidInk/80">النقاط الكلية: <span id="studentScoreValue">${record.score}</span></p>
          </div>
          <button
            id="changeStudentNameButton"
            type="button"
            class="rounded-2xl bg-white/85 px-3 py-2 text-xs font-black text-kidInk shadow-sm transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            تغيير الاسم
          </button>
        </div>
      `;

      document.getElementById("changeStudentNameButton")?.addEventListener("click", () => {
        openStudentPrompt(record.name, record.gradeId);
      });
    }

    function createSparkles(target) {
      const colors = ["var(--spark-1)", "var(--spark-2)", "var(--spark-3)", "var(--spark-4)", "var(--spark-5)"];
      for (let i = 0; i < 7; i += 1) {
        const spark = document.createElement("span");
        spark.className = "spark";
        spark.style.backgroundColor = colors[i % colors.length];
        spark.style.right = `${20 + Math.random() * 60}%`;
        spark.style.top = `${18 + Math.random() * 40}%`;
        spark.style.setProperty("--move-x", `${(Math.random() - 0.5) * 100}px`);
        spark.style.setProperty("--move-y", `${-30 - Math.random() * 55}px`);
        target.appendChild(spark);
        setTimeout(() => spark.remove(), 800);
      }
    }

    function celebrateStudentBadge() {
      studentBadge.classList.remove("tracker-bounce");
      void studentBadge.offsetWidth;
      studentBadge.classList.add("tracker-bounce");
      createSparkles(studentBadge);
    }

    function awardPointForQuestion(question) {
      const record = getCurrentStudentRecord();
      if (!record) return { awardedNow: false, score: 0 };

      const store = loadStudentStore();
      const student = store[state.currentStudentKey];
      if (!student) return { awardedNow: false, score: 0 };
      student.awarded = student.awarded || {};
      student.score = Number(student.score) || 0;
      const awardKey = `${state.selectedGradeId}:${state.selectedSubjectId}:${question.id}`;
      let awardedNow = false;

      if (!student.awarded[awardKey]) {
        student.awarded[awardKey] = true;
        student.score += 1;
        awardedNow = true;
        saveStudentStore(store);
      }

      renderStudentBadge();
      if (awardedNow) {
        celebrateStudentBadge();
      }

      return { awardedNow, score: student.score };
    }

    function openStudentPrompt(prefill = "", prefillGradeId = "") {
      studentPromptOverlay.classList.remove("hidden");
      studentPromptOverlay.classList.add("flex");
      studentNameInput.value = prefill;
      studentGradeInput.value = prefillGradeId ? String(prefillGradeId) : "";
      studentNameInput.classList.remove("shake-input");
      studentGradeInput.classList.remove("shake-input");
      studentPromptError.textContent = "";
      setTimeout(() => studentNameInput.focus(), 0);
    }

    function closeStudentPrompt() {
      studentPromptOverlay.classList.add("hidden");
      studentPromptOverlay.classList.remove("flex");
      studentPromptError.textContent = "";
    }

    async function saveStudentName() {
      const name = studentNameInput.value.trim();
      const gradeId = studentGradeInput.value;
      const secretInput = document.getElementById("studentSecretInput");
      const secretCode = secretInput ? secretInput.value.trim() : "";

      if (!name || !gradeId || !secretCode) {
        studentPromptError.textContent = "من فضلك اكتب الاسم والصف والكود السري.";
        if (!name) triggerShake(studentNameInput);
        if (!gradeId) triggerShake(studentGradeInput);
        if (!secretCode && secretInput) triggerShake(secretInput);
        return;
      }

      saveStudentNameButton.textContent = "جاري التحقق من السحابة...";
      saveStudentNameButton.disabled = true;

      const isEligible = await checkStudentEligibilityFromDB(name, gradeId, secretCode);

      saveStudentNameButton.textContent = "حفظ الاسم والبدء";
      saveStudentNameButton.disabled = false;

      if (!isEligible) {
        studentPromptError.textContent = "عفواً! البيانات غير صحيحة أو الكود السري خاطئ.";
        triggerShake(studentNameInput);
        triggerShake(studentGradeInput);
        if(secretInput) triggerShake(secretInput);
        return;
      }

      state.currentStudentKey = ensureStudentRecord(name, gradeId);
      localStorage.setItem(STORAGE_KEYS.currentStudent, state.currentStudentKey);
      closeStudentPrompt();
      renderStudentBadge();
      renderGradeCards();
      openGrade(gradeId);
    }

    function ensureStudentIdentity() {
      const record = getCurrentStudentRecord();
      if (location.hash === "#admin") {
        return;
      }
      if (!record || !isCurrentStudentAuthorized()) {
        openStudentPrompt(record?.name || "", record?.gradeId || "");
      }
    }

    function renderGradeCards() {
      const authorizedGradeId = getCurrentStudentAuthorizedGradeId();
      gradesGrid.innerHTML = catalog.grades.map(
        (grade) => {
          const isLocked = authorizedGradeId !== null && Number(grade.id) !== Number(authorizedGradeId);
          return `
          <button
            type="button"
            class="card-pop group relative flex flex-col items-center justify-center overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${grade.gradient} p-8 text-center shadow-float focus:outline-none focus:ring-4 focus:ring-sky-200 ${isLocked ? "grayscale opacity-55 cursor-not-allowed" : ""}"
            data-grade-id="${grade.id}"
            aria-label="افتح ${escapeHtml(grade.label)}"
            ${isLocked ? "disabled" : ""}
          >
            <div class="absolute right-6 top-6 text-kidInk/10">
                <svg class="h-10 w-10" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
            ${isLocked ? `
              <div class="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-2xl shadow-sm">
                🔒
              </div>
            ` : ""}

            <div class="mb-4 rounded-3xl bg-white/40 p-5 shadow-sm backdrop-blur-sm transition-transform group-hover:scale-110">
              ${getIconSvg(grade.icon, "h-20 w-20")}
            </div>

            <h4 class="mt-2 text-4xl font-black text-kidInk">${escapeHtml(grade.label)}</h4>

            <p class="mt-3 text-xl font-bold text-kidInk/70">الصف ${escapeHtml(grade.badge)}</p>

            <div class="mt-8 flex items-center justify-center gap-3 text-lg font-black text-kidInk/80 transition-colors group-hover:text-kidInk">
              <span>اضغط للدخول</span>
              <span class="text-2xl">&larr;</span>
            </div>
          </button>
        `;
        }
      ).join("");

      document.querySelectorAll("[data-grade-id]").forEach((button) => {
        button.addEventListener("click", () => openGrade(Number(button.dataset.gradeId)));
      });
    }
    function openGrade(gradeId) {
      const authorizedGradeId = getCurrentStudentAuthorizedGradeId();
      if (authorizedGradeId !== null && Number(gradeId) !== Number(authorizedGradeId)) {
        return;
      }
      state.selectedGradeId = Number(gradeId);
      state.selectedSubjectId = null;
      renderGradeView();
      switchView("grade");
      updateHeader();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function renderGradeView() {
      const grade = getSelectedGrade();
      gradeView.innerHTML = `
        <div class="space-y-6">
          <div class="grid gap-5 lg:grid-cols-[1fr_0.84fr]">
            <div class="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-float sm:p-8">
              <div class="inline-flex items-center gap-2 rounded-full bg-kidGreen/25 px-4 py-2 text-sm font-black text-kidInk">
                <span>📚</span>
                <span>${escapeHtml(grade.label)}</span>
              </div>
              <h2 class="mt-4 text-3xl font-black text-kidInk sm:text-4xl">اختر المادة التي تريد دراستها</h2>
              <p class="mt-3 max-w-2xl text-base leading-8 text-slate-600">
                هذه القائمة تعرض فقط المواد المرتبطة بهذا الصف. بعد اختيار المادة ستشاهد الفيديو ثم تفتح الأسئلة يدويًا.
              </p>
            </div>

            <div class="rounded-[2rem] bg-gradient-to-br from-kidYellow/70 via-white to-kidBlue/35 p-6 shadow-float">
              <div class="grid min-h-[220px] gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div class="rounded-[1.5rem] bg-white/80 p-4 text-center shadow-sm">
                  <div class="text-4xl">🎥</div>
                  <p class="mt-2 text-sm font-black text-kidInk">شاهد الدرس</p>
                </div>
                <div class="rounded-[1.5rem] bg-white/80 p-4 text-center shadow-sm">
                  <div class="text-4xl">🔓</div>
                  <p class="mt-2 text-sm font-black text-kidInk">افتح الاختبار</p>
                </div>
                <div class="rounded-[1.5rem] bg-white/80 p-4 text-center shadow-sm">
                  <div class="text-4xl">⭐</div>
                  <p class="mt-2 text-sm font-black text-kidInk">اجمع نقاطك</p>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-float sm:p-6">
            <div class="mb-5 flex items-center justify-between gap-4">
              <div>
                <h3 class="text-2xl font-black text-kidInk">مواد ${escapeHtml(grade.label)}</h3>
                <p class="mt-1 text-sm font-semibold text-slate-500 sm:text-base">لن تظهر هنا إلا المواد المحددة لهذا الصف.</p>
              </div>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              ${grade.subjects.map((subject) => `
                <button
                  type="button"
                  class="card-pop group overflow-hidden rounded-[1.85rem] bg-gradient-to-br from-white to-slate-50 p-4 text-right shadow-float focus:outline-none focus:ring-4 focus:ring-sky-200"
                  data-subject-id="${subject.id}"
                  aria-label="افتح ${escapeHtml(subject.label)}"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="rounded-[1.4rem] bg-kidBlue/10 p-2 shadow-sm">
                      ${getIconSvg(subject.icon, "h-14 w-14")}
                    </div>
                    <span class="rounded-full bg-kidYellow/50 px-3 py-1 text-xs font-black text-kidInk">${subject.questions.length} سؤال</span>
                  </div>
                  <div class="mt-5">
                    <h4 class="text-xl font-black text-kidInk">${escapeHtml(subject.label)}</h4>
                    <p class="mt-2 text-sm font-bold text-slate-600">فيديو تعليمي + اختبار مقفول حتى انتهاء المشاهدة</p>
                  </div>
                </button>
              `).join("")}
            </div>
          </div>
        </div>
      `;

      gradeView.querySelectorAll("[data-subject-id]").forEach((button) => {
        button.addEventListener("click", () => openSubject(button.dataset.subjectId));
      });
    }

    function openSubject(subjectId) {
      state.selectedSubjectId = subjectId;
      state.videoFinished = false;
      state.resultShown = false;
      const subject = getSelectedSubject();
      state.answers = Array(subject.questions.length).fill(null);
      renderQuizView();
      switchView("quiz");
      updateHeader();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function renderVideoPlayer(subject) {
      const rawUrl = String(subject.videoUrl || "").trim();
      if (!rawUrl) {
        return `
          <div class="flex aspect-video items-center justify-center rounded-[1.6rem] bg-gradient-to-br from-kidBlue/10 via-white to-kidYellow/20 p-6 text-center">
            <div>
              <div class="text-5xl">🎬</div>
              <p class="mt-3 text-lg font-black text-kidInk">لا يوجد فيديو مضاف حاليًا</p>
              <p class="mt-2 text-sm font-bold text-slate-500">يمكن للإدارة إضافة رابط فيديو من لوحة الإدارة.</p>
            </div>
          </div>
        `;
      }

      if (isDirectVideo(rawUrl)) {
        return `
          <video class="aspect-video w-full rounded-[1.6rem] bg-black" controls preload="metadata">
            <source src="${escapeHtml(rawUrl)}" />
            المتصفح لا يدعم تشغيل هذا الفيديو.
          </video>
        `;
      }

      return `
        <iframe
          class="aspect-video w-full rounded-[1.6rem]"
          src="${escapeHtml(normalizeYoutubeUrl(rawUrl))}"
          title="فيديو ${escapeHtml(subject.label)}"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      `;
    }

    function renderQuizView() {
      const grade = getSelectedGrade();
      const subject = getSelectedSubject();
      const answeredCount = state.answers.filter((answer) => answer !== null).length;

      quizView.innerHTML = `
        <div class="space-y-6">
          <div class="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-float sm:p-6">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="inline-flex rounded-full bg-kidBlue/15 px-4 py-2 text-sm font-black text-sky-700">${escapeHtml(grade.label)} • ${escapeHtml(subject.label)}</p>
                <h2 class="mt-3 text-2xl font-black text-kidInk sm:text-3xl">فيديو الشرح والاختبار</h2>
                <p class="mt-2 text-sm leading-7 text-slate-600 sm:text-base">بعد مشاهدة الفيديو اضغط الزر المخصص لفتح الأسئلة.</p>
              </div>
              <div id="quizProgressBadge" class="rounded-[1.5rem] bg-kidGreen/30 px-4 py-3 text-sm font-black text-kidInk shadow-sm">
                تم حل ${answeredCount} من ${subject.questions.length}
              </div>
            </div>
          </div>

          <div class="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <section class="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-float sm:p-6">
              <div class="flex items-center justify-between gap-3">
                <h3 class="text-2xl font-black text-kidInk">فيديو المراجعة</h3>
                <span class="rounded-full bg-kidYellow/70 px-3 py-2 text-xs font-black text-kidInk">مربوط بهذه المادة</span>
              </div>
              <div class="mt-4 overflow-hidden rounded-[1.75rem] border-4 border-white bg-slate-100 shadow-lg">
                ${renderVideoPlayer(subject)}
              </div>
              <div class="mt-4 rounded-[1.5rem] bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                بعد الانتهاء من المشاهدة اضغط الزر التالي لفتح الاختبار يدويًا.
              </div>
              <button
                id="finishWatchingButton"
                type="button"
                class="mt-4 w-full rounded-2xl px-5 py-3 text-base font-black transition focus:outline-none focus:ring-4 ${state.videoFinished ? "bg-kidGreen text-kidInk focus:ring-green-200" : "bg-kidInk text-white hover:scale-[1.01] hover:bg-slate-800 focus:ring-slate-200"}"
              >
                ${state.videoFinished ? "تم فتح الاختبار" : "لقد انتهيت من المشاهدة"}
              </button>
            </section>

            <section class="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-float sm:p-6">
              <div class="flex items-center justify-between gap-3">
                <h3 class="text-2xl font-black text-kidInk">الاختبار</h3>
                <div class="rounded-full bg-kidPink/15 px-4 py-2 text-xs font-black text-kidInk">${state.videoFinished ? "الاختبار مفتوح" : "الاختبار مقفول"}</div>
              </div>
              <div class="mt-2 text-sm font-semibold text-slate-500" id="quizStatus" aria-live="polite">
                ${state.videoFinished ? "يمكنك الآن الإجابة عن الأسئلة." : "الأسئلة ظاهرة ولكنها مقفولة حتى تضغط زر انتهاء المشاهدة."}
              </div>

              <div class="relative mt-5">
                <div class="space-y-4 ${state.videoFinished ? "" : "pointer-events-none opacity-55 select-none"}" id="questionsContainer">
                  ${subject.questions.length === 0 ? `
                    <div class="rounded-[1.75rem] bg-slate-50 p-5 text-center">
                      <div class="text-5xl">🧩</div>
                      <p class="mt-3 text-xl font-black text-kidInk">لا توجد أسئلة بعد</p>
                      <p class="mt-2 text-sm font-bold text-slate-500">يمكن للإدارة إضافة أسئلة لهذه المادة من لوحة الإدارة.</p>
                    </div>
                  ` : subject.questions.map((question, questionIndex) => renderQuestionCard(question, questionIndex, !state.videoFinished)).join("")}
                </div>

                ${state.videoFinished ? "" : `
                  <div class="lock-overlay absolute inset-0 flex items-center justify-center rounded-[1.75rem] bg-white/60">
                    <div class="max-w-sm rounded-[1.75rem] border border-white/70 bg-white/90 p-5 text-center shadow-float">
                      <div class="text-5xl">🔒</div>
                      <h4 class="mt-3 text-xl font-black text-kidInk">الاختبار مقفول حاليًا</h4>
                      <p class="mt-2 text-sm leading-7 text-slate-600">
                        شاهد الفيديو أولًا، ثم اضغط زر <span class="font-black">لقد انتهيت من المشاهدة</span> لفتح الأسئلة.
                      </p>
                    </div>
                  </div>
                `}
              </div>

              <div class="mt-6 flex flex-wrap gap-3">
                <button
                  id="showResultButton"
                  type="button"
                  class="${state.videoFinished && subject.questions.length > 0 && state.answers.every((answer) => answer !== null) ? "" : "hidden "}rounded-2xl bg-kidInk px-5 py-3 text-base font-black text-white transition hover:scale-[1.02] hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
                >
                  عرض النتيجة
                </button>
                <button
                  id="retryQuizButton"
                  type="button"
                  class="rounded-2xl bg-slate-100 px-5 py-3 text-base font-black text-kidInk transition hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-200"
                >
                  إعادة المحاولة
                </button>
              </div>

              <div id="resultPanel" class="${state.resultShown ? "" : "hidden "}mt-5 rounded-[1.75rem] border border-white/70 bg-gradient-to-br from-kidYellow/40 via-white to-kidGreen/25 p-5 shadow-sm" aria-live="polite"></div>
            </section>
          </div>
        </div>
      `;

      // وظيفة فتح الاختبار بطريقة سلسة (بدون إعادة تحميل الفيديو)
      const unlockQuizHandler = () => {
        if(state.videoFinished) return;
        state.videoFinished = true;
        
        // 1. تغيير شكل زر المشاهدة للأخضر
        const btn = quizView.querySelector("#finishWatchingButton");
        if (btn) {
          btn.className = "mt-4 w-full rounded-2xl px-5 py-3 text-base font-black transition focus:outline-none focus:ring-4 bg-kidGreen text-kidInk focus:ring-green-200";
          btn.textContent = "تم فتح الاختبار";
        }
        
        // 2. تحديث الحالة في الأعلى
        const status = quizView.querySelector("#quizStatus");
        if (status) {
          status.textContent = "يمكنك الآن الإجابة عن الأسئلة.";
          const badge = quizView.querySelector(".bg-kidPink\\/15");
          if(badge) badge.textContent = "الاختبار مفتوح";
        }
        
        // 3. إزالة التعتيم وتفعيل أزرار الأسئلة
        const container = quizView.querySelector("#questionsContainer");
        if (container) {
          container.classList.remove("pointer-events-none", "opacity-55", "select-none");
          container.querySelectorAll("button").forEach(b => {
            b.classList.remove("cursor-not-allowed");
            b.removeAttribute("disabled");
          });
        }
        
        // 4. إخفاء القفل الكبير
        const lockOverlay = quizView.querySelector(".lock-overlay");
        if (lockOverlay) lockOverlay.remove();
      };

      // ربط الوظيفة بالزر، وأيضاً بشكل القفل الكبير 🔒 ليكون متجاوباً مع الأطفال
      quizView.querySelector("#finishWatchingButton")?.addEventListener("click", unlockQuizHandler);
      quizView.querySelector(".lock-overlay")?.addEventListener("click", unlockQuizHandler);
      quizView.querySelectorAll("[data-answer]").forEach((button) => {
        button.addEventListener("click", () => handleAnswer(button));
      });

      quizView.querySelector("#retryQuizButton")?.addEventListener("click", resetQuiz);
      quizView.querySelector("#showResultButton")?.addEventListener("click", showResult);

      if (state.resultShown) {
        paintResultPanel();
      }
    }

    function renderQuestionCard(question, questionIndex, locked) {
      return `
        <article class="relative overflow-hidden rounded-[1.75rem] border border-slate-100 bg-slate-50/90 p-4" data-question-card="${questionIndex}">
          <div class="flex items-start justify-between gap-3">
            <h4 class="text-lg font-black text-kidInk">${questionIndex + 1}. ${escapeHtml(question.text)}</h4>
            <span class="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500 shadow-sm">سؤال ${questionIndex + 1}</span>
          </div>
          <div class="mt-4 grid gap-3">
            ${question.options.map((option, optionIndex) => `
              <button
                type="button"
                class="rounded-2xl border-2 border-transparent bg-white px-4 py-3 text-right text-base font-bold text-kidInk shadow-sm transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-sky-200 ${locked ? "cursor-not-allowed" : ""}"
                data-answer="true"
                data-question-index="${questionIndex}"
                data-answer-index="${optionIndex}"
                ${locked ? "disabled" : ""}
              >
                ${escapeHtml(option)}
              </button>
            `).join("")}
          </div>
          <p class="mt-4 min-h-[2rem] text-sm font-bold text-slate-500" data-feedback></p>
        </article>
      `;
    }

    function handleAnswer(button) {
      if (!state.videoFinished) {
        return;
      }

      const questionIndex = Number(button.dataset.questionIndex);
      const answerIndex = Number(button.dataset.answerIndex);
      if (state.answers[questionIndex] !== null) {
        return;
      }

      const subject = getSelectedSubject();
      const question = subject.questions[questionIndex];
      state.answers[questionIndex] = answerIndex;

      const questionCard = quizView.querySelector(`[data-question-card="${questionIndex}"]`);
      const allButtons = questionCard.querySelectorAll("[data-answer]");
      const feedback = questionCard.querySelector("[data-feedback]");
      const correctButton = questionCard.querySelector(`[data-answer-index="${question.correctIndex}"]`);
      const isCorrect = answerIndex === question.correctIndex;

      allButtons.forEach((item) => {
        item.disabled = true;
        item.classList.add("opacity-95");
      });

      if (isCorrect) {
        const awardResult = awardPointForQuestion(question);
        button.classList.add("border-emerald-400", "bg-emerald-100", "text-emerald-800", "correct-pop");
        feedback.textContent = awardResult.awardedNow ? "إجابة صحيحة! تمت إضافة نقطة جديدة." : "إجابة صحيحة! سبق احتساب هذه النقطة من قبل.";
        feedback.className = "mt-4 min-h-[2rem] text-sm font-black text-emerald-600";
        createSparkles(questionCard);
      } else {
        button.classList.add("border-rose-400", "bg-rose-100", "text-rose-700", "wrong-shake");
        correctButton.classList.add("border-sky-400", "bg-sky-100", "text-sky-800");
        feedback.textContent = `إجابة غير صحيحة. الإجابة الصحيحة هي: ${question.options[question.correctIndex]}`;
        feedback.className = "mt-4 min-h-[2rem] text-sm font-black text-rose-600";
      }

      updateQuizProgress();
      toggleResultButton();
    }

    function updateQuizProgress() {
      const subject = getSelectedSubject();
      const solved = state.answers.filter((answer) => answer !== null).length;
      const status = quizView.querySelector("#quizStatus");
      const badge = quizView.querySelector("#quizProgressBadge");
      if (status) {
        status.textContent = solved === subject.questions.length
          ? "أجبت عن جميع الأسئلة. يمكنك الآن عرض النتيجة."
          : `أجبت عن ${solved} من ${subject.questions.length}. أكمل باقي الأسئلة.`;
      }
      if (badge) {
        badge.textContent = `تم حل ${solved} من ${subject.questions.length}`;
      }
    }

    function toggleResultButton() {
      const button = quizView.querySelector("#showResultButton");
      const subject = getSelectedSubject();
      if (!button || !subject) return;
      const ready = state.videoFinished && subject.questions.length > 0 && state.answers.every((answer) => answer !== null);
      button.classList.toggle("hidden", !ready);
    }

    function resetQuiz() {
      const subject = getSelectedSubject();
      state.answers = Array(subject.questions.length).fill(null);
      state.resultShown = false;
      state.videoFinished = false;
      renderQuizView();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function calculateScore() {
      const subject = getSelectedSubject();
      return state.answers.reduce((sum, answer, index) => {
        return sum + (answer === subject.questions[index]?.correctIndex ? 1 : 0);
      }, 0);
    }

    function showResult() {
      state.resultShown = true;
      paintResultPanel();
    }

    function paintResultPanel() {
      const panel = quizView.querySelector("#resultPanel");
      if (!panel) return;
      const subject = getSelectedSubject();
      const score = calculateScore();
      const mood = getMood(score, subject.questions.length);

      panel.classList.remove("hidden");
      panel.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="text-sm font-black text-sky-700">النتيجة النهائية</p>
            <h4 class="mt-2 text-3xl font-black text-kidInk">${score} / ${subject.questions.length}</h4>
            <p class="mt-2 text-base font-bold text-slate-600">${mood.message}</p>
          </div>
          <div class="rounded-[1.5rem] bg-white/85 px-5 py-4 text-center shadow-sm">
            <div class="text-5xl">${mood.emoji}</div>
            <p class="mt-2 text-sm font-black text-kidInk">${mood.title}</p>
          </div>
        </div>
      `;
    }

    function getMood(score, total) {
      if (total === 0) {
        return {
          emoji: "🧩",
          title: "بانتظار الأسئلة",
          message: "لا توجد أسئلة بعد لهذه المادة.",
        };
      }
      if (score === total) {
        return {
          emoji: "🌟",
          title: "عمل رائع",
          message: "أجبت عن جميع الأسئلة بشكل ممتاز.",
        };
      }
      if (score >= Math.max(1, total - 1)) {
        return {
          emoji: "😊",
          title: "أحسنت",
          message: "نتيجة جميلة جدًا، واستمر في التقدم.",
        };
      }
      return {
        emoji: "💪",
        title: "حاول مرة أخرى",
        message: "أنت تتقدم، وأعد المحاولة لتحصل على نتيجة أفضل.",
      };
    }

    function renderAdminAuthView(message = "") {
      adminView.innerHTML = `
        <div class="mx-auto max-w-lg rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-float">
          <div class="text-center">
            <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-kidPink/15 text-5xl">🔐</div>
            <h2 class="mt-4 text-2xl font-black text-kidInk">لوحة الإدارة</h2>
            <p class="mt-2 text-sm leading-7 text-slate-500">
              أدخل كلمة المرور للوصول إلى أدوات إدارة المواد والفيديوهات والأسئلة.
            </p>
          </div>
          <label class="mt-5 block">
            <span class="mb-2 block text-sm font-black text-kidInk">كلمة المرور</span>
            <input
              id="adminPasswordInput"
              type="password"
              class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-bold text-kidInk focus:outline-none focus:ring-4 focus:ring-sky-200"
              placeholder="أدخل كلمة المرور"
            />
          </label>
          <p id="adminAuthError" class="mt-3 min-h-[1.5rem] text-sm font-black text-rose-600">${escapeHtml(message)}</p>
          <button
            id="adminLoginButton"
            type="button"
            class="mt-2 w-full rounded-2xl bg-kidInk px-5 py-3 text-base font-black text-white transition hover:scale-[1.01] hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            دخول لوحة الإدارة
          </button>
        </div>
      `;

     adminView.querySelector("#adminLoginButton")?.addEventListener("click", async () => {
        const inputPass = adminView.querySelector("#adminPasswordInput")?.value || "";
        const loginBtn = adminView.querySelector("#adminLoginButton");
        const errorText = adminView.querySelector("#adminAuthError");
        
        loginBtn.textContent = "جاري التحقق...";
        loginBtn.disabled = true;

        try {
          const { data, error } = await supabaseClient.from('platform_metadata')
            .select('data')
            .eq('key', 'admin_auth')
            .single();

          if (!error && data && data.data && data.data.password === inputPass) {
            localStorage.setItem(STORAGE_KEYS.adminAuth, "1");
            renderAdminDashboard();
            updateHeader();
          } else {
            errorText.textContent = "كلمة المرور غير صحيحة.";
          }
        } catch(err) {
          errorText.textContent = "حدث خطأ في الاتصال بالسحابة.";
        }

        loginBtn.textContent = "دخول لوحة الإدارة";
        loginBtn.disabled = false;
      });
    }

    function renderAdminDashboard() {
      const grade = getAdminGrade();
      const subject = getAdminSubject();

      adminView.innerHTML = `
        <div class="space-y-6">
          <div class="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-float">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p class="inline-flex rounded-full bg-kidPink/15 px-4 py-2 text-sm font-black text-kidInk">محتوى المنصة</p>
                <h2 class="mt-3 text-3xl font-black text-kidInk">لوحة الإدارة</h2>
                <p class="mt-2 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                  من هنا يمكنك إدارة المواد الخاصة بكل صف، وتحديث روابط الفيديو، وإضافة الأسئلة والخيارات وحذفها.
                </p>
              </div>
              <button
                id="adminLogoutButton"
                type="button"
                class="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-kidInk transition hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-200"
              >
                تسجيل خروج الإدارة
              </button>
            </div>
            </div>
            <div class="mt-4 flex gap-2 border-b border-slate-200 pb-4">
              <button onclick="switchAdminTab('content')" id="tabContentBtn" class="rounded-xl bg-kidBlue text-white px-5 py-2.5 text-sm font-black shadow-sm transition">إدارة المحتوى</button>
              <button onclick="switchAdminTab('students')" id="tabStudentsBtn" class="rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 px-5 py-2.5 text-sm font-black transition">سجل الطلبة</button>
            </div>
          </div>

          <div id="adminContentSection" class="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
            <aside class="space-y-6">
              <div class="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-float">
                <h3 class="text-2xl font-black text-kidInk">اختيار الصف</h3>
                <label class="mt-4 block">
                  <span class="mb-2 block text-sm font-black text-kidInk">الصف الدراسي</span>
                  <select
                    id="adminGradeSelect"
                    class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-bold text-kidInk focus:outline-none focus:ring-4 focus:ring-sky-200"
                  >
                    ${catalog.grades.map((item) => `<option value="${item.id}" ${item.id === grade.id ? "selected" : ""}>${escapeHtml(item.label)}</option>`).join("")}
                  </select>
                </label>
              </div>

              <div class="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-float">
                <div class="flex items-center justify-between gap-3">
                  <h3 class="text-2xl font-black text-kidInk">مواد ${escapeHtml(grade.label)}</h3>
                  <button
                    id="addSubjectButton"
                    type="button"
                    class="rounded-2xl bg-gradient-to-br from-kidBlue to-kidGreen px-4 py-3 text-sm font-black text-kidInk transition hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-sky-200"
                  >
                    + إضافة مادة
                  </button>
                </div>
                <div class="mt-5 space-y-4">
                  ${grade.subjects.length === 0 ? `
                    <div class="rounded-[1.75rem] bg-slate-50 p-5 text-center">
                      <div class="text-5xl">📚</div>
                      <p class="mt-3 text-lg font-black text-kidInk">لا توجد مواد بعد</p>
                    </div>
                  ` : grade.subjects.map((item) => `
                    <article class="rounded-[1.75rem] border ${item.id === state.adminSubjectId ? "border-kidBlue bg-kidBlue/5" : "border-slate-100 bg-slate-50/90"} p-4 shadow-sm">
                      <div class="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          data-select-subject="${item.id}"
                          class="text-right text-lg font-black text-kidInk"
                        >
                          ${escapeHtml(item.label)}
                        </button>
                        <button
                          type="button"
                          data-delete-subject="${item.id}"
                          class="rounded-2xl bg-rose-100 px-3 py-2 text-xs font-black text-rose-700 transition hover:bg-rose-200 focus:outline-none focus:ring-4 focus:ring-rose-200"
                        >
                          حذف
                        </button>
                      </div>
                      <label class="mt-3 block">
                        <span class="mb-2 block text-xs font-black text-slate-500">اسم المادة</span>
                        <input
                          type="text"
                          value="${escapeHtml(item.label)}"
                          data-subject-label="${item.id}"
                          class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-kidInk focus:outline-none focus:ring-4 focus:ring-sky-200"
                        />
                      </label>
                      <label class="mt-3 block">
                        <span class="mb-2 block text-xs font-black text-slate-500">رابط الفيديو</span>
                        <input
                          type="text"
                          value="${escapeHtml(item.videoUrl)}"
                          data-subject-video="${item.id}"
                          class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-kidInk focus:outline-none focus:ring-4 focus:ring-sky-200"
                        />
                      </label>
                    </article>
                  `).join("")}
                </div>
              </div>
            </aside>

            <section class="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-float sm:p-6">
              ${
                !subject
                  ? `
                    <div class="rounded-[1.75rem] bg-slate-50 p-6 text-center">
                      <div class="text-5xl">🛠️</div>
                      <p class="mt-3 text-xl font-black text-kidInk">اختر مادة من القائمة</p>
                      <p class="mt-2 text-sm font-bold text-slate-500">ثم ابدأ بإدارة أسئلتها وفيديوها.</p>
                    </div>
                  `
                  : `
                    <div class="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 class="text-2xl font-black text-kidInk">أسئلة ${escapeHtml(subject.label)}</h3>
                        <p class="mt-2 text-sm leading-7 text-slate-500">يمكنك إضافة أي عدد من الأسئلة والخيارات لهذه المادة.</p>
                      </div>
                      <button
                        id="addQuestionButton"
                        type="button"
                        class="rounded-2xl bg-gradient-to-br from-kidYellow to-kidOrange px-4 py-3 text-sm font-black text-kidInk transition hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-yellow-200"
                      >
                        + إضافة سؤال
                      </button>
                    </div>

                    <div class="mt-6 space-y-4">
                      ${subject.questions.length === 0 ? `
                        <div class="rounded-[1.75rem] bg-slate-50 p-5 text-center">
                          <div class="text-5xl">❓</div>
                          <p class="mt-3 text-lg font-black text-kidInk">لا توجد أسئلة بعد</p>
                        </div>
                      ` : subject.questions.map((question, questionIndex) => renderAdminQuestionCard(question, questionIndex)).join("")}
                    </div>
                  `
              }
     </section>
          </div>

          <div id="adminStudentsSection" class="hidden overflow-x-auto rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-float sm:p-6">
             <table class="w-full text-right border-collapse min-w-[600px]">
                <thead>
                  <tr class="bg-slate-50 text-slate-500 text-sm">
                    <th class="p-4 border-b font-bold rounded-tr-xl">اسم الطالب</th>
                    <th class="p-4 border-b font-bold text-center">عدد النقاط المكتسبة</th>
                    <th class="p-4 border-b font-bold rounded-tl-xl text-center">مستوى التفاعل</th>
                  </tr>
                </thead>
                <tbody id="adminStudentsTableBody" class="text-kidInk font-bold">
                  </tbody>
              </table>
          </div>
        </div>
      `;

      bindAdminEvents();
      renderStudentsTable(); // استدعاء دالة رسم الجدول
    }       
    function renderAdminQuestionCard(question, questionIndex) {
      return `
        <article class="rounded-[1.85rem] border border-slate-100 bg-slate-50/90 p-4 shadow-sm">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500 shadow-sm">سؤال ${questionIndex + 1}</div>
            <button
              type="button"
              data-delete-question="${question.id}"
              class="rounded-2xl bg-rose-100 px-4 py-2 text-sm font-black text-rose-700 transition hover:bg-rose-200 focus:outline-none focus:ring-4 focus:ring-rose-200"
            >
              حذف السؤال
            </button>
          </div>

          <label class="mt-4 block">
            <span class="mb-2 block text-sm font-black text-kidInk">نص السؤال</span>
            <textarea
              rows="2"
              data-question-text="${question.id}"
              class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-bold text-kidInk focus:outline-none focus:ring-4 focus:ring-sky-200"
            >${escapeHtml(question.text)}</textarea>
          </label>

          <div class="mt-5 space-y-3">
            ${question.options.map((option, optionIndex) => `
              <div class="rounded-[1.4rem] bg-white p-3 shadow-sm">
                <div class="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
                  <input
                    type="text"
                    value="${escapeHtml(option)}"
                    data-option-text="${question.id}"
                    data-option-index="${optionIndex}"
                    class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-bold text-kidInk focus:outline-none focus:ring-4 focus:ring-sky-200"
                  />
                  <label class="inline-flex items-center justify-center gap-2 rounded-2xl bg-kidYellow/35 px-4 py-3 text-sm font-black text-kidInk">
                    <input
                      type="radio"
                      name="correct-${question.id}"
                      data-correct-option="${question.id}"
                      value="${optionIndex}"
                      ${optionIndex === question.correctIndex ? "checked" : ""}
                      class="h-4 w-4 accent-sky-500"
                    />
                    <span>الإجابة الصحيحة</span>
                  </label>
                  <button
                    type="button"
                    data-delete-option="${question.id}"
                    data-option-index="${optionIndex}"
                    class="rounded-2xl px-4 py-3 text-sm font-black transition focus:outline-none focus:ring-4 ${question.options.length <= 2 ? "cursor-not-allowed bg-slate-100 text-slate-400 focus:ring-slate-100" : "bg-rose-100 text-rose-700 hover:bg-rose-200 focus:ring-rose-200"}"
                    ${question.options.length <= 2 ? "disabled" : ""}
                  >
                    حذف الخيار
                  </button>
                </div>
              </div>
            `).join("")}
          </div>

          <button
            type="button"
            data-add-option="${question.id}"
            class="mt-4 rounded-2xl bg-kidBlue/15 px-4 py-3 text-sm font-black text-kidInk transition hover:bg-kidBlue/25 focus:outline-none focus:ring-4 focus:ring-sky-200"
          >
            + إضافة خيار
          </button>
        </article>
      `;
    }

    function bindAdminEvents() {
      adminView.querySelector("#adminLogoutButton")?.addEventListener("click", () => {
        localStorage.removeItem(STORAGE_KEYS.adminAuth);
        location.hash = "";
        goHome();
      });

      adminView.querySelector("#adminGradeSelect")?.addEventListener("change", (event) => {
        state.adminGradeId = Number(event.target.value);
        const grade = getAdminGrade();
        state.adminSubjectId = grade.subjects[0]?.id || null;
        renderAdminDashboard();
      });

      adminView.querySelector("#addSubjectButton")?.addEventListener("click", () => {
        const grade = getAdminGrade();
        const newSubject = {
          id: createId("subject"),
          key: createId("custom"),
          label: "مادة جديدة",
          icon: subjectIconFromKey("generic", "مادة جديدة"),
          videoUrl: DEFAULT_VIDEO_URL,
          questions: [],
        };
        grade.subjects.push(newSubject);
        state.adminSubjectId = newSubject.id;
        persistCatalog();
        renderAdminDashboard();
      });

      adminView.querySelectorAll("[data-select-subject]").forEach((button) => {
        button.addEventListener("click", () => {
          state.adminSubjectId = button.dataset.selectSubject;
          renderAdminDashboard();
        });
      });

      adminView.querySelectorAll("[data-delete-subject]").forEach((button) => {
        button.addEventListener("click", () => {
          const grade = getAdminGrade();
          const subjectId = button.dataset.deleteSubject;
          grade.subjects = grade.subjects.filter((item) => item.id !== subjectId);
          state.adminSubjectId = grade.subjects[0]?.id || null;
          persistCatalog();
          renderAdminDashboard();
        });
      });

      adminView.querySelectorAll("[data-subject-label]").forEach((input) => {
        input.addEventListener("input", (event) => {
          const subject = getAdminGrade().subjects.find((item) => item.id === event.target.dataset.subjectLabel);
          subject.label = event.target.value;
          subject.icon = subjectIconFromKey(subject.key, subject.label);
          persistCatalog();
        });
      });

      adminView.querySelectorAll("[data-subject-video]").forEach((input) => {
        input.addEventListener("input", (event) => {
          const subject = getAdminGrade().subjects.find((item) => item.id === event.target.dataset.subjectVideo);
          subject.videoUrl = event.target.value;
          persistCatalog();
        });
      });

      adminView.querySelector("#addQuestionButton")?.addEventListener("click", () => {
        const subject = getAdminSubject();
        subject.questions.push({
          id: createId("question"),
          text: "سؤال جديد",
          options: ["الخيار الأول", "الخيار الثاني"],
          correctIndex: 0,
        });
        persistCatalog();
        renderAdminDashboard();
      });

      adminView.querySelectorAll("[data-question-text]").forEach((textarea) => {
        textarea.addEventListener("input", (event) => {
          const question = getAdminSubject().questions.find((item) => item.id === event.target.dataset.questionText);
          question.text = event.target.value;
          persistCatalog();
        });
      });

      adminView.querySelectorAll("[data-option-text]").forEach((input) => {
        input.addEventListener("input", (event) => {
          const question = getAdminSubject().questions.find((item) => item.id === event.target.dataset.optionText);
          const optionIndex = Number(event.target.dataset.optionIndex);
          question.options[optionIndex] = event.target.value;
          persistCatalog();
        });
      });

      adminView.querySelectorAll("[data-correct-option]").forEach((radio) => {
        radio.addEventListener("change", (event) => {
          const question = getAdminSubject().questions.find((item) => item.id === event.target.dataset.correctOption);
          question.correctIndex = Number(event.target.value);
          persistCatalog();
        });
      });

      adminView.querySelectorAll("[data-delete-question]").forEach((button) => {
        button.addEventListener("click", () => {
          const subject = getAdminSubject();
          subject.questions = subject.questions.filter((item) => item.id !== button.dataset.deleteQuestion);
          persistCatalog();
          renderAdminDashboard();
        });
      });

      adminView.querySelectorAll("[data-add-option]").forEach((button) => {
        button.addEventListener("click", () => {
          const question = getAdminSubject().questions.find((item) => item.id === button.dataset.addOption);
          question.options.push(`خيار ${question.options.length + 1}`);
          persistCatalog();
          renderAdminDashboard();
        });
      });

      adminView.querySelectorAll("[data-delete-option]").forEach((button) => {
        button.addEventListener("click", () => {
          const question = getAdminSubject().questions.find((item) => item.id === button.dataset.deleteOption);
          if (question.options.length <= 2) return;
          const optionIndex = Number(button.dataset.optionIndex);
          question.options.splice(optionIndex, 1);
          if (question.correctIndex === optionIndex) {
            question.correctIndex = 0;
          } else if (question.correctIndex > optionIndex) {
            question.correctIndex -= 1;
          }
          persistCatalog();
          renderAdminDashboard();
        });
      });
    }

window.switchAdminTab = function(tabName) {
      const isContent = tabName === 'content';
      document.getElementById('adminContentSection').classList.toggle('hidden', !isContent);
      document.getElementById('adminStudentsSection').classList.toggle('hidden', isContent);
      
      document.getElementById('tabContentBtn').className = isContent ? "rounded-xl bg-kidBlue text-white px-5 py-2.5 text-sm font-black shadow-sm transition" : "rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 px-5 py-2.5 text-sm font-black transition";
      document.getElementById('tabStudentsBtn').className = !isContent ? "rounded-xl bg-kidBlue text-white px-5 py-2.5 text-sm font-black shadow-sm transition" : "rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 px-5 py-2.5 text-sm font-black transition";
      
      if (!isContent) renderStudentsTable();
    };

    function renderStudentsTable() {
      const tbody = document.getElementById('adminStudentsTableBody');
      if (!tbody) return;
      const store = loadStudentStore();
      
      // سحب أسماء الطلبة وترتيبهم تنازلياً حسب النقاط
      const students = Object.values(store).sort((a, b) => b.score - a.score); 

      if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="p-8 text-center text-slate-500 font-bold">لا يوجد طلبة مسجلين أو نقاط حتى الآن.</td></tr>';
        return;
      }

      tbody.innerHTML = students.map(student => `
        <tr class="hover:bg-slate-50 transition-colors border-b border-slate-100">
          <td class="p-4 text-lg">${escapeHtml(student.name)}</td>
          <td class="p-4 text-center"><span class="bg-kidYellow/40 text-kidInk px-4 py-1.5 rounded-full text-sm font-black">⭐ ${student.score} نقطة</span></td>
          <td class="p-4 text-center">
            <div class="w-full bg-slate-100 rounded-full h-2.5 max-w-[120px] mx-auto overflow-hidden">
              <div class="bg-kidGreen h-full rounded-full transition-all duration-500" style="width: ${Math.min(100, student.score * 10)}%"></div>
            </div>
          </td>
        </tr>
      `).join('');
    }
    function getAdminTabButtonClass(isActive) {
      return isActive
        ? "rounded-xl bg-kidBlue text-white px-5 py-2.5 text-sm font-black shadow-sm transition"
        : "rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 px-5 py-2.5 text-sm font-black transition";
    }

    function renderAdminDashboard() {
      const grade = getAdminGrade();
      const subject = getAdminSubject();
      const activeTab = ["content", "students", "permissions"].includes(state.adminTab) ? state.adminTab : "content";

      adminView.innerHTML = `
        <div class="space-y-6">
          <div class="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-float">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p class="inline-flex rounded-full bg-kidPink/15 px-4 py-2 text-sm font-black text-kidInk">محتوى المنصة</p>
                <h2 class="mt-3 text-3xl font-black text-kidInk">لوحة الإدارة</h2>
                <p class="mt-2 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                  من هنا يمكنك إدارة المواد الخاصة بكل صف، وتحديث روابط الفيديو، وإضافة الأسئلة والخيارات، والتحكم في صلاحيات الطلبة.
                </p>
              </div>
              <button
                id="adminLogoutButton"
                type="button"
                class="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-kidInk transition hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-200"
              >
                تسجيل خروج الإدارة
              </button>
            </div>
            <div class="mt-4 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
              <button onclick="switchAdminTab('content')" id="tabContentBtn" class="${getAdminTabButtonClass(activeTab === "content")}">إدارة المحتوى</button>
              <button onclick="switchAdminTab('students')" id="tabStudentsBtn" class="${getAdminTabButtonClass(activeTab === "students")}">سجل الطلبة</button>
              <button onclick="switchAdminTab('permissions')" id="tabPermissionsBtn" class="${getAdminTabButtonClass(activeTab === "permissions")}">صلاحيات الطلبة</button>
            </div>
          </div>

          <div id="adminContentSection" class="${activeTab === "content" ? "grid" : "hidden"} gap-6 xl:grid-cols-[0.88fr_1.12fr]">
            <aside class="space-y-6">
              <div class="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-float">
                <h3 class="text-2xl font-black text-kidInk">اختيار الصف</h3>
                <label class="mt-4 block">
                  <span class="mb-2 block text-sm font-black text-kidInk">الصف الدراسي</span>
                  <select
                    id="adminGradeSelect"
                    class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-bold text-kidInk focus:outline-none focus:ring-4 focus:ring-sky-200"
                  >
                    ${catalog.grades.map((item) => `<option value="${item.id}" ${item.id === grade.id ? "selected" : ""}>${escapeHtml(item.label)}</option>`).join("")}
                  </select>
                </label>
              </div>

              <div class="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-float">
                <div class="flex items-center justify-between gap-3">
                  <h3 class="text-2xl font-black text-kidInk">مواد ${escapeHtml(grade.label)}</h3>
                  <button
                    id="addSubjectButton"
                    type="button"
                    class="rounded-2xl bg-gradient-to-br from-kidBlue to-kidGreen px-4 py-3 text-sm font-black text-kidInk transition hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-sky-200"
                  >
                    + إضافة مادة
                  </button>
                </div>
                <div class="mt-5 space-y-4">
                  ${grade.subjects.length === 0 ? `
                    <div class="rounded-[1.75rem] bg-slate-50 p-5 text-center">
                      <div class="text-5xl">📘</div>
                      <p class="mt-3 text-lg font-black text-kidInk">لا توجد مواد بعد</p>
                    </div>
                  ` : grade.subjects.map((item) => `
                    <article class="rounded-[1.75rem] border ${item.id === state.adminSubjectId ? "border-kidBlue bg-kidBlue/5" : "border-slate-100 bg-slate-50/90"} p-4 shadow-sm">
                      <div class="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          data-select-subject="${item.id}"
                          class="text-right text-lg font-black text-kidInk"
                        >
                          ${escapeHtml(item.label)}
                        </button>
                        <button
                          type="button"
                          data-delete-subject="${item.id}"
                          class="rounded-2xl bg-rose-100 px-3 py-2 text-xs font-black text-rose-700 transition hover:bg-rose-200 focus:outline-none focus:ring-4 focus:ring-rose-200"
                        >
                          حذف
                        </button>
                      </div>
                      <label class="mt-3 block">
                        <span class="mb-2 block text-xs font-black text-slate-500">اسم المادة</span>
                        <input
                          type="text"
                          value="${escapeHtml(item.label)}"
                          data-subject-label="${item.id}"
                          class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-kidInk focus:outline-none focus:ring-4 focus:ring-sky-200"
                        />
                      </label>
                      <label class="mt-3 block">
                        <span class="mb-2 block text-xs font-black text-slate-500">رابط الفيديو</span>
                        <input
                          type="text"
                          value="${escapeHtml(item.videoUrl)}"
                          data-subject-video="${item.id}"
                          class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-kidInk focus:outline-none focus:ring-4 focus:ring-sky-200"
                        />
                      </label>
                    </article>
                  `).join("")}
                </div>
              </div>
            </aside>

            <section class="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-float sm:p-6">
              ${
                !subject
                  ? `
                    <div class="rounded-[1.75rem] bg-slate-50 p-6 text-center">
                      <div class="text-5xl">🛰️</div>
                      <p class="mt-3 text-xl font-black text-kidInk">اختر مادة من القائمة</p>
                      <p class="mt-2 text-sm font-bold text-slate-500">ثم ابدأ بإدارة أسئلتها وفيديوها.</p>
                    </div>
                  `
                  : `
                    <div class="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 class="text-2xl font-black text-kidInk">أسئلة ${escapeHtml(subject.label)}</h3>
                        <p class="mt-2 text-sm leading-7 text-slate-500">يمكنك إضافة أي عدد من الأسئلة والخيارات لهذه المادة.</p>
                      </div>
                      <button
                        id="addQuestionButton"
                        type="button"
                        class="rounded-2xl bg-gradient-to-br from-kidYellow to-kidOrange px-4 py-3 text-sm font-black text-kidInk transition hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-yellow-200"
                      >
                        + إضافة سؤال
                      </button>
                    </div>

                    <div class="mt-6 space-y-4">
                      ${subject.questions.length === 0 ? `
                        <div class="rounded-[1.75rem] bg-slate-50 p-5 text-center">
                          <div class="text-5xl">➕</div>
                          <p class="mt-3 text-lg font-black text-kidInk">لا توجد أسئلة بعد</p>
                        </div>
                      ` : subject.questions.map((question, questionIndex) => renderAdminQuestionCard(question, questionIndex)).join("")}
                    </div>
                  `
              }
            </section>
          </div>

          <div id="adminStudentsSection" class="${activeTab === "students" ? "overflow-x-auto" : "hidden"} rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-float sm:p-6">
            <table class="w-full min-w-[600px] border-collapse text-right">
              <thead>
                <tr class="bg-slate-50 text-sm text-slate-500">
                  <th class="rounded-tr-xl border-b p-4 font-bold">اسم الطالب</th>
                  <th class="border-b p-4 text-center font-bold">عدد النقاط المكتسبة</th>
                  <th class="rounded-tl-xl border-b p-4 text-center font-bold">مستوى التفاعل</th>
                </tr>
              </thead>
              <tbody id="adminStudentsTableBody" class="font-bold text-kidInk"></tbody>
            </table>
          </div>

          <div id="adminPermissionsSection" class="${activeTab === "permissions" ? "space-y-6" : "hidden"}">
            <div class="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-float sm:p-6">
              <div>
                <h3 class="text-2xl font-black text-kidInk">صلاحيات الطلبة</h3>
                <p class="mt-2 text-sm leading-7 text-slate-500">أضف الاسم والصف المسموح له بالدخول، ثم احفظه في القائمة.</p>
              </div>
              <div class="mt-5 grid gap-4 lg:grid-cols-[1fr_220px_auto]">
                <label class="block">
                  <span class="mb-2 block text-sm font-black text-kidInk">اسم الطالب</span>
                  <input
                    id="whitelistNameInput"
                    type="text"
                    class="w-full rounded-[2rem] border border-slate-200 bg-white px-4 py-3 text-base font-bold text-kidInk focus:outline-none focus:ring-4 focus:ring-sky-200"
                    placeholder="اكتب الاسم كما سيُستخدم"
                  />
                </label>
                <label class="block">
                  <span class="mb-2 block text-sm font-black text-kidInk">الصف الدراسي</span>
                  <select
                    id="whitelistGradeSelect"
                    class="w-full rounded-[2rem] border border-slate-200 bg-white px-4 py-3 text-base font-bold text-kidInk focus:outline-none focus:ring-4 focus:ring-sky-200"
                  >
                    <option value="">اختر الصف</option>
                    ${catalog.grades.map((item) => `<option value="${item.id}">${escapeHtml(item.label)}</option>`).join("")}
                  </select>
                </label>
                <div class="flex items-end">
                  <button
                    id="addWhitelistButton"
                    type="button"
                    class="w-full rounded-[2rem] bg-gradient-to-br from-kidBlue to-kidGreen px-5 py-3 text-base font-black text-kidInk transition hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-sky-200"
                  >
                    إضافة
                  </button>
                </div>
              </div>
            </div>

            <div class="overflow-x-auto rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-float sm:p-6">
              <table class="w-full min-w-[560px] border-collapse text-right">
                <thead>
                  <tr class="bg-slate-50 text-sm text-slate-500">
                    <th class="rounded-tr-xl border-b p-4 font-bold">اسم الطالب</th>
                    <th class="border-b p-4 text-center font-bold">الصف</th>
                    <th class="rounded-tl-xl border-b p-4 text-center font-bold">إجراء</th>
                  </tr>
                </thead>
                <tbody id="adminWhitelistTableBody" class="font-bold text-kidInk"></tbody>
              </table>
            </div>
          </div>
        </div>
      `;

      bindAdminEvents();
      renderStudentsTable();
      renderWhitelistTable();
    }

    function bindAdminEvents() {
      adminView.querySelector("#adminLogoutButton")?.addEventListener("click", () => {
        localStorage.removeItem(STORAGE_KEYS.adminAuth);
        location.hash = "";
        goHome();
      });

      adminView.querySelector("#adminGradeSelect")?.addEventListener("change", (event) => {
        state.adminGradeId = Number(event.target.value);
        const grade = getAdminGrade();
        state.adminSubjectId = grade.subjects[0]?.id || null;
        renderAdminDashboard();
      });

      adminView.querySelector("#addSubjectButton")?.addEventListener("click", () => {
        const grade = getAdminGrade();
        const newSubject = {
          id: createId("subject"),
          key: createId("custom"),
          label: "مادة جديدة",
          icon: subjectIconFromKey("generic", "مادة جديدة"),
          videoUrl: DEFAULT_VIDEO_URL,
          questions: [],
        };
        grade.subjects.push(newSubject);
        state.adminSubjectId = newSubject.id;
        persistCatalog();
        renderAdminDashboard();
      });

      adminView.querySelectorAll("[data-select-subject]").forEach((button) => {
        button.addEventListener("click", () => {
          state.adminSubjectId = button.dataset.selectSubject;
          renderAdminDashboard();
        });
      });

      adminView.querySelectorAll("[data-delete-subject]").forEach((button) => {
        button.addEventListener("click", () => {
          const grade = getAdminGrade();
          const subjectId = button.dataset.deleteSubject;
          grade.subjects = grade.subjects.filter((item) => item.id !== subjectId);
          state.adminSubjectId = grade.subjects[0]?.id || null;
          persistCatalog();
          renderAdminDashboard();
        });
      });

      adminView.querySelectorAll("[data-subject-label]").forEach((input) => {
        input.addEventListener("input", (event) => {
          const subject = getAdminGrade().subjects.find((item) => item.id === event.target.dataset.subjectLabel);
          subject.label = event.target.value;
          subject.icon = subjectIconFromKey(subject.key, subject.label);
          persistCatalog();
        });
      });

      adminView.querySelectorAll("[data-subject-video]").forEach((input) => {
        input.addEventListener("input", (event) => {
          const subject = getAdminGrade().subjects.find((item) => item.id === event.target.dataset.subjectVideo);
          subject.videoUrl = event.target.value;
          persistCatalog();
        });
      });

      adminView.querySelector("#addQuestionButton")?.addEventListener("click", () => {
        const subject = getAdminSubject();
        subject.questions.push({
          id: createId("question"),
          text: "سؤال جديد",
          options: ["الخيار الأول", "الخيار الثاني"],
          correctIndex: 0,
        });
        persistCatalog();
        renderAdminDashboard();
      });

      adminView.querySelectorAll("[data-question-text]").forEach((textarea) => {
        textarea.addEventListener("input", (event) => {
          const question = getAdminSubject().questions.find((item) => item.id === event.target.dataset.questionText);
          question.text = event.target.value;
          persistCatalog();
        });
      });

      adminView.querySelectorAll("[data-option-text]").forEach((input) => {
        input.addEventListener("input", (event) => {
          const question = getAdminSubject().questions.find((item) => item.id === event.target.dataset.optionText);
          const optionIndex = Number(event.target.dataset.optionIndex);
          question.options[optionIndex] = event.target.value;
          persistCatalog();
        });
      });

      adminView.querySelectorAll("[data-correct-option]").forEach((radio) => {
        radio.addEventListener("change", (event) => {
          const question = getAdminSubject().questions.find((item) => item.id === event.target.dataset.correctOption);
          question.correctIndex = Number(event.target.value);
          persistCatalog();
        });
      });

      adminView.querySelectorAll("[data-delete-question]").forEach((button) => {
        button.addEventListener("click", () => {
          const subject = getAdminSubject();
          subject.questions = subject.questions.filter((item) => item.id !== button.dataset.deleteQuestion);
          persistCatalog();
          renderAdminDashboard();
        });
      });

      adminView.querySelectorAll("[data-add-option]").forEach((button) => {
        button.addEventListener("click", () => {
          const question = getAdminSubject().questions.find((item) => item.id === button.dataset.addOption);
          question.options.push(`خيار ${question.options.length + 1}`);
          persistCatalog();
          renderAdminDashboard();
        });
      });

      adminView.querySelectorAll("[data-delete-option]").forEach((button) => {
        button.addEventListener("click", () => {
          const question = getAdminSubject().questions.find((item) => item.id === button.dataset.deleteOption);
          if (question.options.length <= 2) return;
          const optionIndex = Number(button.dataset.optionIndex);
          question.options.splice(optionIndex, 1);
          if (question.correctIndex === optionIndex) {
            question.correctIndex = 0;
          } else if (question.correctIndex > optionIndex) {
            question.correctIndex -= 1;
          }
          persistCatalog();
          renderAdminDashboard();
        });
      });

      adminView.querySelector("#addWhitelistButton")?.addEventListener("click", async () => {
        const nameInput = adminView.querySelector("#whitelistNameInput");
        const gradeSelect = adminView.querySelector("#whitelistGradeSelect");
        const addBtn = adminView.querySelector("#addWhitelistButton");
        
        const name = String(nameInput?.value || "").trim();
        const gradeId = gradeSelect?.value || "";
        
        if (!name || !gradeId) {
          if (!name) triggerShake(nameInput);
          if (!gradeId) triggerShake(gradeSelect);
          return;
        }

        addBtn.textContent = "جاري الإضافة للسحابة...";
        addBtn.disabled = true;

        // 💡 البحث في السحابة للتأكد إن الطالب مش متسجل قبل كدا
        const { data: existing } = await supabaseClient.from('students_whitelist').select('id').eq('name', name).eq('grade_id', Number(gradeId));
        
        if (!existing || existing.length === 0) {
          try {
            // 💡 اختراع كود سري عشوائي من 4 أرقام
            const randomSecretCode = Math.floor(1000 + Math.random() * 9000).toString();
            await supabaseClient.from('students_whitelist').insert([{ name: name, grade_id: Number(gradeId), secret_code: randomSecretCode }]);
            nameInput.value = "";
          } catch (error) {
            console.error("خطأ أثناء الإضافة:", error);
            alert("حدث خطأ أثناء الاتصال بقاعدة البيانات.");
          }
        } else {
          alert("هذا الطالب مسجل مسبقاً في هذا الصف!");
        }

        addBtn.textContent = "إضافة";
        addBtn.disabled = false;
        renderWhitelistTable();
      });
    }

    window.switchAdminTab = function(tabName) {
      state.adminTab = tabName;
      const contentSection = document.getElementById("adminContentSection");
      const studentsSection = document.getElementById("adminStudentsSection");
      const permissionsSection = document.getElementById("adminPermissionsSection");
      if (!contentSection || !studentsSection || !permissionsSection) return;

      contentSection.classList.toggle("hidden", tabName !== "content");
      studentsSection.classList.toggle("hidden", tabName !== "students");
      if (tabName === "students") {
        studentsSection.classList.add("overflow-x-auto");
      }
      permissionsSection.classList.toggle("hidden", tabName !== "permissions");

      const contentBtn = document.getElementById("tabContentBtn");
      const studentsBtn = document.getElementById("tabStudentsBtn");
      const permissionsBtn = document.getElementById("tabPermissionsBtn");
      if (contentBtn) contentBtn.className = getAdminTabButtonClass(tabName === "content");
      if (studentsBtn) studentsBtn.className = getAdminTabButtonClass(tabName === "students");
      if (permissionsBtn) permissionsBtn.className = getAdminTabButtonClass(tabName === "permissions");

      if (tabName === "students") {
        renderStudentsTable();
      }
      if (tabName === "permissions") {
        renderWhitelistTable();
      }
    };

    function renderStudentsTable() {
      const tbody = document.getElementById("adminStudentsTableBody");
      if (!tbody) return;
      const store = loadStudentStore();
      const students = Object.entries(store)
        .map(([key, student]) => ({ key, ...student }))
        .sort((a, b) => b.score - a.score);

      if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="p-8 text-center text-slate-500 font-bold">لا يوجد طلبة مسجلين أو نقاط حتى الآن.</td></tr>';
        return;
      }

      tbody.innerHTML = students.map((student) => `
        <tr class="border-b border-slate-100 transition-colors hover:bg-slate-50">
          <td class="p-4 text-lg">${escapeHtml(student.name)}</td>
          <td class="p-4 text-center">
            <div class="flex flex-col items-center gap-2">
              <span class="rounded-full bg-kidYellow/40 px-4 py-1.5 text-sm font-black text-kidInk">⭐ ${student.score} نقطة</span>
              <button
                type="button"
                data-reset-student="${escapeHtml(student.key)}"
                class="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-600 transition hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-200"
              >
                🔄 إعادة تعيين النقاط
              </button>
            </div>
          </td>
          <td class="p-4 text-center">
            <div class="mx-auto h-2.5 w-full max-w-[120px] overflow-hidden rounded-full bg-slate-100">
              <div class="h-full rounded-full bg-kidGreen transition-all duration-500" style="width: ${Math.min(100, student.score * 10)}%"></div>
            </div>
          </td>
        </tr>
      `).join("");

      tbody.querySelectorAll("[data-reset-student]").forEach((button) => {
        button.addEventListener("click", () => {
          if (!confirm("هل تريد إعادة تعيين نقاط هذا الطالب؟")) {
            return;
          }
          const store = loadStudentStore();
          const student = store[button.dataset.resetStudent];
          if (!student) return;
          student.score = 0;
          student.awarded = {};
          saveStudentStore(store);
          renderStudentsTable();
          renderStudentBadge();
        });
      });
    }

    async function renderWhitelistTable() {
      const tbody = document.getElementById("adminWhitelistTableBody");
      if (!tbody) return;
      
      tbody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-slate-500 font-bold">جاري تحميل البيانات من السحابة ☁️...</td></tr>';
      
      const whitelist = await fetchWhitelistFromDB();

      const thead = tbody.parentElement.querySelector("thead tr");
      if (thead) {
        thead.innerHTML = `
          <th class="rounded-tr-xl border-b p-4 font-bold">اسم الطالب</th>
          <th class="border-b p-4 text-center font-bold">الصف</th>
          <th class="border-b p-4 text-center font-bold text-kidBlue">الكود السري</th>
          <th class="rounded-tl-xl border-b p-4 text-center font-bold">إجراء</th>
        `;
      }

      if (whitelist.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-slate-500 font-bold">لا توجد صلاحيات مضافة في قاعدة البيانات حتى الآن.</td></tr>';
        return;
      }

      tbody.innerHTML = whitelist.map((entry) => `
        <tr class="border-b border-slate-100 transition-colors hover:bg-slate-50">
          <td class="p-4 text-lg">${escapeHtml(entry.name)}</td>
          <td class="p-4 text-center">${escapeHtml(getGradeById(entry.grade_id)?.label || `الصف ${entry.grade_id}`)}</td>
          <td class="p-4 text-center font-black text-xl text-kidBlue tracking-widest bg-kidBlue/5">${escapeHtml(entry.secret_code || "1234")}</td>
          <td class="p-4 text-center">
            <button type="button" data-remove-whitelist="${entry.id}" class="rounded-2xl bg-rose-100 px-3 py-2 text-xs font-black text-rose-700 transition hover:bg-rose-200 focus:outline-none focus:ring-4 focus:ring-rose-200">إزالة</button>
          </td>
        </tr>
      `).join("");

      tbody.querySelectorAll("[data-remove-whitelist]").forEach((button) => {
        button.addEventListener("click", async () => {
          const id = button.dataset.removeWhitelist;
          button.textContent = "جاري الحذف...";
          button.disabled = true;
          try {
            await supabaseClient.from('students_whitelist').delete().eq('id', id);
            renderWhitelistTable();
          } catch(err) { console.error("Error deleting:", err); }
        });
      });
    }

    
    function switchView(viewName) {
      state.currentView = viewName;
      homeView.classList.toggle("hidden", viewName !== "home");
      gradeView.classList.toggle("hidden", viewName !== "grade");
      quizView.classList.toggle("hidden", viewName !== "quiz");
      adminView.classList.toggle("hidden", viewName !== "admin");
      renderStudentBadge();
      document.title = getPageTitle();
    }

    function getPageTitle() {
      if (state.currentView === "home") return "أكاديمية التعلّم الممتع";
      if (state.currentView === "grade") return `${getSelectedGrade()?.label} | أكاديمية التعلّم الممتع`;
      if (state.currentView === "quiz") return `${getSelectedSubject()?.label} | ${getSelectedGrade()?.label}`;
      if (state.currentView === "admin") return "لوحة الإدارة | أكاديمية التعلّم الممتع";
      return "أكاديمية التعلّم الممتع";
    }

    function goHome() {
      state.currentView = "home";
      state.selectedGradeId = null;
      state.selectedSubjectId = null;
      renderGradeCards();
      switchView("home");
      updateHeader();
      ensureStudentIdentity();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function goBack() {
      if (state.currentView === "quiz" && state.selectedGradeId) {
        renderGradeView();
        switchView("grade");
        updateHeader();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (state.currentView === "grade" || state.currentView === "admin") {
        if (state.currentView === "admin") {
          location.hash = "";
        }
        goHome();
      }
    }

    function updateHeader() {
      if (state.currentView === "home") {
        breadcrumb.textContent = "منصة تعليمية تفاعلية";
        pageHeading.textContent = "أهلاً بك في رحلة التعلّم";
        backButton.classList.add("hidden");
        homeButton.classList.add("hidden");
        return;
      }

      homeButton.classList.remove("hidden");

      if (state.currentView === "grade") {
        breadcrumb.textContent = "الصفوف الدراسية";
        pageHeading.textContent = getSelectedGrade().label;
        backButton.textContent = "رجوع للصفوف";
        backButton.classList.remove("hidden");
        return;
      }

      if (state.currentView === "quiz") {
        breadcrumb.textContent = `${getSelectedGrade().label} / ${getSelectedSubject().label}`;
        pageHeading.textContent = `مادة ${getSelectedSubject().label}`;
        backButton.textContent = "رجوع للمواد";
        backButton.classList.remove("hidden");
        return;
      }

      breadcrumb.textContent = "إدارة المحتوى";
      pageHeading.textContent = "لوحة الإدارة";
      backButton.textContent = "العودة للمنصة";
      backButton.classList.remove("hidden");
    }

    function openAdminRoute() {
      closeStudentPrompt();
      state.currentView = "admin";
      const currentAdminGrade = getAdminGrade();
      if (!currentAdminGrade) {
        state.adminGradeId = 1;
      }
      if (!state.adminSubjectId) {
        state.adminSubjectId = getAdminGrade()?.subjects[0]?.id || null;
      }
      switchView("admin");
      updateHeader();
      if (isAdminAuthenticated()) {
        renderAdminDashboard();
      } else {
        renderAdminAuthView();
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleHashRoute() {
      const hash = location.hash;
      const currentStudentSession = localStorage.getItem(STORAGE_KEYS.currentStudent);
      let currentStudent = null;

      try {
        currentStudent = currentStudentSession ? JSON.parse(currentStudentSession) : null;
      } catch (error) {
        currentStudent = null;
      }

      const currentStudentKey = currentStudent?.normalizedName || currentStudentSession;
      const currentStudentRecord = currentStudent || getCurrentStudentRecord();

      if (currentStudentKey && currentStudentRecord && !hash.startsWith("#admin")) {
        try {
          const client = typeof supabaseClient !== "undefined" ? supabaseClient : (typeof _supabase !== "undefined" ? _supabase : null);
          let data = null;
          let error = null;

          if (currentStudent?.normalizedName && currentStudent?.grade && currentStudent?.secretCode) {
            const response = await client
              .from("students_whitelist")
              .select("id")
              .eq("normalized_name", currentStudent.normalizedName)
              .eq("grade", currentStudent.grade)
              .eq("secret_code", currentStudent.secretCode)
              .single();

            data = response.data;
            error = response.error;
          } else {
            const response = await client
              .from("students_whitelist")
              .select("id, name, grade_id, secret_code")
              .eq("grade_id", Number(currentStudentRecord.gradeId));

            error = response.error;
            data = response.data?.find((student) => normalizeName(student.name) === currentStudentKey) || null;
          }

          if (error || !data) {
            alert("عذراً، انتهت صلاحية الجلسة أو تم تعديل صلاحياتك. يرجى تسجيل الدخول مجدداً.");
            localStorage.removeItem(STORAGE_KEYS.currentStudent);
            state.currentStudentKey = "";
            location.hash = "";
            if (typeof showAuthModal === "function") {
              showAuthModal();
            } else {
              openStudentPrompt();
            }
            return;
          }
        } catch (err) {
          console.error("Error during real-time student verification:", err);
        }
      }

      if (hash === "#admin") {
        openAdminRoute();
      } else if (state.currentView === "admin") {
        goHome();
      }
    }

    function getIconSvg(iconName, extraClasses = "h-14 w-14") {
      const base = `class="${extraClasses}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"`;
      const icons = {
        star: `
          <svg ${base} aria-hidden="true">
            <circle cx="32" cy="32" r="29" fill="#ffffff" fill-opacity="0.82"/>
            <path d="M32 13l5.5 11.2 12.3 1.8-8.9 8.7 2.1 12.3L32 41.5 21 47l2.1-12.3-8.9-8.7 12.3-1.8L32 13z" fill="#FFE45E" stroke="#173558" stroke-width="2.3" stroke-linejoin="round"/>
          </svg>
        `,
        rocket: `
          <svg ${base} aria-hidden="true">
            <circle cx="32" cy="32" r="29" fill="#ffffff" fill-opacity="0.82"/>
            <path d="M37.8 17.6c6.8 1.1 10.6 4.9 11.7 11.7l-10.5 10.5c-1.9 1.9-4.4 3-7.1 3.1l-10 0.3 0.3-10c0.1-2.7 1.2-5.2 3.1-7.1l10.5-10.5z" fill="#27D4FF" stroke="#173558" stroke-width="2.3" stroke-linejoin="round"/>
            <circle cx="37.5" cy="26.5" r="3.6" fill="#FFE45E" stroke="#173558" stroke-width="2"/>
          </svg>
        `,
        pencil: `
          <svg ${base} aria-hidden="true">
            <circle cx="32" cy="32" r="29" fill="#ffffff" fill-opacity="0.82"/>
            <path d="M18 43.5L41.7 19.8l6.5 6.5L24.5 50H18v-6.5z" fill="#FFE45E" stroke="#173558" stroke-width="2.3" stroke-linejoin="round"/>
            <path d="M41.7 19.8l3.1-3.1a3.8 3.8 0 015.4 0l1.2 1.2a3.8 3.8 0 010 5.4l-3.2 3.1-6.5-6.6z" fill="#FF6DB2" stroke="#173558" stroke-width="2.3" stroke-linejoin="round"/>
          </svg>
        `,
        sun: `
          <svg ${base} aria-hidden="true">
            <circle cx="32" cy="32" r="29" fill="#ffffff" fill-opacity="0.82"/>
            <circle cx="32" cy="32" r="10" fill="#FFE45E" stroke="#173558" stroke-width="2.3"/>
            <path d="M32 13v6m0 26v6M13 32h6m26 0h6M19.3 19.3l4.2 4.2m16.9 16.9l4.3 4.3m0-25.4l-4.3 4.2M23.5 40.5l-4.2 4.2" stroke="#173558" stroke-width="2.3" stroke-linecap="round"/>
          </svg>
        `,
        rainbow: `
          <svg ${base} aria-hidden="true">
            <circle cx="32" cy="32" r="29" fill="#ffffff" fill-opacity="0.82"/>
            <path d="M17 40a15 15 0 0130 0" stroke="#FF6DB2" stroke-width="5" stroke-linecap="round"/>
            <path d="M21 40a11 11 0 0122 0" stroke="#FFE45E" stroke-width="5" stroke-linecap="round"/>
            <path d="M25 40a7 7 0 0114 0" stroke="#27D4FF" stroke-width="5" stroke-linecap="round"/>
          </svg>
        `,
        trophy: `
          <svg ${base} aria-hidden="true">
            <circle cx="32" cy="32" r="29" fill="#ffffff" fill-opacity="0.82"/>
            <path d="M23 16h18v8a9 9 0 01-18 0v-8z" fill="#FFE45E" stroke="#173558" stroke-width="2.3" stroke-linejoin="round"/>
            <path d="M23 19h-6a4 4 0 004 8h3m17-8h6a4 4 0 01-4 8h-3" stroke="#173558" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M32 33v8m-7 7h14m-10-7h6" stroke="#173558" stroke-width="2.3" stroke-linecap="round"/>
          </svg>
        `,
        book: `
          <svg ${base} aria-hidden="true">
            <rect x="11" y="15" width="42" height="34" rx="8" fill="#FFFFFF" fill-opacity="0.82"/>
            <path d="M17 20.5A5.5 5.5 0 0122.5 15H32v28h-9.5A5.5 5.5 0 0017 48.5v-28z" fill="#FF9C6E" stroke="#173558" stroke-width="2.3" stroke-linejoin="round"/>
            <path d="M47 20.5A5.5 5.5 0 0041.5 15H32v28h9.5a5.5 5.5 0 015.5 5.5v-28z" fill="#27D4FF" stroke="#173558" stroke-width="2.3" stroke-linejoin="round"/>
          </svg>
        `,
        calculator: `
          <svg ${base} aria-hidden="true">
            <rect x="15" y="10" width="34" height="44" rx="9" fill="#FFFFFF" fill-opacity="0.82" stroke="#173558" stroke-width="2.3"/>
            <rect x="21" y="16" width="22" height="8" rx="3" fill="#D3F8FF" stroke="#173558" stroke-width="2"/>
            <circle cx="24" cy="32" r="3.3" fill="#FFE45E"/>
            <circle cx="32" cy="32" r="3.3" fill="#98EC54"/>
            <circle cx="40" cy="32" r="3.3" fill="#FF6DB2"/>
            <circle cx="24" cy="41" r="3.3" fill="#FF6DB2"/>
            <circle cx="32" cy="41" r="3.3" fill="#FFE45E"/>
            <rect x="37" y="38" width="6" height="10" rx="2" fill="#27D4FF"/>
          </svg>
        `,
        abc: `
          <svg ${base} aria-hidden="true">
            <rect x="10" y="14" width="44" height="36" rx="10" fill="#FFFFFF" fill-opacity="0.82" stroke="#173558" stroke-width="2.3"/>
            <text x="32" y="39" text-anchor="middle" font-size="18" font-weight="800" fill="#8A92FF" font-family="Cairo, sans-serif">ABC</text>
          </svg>
        `,
        robot: `
          <svg ${base} aria-hidden="true">
            <rect x="16" y="18" width="32" height="24" rx="10" fill="#FFFFFF" fill-opacity="0.82" stroke="#173558" stroke-width="2.3"/>
            <path d="M32 12v6m-9 30v4m18-4v4M24 42h16" stroke="#173558" stroke-width="2.3" stroke-linecap="round"/>
            <circle cx="25" cy="30" r="4" fill="#27D4FF" stroke="#173558" stroke-width="2"/>
            <circle cx="39" cy="30" r="4" fill="#FFE45E" stroke="#173558" stroke-width="2"/>
          </svg>
        `,
        moon: `
          <svg ${base} aria-hidden="true">
            <circle cx="32" cy="32" r="29" fill="#ffffff" fill-opacity="0.82"/>
            <path d="M37 16c-7 2-12 8.6-12 16.1C25 40.4 31.6 47 40 47c2.4 0 4.6-.5 6.6-1.5A17.2 17.2 0 1137 16z" fill="#8A92FF" stroke="#173558" stroke-width="2.3" stroke-linejoin="round"/>
            <circle cx="43.5" cy="23" r="2" fill="#FFE45E"/>
          </svg>
        `,
        globe: `
          <svg ${base} aria-hidden="true">
            <circle cx="32" cy="32" r="21" fill="#DFFBFF" stroke="#173558" stroke-width="2.3"/>
            <path d="M11 32h42M32 11c6 6 8.5 13.2 8.5 21S38 47 32 53M32 11c-6 6-8.5 13.2-8.5 21S26 47 32 53" stroke="#173558" stroke-width="2.3" stroke-linecap="round"/>
          </svg>
        `,
      };
      return icons[iconName] || icons.book;
    }

    backButton.addEventListener("click", goBack);
    homeButton.addEventListener("click", () => {
      location.hash = "";
      goHome();
    });
    saveStudentNameButton.addEventListener("click", saveStudentName);
    studentNameInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveStudentName();
      }
    });
    studentGradeInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveStudentName();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === "a") {
        event.preventDefault();
        location.hash = "#admin";
      }
    });

    window.addEventListener("hashchange", handleHashRoute);

    async function startPlatform() {
      // 1. جلب المحتوى من السحابة أولاً
      catalog = await loadCatalogFromDB();
      
      // 2. رسم الموقع
      renderGradeCards();
      renderStudentBadge();
      handleHashRoute();
      if (location.hash !== "#admin") {
        switchView("home");
        updateHeader();
        ensureStudentIdentity();
      }
    }

    // تشغيل المنصة
    startPlatform();
