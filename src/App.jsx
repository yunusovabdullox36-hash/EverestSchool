
import { useEffect, useMemo, useState } from "react";
import { NavLink, Navigate, Outlet, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { FaChartLine, FaChalkboardTeacher, FaClipboardList, FaDownload, FaExclamationTriangle, FaGraduationCap, FaPlus, FaRobot, FaSignOutAlt, FaTrash, FaUserGraduate } from "react-icons/fa";
import { generateTopicTests } from "./lib/ai";
import { clearSession, getSession, loadInitialState, readLocalState, saveState, setSession, subscribeRealtime } from "./lib/storage";

const VALID_ROLES = ["teacher", "student"];
const LEVELS = ["A1", "A2", "B1", "B2", "C1"];
const LANGUAGE_KEY = "english_group_language_v1";

const MESSAGES = {
  uz: {
    appTitle: "English Group Hub",
    loading: "Tizim yuklanmoqda...",
    heroSubtitle: "Sodda va tushunarli: ustoz test yuboradi, o'quvchi ishlaydi.",
    teacher: "Teacher",
    student: "Student",
    teacherCardDesc: "1 daqiqada o'quvchi qo'shing, test yarating, natijani kuzating.",
    studentCardDesc: "Testni boshlang, yakunlang va ballarni darhol ko'ring.",
    loginTitle: "{role} Login",
    loginSubtitle: "Login va parol orqali panelga kiring.",
    login: "Login",
    password: "Parol",
    signIn: "Kirish",
    invalidCredentials: "Login yoki parol noto'g'ri",
    invalidLoginRoute: "Noto'g'ri login sahifasi.",
    requiredFieldsMissing: "Majburiy maydonlar to'liq kiritilmadi.",
    birthDateRequired: "Tug'ilgan sana kiritilishi shart.",
    ageRangeError: "Yosh 6 dan 99 gacha bo'lishi kerak.",
    loginTaken: "Bu login band, boshqasini kiriting.",
    studentCreated: "Yangi student yaratildi.",
    topicTooShort: "Mavzu kamida 2 ta belgidan iborat bo'lsin.",
    addStudentFirst: "Avval kamida bitta student qo'shing.",
    testSent: "AI test yuborildi: {topic} ({count} ta savol).",
    studentDeleted: "{name} o'chirildi.",
    studentNotFound: "O'quvchi topilmadi.",
    home: "Home",
    logout: "Chiqish",
    teacherPanel: "Teacher Panel",
    studentPanel: "Student Panel",
    helloTeacher: "Assalomu alaykum, {name}!",
    introTeacher: "Bu panel 3 qadamdan iborat: o'quvchi qo'shing, test yuboring, natijani ko'ring.",
    students: "O'quvchilar",
    testsSent: "Yuborilgan testlar",
    groupLevel: "Guruh darajasi",
    teacherProfile: "Ustoz profili",
    fullName: "Ism-familiya",
    email: "Email",
    speciality: "Yo'nalish",
    stepAddStudent: "1-qadam: O'quvchi qo'shish",
    firstName: "Ism",
    lastName: "Familiya",
    age: "Yosh",
    monthOptional: "Oyi (ixtiyoriy)",
    birthDate: "Tug'ilgan sana",
    level: "Daraja",
    save: "Saqlash",
    stepSendTest: "2-qadam: Test yuborish",
    sendTestHelp: "Mavzu kiriting, savollar sonini tanlang va kerakli o'quvchilarga yuboring.",
    topic: "Mavzu",
    classLevel: "Sinf/Daraja",
    questionCount: "Savollar soni",
    assignTo: "Kimlarga yuborilsin:",
    noStudentsYet: "Hali student yo'q.",
    sendTest: "Testni yuborish",
    stepSentTests: "3-qadam: Yuborilgan testlar",
    noTestsYet: "Hozircha test yo'q. Avval 2-qadam orqali test yuboring.",
    questions: "Savollar",
    sentToStudents: "Yuborilgan students",
    stepManageStudents: "4-qadam: O'quvchilarni boshqarish",
    manageStudentsHelp: "Keraksiz o'quvchilarni o'chirishingiz mumkin.",
    noStudentsForManage: "O'quvchi yo'q.",
    deleteStudent: "O'chirish",
    confirmDeleteStudent: "{name}ni o'chirmoqchimisiz?",
    pickInTable: "O'quvchini pastdagi jadvaldan tanlang.",
    studentsTable: "O'quvchilar jadvali",
    colName: "Ism-familiya",
    colAssign: "Testga belgilash",
    colActions: "Amallar",
    totalScore: "Jami ball",
    finishedTests: "Yakunlangan testlar",
    tests: "Testlar",
    testHelp: "Pastdagi test iconini bosib mavzuni ishlang.",
    noAssignedTests: "Hali sizga test yuborilmagan.",
    completed: "Yakunlangan",
    startTest: "Testni boshlash",
    testFinishedWithScore: "Test yakunlandi. Siz {score} ball oldingiz.",
    testWord: "testi",
    back: "Orqaga",
    finishTest: "Testni tugatish",
    language: "Til",
    chooseBestAnswerByTopic: "{topic} bo'yicha to'g'ri javobni tanlang.",
    noPromptTranslation: "Savol tarjimasi mavjud emas.",
    analytics: "Analitika",
    completionRate: "Bajarilish foizi",
    averageScore: "O'rtacha ball",
    totalAttempts: "Urinishlar soni",
    topStudents: "Top o'quvchilar",
    riskStudents: "Qo'llab-quvvatlash kerak",
    noDataYet: "Hali ma'lumot yetarli emas.",
    exportCsv: "CSV eksport",
    searchStudents: "O'quvchi qidirish",
    filterLevel: "Daraja filtri",
    allLevels: "Barcha darajalar",
    recentResults: "So'nggi natijalar",
    noResultsYet: "Hali test natijalari yo'q.",
    score: "Ball",
    statusGood: "Yaxshi",
    statusRisk: "Risk",
    selectAll: "Barchasini belgilash",
    clearAll: "Tozalash",
    deleteTest: "Testni o'chirish",
    confirmDeleteTest: "\"{topic}\" testini o'chirmoqchimisiz?",
    testDeleted: "Test o'chirildi.",
    progressRate: "Progress foizi",
    streakDays: "Faol kunlar seriyasi",
    studentTestsTab: "Testlar",
    studentResultsTab: "Natijalar",
    studentProfileTab: "Profil",
    profileSettings: "Profil sozlamalari",
    learningGoal: "O'rganish maqsadi",
    saveSettings: "Sozlamani saqlash",
    settingsSaved: "Sozlama saqlandi.",
    welcomeBack: "Xush kelibsiz",
  },
  ru: {
    appTitle: "English Group Hub",
    loading: "Система загружается...",
    heroSubtitle: "Просто и понятно: учитель отправляет тест, ученик решает.",
    teacher: "Учитель",
    student: "Ученик",
    teacherCardDesc: "Добавьте ученика за 1 минуту, создайте тест и следите за результатом.",
    studentCardDesc: "Начните тест, завершите и сразу увидите баллы.",
    loginTitle: "Вход: {role}",
    loginSubtitle: "Войдите в панель через логин и пароль.",
    login: "Логин",
    password: "Пароль",
    signIn: "Войти",
    invalidCredentials: "Неверный логин или пароль",
    invalidLoginRoute: "Некорректная страница входа.",
    requiredFieldsMissing: "Заполните обязательные поля.",
    birthDateRequired: "Дата рождения обязательна.",
    ageRangeError: "Возраст должен быть от 6 до 99.",
    loginTaken: "Этот логин уже занят.",
    studentCreated: "Новый ученик создан.",
    topicTooShort: "Тема должна быть минимум 2 символа.",
    addStudentFirst: "Сначала добавьте хотя бы одного ученика.",
    testSent: "AI тест отправлен: {topic} ({count} вопросов).",
    studentDeleted: "{name} удален.",
    studentNotFound: "Ученик не найден.",
    home: "Домой",
    logout: "Выход",
    teacherPanel: "Панель учителя",
    studentPanel: "Панель ученика",
    helloTeacher: "Здравствуйте, {name}!",
    introTeacher: "Панель состоит из 3 шагов: добавьте ученика, отправьте тест, смотрите результат.",
    students: "Ученики",
    testsSent: "Отправленные тесты",
    groupLevel: "Уровень группы",
    teacherProfile: "Профиль учителя",
    fullName: "Имя и фамилия",
    email: "Email",
    speciality: "Специализация",
    stepAddStudent: "Шаг 1: Добавить ученика",
    firstName: "Имя",
    lastName: "Фамилия",
    age: "Возраст",
    monthOptional: "Месяц (необязательно)",
    birthDate: "Дата рождения",
    level: "Уровень",
    save: "Сохранить",
    stepSendTest: "Шаг 2: Отправить тест",
    sendTestHelp: "Введите тему, количество вопросов и отправьте выбранным ученикам.",
    topic: "Тема",
    classLevel: "Класс/Уровень",
    questionCount: "Количество вопросов",
    assignTo: "Кому отправить:",
    noStudentsYet: "Пока нет учеников.",
    sendTest: "Отправить тест",
    stepSentTests: "Шаг 3: Отправленные тесты",
    noTestsYet: "Тестов пока нет. Сначала отправьте тест через шаг 2.",
    questions: "Вопросы",
    sentToStudents: "Отправлено ученикам",
    stepManageStudents: "Шаг 4: Управление учениками",
    manageStudentsHelp: "Можно удалить ненужных учеников.",
    noStudentsForManage: "Учеников нет.",
    deleteStudent: "Удалить",
    confirmDeleteStudent: "Удалить {name}?",
    pickInTable: "Выберите учеников в таблице ниже.",
    studentsTable: "Таблица учеников",
    colName: "Имя и фамилия",
    colAssign: "Назначить в тест",
    colActions: "Действия",
    totalScore: "Общий балл",
    finishedTests: "Завершенные тесты",
    tests: "Тесты",
    testHelp: "Нажмите на карточку теста ниже и начните.",
    noAssignedTests: "Вам пока не отправили тест.",
    completed: "Завершено",
    startTest: "Начать тест",
    testFinishedWithScore: "Тест завершен. Вы получили {score} баллов.",
    testWord: "тест",
    back: "Назад",
    finishTest: "Завершить тест",
    language: "Язык",
    chooseBestAnswerByTopic: "Выберите правильный ответ по теме: {topic}.",
    noPromptTranslation: "Перевод вопроса недоступен.",
    analytics: "Аналитика",
    completionRate: "Процент выполнения",
    averageScore: "Средний балл",
    totalAttempts: "Количество попыток",
    topStudents: "Лучшие ученики",
    riskStudents: "Нужна поддержка",
    noDataYet: "Пока недостаточно данных.",
    exportCsv: "Экспорт CSV",
    searchStudents: "Поиск ученика",
    filterLevel: "Фильтр уровня",
    allLevels: "Все уровни",
    recentResults: "Последние результаты",
    noResultsYet: "Результатов пока нет.",
    score: "Балл",
    statusGood: "Хорошо",
    statusRisk: "Риск",
    selectAll: "Выбрать всех",
    clearAll: "Очистить",
    deleteTest: "Удалить тест",
    confirmDeleteTest: "Удалить тест \"{topic}\"?",
    testDeleted: "Тест удален.",
    progressRate: "Прогресс",
    streakDays: "Серия активных дней",
    studentTestsTab: "Тесты",
    studentResultsTab: "Результаты",
    studentProfileTab: "Профиль",
    profileSettings: "Настройки профиля",
    learningGoal: "Учебная цель",
    saveSettings: "Сохранить настройки",
    settingsSaved: "Настройки сохранены.",
    welcomeBack: "С возвращением",
  },
  en: {
    appTitle: "English Group Hub",
    loading: "System loading...",
    heroSubtitle: "Simple and clear: teacher sends tests, student completes them.",
    teacher: "Teacher",
    student: "Student",
    teacherCardDesc: "Add a student in 1 minute, create tests, and track results.",
    studentCardDesc: "Start a test, finish it, and see your score instantly.",
    loginTitle: "{role} Login",
    loginSubtitle: "Sign in with login and password.",
    login: "Login",
    password: "Password",
    signIn: "Sign In",
    invalidCredentials: "Invalid login or password",
    invalidLoginRoute: "Invalid login route.",
    requiredFieldsMissing: "Required fields are missing.",
    birthDateRequired: "Birth date is required.",
    ageRangeError: "Age must be between 6 and 99.",
    loginTaken: "This login is already taken.",
    studentCreated: "New student created.",
    topicTooShort: "Topic must contain at least 2 characters.",
    addStudentFirst: "Add at least one student first.",
    testSent: "AI test sent: {topic} ({count} questions).",
    studentDeleted: "{name} deleted.",
    studentNotFound: "Student not found.",
    home: "Home",
    logout: "Logout",
    teacherPanel: "Teacher Panel",
    studentPanel: "Student Panel",
    helloTeacher: "Hello, {name}!",
    introTeacher: "This panel has 3 steps: add students, send tests, review results.",
    students: "Students",
    testsSent: "Sent tests",
    groupLevel: "Group level",
    teacherProfile: "Teacher profile",
    fullName: "Full name",
    email: "Email",
    speciality: "Speciality",
    stepAddStudent: "Step 1: Add student",
    firstName: "First name",
    lastName: "Last name",
    age: "Age",
    monthOptional: "Month (optional)",
    birthDate: "Birth date",
    level: "Level",
    save: "Save",
    stepSendTest: "Step 2: Send test",
    sendTestHelp: "Enter topic, choose number of questions, and assign students.",
    topic: "Topic",
    classLevel: "Class/Level",
    questionCount: "Question count",
    assignTo: "Assign to:",
    noStudentsYet: "No students yet.",
    sendTest: "Send test",
    stepSentTests: "Step 3: Sent tests",
    noTestsYet: "No tests yet. Send one from step 2 first.",
    questions: "Questions",
    sentToStudents: "Assigned students",
    stepManageStudents: "Step 4: Manage students",
    manageStudentsHelp: "You can remove unnecessary students.",
    noStudentsForManage: "No students.",
    deleteStudent: "Delete",
    confirmDeleteStudent: "Delete {name}?",
    pickInTable: "Select students in the table below.",
    studentsTable: "Students table",
    colName: "Full name",
    colAssign: "Assign to test",
    colActions: "Actions",
    totalScore: "Total score",
    finishedTests: "Finished tests",
    tests: "Tests",
    testHelp: "Click a test card below to start.",
    noAssignedTests: "No tests assigned to you yet.",
    completed: "Completed",
    startTest: "Start test",
    testFinishedWithScore: "Test finished. You scored {score} points.",
    testWord: "test",
    back: "Back",
    finishTest: "Finish test",
    language: "Language",
    chooseBestAnswerByTopic: "Choose the correct answer for: {topic}.",
    noPromptTranslation: "Question translation is unavailable.",
    analytics: "Analytics",
    completionRate: "Completion rate",
    averageScore: "Average score",
    totalAttempts: "Total attempts",
    topStudents: "Top students",
    riskStudents: "Needs support",
    noDataYet: "Not enough data yet.",
    exportCsv: "Export CSV",
    searchStudents: "Search student",
    filterLevel: "Level filter",
    allLevels: "All levels",
    recentResults: "Recent results",
    noResultsYet: "No results yet.",
    score: "Score",
    statusGood: "Good",
    statusRisk: "Risk",
    selectAll: "Select all",
    clearAll: "Clear",
    deleteTest: "Delete test",
    confirmDeleteTest: "Delete test \"{topic}\"?",
    testDeleted: "Test deleted.",
    progressRate: "Progress rate",
    streakDays: "Active day streak",
    studentTestsTab: "Tests",
    studentResultsTab: "Results",
    studentProfileTab: "Profile",
    profileSettings: "Profile settings",
    learningGoal: "Learning goal",
    saveSettings: "Save settings",
    settingsSaved: "Settings saved.",
    welcomeBack: "Welcome back",
  },
};

function getSavedLanguage() {
  const raw = localStorage.getItem(LANGUAGE_KEY);
  if (raw && ["uz", "ru", "en"].includes(raw)) return raw;
  return "uz";
}

function normalizeText(value = "") {
  return String(value).trim();
}

function normalizeLogin(value = "") {
  return String(value).trim().toLowerCase();
}

function translate(lang, key, params = {}) {
  const text = MESSAGES[lang]?.[key] ?? MESSAGES.en[key] ?? key;
  return Object.keys(params).reduce((acc, paramKey) => acc.replaceAll(`{${paramKey}}`, String(params[paramKey])), text);
}

function getLocalizedPrompt(questionText = "", t) {
  const clean = String(questionText)
    .replace(/\([^)]*\)\s*/g, "")
    .replace(/: choose the best answer for item \d+\./i, "")
    .trim();
  if (!clean) return t("noPromptTranslation");
  return t("chooseBestAnswerByTopic", { topic: clean });
}

function normalizeStateShape(raw) {
  const safe = raw || {};
  return {
    teachers: Array.isArray(safe.teachers) ? safe.teachers : [],
    students: Array.isArray(safe.students)
      ? safe.students.map((student) => ({
          ...student,
          totalScore: Number(student.totalScore) || 0,
          completedTestIds: Array.isArray(student.completedTestIds) ? student.completedTestIds : [],
          testAttempts: Array.isArray(student.testAttempts) ? student.testAttempts : [],
          learningGoal: typeof student.learningGoal === "string" ? student.learningGoal : "",
        }))
      : [],
    tests: Array.isArray(safe.tests) ? safe.tests : [],
  };
}

function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function RoleGuard({ session, role, children }) {
  if (!session) return <Navigate to={`/login/${role}`} replace />;
  if (session.role !== role) return <Navigate to={`/login/${role}`} replace />;
  return children;
}

function LanguageSwitcher({ language, onChange, t }) {
  return (
    <div className="lang-switch" role="group" aria-label={t("language")}>
      <span>{t("language")}:</span>
      <button type="button" className={language === "uz" ? "active" : ""} onClick={() => onChange("uz")}>Uz</button>
      <button type="button" className={language === "ru" ? "active" : ""} onClick={() => onChange("ru")}>Ru</button>
      <button type="button" className={language === "en" ? "active" : ""} onClick={() => onChange("en")}>En</button>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ teachers: [], students: [], tests: [] });
  const [session, setSessionState] = useState(getSession());
  const [language, setLanguage] = useState(getSavedLanguage);

  const t = (key, params) => translate(language, key, params);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    let mounted = true;
    loadInitialState().then((initial) => {
      if (!mounted) return;
      setData(normalizeStateShape(initial));
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeRealtime(() => {
      const latest = readLocalState();
      if (latest) setData(normalizeStateShape(latest));
    });
    return unsubscribe;
  }, []);

  const updateData = (updater) => {
    setData((prev) => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  };

  const login = ({ role, loginName, password }) => {
    if (!VALID_ROLES.includes(role)) {
      return { ok: false, messageKey: "invalidLoginRoute" };
    }
    const safeLogin = normalizeLogin(loginName);
    const safePassword = String(password);

    if (role === "teacher") {
      const teacher = data.teachers.find((item) => normalizeLogin(item.login) === safeLogin && item.password === safePassword);
      if (!teacher) return { ok: false, messageKey: "invalidCredentials" };
      const newSession = { role: "teacher", userId: teacher.id };
      setSession(newSession);
      setSessionState(newSession);
      return { ok: true };
    }

    const student = data.students.find((item) => normalizeLogin(item.login) === safeLogin && item.password === safePassword);
    if (!student) return { ok: false, messageKey: "invalidCredentials" };
    const newSession = { role: "student", userId: student.id };
    setSession(newSession);
    setSessionState(newSession);
    return { ok: true };
  };

  const logout = () => {
    clearSession();
    setSessionState(null);
  };

  const createStudent = (teacherId, form) => {
    const firstName = normalizeText(form.firstName);
    const lastName = normalizeText(form.lastName);
    const loginName = normalizeLogin(form.login);
    const password = String(form.password || "").trim();
    const level = normalizeText(form.level).toUpperCase() || "A1";
    const month = normalizeText(form.month);
    const age = Number(form.age);

    if (!firstName || !lastName || !loginName || !password) {
      return { ok: false, messageKey: "requiredFieldsMissing" };
    }
    if (!form.birthDate) {
      return { ok: false, messageKey: "birthDateRequired" };
    }
    if (Number.isNaN(age) || age < 6 || age > 99) {
      return { ok: false, messageKey: "ageRangeError" };
    }

    const loginUsed =
      data.students.some((item) => normalizeLogin(item.login) === loginName) ||
      data.teachers.some((item) => normalizeLogin(item.login) === loginName);

    if (loginUsed) {
      return { ok: false, messageKey: "loginTaken" };
    }

    const newStudent = {
      id: `s-${Date.now()}`,
      teacherId,
      firstName,
      lastName,
      login: loginName,
      password,
      birthDate: form.birthDate,
      age,
      month,
      level,
      totalScore: 0,
      completedTestIds: [],
      testAttempts: [],
      learningGoal: "",
      createdAt: new Date().toISOString(),
    };

    updateData((prev) => ({ ...prev, students: [...prev.students, newStudent] }));
    return { ok: true, messageKey: "studentCreated" };
  };

  const deleteStudent = (teacherId, studentId) => {
    const target = data.students.find((item) => item.id === studentId && item.teacherId === teacherId);
    if (!target) {
      return { ok: false, messageKey: "studentNotFound" };
    }

    updateData((prev) => {
      const students = prev.students.filter((item) => item.id !== studentId);
      const tests = prev.tests.map((test) => ({
        ...test,
        assignedTo: test.assignedTo.filter((id) => id !== studentId),
      }));
      return { ...prev, students, tests };
    });

    if (session?.role === "student" && session.userId === studentId) {
      clearSession();
      setSessionState(null);
    }

    return {
      ok: true,
      messageKey: "studentDeleted",
      params: { name: `${target.firstName} ${target.lastName}` },
    };
  };

  const deleteTest = (teacherId, testId) => {
    const target = data.tests.find((item) => item.id === testId && item.teacherId === teacherId);
    if (!target) {
      return { ok: false, messageKey: "noDataYet" };
    }
    updateData((prev) => {
      const tests = prev.tests.filter((item) => item.id !== testId);
      const students = prev.students.map((studentItem) => ({
        ...studentItem,
        completedTestIds: studentItem.completedTestIds.filter((id) => id !== testId),
        testAttempts: (studentItem.testAttempts || []).filter((attempt) => attempt.testId !== testId),
      }));
      return { ...prev, tests, students };
    });
    return { ok: true, messageKey: "testDeleted" };
  };

  const createAiTest = (teacherId, payload) => {
    const topic = normalizeText(payload.topic);
    const level = normalizeText(payload.level).toUpperCase() || "A1";
    const howMany = Number(payload.howMany);

    if (!topic || topic.length < 2) {
      return { ok: false, messageKey: "topicTooShort" };
    }

    const questions = generateTopicTests({ topic, level, count: howMany });

    const assignedTo = payload.studentIds.length
      ? payload.studentIds
      : data.students.filter((item) => item.teacherId === teacherId).map((item) => item.id);

    if (!assignedTo.length) {
      return { ok: false, messageKey: "addStudentFirst" };
    }

    const newTest = {
      id: `test-${Date.now()}`,
      teacherId,
      topic,
      level,
      questionCount: questions.length,
      questions,
      assignedTo,
      createdAt: new Date().toISOString(),
    };

    updateData((prev) => ({ ...prev, tests: [newTest, ...prev.tests] }));

    return {
      ok: true,
      messageKey: "testSent",
      params: { topic: newTest.topic, count: newTest.questionCount },
      test: newTest,
    };
  };

  const completeTest = ({ studentId, testId, earned }) => {
    updateData((prev) => {
      const currentTest = prev.tests.find((test) => test.id === testId);
      const maxScore = (currentTest?.questionCount || 0) * 10;
      const students = prev.students.map((item) => {
        if (item.id !== studentId) return item;
        if (item.completedTestIds.includes(testId)) return item;
        return {
          ...item,
          totalScore: item.totalScore + earned,
          completedTestIds: [...item.completedTestIds, testId],
          testAttempts: [
            ...(Array.isArray(item.testAttempts) ? item.testAttempts : []),
            { testId, earned, maxScore, completedAt: new Date().toISOString() },
          ],
        };
      });
      return { ...prev, students };
    });
  };

  const updateStudentSettings = ({ studentId, learningGoal }) => {
    updateData((prev) => {
      const students = prev.students.map((item) => {
        if (item.id !== studentId) return item;
        return { ...item, learningGoal: normalizeText(learningGoal) };
      });
      return { ...prev, students };
    });
  };

  const teacher = useMemo(() => data.teachers.find((item) => item.id === session?.userId) || null, [data.teachers, session]);
  const student = useMemo(() => data.students.find((item) => item.id === session?.userId) || null, [data.students, session]);

  if (loading) {
    return (
      <div className="loading-screen">
        <h1>{t("appTitle")}</h1>
        <p>{t("loading")}</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing t={t} language={language} onLanguageChange={setLanguage} />} />
      <Route path="/login/:role" element={<LoginPage onLogin={login} t={t} language={language} onLanguageChange={setLanguage} />} />
      <Route
        path="/teacher"
        element={
          <RoleGuard role="teacher" session={session}>
            <TeacherPanel
              teacher={teacher}
              students={data.students}
              tests={data.tests}
              onLogout={logout}
              onCreateStudent={createStudent}
              onDeleteStudent={deleteStudent}
              onDeleteTest={deleteTest}
              onCreateAiTest={createAiTest}
              t={t}
              language={language}
              onLanguageChange={setLanguage}
            />
          </RoleGuard>
        }
      />
      <Route
        path="/student/*"
        element={
          <RoleGuard role="student" session={session}>
            <StudentRoutes
              student={student}
              tests={data.tests}
              onLogout={logout}
              onCompleteTest={completeTest}
              onUpdateSettings={updateStudentSettings}
              t={t}
              language={language}
              onLanguageChange={setLanguage}
            />
          </RoleGuard>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function Landing({ t, language, onLanguageChange }) {
  const navigate = useNavigate();

  const handleCardKey = (event, path) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate(path);
    }
  };

  return (
    <main className="page shell">
      <LanguageSwitcher language={language} onChange={onLanguageChange} t={t} />
      <section className="hero">
        <div className="hero-head">
          <div className="brand-mark">
            <img src="/logo.png" alt="English Group Hub logo" />
          </div>
          <div>
            <h1>{t("appTitle")}</h1>
            <p>{t("heroSubtitle")}</p>
          </div>
        </div>
      </section>
      <section className="split-grid">
        <div className="role-card role-teacher" onClick={() => navigate("/login/teacher")} onKeyDown={(event) => handleCardKey(event, "/login/teacher")} role="button" tabIndex={0}>
          <FaChalkboardTeacher size={40} />
          <h2>{t("teacher")}</h2>
          <p>{t("teacherCardDesc")}</p>
        </div>
        <div className="role-card role-student" onClick={() => navigate("/login/student")} onKeyDown={(event) => handleCardKey(event, "/login/student")} role="button" tabIndex={0}>
          <FaUserGraduate size={40} />
          <h2>{t("student")}</h2>
          <p>{t("studentCardDesc")}</p>
        </div>
      </section>
    </main>
  );
}

function LoginPage({ onLogin, t, language, onLanguageChange }) {
  const { role } = useParams();
  const navigate = useNavigate();
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [errorKey, setErrorKey] = useState("");
  const validRole = VALID_ROLES.includes(role);
  const roleLabel = role === "teacher" ? t("teacher") : t("student");

  const submit = (event) => {
    event.preventDefault();
    const result = onLogin({ role, loginName, password });
    if (!result.ok) {
      setErrorKey(result.messageKey);
      return;
    }
    navigate(role === "teacher" ? "/teacher" : "/student");
  };

  if (!validRole) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="page shell">
      <LanguageSwitcher language={language} onChange={onLanguageChange} t={t} />
      <section className="panel auth-panel">
        <h1>{t("loginTitle", { role: roleLabel })}</h1>
        <p>{t("loginSubtitle")}</p>
        <form onSubmit={submit} className="form-grid">
          <label>{t("login")}
            <input value={loginName} onChange={(event) => { setLoginName(event.target.value); if (errorKey) setErrorKey(""); }} required />
          </label>
          <label>{t("password")}
            <input type="password" value={password} onChange={(event) => { setPassword(event.target.value); if (errorKey) setErrorKey(""); }} required />
          </label>
          {errorKey && <p className="error-text">{t(errorKey)}</p>}
          <button className="primary-btn" type="submit">{t("signIn")}</button>
        </form>
      </section>
    </main>
  );
}
function TeacherPanel({ teacher, students, tests, onLogout, onCreateStudent, onDeleteStudent, onDeleteTest, onCreateAiTest, t, language, onLanguageChange }) {
  const navigate = useNavigate();
  const [notice, setNotice] = useState({ type: "", text: "" });
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [studentForm, setStudentForm] = useState({
    firstName: "",
    lastName: "",
    login: "",
    password: "",
    age: "",
    month: "",
    birthDate: "",
    level: "A1",
  });
  const [aiForm, setAiForm] = useState({ topic: "", level: "A1", howMany: 5, studentIds: [] });

  if (!teacher) return <Navigate to="/login/teacher" replace />;

  const myStudents = students.filter((item) => item.teacherId === teacher.id);
  const myTests = tests.filter((item) => item.teacherId === teacher.id);
  const filteredStudents = myStudents.filter((item) => {
    const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
    const q = query.trim().toLowerCase();
    const matchQuery = !q || fullName.includes(q) || item.login.toLowerCase().includes(q);
    const matchLevel = levelFilter === "all" || item.level === levelFilter;
    return matchQuery && matchLevel;
  });
  const testAssignments = myTests.reduce((sum, test) => sum + (test.assignedTo?.length || 0), 0);
  const allAttempts = myStudents.flatMap((item) => (Array.isArray(item.testAttempts) ? item.testAttempts : []));
  const averageScore = allAttempts.length
    ? Math.round(allAttempts.reduce((sum, attempt) => sum + attempt.earned, 0) / allAttempts.length)
    : 0;
  const completionRate = testAssignments ? Math.round((allAttempts.length / testAssignments) * 100) : 0;
  const rankedStudents = [...myStudents]
    .map((item) => ({
      ...item,
      attemptCount: Array.isArray(item.testAttempts) ? item.testAttempts.length : 0,
      avgScore: Array.isArray(item.testAttempts) && item.testAttempts.length
        ? Math.round(item.testAttempts.reduce((sum, attempt) => sum + attempt.earned, 0) / item.testAttempts.length)
        : 0,
    }))
    .sort((a, b) => b.avgScore - a.avgScore || b.totalScore - a.totalScore);
  const riskStudents = rankedStudents.filter((item) => item.attemptCount > 0 && item.avgScore < 60);
  const topStudents = rankedStudents.slice(0, 3);

  const submitStudent = (event) => {
    event.preventDefault();
    const response = onCreateStudent(teacher.id, studentForm);
    setNotice({ type: response.ok ? "success" : "error", text: t(response.messageKey, response.params) });
    if (response.ok) {
      setStudentForm({ firstName: "", lastName: "", login: "", password: "", age: "", month: "", birthDate: "", level: "A1" });
    }
  };

  const submitAi = (event) => {
    event.preventDefault();
    const response = onCreateAiTest(teacher.id, aiForm);
    setNotice({ type: response.ok ? "success" : "error", text: t(response.messageKey, response.params) });
    if (response.ok) {
      setAiForm((prev) => ({ ...prev, topic: "", howMany: 5, studentIds: [] }));
    }
  };

  const toggleStudentAssign = (studentId) => {
    setAiForm((prev) => ({
      ...prev,
      studentIds: prev.studentIds.includes(studentId) ? prev.studentIds.filter((id) => id !== studentId) : [...prev.studentIds, studentId],
    }));
  };

  const selectAllStudents = () => {
    setAiForm((prev) => ({ ...prev, studentIds: filteredStudents.map((item) => item.id) }));
  };

  const clearSelectedStudents = () => {
    setAiForm((prev) => ({ ...prev, studentIds: [] }));
  };

  const removeStudent = (studentItem) => {
    const allow = window.confirm(t("confirmDeleteStudent", { name: `${studentItem.firstName} ${studentItem.lastName}` }));
    if (!allow) return;
    const response = onDeleteStudent(teacher.id, studentItem.id);
    setNotice({ type: response.ok ? "success" : "error", text: t(response.messageKey, response.params) });
    setAiForm((prev) => ({ ...prev, studentIds: prev.studentIds.filter((id) => id !== studentItem.id) }));
  };

  const removeTest = (testItem) => {
    const allow = window.confirm(t("confirmDeleteTest", { topic: testItem.topic }));
    if (!allow) return;
    const response = onDeleteTest(teacher.id, testItem.id);
    setNotice({ type: response.ok ? "success" : "error", text: t(response.messageKey, response.params) });
  };

  const exportReport = () => {
    const rows = [
      ["Name", "Login", "Level", "Total Score", "Attempts", "Average Score"],
      ...rankedStudents.map((item) => [
        `${item.firstName} ${item.lastName}`,
        item.login,
        item.level,
        item.totalScore,
        item.attemptCount,
        item.avgScore,
      ]),
    ];
    downloadCsv(`teacher-report-${new Date().toISOString().slice(0, 10)}.csv`, rows);
  };

  return (
    <main className="page shell">
      <LanguageSwitcher language={language} onChange={onLanguageChange} t={t} />
      <header className="topbar">
        <h1>{t("teacherPanel")}</h1>
        <div className="topbar-actions">
          <button className="ghost-btn" onClick={() => navigate("/")}>{t("home")}</button>
          <button className="danger-btn" onClick={onLogout}><FaSignOutAlt /> {t("logout")}</button>
        </div>
      </header>
      <section className="panel intro-panel">
        <h2>{t("helloTeacher", { name: teacher.firstName })}</h2>
        <p>{t("introTeacher")}</p>
        <div className="mini-stats">
          <article className="mini-stat"><small>{t("students")}</small><strong>{myStudents.length}</strong></article>
          <article className="mini-stat"><small>{t("testsSent")}</small><strong>{myTests.length}</strong></article>
          <article className="mini-stat"><small>{t("groupLevel")}</small><strong>{teacher.groupLevel}</strong></article>
        </div>
      </section>
      <section className="panel analytics-panel">
        <div className="analytics-head">
          <h2><FaChartLine /> {t("analytics")}</h2>
          <button className="ghost-btn" type="button" onClick={exportReport}>
            <FaDownload /> {t("exportCsv")}
          </button>
        </div>
        <div className="mini-stats">
          <article className="mini-stat"><small>{t("completionRate")}</small><strong>{completionRate}%</strong></article>
          <article className="mini-stat"><small>{t("averageScore")}</small><strong>{averageScore}</strong></article>
          <article className="mini-stat"><small>{t("totalAttempts")}</small><strong>{allAttempts.length}</strong></article>
        </div>
        <div className="grid-two analytics-grid">
          <article className="panel compact-panel">
            <h3>{t("topStudents")}</h3>
            {topStudents.length === 0 && <p>{t("noDataYet")}</p>}
            {topStudents.map((item) => (
              <p key={item.id}>
                {item.firstName} {item.lastName}: {item.avgScore} ({item.attemptCount})
              </p>
            ))}
          </article>
          <article className="panel compact-panel">
            <h3><FaExclamationTriangle /> {t("riskStudents")}</h3>
            {riskStudents.length === 0 && <p>{t("noDataYet")}</p>}
            {riskStudents.map((item) => (
              <p key={item.id}>
                {item.firstName} {item.lastName}: {item.avgScore}
              </p>
            ))}
          </article>
        </div>
      </section>
      <section className="grid-two">
        <article className="panel">
          <h2><FaGraduationCap /> {t("teacherProfile")}</h2>
          <p><strong>{t("fullName")}:</strong> {teacher.firstName} {teacher.lastName}</p>
          <p><strong>{t("login")}:</strong> {teacher.login}</p>
          <p><strong>{t("email")}:</strong> {teacher.email}</p>
          <p><strong>{t("speciality")}:</strong> {teacher.speciality}</p>
          <p><strong>{t("groupLevel")}:</strong> {teacher.groupLevel}</p>
          <p><strong>{t("students")}:</strong> {myStudents.length}</p>
        </article>
        <article className="panel">
          <h2><FaPlus /> {t("stepAddStudent")}</h2>
          <form onSubmit={submitStudent} className="form-grid form-two">
            <label>{t("firstName")}<input value={studentForm.firstName} onChange={(event) => setStudentForm((prev) => ({ ...prev, firstName: event.target.value }))} required /></label>
            <label>{t("lastName")}<input value={studentForm.lastName} onChange={(event) => setStudentForm((prev) => ({ ...prev, lastName: event.target.value }))} required /></label>
            <label>{t("login")}<input value={studentForm.login} onChange={(event) => setStudentForm((prev) => ({ ...prev, login: event.target.value }))} required /></label>
            <label>{t("password")}<input type="password" value={studentForm.password} onChange={(event) => setStudentForm((prev) => ({ ...prev, password: event.target.value }))} required /></label>
            <label>{t("age")}<input type="number" min="6" max="99" value={studentForm.age} onChange={(event) => setStudentForm((prev) => ({ ...prev, age: event.target.value }))} required /></label>
            <label>{t("monthOptional")}<input value={studentForm.month} onChange={(event) => setStudentForm((prev) => ({ ...prev, month: event.target.value }))} /></label>
            <label>{t("birthDate")}<input type="date" value={studentForm.birthDate} onChange={(event) => setStudentForm((prev) => ({ ...prev, birthDate: event.target.value }))} required /></label>
            <label>{t("level")}<select value={studentForm.level} onChange={(event) => setStudentForm((prev) => ({ ...prev, level: event.target.value }))}>{LEVELS.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <button className="primary-btn" type="submit">{t("save")}</button>
          </form>
        </article>
      </section>
      <section className="panel ai-panel">
        <h2><FaRobot /> {t("stepSendTest")}</h2>
        <p>{t("sendTestHelp")}</p>
        <div className="action-row">
          <button type="button" className="ghost-btn" onClick={selectAllStudents}>{t("selectAll")}</button>
          <button type="button" className="ghost-btn" onClick={clearSelectedStudents}>{t("clearAll")}</button>
        </div>
        <form onSubmit={submitAi} className="form-grid form-three">
          <label>{t("topic")}<input value={aiForm.topic} onChange={(event) => setAiForm((prev) => ({ ...prev, topic: event.target.value }))} placeholder="Past Simple" required /></label>
          <label>{t("classLevel")}<select value={aiForm.level} onChange={(event) => setAiForm((prev) => ({ ...prev, level: event.target.value }))}>{LEVELS.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label>{t("questionCount")}<input type="number" min="3" max="20" value={aiForm.howMany} onChange={(event) => setAiForm((prev) => ({ ...prev, howMany: event.target.value }))} required /></label>
          <p className="muted-line">{t("pickInTable")}</p>
          <button className="primary-btn" type="submit" disabled={myStudents.length === 0}>{t("sendTest")}</button>
        </form>
        {notice.text && <p className={notice.type === "error" ? "error-banner" : "success-text"}>{notice.text}</p>}
      </section>
      <section className="panel">
        <h2><FaClipboardList /> {t("stepSentTests")}</h2>
        <div className="test-list">
          {myTests.length === 0 && <p>{t("noTestsYet")}</p>}
          {myTests.map((item) => (
            <article key={item.id} className="test-item">
              <h3>{item.topic}</h3>
              <p>{t("level")}: {item.level}</p>
              <p>{t("questions")}: {item.questionCount}</p>
              <p>{t("sentToStudents")}: {item.assignedTo.length}</p>
              <button className="danger-btn table-delete-btn" type="button" onClick={() => removeTest(item)}>
                <FaTrash /> {t("deleteTest")}
              </button>
            </article>
          ))}
        </div>
      </section>
      <section className="panel">
        <h2><FaTrash /> {t("stepManageStudents")}</h2>
        <p>{t("manageStudentsHelp")}</p>
        <div className="table-tools">
          <label>
            {t("searchStudents")}
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("searchStudents")} />
          </label>
          <label>
            {t("filterLevel")}
            <select value={levelFilter} onChange={(event) => setLevelFilter(event.target.value)}>
              <option value="all">{t("allLevels")}</option>
              {LEVELS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
        {filteredStudents.length === 0 && <p>{t("noStudentsForManage")}</p>}
        {filteredStudents.length > 0 && (
          <div className="table-wrap">
            <table className="student-table">
              <thead>
                <tr>
                  <th>{t("colName")}</th>
                  <th>{t("login")}</th>
                  <th>{t("level")}</th>
                  <th>{t("colAssign")}</th>
                  <th>{t("colActions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((item) => (
                  <tr key={item.id}>
                    <td>{item.firstName} {item.lastName}</td>
                    <td>{item.login}</td>
                    <td>{item.level}</td>
                    <td>
                      <label className="table-check">
                        <input
                          type="checkbox"
                          checked={aiForm.studentIds.includes(item.id)}
                          onChange={() => toggleStudentAssign(item.id)}
                        />
                        <span>{t("sendTest")}</span>
                      </label>
                    </td>
                    <td>
                      <button className="danger-btn table-delete-btn" type="button" onClick={() => removeStudent(item)}>
                        <FaTrash /> {t("deleteStudent")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function StudentRoutes({ student, tests, onLogout, onCompleteTest, onUpdateSettings, t, language, onLanguageChange }) {
  if (!student) return <Navigate to="/login/student" replace />;

  return (
    <Routes>
      <Route
        element={
          <StudentLayout
            student={student}
            onLogout={onLogout}
            t={t}
            language={language}
            onLanguageChange={onLanguageChange}
          />
        }
      >
        <Route index element={<Navigate to="tests" replace />} />
        <Route path="tests" element={<StudentTests student={student} tests={tests} onCompleteTest={onCompleteTest} t={t} />} />
        <Route path="results" element={<StudentResults student={student} tests={tests} t={t} />} />
        <Route
          path="profile"
          element={<StudentProfile student={student} onUpdateSettings={onUpdateSettings} t={t} />}
        />
      </Route>
      <Route path="*" element={<Navigate to="tests" replace />} />
    </Routes>
  );
}

function StudentLayout({ student, onLogout, t, language, onLanguageChange }) {
  const navigate = useNavigate();
  return (
    <main className="page shell">
      <LanguageSwitcher language={language} onChange={onLanguageChange} t={t} />
      <header className="topbar">
        <h1>{t("studentPanel")}</h1>
        <div className="topbar-actions">
          <button className="ghost-btn" onClick={() => navigate("/")}>{t("home")}</button>
          <button className="danger-btn" onClick={onLogout}><FaSignOutAlt /> {t("logout")}</button>
        </div>
      </header>
      <section className="grid-two">
        <article className="panel">
          <h2>{t("welcomeBack")}, {student.firstName}</h2>
          <p>{t("login")}: {student.login}</p>
          <p>{t("level")}: {student.level}</p>
          <p className="score-box">{t("totalScore")}: {student.totalScore}</p>
          <p className="muted-line">{t("finishedTests")}: {student.completedTestIds.length}</p>
        </article>
        <article className="panel">
          <h2>{t("profileSettings")}</h2>
          <p>{student.learningGoal || "-"}</p>
        </article>
      </section>
      <nav className="student-nav panel">
        <NavLink to="/student/tests" className={({ isActive }) => `student-nav-link ${isActive ? "active" : ""}`}>{t("studentTestsTab")}</NavLink>
        <NavLink to="/student/results" className={({ isActive }) => `student-nav-link ${isActive ? "active" : ""}`}>{t("studentResultsTab")}</NavLink>
        <NavLink to="/student/profile" className={({ isActive }) => `student-nav-link ${isActive ? "active" : ""}`}>{t("studentProfileTab")}</NavLink>
      </nav>
      <Outlet />
    </main>
  );
}

function StudentTests({ student, tests, onCompleteTest, t }) {
  const [activeTestId, setActiveTestId] = useState(null);
  const [result, setResult] = useState("");
  const availableTests = tests.filter((item) => item.assignedTo.includes(student.id));
  const activeTest = availableTests.find((item) => item.id === activeTestId) || null;

  const finishTest = ({ testId, earned }) => {
    onCompleteTest({ studentId: student.id, testId, earned });
    setResult(t("testFinishedWithScore", { score: earned }));
    setActiveTestId(null);
  };

  if (activeTest) {
    return <TestRunner test={activeTest} onBack={() => setActiveTestId(null)} onFinish={finishTest} t={t} />;
  }

  return (
    <>
      {result && <p className="success-text">{result}</p>}
      <section className="panel">
        <div className="test-grid">
          {availableTests.length === 0 && <p>{t("noAssignedTests")}</p>}
          {availableTests.map((item) => {
            const completed = student.completedTestIds.includes(item.id);
            return (
              <article key={item.id} className={`topic-card ${completed ? "done" : ""}`}>
                <h3>{item.topic}</h3>
                <p>{item.level}</p>
                <button className="primary-btn" disabled={completed} onClick={() => { setResult(""); setActiveTestId(item.id); }}>
                  {completed ? t("completed") : t("startTest")}
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

function StudentResults({ student, tests, t }) {
  const recentAttempts = [...(Array.isArray(student.testAttempts) ? student.testAttempts : [])]
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  const completionRate = tests.length ? Math.round((student.completedTestIds.length / tests.length) * 100) : 0;
  const uniqueDays = [...new Set(recentAttempts.map((attempt) => String(attempt.completedAt).slice(0, 10)))].sort().reverse();
  let streakDays = 0;
  if (uniqueDays.length) {
    let cursor = new Date(uniqueDays[0]);
    for (let i = 0; i < uniqueDays.length; i += 1) {
      const current = new Date(uniqueDays[i]);
      if (current.toDateString() !== cursor.toDateString()) break;
      streakDays += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
  }
  return (
    <section className="panel">
      <h2>{t("recentResults")}</h2>
      <div className="mini-stats">
        <article className="mini-stat"><small>{t("progressRate")}</small><strong>{completionRate}%</strong></article>
        <article className="mini-stat"><small>{t("streakDays")}</small><strong>{streakDays}</strong></article>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, completionRate))}%` }} />
      </div>
      {recentAttempts.length === 0 && <p>{t("noResultsYet")}</p>}
      {recentAttempts.length > 0 && (
        <div className="attempt-list">
          {recentAttempts.map((attempt) => {
            const testTitle = tests.find((item) => item.id === attempt.testId)?.topic || attempt.testId;
            const statusKey = attempt.earned >= 60 ? "statusGood" : "statusRisk";
            return (
              <article key={`${attempt.testId}-${attempt.completedAt}`} className="attempt-item">
                <strong>{testTitle}</strong>
                <span>{t("score")}: {attempt.earned}</span>
                <span className={attempt.earned >= 60 ? "pill-good" : "pill-risk"}>{t(statusKey)}</span>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function StudentProfile({ student, onUpdateSettings, t }) {
  const [goal, setGoal] = useState(student.learningGoal || "");
  const [saved, setSaved] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    onUpdateSettings({ studentId: student.id, learningGoal: goal });
    setSaved(true);
  };

  return (
    <section className="panel">
      <h2>{t("profileSettings")}</h2>
      <form onSubmit={submit} className="form-grid">
        <label>
          {t("learningGoal")}
          <input value={goal} onChange={(event) => { setGoal(event.target.value); if (saved) setSaved(false); }} />
        </label>
        <button className="primary-btn" type="submit">{t("saveSettings")}</button>
      </form>
      {saved && <p className="success-text">{t("settingsSaved")}</p>}
    </section>
  );
}

function TestRunner({ test, onBack, onFinish, t }) {
  const [answers, setAnswers] = useState({});

  const submit = (event) => {
    event.preventDefault();
    let correct = 0;
    test.questions.forEach((question) => {
      if (Number(answers[question.id]) === question.correctIndex) correct += 1;
    });
    onFinish({ testId: test.id, earned: correct * 10 });
  };

  return (
    <section className="panel">
      <h2>{test.topic} {t("testWord")}</h2>
      <form onSubmit={submit} className="question-list">
        {test.questions.map((question, index) => (
          <article key={question.id} className="question-item">
            <h4>{index + 1}. {question.prompt}</h4>
            <p className="question-uz">({getLocalizedPrompt(question.prompt, t)})</p>
            <div className="option-grid">
              {question.options.map((option, optionIndex) => (
                <label key={`${question.id}-${optionIndex}`} className="option-item">
                  <input type="radio" name={question.id} value={optionIndex} checked={Number(answers[question.id]) === optionIndex} onChange={(event) => setAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))} required />
                  {option}
                </label>
              ))}
            </div>
          </article>
        ))}
        <div className="row">
          <button className="ghost-btn" type="button" onClick={onBack}>{t("back")}</button>
          <button className="primary-btn" type="submit">{t("finishTest")}</button>
        </div>
      </form>
    </section>
  );
}

export default App;

