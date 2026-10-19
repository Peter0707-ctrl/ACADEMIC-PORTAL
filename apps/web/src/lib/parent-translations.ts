export type Language = 'SW' | 'EN';

export interface ParentDictionary {
  // Brand & Header
  schoolPortalTitle: string;
  parentGuardianPortal: string;
  selectChildToView: string;
  linkAnotherChild: string;
  dustbinTitle: string;
  verifiedParentBadge: string;
  parentVerifiedBadge: string;
  changeRole: string;
  logoutBtn: string;
  officialYear: string;
  studentDataProtection: string;
  allRightsReserved: string;
  officialParentPortal: string;

  // Navigation Items
  navDashboard: string;
  navAcademic: string;
  navAttendance: string;
  navFinance: string;
  navCommunication: string;
  navMeetings: string;
  navDocuments: string;
  navDiscipline: string;
  navRequests: string;

  // Breadcrumbs & Common
  parentPortalBreadcrumb: string;
  boy: string;
  girl: string;
  admissionNoLabel: string;
  classAndStreamLabel: string;
  homeroomTeacherLabel: string;
  examReportBtn: string;
  payFeesBtn: string;
  printBtn: string;
  downloadPdfBtn: string;
  closeBtn: string;
  cancelBtn: string;
  confirmBtn: string;
  saveBtn: string;
  statusLabel: string;
  dateLabel: string;
  timeLabel: string;
  actionLabel: string;
  viewDetails: string;
  viewFullRecords: string;

  // Summary Metrics
  metricTermAverage: string;
  metricTermGrade: string;
  metricClassRank: string;
  metricRankSuffix: string;
  metricAttendanceRate: string;
  metricGoodAttendance: string;
  metricFeeStatus: string;
  metricOutstandingBalance: string;
  metricFeeCompleted: string;

  // Dashboard Sections
  academicsQuickGlanceTitle: string;
  viewFullReportLink: string;
  schoolAnnouncementsTitle: string;
  agmTitle: string;
  agmDesc: string;
  easterHolidayTitle: string;
  easterHolidayDesc: string;
  examScheduleTitle: string;
  examScheduleDesc: string;
  sportsDayTitle: string;
  sportsDayDesc: string;

  // Academic Tab
  academicReportTitle: string;
  academicReportSubtitle: string;
  tblSubject: string;
  tblTest1: string;
  tblTest2: string;
  tblMidterm: string;
  tblFinal: string;
  tblAverage: string;
  tblGrade: string;
  tblRemarks: string;
  stampApproved: string;
  stampOfficialSeal: string;
  stampHeadteacher: string;
  stampApprovalDate: string;
  stampRemarksHeading: string;
  stampHeadteacherNote: string;
  scheduledResultsLockedTitle: string;
  scheduledResultsLockedDesc: string;
  officialResultsReleaseDate: string;
  resultsSmsNotice: string;
  emergencyEnquiryNote: string;

  // Attendance Tab
  attendanceReportTitle: string;
  attendanceReportSubtitle: string;
  btnRequestLeave: string;
  attendanceOverallRate: string;
  attendanceOverallExcellent: string;
  attendancePresentDays: string;
  attendancePresentSubtitle: string;
  attendanceAbsentDays: string;
  attendanceAbsentSubtitle: string;
  attendancePermittedDays: string;
  attendancePermittedSubtitle: string;
  attendanceMonthlyTableTitle: string;
  attendanceMonthlyTableSubtitle: string;
  tblMonth: string;
  tblPresent: string;
  tblAbsent: string;
  tblPermission: string;
  tblTotalDays: string;
  tblRate: string;
  tblEvaluation: string;
  evalOutstanding: string;
  evalGood: string;
  evalNeedsAttention: string;
  attendanceTeacherRemarkTitle: string;
  attendanceTeacherRemarkBody: string;

  // Finance Tab
  financeStructureTitle: string;
  financeStructureSubtitle: string;
  termOneBadge: string;
  feeTotalLabel: string;
  feePaidLabel: string;
  feeBalanceLabel: string;
  controlNumberTitle: string;
  controlNumberSubtitle: string;
  controlNumberActive: string;
  pupilControlNumber: string;
  copyControlNumberBtn: string;
  copiedNotice: string;
  controlNumberInstructions: string;
  nmbAccountLabel: string;
  crdbAccountLabel: string;
  accountNameLabel: string;
  howToPayTitle: string;
  step1Pay: string;
  step2Pay: string;
  step3Pay: string;
  step4Pay: string;
  receiptHistoryTitle: string;
  receiptHistorySubtitle: string;
  tblReceiptNo: string;
  tblAmount: string;
  tblPaymentMethod: string;
  tblDescription: string;
  paymentConfirmed: string;
  paymentPending: string;
  generateControlNumberBtn: string;
  generateNewBillModalTitle: string;
  generateNewBillDesc: string;
  feePurposeLabel: string;
  amountToPayLabel: string;
  channelPreferenceLabel: string;
  billExpiryLabel: string;
  billRefLabel: string;
  btnDownloadBillSlip: string;
  btnPrintBillSlip: string;
  simulatePaymentBtn: string;
  controlNumberGeneratedNotice: string;
  paymentSuccessNotice: string;

  // Communication Tab
  commOfficialTitle: string;
  commOfficialSubtitle: string;
  filterAll: string;
  filterUrgent: string;
  filterAcademic: string;
  filterFinance: string;
  messageFromSchool: string;
  directMessageTitle: string;
  directMessageSubtitle: string;
  sendDirectMessageBtn: string;
  selectRecipientLabel: string;
  messageContentLabel: string;
  messagePlaceholder: string;

  // Meetings Tab
  meetingsTitle: string;
  meetingsSubtitle: string;
  scheduleAppointmentTitle: string;
  scheduleAppointmentSubtitle: string;
  selectStaffLabel: string;
  meetingTopicLabel: string;
  preferredDateLabel: string;
  bookAppointmentBtn: string;
  scheduledMeetingsTitle: string;

  // Documents Tab
  documentsTitle: string;
  documentsSubtitle: string;
  docBirthCertificate: string;
  docAdmissionLetter: string;
  docMedicalForm: string;
  docProgressReport: string;
  docRulesRegulation: string;
  verifiedOfficialDoc: string;
  downloadDocBtn: string;

  // Discipline Tab
  disciplineTitle: string;
  disciplineSubtitle: string;
  conductAssessmentLabel: string;
  excellentConduct: string;
  incidentHistoryTitle: string;
  noDisciplineIncidents: string;
  cleanRecordDesc: string;
  tblIncidentDate: string;
  tblIncidentIssue: string;
  tblActionTaken: string;

  // Requests Tab
  requestsTitle: string;
  leaveRequestFormTitle: string;
  leaveReasonLabel: string;
  leaveReasonMedical: string;
  leaveReasonFamily: string;
  leaveReasonTravel: string;
  leaveReasonOther: string;
  startDateLabel: string;
  numberOfDaysLabel: string;
  additionalNotesLabel: string;
  submitLeaveRequestBtn: string;
  submittedRequestsTitle: string;
  statusPendingHeadteacher: string;
  statusApprovedHeadteacher: string;

  // Student Visit Request
  visitRequestTitle: string;
  visitRequestSubtitle: string;
  visitDisciplineNotice: string;
  visitChildLabel: string;
  visitTypeLabel: string;
  visitTypeGeneral: string;
  visitTypeAcademic: string;
  visitTypeDiscipline: string;
  visitTypeHealth: string;
  visitTypeUrgent: string;
  visitTypeEvent: string;
  visitTypeOther: string;
  preferredVisitDate: string;
  preferredVisitTime: string;
  disciplineRefOptional: string;
  notesForHeadteacher: string;
  visitApprovalDisclaimer: string;
  submitVisitRequestBtn: string;
  visitTrackerTitle: string;
  noVisitsSubmitted: string;

  // Modals
  profileModalTitle: string;
  profileModalPreview: string;
  profileModalChoosePhoto: string;
  profileModalNotice: string;
  linkModalTitle: string;
  linkModalDesc: string;
  linkModalAdmLabel: string;
  linkModalPinLabel: string;
  linkModalBenefitNotice: string;
  linkModalSubmitBtn: string;
  dustbinModalTitle: string;
  dustbinModalSubtitle: string;
  dustbinEmptyTitle: string;
  dustbinEmptyDesc: string;
  dustbinWarning: string;
  restoreBtn: string;
  deleteForeverBtn: string;
  confirmDeleteModalTitle: string;
  confirmDeleteModalText: string;
  confirmDeleteYesBtn: string;

  // Copetra AI
  navCopetraAi: string;
  copetraAiTitle: string;
  copetraAiSubtitle: string;
  copetraAiBadge: string;
  copetraAiComprehensiveAnalysis: string;
  copetraAiOverallVerdict: string;
  copetraAiStrengthsTitle: string;
  copetraAiGrowthAreasTitle: string;
  copetraAiNectaForecastTitle: string;
  copetraAiAttendanceImpactTitle: string;
  copetraAiParentAdviceTitle: string;
  copetraAiChatTitle: string;
  copetraAiChatSubtitle: string;
  copetraAiChatPlaceholder: string;
  copetraAiSendPrompt: string;
  copetraAiQuickQuestions: string;
  copetraAiPrintReportBtn: string;
  copetraAiQuickInsightBtn: string;
}

export const PARENT_TRANSLATIONS: Record<Language, ParentDictionary> = {
  SW: {
    // Brand & Header
    schoolPortalTitle: 'PRIMARY & NURSERY',
    parentGuardianPortal: 'PORTAL YA MZAZI / MLEZI',
    selectChildToView: 'CHAGUA MTOTO WA KUANGALIA:',
    linkAnotherChild: 'Unganisha Mtoto Mwingine',
    dustbinTitle: 'Dustbin (Watoto Waliofutwa)',
    verifiedParentBadge: 'Mzazi / Mlezi Aliyethibitishwa',
    parentVerifiedBadge: 'Utambulisho wa Mzazi Umeridhiwa',
    changeRole: 'Badili Nafasi',
    logoutBtn: 'Toka',
    officialYear: 'Mwaka wa Masomo 2026',
    studentDataProtection: 'Ulinzi wa Taarifa za Wanafunzi',
    allRightsReserved: 'Haki zote zimehifadhiwa.',
    officialParentPortal: 'Portal Rasmi ya Wazazi',

    // Navigation
    navDashboard: 'Dashibodi ya Mtoto',
    navAcademic: 'Taaluma & Matokeo',
    navAttendance: 'Mahudhurio ya Shule',
    navFinance: 'Ada & Malipo (Finance)',
    navCommunication: 'Mawasiliano & Matangazo',
    navMeetings: 'Mikutano & Miadi',
    navDocuments: 'Nyaraka & Vyeti vya Mtoto',
    navDiscipline: 'Nidhamu & Malezi',
    navRequests: 'Maombi ya Ruhusa (Requests)',

    // Breadcrumbs & Common
    parentPortalBreadcrumb: 'Portal ya Mzazi',
    boy: 'Mvulana',
    girl: 'Msichana',
    admissionNoLabel: 'Namba ya Usajili:',
    classAndStreamLabel: 'Darasa & Mkondo:',
    homeroomTeacherLabel: 'Mwalimu wa Darasa:',
    examReportBtn: 'Ripoti ya Matokeo',
    payFeesBtn: 'Lipa Ada / Namba ya Malipo',
    printBtn: 'Chapisha',
    downloadPdfBtn: 'Pakua PDF',
    closeBtn: 'Funga',
    cancelBtn: 'Ghairi',
    confirmBtn: 'Thibitisha',
    saveBtn: 'Hifadhi',
    statusLabel: 'Hali:',
    dateLabel: 'Tarehe:',
    timeLabel: 'Saa:',
    actionLabel: 'Hatua:',
    viewDetails: 'Tazama Maelezo',
    viewFullRecords: 'Tazama Rekodi Kamili →',

    // Summary Metrics
    metricTermAverage: 'Wastani wa Muhula',
    metricTermGrade: 'Daraja A (Bora Sana)',
    metricClassRank: 'Nafasi Darasani',
    metricRankSuffix: 'Nafasi',
    metricAttendanceRate: 'Mahudhurio ya Shule',
    metricGoodAttendance: 'Mahudhurio Mazuri',
    metricFeeStatus: 'Hali ya Ada',
    metricOutstandingBalance: 'Bao Lililosalia',
    metricFeeCompleted: 'Ada Imekamilika',

    // Dashboard Sections
    academicsQuickGlanceTitle: 'Ufaulu wa Masomo ya Mtoto (Continuous Assessment)',
    viewFullReportLink: 'Tazama Ripoti Kamili →',
    schoolAnnouncementsTitle: 'Matangazo ya Shule',
    agmTitle: 'Kikao cha Wazazi na Uongozi wa Shule (AGM)',
    agmDesc: 'Jumamosi saa 3:00 Asubuhi ukumbini.',
    easterHolidayTitle: 'Kazi za Likizo ya Pasaka 2026',
    easterHolidayDesc: 'Pakua vijitabu vya mazoezi ya nyumbani.',
    examScheduleTitle: 'Ratiba ya Mitihani ya Nusu Muhula',
    examScheduleDesc: 'Inaanza tarehe 20 Machi 2026.',
    sportsDayTitle: 'Siku ya Bonanza la Michezo & Vipaji',
    sportsDayDesc: 'Michezo na burudani uwanja wa shule.',

    // Academic Tab
    academicReportTitle: 'Ripoti Rasmi ya Maendeleo ya Masomo (Report Card)',
    academicReportSubtitle: 'PRIMARY & NURSERY SCHOOL • Idara ya Elimu ya Msingi',
    tblSubject: 'Somo',
    tblTest1: 'Mjaribio 1',
    tblTest2: 'Mjaribio 2',
    tblMidterm: 'Nusu Muhula',
    tblFinal: 'Muhula (Final)',
    tblAverage: 'Wastani (%)',
    tblGrade: 'Daraja',
    tblRemarks: 'Maoni ya Mwalimu wa Somo',
    stampApproved: 'APPROVED & SEALED',
    stampOfficialSeal: 'Muhuri Rasmi Umethibitishwa ✓',
    stampHeadteacher: 'Mkuu wa Shule (Headteacher)',
    stampApprovalDate: 'Tarehe ya Idhini:',
    stampRemarksHeading: 'Ushauri na Maoni ya Mwalimu Mkuu:',
    stampHeadteacherNote: 'Mwanafunzi ana maendeleo mazuri sana ya kitaaluma. Amefanya vizuri sana kwenye masomo ya Sayansi na Hisabati. Ana uwezo wa kufaulu zaidi akiongeza bidii katika masomo ya kijamii.',
    scheduledResultsLockedTitle: '🔒 MATOKEO YAMEHIFADHIWA • YATAFUNGULIWA HIVI PUNDE',
    scheduledResultsLockedDesc: 'Uongozi wa Shule unawataarifu wazazi kuwa matokeo ya Muhula wa 1 yamekamilika na yamekaguliwa na Mwalimu Mkuu. Ripoti rasmi zimepangwa kufunguliwa rasmi kwa wazazi wote siku ya kufunga shule:',
    officialResultsReleaseDate: 'Tarehe Rasmi ya Kufunguliwa Matokeo:',
    resultsSmsNotice: 'Wazazi wataarifiwa pia kupitia ujumbe wa SMS / WhatsApp mara baada ya kufunguliwa.',
    emergencyEnquiryNote: 'Ikiwa unahitaji ufafanuzi wa dharura, unaweza kuwasiliana na Uongozi wa Shule kupitia dawati la huduma.',

    // Attendance Tab
    attendanceReportTitle: 'Ripoti Kamili ya Mahudhurio ya Shule',
    attendanceReportSubtitle: 'Rekodi rasmi za daftari la mahudhurio ya shule (Daily Roll Call)',
    btnRequestLeave: 'Omba Ruhusa ya Utoro',
    attendanceOverallRate: 'Kiwango cha Mahudhurio',
    attendanceOverallExcellent: 'Bora Sana (Kiwango cha Juu)',
    attendancePresentDays: 'Siku Alizohudhuria',
    attendancePresentSubtitle: 'Siku za masomo darasani',
    attendanceAbsentDays: 'Siku Alizokosa (Utoro)',
    attendanceAbsentSubtitle: 'Bila taarifa / utoro',
    attendancePermittedDays: 'Siku za Ruhusa',
    attendancePermittedSubtitle: 'Matibabu & dharura',
    attendanceMonthlyTableTitle: 'Mchanganuo wa Mahudhurio kwa Kila Mwezi (Muhula wa 1)',
    attendanceMonthlyTableSubtitle: 'Rekodi rasmi za daftari la mahudhurio ya shule (Daily Roll Call)',
    tblMonth: 'Mwezi',
    tblPresent: 'Siku Alizohudhuria',
    tblAbsent: 'Siku za Utoro',
    tblPermission: 'Siku za Ruhusa',
    tblTotalDays: 'Jumla ya Siku',
    tblRate: 'Kiwango (%)',
    tblEvaluation: 'Tathmini',
    evalOutstanding: 'Bora Kabisa',
    evalGood: 'Inaridhisha',
    evalNeedsAttention: 'Inahitaji Uangalizi',
    attendanceTeacherRemarkTitle: 'Maoni ya Mwalimu wa Darasa (Homeroom Teacher):',
    attendanceTeacherRemarkBody: 'Mwanafunzi ana rekodi nzuri sana ya kuwahi vipindi vya asubuhi. Hakuna kosa la kutoroka vipindi au kufika baada ya kengele ya kwanza.',

    // Finance Tab
    financeStructureTitle: 'Muundo wa Ada & Bao Lililosalia',
    financeStructureSubtitle: 'Ada ya Masomo ya Mwaka 2026',
    termOneBadge: 'Muhula wa 1',
    feeTotalLabel: 'Ada Kamili',
    feePaidLabel: 'Kiasi Kilicholipwa',
    feeBalanceLabel: 'Bao Lililosalia',
    controlNumberTitle: 'Namba ya Malipo ya Shule (School Fee Control Number)',
    controlNumberSubtitle: 'PRIMARY & NURSERY SCHOOL • Akaunti Rasmi ya Malipo ya Ada',
    controlNumberActive: 'Inatumika (Active)',
    pupilControlNumber: 'Namba ya Malipo ya Mwanafunzi',
    copyControlNumberBtn: 'Nakili Namba',
    copiedNotice: 'Namba ya malipo imenakiliwa!',
    controlNumberInstructions: 'Lipia ada kwa kutumia namba hii kupitia mitandao yote ya simu au moja kwa moja kupitia benki ya shule (NMB & CRDB).',
    nmbAccountLabel: 'NMB Bank A/C:',
    crdbAccountLabel: 'CRDB Bank A/C:',
    accountNameLabel: 'Jina la Akaunti:',
    howToPayTitle: 'Jinsi ya Kulipa Ada ya Shule',
    step1Pay: 'Piga *150*00# (M-Pesa), *150*01# (Tigo Pesa), au *150*60# (Airtel Money).',
    step2Pay: 'Chagua Lipa kwa Simu au Lipa Bili (Pay Bill).',
    step3Pay: 'Ingiza Namba ya Malipo (Control Number) ya mtoto wako iliyo hapo juu.',
    step4Pay: 'Thibitisha jina la shule, weka PIN yako na utapokea ujumbe wa uthibitisho papo hapo.',
    receiptHistoryTitle: 'Historia ya Risiti za Malipo Yaliyothibitishwa',
    receiptHistorySubtitle: 'Stakabadhi rasmi za malipo ya ada ya shule',
    tblReceiptNo: 'Namba ya Risiti',
    tblAmount: 'Kiasi (Tsh)',
    tblPaymentMethod: 'Njia ya Malipo',
    tblDescription: 'Maelezo ya Malipo',
    paymentConfirmed: 'Imethibitishwa',
    paymentPending: 'Inasubiri',
    generateControlNumberBtn: 'Tengeneza Namba Mpya ya Malipo',
    generateNewBillModalTitle: 'Tengeneza Namba Mpya ya Malipo (Control Number)',
    generateNewBillDesc: 'Chagua aina ya malipo na kiasi unachotaka kulipa ili kuzalisha Namba halisi ya Malipo (GePG / Bank Control Number) yenye uthibitisho wa shule.',
    feePurposeLabel: 'Kusudio la Malipo / Aina ya Ada:',
    amountToPayLabel: 'Kiasi cha Kulipa (Tsh):',
    channelPreferenceLabel: 'Njia ya Kulipia (M-Pesa / Tigo Pesa / Benki):',
    billExpiryLabel: 'Tarehe ya Mwisho wa Kulipa:',
    billRefLabel: 'Namba ya Kumbukumbu ya Bili (Bill Ref):',
    btnDownloadBillSlip: 'Pakua Bili ya Malipo (PDF)',
    btnPrintBillSlip: 'Chapisha Hati ya Bili',
    simulatePaymentBtn: 'Fanya Malipo ya Majaribio (Simulate M-Pesa)',
    controlNumberGeneratedNotice: 'Namba Mpya Halisi ya Malipo imetengenezwa kikamilifu!',
    paymentSuccessNotice: 'Malipo yamekamilika na stakabadhi rasmi imezalishwa!',

    // Communication Tab
    commOfficialTitle: 'Mawasiliano na Matangazo Rasmi ya Shule',
    commOfficialSubtitle: 'Taarifa za dharura, barua za shule na ujumbe wa walimu kwa wazazi',
    filterAll: 'Yote',
    filterUrgent: 'Dharura',
    filterAcademic: 'Taaluma',
    filterFinance: 'Ada & Fedha',
    messageFromSchool: 'Ujumbe kutoka Uongozi wa Shule',
    directMessageTitle: 'Wasiliana Moja kwa Moja na Mwalimu / Uongozi',
    directMessageSubtitle: 'Tuma ujumbe wa moja kwa moja kwa mwalimu wa darasa au Mkuu wa Shule',
    sendDirectMessageBtn: 'Tuma Ujumbe kwa Shule',
    selectRecipientLabel: 'Mpokeaji:',
    messageContentLabel: 'Ujumbe Wako:',
    messagePlaceholder: 'Andika ujumbe wako hapa...',

    // Meetings Tab
    meetingsTitle: 'Mikutano ya Wazazi na Miadi ya Walimu',
    meetingsSubtitle: 'Ratiba ya vikao vikuu vya wazazi na miadi ya mashauriano binafsi',
    scheduleAppointmentTitle: 'Omba Miadi ya Kuonana na Mwalimu',
    scheduleAppointmentSubtitle: 'Chagua mwalimu unayetaka kuonana naye na muda unaopendelea',
    selectStaffLabel: 'Chagua Mwalimu / Afisa wa Shule:',
    meetingTopicLabel: 'Mada ya Mashauriano:',
    preferredDateLabel: 'Tarehe Unayopendelea:',
    bookAppointmentBtn: 'Tuma Ombi la Miadi',
    scheduledMeetingsTitle: 'Ratiba ya Vikao Vilivyopangwa Shuleni',

    // Documents Tab
    documentsTitle: 'Nyaraka & Vyeti vya Mwanafunzi',
    documentsSubtitle: 'Vyeti vya kitaaluma, barua za kujiunga na hati rasmi za mwanafunzi',
    docBirthCertificate: 'Cheti cha Kuzaliwa (RITA)',
    docAdmissionLetter: 'Barua Rasmi ya Kujiunga na Shule',
    docMedicalForm: 'Fomu ya Afya ya Mwanafunzi',
    docProgressReport: 'Ripoti ya Maendeleo ya Masomo',
    docRulesRegulation: 'Sheria na Taratibu za Shule',
    verifiedOfficialDoc: 'Imethibitishwa na Shule',
    downloadDocBtn: 'Pakua Hati',

    // Discipline Tab
    disciplineTitle: 'Tathmini ya Nidhamu & Malezi ya Mwanafunzi',
    disciplineSubtitle: 'Ufuatiliaji wa tabia, mwenendo wa darasani na malezi ya mtoto',
    conductAssessmentLabel: 'Tathmini ya Mwenendo:',
    excellentConduct: 'Mwenendo Bora Sana (Tabia Njema)',
    incidentHistoryTitle: 'Kumbukumbu za Matukio ya Kinidhamu',
    noDisciplineIncidents: 'Hakuna Rekodi Yoyote ya Kinidhamu',
    cleanRecordDesc: 'Mwanafunzi ana mwenendo na tabia safi kabisa shuleni.',
    tblIncidentDate: 'Tarehe',
    tblIncidentIssue: 'Suala / Kosa',
    tblActionTaken: 'Hatua Iliyochukuliwa',

    // Requests Tab
    requestsTitle: 'Maombi ya Ruhusa & Mahitaji Maalum',
    leaveRequestFormTitle: 'Wasilisha Ombi la Ruhusa ya Mtoto (Leave Request)',
    leaveReasonLabel: 'Sababu ya Ruhusa:',
    leaveReasonMedical: 'Matibabu (Hospitali / Ushauri wa Daktari)',
    leaveReasonFamily: 'Dharura ya Kifamilia / Msiba',
    leaveReasonTravel: 'Safari Maalum ya Familia',
    leaveReasonOther: 'Sababu Nyingine',
    startDateLabel: 'Tarehe ya Kuanza:',
    numberOfDaysLabel: 'Idadi ya Siku:',
    additionalNotesLabel: 'Maelezo ya Ziada kwa Mwalimu Mkuu:',
    submitLeaveRequestBtn: 'Tuma Ombi kwa Mwalimu Mkuu',
    submittedRequestsTitle: 'Hali ya Maombi ya Ruhusa Yaliyotumwa',
    statusPendingHeadteacher: 'INASUBIRI IDHINI YA MWALIMU MKUU',
    statusApprovedHeadteacher: 'IMEIDHINISHWA NA MWALIMU MKUU',

    // Student Visit Request
    visitRequestTitle: 'Ombi la Kumuona Mwanafunzi Shuleni',
    visitRequestSubtitle: 'Ombi hili linatumwa kwa Mwalimu Mkuu kupitishwa rasmi',
    visitDisciplineNotice: 'Mwanafunzi ana rekodi ya kinidhamu. Unaweza taja namba ya rejea ya kesi hiyo kama mkutano unahusiana nazo.',
    visitChildLabel: 'Mtoto Unayetaka Kumuona:',
    visitTypeLabel: 'Aina ya Ziara:',
    visitTypeGeneral: 'Mazungumzo ya Jumla na Mwalimu Mkuu',
    visitTypeAcademic: 'Tathmini ya Maendeleo ya Masomo',
    visitTypeDiscipline: 'Mkutano Kuhusu Suala la Kinidhamu',
    visitTypeHealth: 'Kuangalia Hali ya Afya ya Mtoto',
    visitTypeUrgent: 'Mkutano wa Haraka — Suala Nyeti',
    visitTypeEvent: 'Ushiriki — Sherehe / Tukio la Shule',
    visitTypeOther: 'Sababu Nyingine',
    preferredVisitDate: 'Tarehe ya Ziara:',
    preferredVisitTime: 'Saa ya Ziara:',
    disciplineRefOptional: 'Namba ya Rejea ya Kinidhamu (si lazima):',
    notesForHeadteacher: 'Maelezo kwa Mwalimu Mkuu:',
    visitApprovalDisclaimer: 'Ombi lako litatumwa kwa Mwalimu Mkuu moja kwa moja. Ukishapitishwa, utapata namba ya kuthibitisha ya ziara hapa. Mwalimu Mkuu ndiye pekee anayeidhinisha ziara zote shuleni.',
    submitVisitRequestBtn: 'Tuma Ombi kwa Mwalimu Mkuu',
    visitTrackerTitle: 'Hali ya Maombi ya Ziara / Mikutano',
    noVisitsSubmitted: 'Bado haujatuma ombi lolote la ziara.',

    // Modals
    profileModalTitle: 'Pakia Picha ya Wasifu',
    profileModalPreview: 'Picha ya sasa ya wasifu wako.',
    profileModalChoosePhoto: 'Chagua Picha (jpg, png, webp)',
    profileModalNotice: 'Picha inabaki kwenye kifaa chako tu na inahifadhiwa hata ukifungua upya ukurasa.',
    linkModalTitle: 'Unganisha Mtoto Mwingine',
    linkModalDesc: 'Kama una mtoto mwingine anayesoma shuleni hapa, weka Namba yake ya Usajili (Admission Number) na PIN ya siri ili kumuunganisha kwenye akaunti yako moja.',
    linkModalAdmLabel: 'Namba ya Usajili ya Mtoto (Admission / Reg No.)',
    linkModalPinLabel: 'PIN ya Siri ya Mzazi / Namba ya Simu Iliyosajiliwa',
    linkModalBenefitNotice: 'Ukishaunganisha, utaweza kuangalia matokeo, ada, na mahudhurio ya watoto wako wote kwa kubadili jina tu kwenye kona ya juu kushoto.',
    linkModalSubmitBtn: 'Thibitisha & Unganisha',
    dustbinModalTitle: 'Dustbin (Kapu la Taka)',
    dustbinModalSubtitle: 'Watoto waliofutwa kutoka kwenye orodha yako',
    dustbinEmptyTitle: 'Dustbin iko tupu',
    dustbinEmptyDesc: 'Watoto unaofuta kutoka kwenye orodha watakuja hapa kwanza kabla ya kufutwa kabisa.',
    dustbinWarning: 'Watoto walio hapa wanaweza kurejeshwa kwenye orodha yako. Ukifuta kabisa (Futa Milele), hawezi kurejeshwa tena.',
    restoreBtn: 'Rejesha',
    deleteForeverBtn: 'Futa Milele',
    confirmDeleteModalTitle: 'Futa Kabisa?',
    confirmDeleteModalText: 'kabisa, hawezi kurejeshwa tena. Data yake yote itafutwa milele.',
    confirmDeleteYesBtn: 'Ndio, Futa Milele',

    // Copetra AI
    navCopetraAi: 'Copetra AI (Uchambuzi)',
    copetraAiTitle: 'Copetra AI — Mchambuzi wa Kiakili wa Mwanafunzi',
    copetraAiSubtitle: 'Uchambuzi wa kina wa kitaaluma, mahudhurio, mwenendo wa mitihani na mwongozo wa mzazi',
    copetraAiBadge: 'Copetra AI Engine v3.2',
    copetraAiComprehensiveAnalysis: 'Uchambuzi Mzima wa Mwanafunzi',
    copetraAiOverallVerdict: 'Tathmini ya Jumla ya Kiakili (Overall AI Verdict)',
    copetraAiStrengthsTitle: 'Nguvu Kuu za Kitaaluma (Core Strengths)',
    copetraAiGrowthAreasTitle: 'Maeneo Yanayohitaji Msukumo (Growth Areas)',
    copetraAiNectaForecastTitle: 'Utabiri wa Mitihani ya Taifa (NECTA Forecast)',
    copetraAiAttendanceImpactTitle: 'Uhusiano wa Mahudhurio na Ufaulu (Attendance Correlation)',
    copetraAiParentAdviceTitle: 'Mpango Kazi na Ushauri kwa Mzazi Nyumbani',
    copetraAiChatTitle: 'Uliza Copetra AI Chochote Kuhusu Mwanafunzi',
    copetraAiChatSubtitle: 'Pata majibu ya papo hapo yaliyochambuliwa kutoka kwenye alama, mahudhurio, na mwenendo wake',
    copetraAiChatPlaceholder: 'Andika swali lako hapa... (Mfn: Je, mwanangu anahitaji tuition ya somo gani?)',
    copetraAiSendPrompt: 'Tuma Swali',
    copetraAiQuickQuestions: 'Maswali ya Haraka:',
    copetraAiPrintReportBtn: 'Pakua Ripoti ya Copetra AI (PDF)',
    copetraAiQuickInsightBtn: 'Tazama Uchambuzi wa Copetra AI',
  },
  EN: {
    // Brand & Header
    schoolPortalTitle: 'PRIMARY & NURSERY',
    parentGuardianPortal: 'PARENT & GUARDIAN PORTAL',
    selectChildToView: 'SELECT CHILD TO VIEW:',
    linkAnotherChild: 'Link Another Child',
    dustbinTitle: 'Trash Bin (Deleted Children)',
    verifiedParentBadge: 'Verified Parent / Guardian',
    parentVerifiedBadge: 'Parent Identity Verified',
    changeRole: 'Change Role',
    logoutBtn: 'Logout',
    officialYear: 'Academic Year 2026',
    studentDataProtection: 'Student Data Protection & Security',
    allRightsReserved: 'All rights reserved.',
    officialParentPortal: 'Official Parent Portal',

    // Navigation
    navDashboard: 'Child Dashboard',
    navAcademic: 'Academics & Reports',
    navAttendance: 'School Attendance',
    navFinance: 'Fees & Payments',
    navCommunication: 'Communication & Notices',
    navMeetings: 'Meetings & Appointments',
    navDocuments: 'Documents & Certificates',
    navDiscipline: 'Discipline & Welfare',
    navRequests: 'Leave & Visit Requests',

    // Breadcrumbs & Common
    parentPortalBreadcrumb: 'Parent Portal',
    boy: 'Boy',
    girl: 'Girl',
    admissionNoLabel: 'Admission Number:',
    classAndStreamLabel: 'Class & Stream:',
    homeroomTeacherLabel: 'Homeroom Teacher:',
    examReportBtn: 'Exam Report Card',
    payFeesBtn: 'Pay Fees / Control Number',
    printBtn: 'Print',
    downloadPdfBtn: 'Download PDF',
    closeBtn: 'Close',
    cancelBtn: 'Cancel',
    confirmBtn: 'Confirm',
    saveBtn: 'Save',
    statusLabel: 'Status:',
    dateLabel: 'Date:',
    timeLabel: 'Time:',
    actionLabel: 'Action:',
    viewDetails: 'View Details',
    viewFullRecords: 'View Full Records →',

    // Summary Metrics
    metricTermAverage: 'Term Average',
    metricTermGrade: 'Grade A (Excellent)',
    metricClassRank: 'Class Rank',
    metricRankSuffix: 'Rank',
    metricAttendanceRate: 'Attendance Rate',
    metricGoodAttendance: 'Good Attendance',
    metricFeeStatus: 'Fee Status',
    metricOutstandingBalance: 'Outstanding Balance',
    metricFeeCompleted: 'Fee Fully Paid',

    // Dashboard Sections
    academicsQuickGlanceTitle: "Pupil's Academic Performance (Continuous Assessment)",
    viewFullReportLink: 'View Full Report →',
    schoolAnnouncementsTitle: 'School Announcements',
    agmTitle: 'Annual General Meeting with School Leadership (AGM)',
    agmDesc: 'Saturday 9:00 AM at the Main School Hall.',
    easterHolidayTitle: 'Easter Holiday Homework 2026',
    easterHolidayDesc: 'Download homework packages and reading material.',
    examScheduleTitle: 'Mid-Term Examination Timetable',
    examScheduleDesc: 'Begins on March 20, 2026.',
    sportsDayTitle: 'Sports & Talents Gala Day',
    sportsDayDesc: 'Sports tournaments and arts presentations on school grounds.',

    // Academic Tab
    academicReportTitle: 'Official Academic Progress Report (Report Card)',
    academicReportSubtitle: 'PRIMARY & NURSERY SCHOOL • Department of Primary Education',
    tblSubject: 'Subject',
    tblTest1: 'Test 1',
    tblTest2: 'Test 2',
    tblMidterm: 'Mid-Term',
    tblFinal: 'Final Exam',
    tblAverage: 'Average (%)',
    tblGrade: 'Grade',
    tblRemarks: 'Subject Teacher Remarks',
    stampApproved: 'APPROVED & SEALED',
    stampOfficialSeal: 'Official Seal Verified ✓',
    stampHeadteacher: 'Headteacher',
    stampApprovalDate: 'Approval Date:',
    stampRemarksHeading: "Headteacher's Remarks and Guidance:",
    stampHeadteacherNote: 'The pupil demonstrates commendable academic diligence. Performance in Science and Mathematics is outstanding. With sustained dedication in Social Studies, further academic distinction is well within reach.',
    scheduledResultsLockedTitle: '🔒 RESULTS ARCHIVED • RELEASING SHORTLY',
    scheduledResultsLockedDesc: 'The School Administration informs parents that Term 1 examinations are complete and verified by the Headteacher. Official report cards will be released to all parents on the designated closing day:',
    officialResultsReleaseDate: 'Official Results Release Date:',
    resultsSmsNotice: 'Parents will also receive notification via SMS and WhatsApp upon immediate release.',
    emergencyEnquiryNote: 'For urgent inquiries, please contact the School Administration via the help desk.',

    // Attendance Tab
    attendanceReportTitle: 'Pupil School Attendance Report',
    attendanceReportSubtitle: 'Official daily roll call register records',
    btnRequestLeave: 'Request Leave / Absence',
    attendanceOverallRate: 'Overall Attendance Rate',
    attendanceOverallExcellent: 'Excellent (High Standing)',
    attendancePresentDays: 'Days Present',
    attendancePresentSubtitle: 'Classroom learning days',
    attendanceAbsentDays: 'Days Absent',
    attendanceAbsentSubtitle: 'Unexcused absences',
    attendancePermittedDays: 'Excused / Permission Days',
    attendancePermittedSubtitle: 'Medical & family leave',
    attendanceMonthlyTableTitle: 'Monthly Attendance Breakdown (Term 1)',
    attendanceMonthlyTableSubtitle: 'Official daily roll call register records',
    tblMonth: 'Month',
    tblPresent: 'Days Present',
    tblAbsent: 'Days Absent',
    tblPermission: 'Excused Days',
    tblTotalDays: 'Total Days',
    tblRate: 'Rate (%)',
    tblEvaluation: 'Assessment',
    evalOutstanding: 'Outstanding',
    evalGood: 'Satisfactory',
    evalNeedsAttention: 'Needs Attention',
    attendanceTeacherRemarkTitle: 'Homeroom Teacher Remark:',
    attendanceTeacherRemarkBody: 'The pupil maintains an exemplary punctuality record and arrives well before the morning assembly bell. Zero infractions regarding unexcused class absences.',

    // Finance Tab
    financeStructureTitle: 'Fee Structure & Outstanding Balance',
    financeStructureSubtitle: 'Tuition & School Services 2026',
    termOneBadge: 'Term 1',
    feeTotalLabel: 'Total Fee',
    feePaidLabel: 'Amount Paid',
    feeBalanceLabel: 'Outstanding Balance',
    controlNumberTitle: 'School Fee Control Number',
    controlNumberSubtitle: 'PRIMARY & NURSERY SCHOOL • Official Fee Collection Account',
    controlNumberActive: 'Active & Valid',
    pupilControlNumber: "Pupil's Control Number",
    copyControlNumberBtn: 'Copy Number',
    copiedNotice: 'Payment control number copied to clipboard!',
    controlNumberInstructions: 'Pay school fees via any mobile money operator (M-Pesa, Tigo Pesa, Airtel Money) or directly through school bank branches (NMB & CRDB).',
    nmbAccountLabel: 'NMB Bank A/C:',
    crdbAccountLabel: 'CRDB Bank A/C:',
    accountNameLabel: 'Account Name:',
    howToPayTitle: 'How to Pay School Fees',
    step1Pay: 'Dial *150*00# (M-Pesa), *150*01# (Tigo Pesa), or *150*60# (Airtel Money).',
    step2Pay: 'Select Pay by Phone or Pay Bill.',
    step3Pay: "Enter the child's Control Number shown above.",
    step4Pay: 'Confirm school name, enter your mobile PIN, and you will receive an instant SMS receipt.',
    receiptHistoryTitle: 'Verified Fee Receipt History',
    receiptHistorySubtitle: 'Official payment acknowledgments and receipts',
    tblReceiptNo: 'Receipt No.',
    tblAmount: 'Amount (Tsh)',
    tblPaymentMethod: 'Payment Channel',
    tblDescription: 'Payment Purpose',
    paymentConfirmed: 'Confirmed',
    paymentPending: 'Pending',
    generateControlNumberBtn: 'Generate New Control Number',
    generateNewBillModalTitle: 'Generate Payment Control Number',
    generateNewBillDesc: 'Select fee item and amount to generate an authentic real electronic school fee control number (GePG / Bank format).',
    feePurposeLabel: 'Payment Purpose / Fee Item:',
    amountToPayLabel: 'Amount to Pay (Tsh):',
    channelPreferenceLabel: 'Preferred Payment Channel:',
    billExpiryLabel: 'Payment Due Date:',
    billRefLabel: 'Bill Reference Number:',
    btnDownloadBillSlip: 'Download Payment Slip (PDF)',
    btnPrintBillSlip: 'Print Payment Slip',
    simulatePaymentBtn: 'Simulate Payment (Instant Receipt)',
    controlNumberGeneratedNotice: 'Real Payment Control Number generated successfully!',
    paymentSuccessNotice: 'Payment processed and verified receipt generated!',

    // Communication Tab
    commOfficialTitle: 'Official School Announcements & Messages',
    commOfficialSubtitle: 'Emergency alerts, school circulars, and teacher-parent communications',
    filterAll: 'All',
    filterUrgent: 'Urgent',
    filterAcademic: 'Academics',
    filterFinance: 'Finance & Fees',
    messageFromSchool: 'Message from School Administration',
    directMessageTitle: 'Direct Inquiry to Teacher / Administration',
    directMessageSubtitle: 'Submit a confidential inquiry to the homeroom teacher or Headteacher',
    sendDirectMessageBtn: 'Send Message to School',
    selectRecipientLabel: 'Recipient:',
    messageContentLabel: 'Your Message:',
    messagePlaceholder: 'Compose your message here...',

    // Meetings Tab
    meetingsTitle: 'Parent-Teacher Conferences & Appointments',
    meetingsSubtitle: 'Schedule of general parent assemblies and private consultations',
    scheduleAppointmentTitle: 'Request an Appointment with School Staff',
    scheduleAppointmentSubtitle: 'Select staff member and your preferred date and time',
    selectStaffLabel: 'Select Teacher / School Officer:',
    meetingTopicLabel: 'Discussion Subject:',
    preferredDateLabel: 'Preferred Date:',
    bookAppointmentBtn: 'Submit Appointment Request',
    scheduledMeetingsTitle: 'Scheduled School Meetings Calendar',

    // Documents Tab
    documentsTitle: "Pupil's Certificates & Official Documents",
    documentsSubtitle: 'Academic credentials, admission records, and verified school documentation',
    docBirthCertificate: 'Birth Certificate (RITA)',
    docAdmissionLetter: 'Official School Admission Letter',
    docMedicalForm: 'Pupil Medical Examination Form',
    docProgressReport: 'Continuous Academic Progress Report',
    docRulesRegulation: 'School Rules & Regulations Code',
    verifiedOfficialDoc: 'Verified by School',
    downloadDocBtn: 'Download Document',

    // Discipline Tab
    disciplineTitle: "Pupil Discipline & Welfare Assessment",
    disciplineSubtitle: 'Monitoring classroom conduct, ethics, and character development',
    conductAssessmentLabel: 'Conduct Evaluation:',
    excellentConduct: 'Exemplary Conduct (High Integrity)',
    incidentHistoryTitle: 'Discipline Incident Registry',
    noDisciplineIncidents: 'Zero Disciplinary Infractions Recorded',
    cleanRecordDesc: 'The pupil maintains an impeccable moral and behavioural record at school.',
    tblIncidentDate: 'Date',
    tblIncidentIssue: 'Incident / Infraction',
    tblActionTaken: 'Action Taken',

    // Requests Tab
    requestsTitle: 'Leave Requests & Special Permissions',
    leaveRequestFormTitle: 'Submit Pupil Leave Request',
    leaveReasonLabel: 'Reason for Leave:',
    leaveReasonMedical: 'Medical Care / Doctor Consultation',
    leaveReasonFamily: 'Family Emergency / Bereavement',
    leaveReasonTravel: 'Special Family Travel',
    leaveReasonOther: 'Other Reason',
    startDateLabel: 'Start Date:',
    numberOfDaysLabel: 'Number of Days:',
    additionalNotesLabel: 'Additional Information for Headteacher:',
    submitLeaveRequestBtn: 'Submit Request to Headteacher',
    submittedRequestsTitle: 'Leave Request Status Tracker',
    statusPendingHeadteacher: 'PENDING HEADTEACHER APPROVAL',
    statusApprovedHeadteacher: 'APPROVED BY HEADTEACHER',

    // Student Visit Request
    visitRequestTitle: 'Pupil School Visit Request',
    visitRequestSubtitle: 'This request is submitted directly to the Headteacher for formal approval',
    visitDisciplineNotice: 'The pupil has a recorded disciplinary issue. You may cite the reference code if this visit relates to it.',
    visitChildLabel: 'Pupil to Visit:',
    visitTypeLabel: 'Nature of Visit / Tour:',
    visitTypeGeneral: 'General Consultation with Headteacher',
    visitTypeAcademic: 'Academic Performance Review',
    visitTypeDiscipline: 'Disciplinary Matter Consultation',
    visitTypeHealth: 'Checking Pupil Health & Welfare',
    visitTypeUrgent: 'Urgent Confidential Meeting',
    visitTypeEvent: 'School Function / Co-curricular Attendance',
    visitTypeOther: 'Other Specific Purpose',
    preferredVisitDate: 'Preferred Visit Date:',
    preferredVisitTime: 'Preferred Time:',
    disciplineRefOptional: 'Disciplinary Case Ref (Optional):',
    notesForHeadteacher: 'Explanation for Headteacher:',
    visitApprovalDisclaimer: 'Your request is forwarded directly to the Headteacher. Once approved, you will receive a verified visit pass here. Only the Headteacher can authorize on-campus visits.',
    submitVisitRequestBtn: 'Submit Visit Request to Headteacher',
    visitTrackerTitle: 'Visit & Meeting Request Status',
    noVisitsSubmitted: 'No visit requests submitted yet.',

    // Modals
    profileModalTitle: 'Upload Profile Photo',
    profileModalPreview: 'Current profile photo.',
    profileModalChoosePhoto: 'Choose Photo (jpg, png, webp)',
    profileModalNotice: 'Photo is stored on your device and persists across page reloads.',
    linkModalTitle: 'Link Another Child',
    linkModalDesc: 'If you have another child attending this school, enter their Admission Number and secret security PIN to link them to your existing account.',
    linkModalAdmLabel: "Child's Admission / Reg Number",
    linkModalPinLabel: 'Registered Parent Security PIN / Phone Number',
    linkModalBenefitNotice: 'Once linked, you can view examination reports, fees, and attendance for all your children by selecting their name in the top left corner.',
    linkModalSubmitBtn: 'Verify & Link Child',
    dustbinModalTitle: 'Trash Bin (Archived Children)',
    dustbinModalSubtitle: 'Children removed from your active dashboard',
    dustbinEmptyTitle: 'Trash Bin is Empty',
    dustbinEmptyDesc: 'Children you remove from your list will appear here before being permanently deleted.',
    dustbinWarning: 'Children listed here can be restored to your active list. If you choose Permanent Delete, the record cannot be recovered.',
    restoreBtn: 'Restore',
    deleteForeverBtn: 'Delete Forever',
    confirmDeleteModalTitle: 'Permanently Delete?',
    confirmDeleteModalText: 'permanently, this action cannot be undone. All linked local view cache will be erased.',
    confirmDeleteYesBtn: 'Yes, Delete Forever',

    // Copetra AI
    navCopetraAi: 'Copetra AI (Analytics)',
    copetraAiTitle: 'Copetra AI — Pupil Intelligent Academic Analyst',
    copetraAiSubtitle: 'Deep analytical synthesis of academic progress, attendance impact, national exam forecasts & parent home guidance',
    copetraAiBadge: 'Copetra AI Engine v3.2',
    copetraAiComprehensiveAnalysis: 'Comprehensive Pupil Analysis',
    copetraAiOverallVerdict: 'Overall AI Assessment & Executive Verdict',
    copetraAiStrengthsTitle: 'Core Academic Strengths',
    copetraAiGrowthAreasTitle: 'Targeted Growth Opportunities',
    copetraAiNectaForecastTitle: 'National Examination Forecast (NECTA Readiness)',
    copetraAiAttendanceImpactTitle: 'Attendance & Punctuality Impact Correlation',
    copetraAiParentAdviceTitle: 'Actionable Home Study Plan for Parents',
    copetraAiChatTitle: 'Ask Copetra AI Anything About Your Child',
    copetraAiChatSubtitle: 'Instant data-driven insights tailored to your child’s continuous assessment, attendance, and exam history',
    copetraAiChatPlaceholder: 'Ask a question... (e.g. Which subject requires the most home revision?)',
    copetraAiSendPrompt: 'Send Prompt',
    copetraAiQuickQuestions: 'Quick Prompts:',
    copetraAiPrintReportBtn: 'Download Copetra AI Report (PDF)',
    copetraAiQuickInsightBtn: 'View Copetra AI Analysis',
  },
};
