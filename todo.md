# TIMSS Grade 8 Mock Assessment Platform - TODO

## Phase 1: Database Schema
- [x] Design and create all database tables (schema.ts)
- [x] Run migrations and apply SQL
- [x] Seed sample data: admin, teachers, students, classes, questions (Mock 1), exams

## Phase 2: Authentication
- [x] Custom username/password login (not OAuth) for admin/teacher/student
- [x] JWT session management with role-based access
- [x] Protect routes by role (admin, teacher, student)
- [x] Login page with clean blue/white design

## Phase 3: Admin Panel
- [x] Admin dashboard with stats overview
- [x] Manage students (add, edit, delete, generate credentials)
- [x] Manage teachers (add, edit, delete)
- [x] Manage classes (create, assign teachers and students)
- [x] Question bank management (add, edit, delete, tag questions)
- [x] Exam management (create 6 mock exams, assign questions)

## Phase 4: Teacher Dashboard
- [x] Teacher login and dashboard
- [x] View assigned classes
- [x] Activate/deactivate exams for a class
- [x] View student progress and scores
- [x] Download class reports as HTML (printable PDF)
- [x] Download individual student reports

## Phase 5: Student Exam Interface
- [x] Student login and dashboard showing available exams
- [x] Exam instructions screen before starting
- [x] One question per screen interface
- [x] Next / Previous / Flag for review / Review all / Submit buttons
- [x] Countdown timer
- [x] Multiple choice question rendering
- [x] Short answer question rendering
- [x] Prevent answer visibility before submission
- [x] Completion message after submission

## Phase 6: Scoring and Reports
- [x] Automatic scoring for multiple choice questions
- [x] Store: answers, total score, time spent, question-level performance
- [x] Generate detailed per-student report with all required fields
- [x] Admin/Teacher: download individual student report as HTML
- [x] Admin/Teacher: download full class report as HTML

## Phase 7: UI Polish
- [x] Professional blue/white theme throughout
- [x] Accessible typography (readable fonts, high contrast)
- [x] Responsive design
- [x] Write vitest tests (16 tests passing)

## Phase 8: TIMSS 2027 Enhanced Exam Interface
- [x] Extended question type enum: drag_drop, matching, ordering
- [x] Drag-and-drop question renderer (with HTML5 DnD API)
- [x] Matching question renderer (column A to column B)
- [x] Ordering/sequencing question renderer
- [x] On-screen scientific calculator (toggle button in exam toolbar)
- [x] 52 TIMSS 2027-aligned questions seeded across all 6 exams
- [x] Questions cover all 8 content domains (Math + Science)
- [x] Questions cover all 3 cognitive domains (Knowing, Applying, Reasoning)
- [x] Mock 1: 30 questions (18 MC, 6 SA, 2 ordering, 2 drag-drop, 2 matching)
- [x] Mocks 2-6: populated with question subsets from the full bank

## Phase 9: Bug Fixes
- [x] Fix student dashboard loading bug: retry loop from wrong unauthorized error detection
  - Fixed main.tsx: changed error detection from message comparison to error.data?.code === 'UNAUTHORIZED'
  - Fixed StudentDashboard.tsx: added isError handling, explicit error state UI, retry:false
  - Fixed ExamInstructions.tsx: added retry:false to availableExams query
  - Set QueryClient default retry:false to prevent infinite retry loops globally

## Phase 10: TIMSS Authenticity Upgrades

### Schema & Data
- [x] Add exam_sessions table (math_session / science_session, 45 min each)
- [x] Add exam_blocks table (14 blocks, ~14-15 items each, math/science)
- [x] Add block_rotation to class_exam_assignments (each class gets different block combo)
- [x] Add science sub-domains: earth_science, biology, chemistry, physics to questions table
- [x] Add partial_credit field to questions (max_points: 1 or 2)
- [x] Add points_earned to student_answers (0, 1, or 2)
- [x] Add session_state to student_exam_attempts (track break between sessions)
- [x] Add background_questionnaire_responses table
- [x] Seed expanded question bank (60+ questions across blocks, all types)

### New Question Types
- [x] drawing_canvas type: student draws on a canvas (geometry, graphs)
- [x] pattern_interaction type: student completes/extends a pattern by clicking
- [x] psi_lab type: Problem Solving & Inquiry — simulated lab with variables
- [x] partial_credit_short_answer type: text answer scored 0/1/2

### Exam Flow
- [x] Session 1 (Math, 45 min) → Break screen (5 min countdown) → Session 2 (Science, 45 min)
- [x] Break screen shows motivational message and countdown
- [x] Auto-advance from break to Session 2 when timer ends
- [x] Block rotation: assign different question blocks to each student/class

### Scoring
- [x] Partial credit scoring engine (0/1/2 points for constructed response)
- [x] Total score = sum of points_earned across all answers
- [x] Display score breakdown by session and domain

### Background Questionnaire
- [x] 30-minute questionnaire after exam submission
- [x] Questions: home resources, parental education, study habits, attitude toward math/science
- [x] Store responses in background_questionnaire_responses table
- [x] Questionnaire is optional (can skip) but encouraged

### Admin/Teacher UI
- [x] Block management UI: assign blocks to exams
- [x] Question type selector includes new types (drawing, pattern, PSI lab)
- [x] Science sub-domain selector in question editor
- [x] Partial credit max points selector in question editor

### Reporting
- [x] Score breakdown by session (Math vs Science)
- [x] Score breakdown by sub-domain
- [x] Partial credit score display in student reports
- [x] Background questionnaire summary in class reports

## Phase 11: Bug Fixes (Round 2)
- [x] Drawing canvas questions missing reference graph/diagram to draw on
- [x] Science questions appearing in Math session (fixed operator precedence bug in server routers.ts)
- [x] Q13 answer selection not working (fixed pattern table blank detection to use header names)

## Phase 12: Drawing Canvas & Scoring Accuracy
- [x] Fix drawing canvas: visible coordinate grid with labeled axes, tick marks, and numbered gridlines
- [x] Add point-plotting mode: click on grid to place/remove points with snap-to-grid
- [x] Fix auto-scoring for pattern_interaction (table format with named blanks)
- [x] Fix auto-scoring for matching questions (compare selected pairs to correct pairs)
- [x] Fix auto-scoring for ordering/drag-drop questions (compare order to correct order)
- [x] Fix auto-scoring for PSI lab tasks (compare task answers to correct answers)
- [x] Fix auto-scoring for short_answer / partial_credit_short_answer (keyword matching 0/1/2)
- [x] Build teacher drawing review interface at /teacher/drawing-review (show canvas image, award 0/1/2 points)
- [x] Update student attempt totals after teacher drawing review (recalculateAttemptScore)
- [x] Ensure student reports accurately reflect all scored answers
- [x] Admin Reset All Student Data button in AdminDashboard (with confirmation step)
- [x] Point toggle/removal in Plot Point mode (click existing point to remove it)
- [x] After drawing review, regenerate student_reports.reportData so PDFs stay accurate
- [x] 24 new scoring unit tests for all question types (40 total tests passing)

## Phase 13: TIMSS Standard Alignment, Teacher Review, Bug Fixes & Question Import
- [x] Research standard TIMSS Grade 8 structure (question count per booklet/session)
- [x] Fix Mock 2 so student answers are displayed correctly in review/report flows (was not assigned to class 8B)
- [x] Assign all 6 mocks to both classes (8A + 8B) and activate them
- [x] Deactivated exam filter already works correctly (server skips isActive=false)
- [x] Build teacher Answer Review page at /teacher/answer-review with Q-by-Q inspection
- [x] Add overrideAnswerScore procedure for teachers to adjust any answer mark
- [x] Add getStudentAttemptDetail procedure showing all Q+A with correct answers
- [x] Add Review Answers button to TeacherReports page header
- [x] After mark override, recalculate attempt totals automatically
- [x] Extract and seed 62 questions from TIMSS Algebra, Geometry, Statistics, Decimals, FDP booklets
- [x] Extract and seed questions from Grade 8 Biology, Chemistry, Physics workbooks
- [x] All 6 mocks now have 56-61 questions each (distributed from booklets)
- [x] All 40 tests passing after changes

## Phase 14: PDF Report Download Fix
- [x] Replace puppeteer-core (requires Chromium, not available on Cloud Run) with pdfkit (pure Node.js)
- [x] Rewrite generateStudentPDF using PDFKit: header, score cards, domain breakdown tables with progress bars, strengths/weaknesses, intervention group, next targets
- [x] Rewrite generateClassPDF using PDFKit: landscape layout, summary cards, student table with color-coded scores
- [x] Verified PDF generation works end-to-end (4.5KB PDF, 2 pages, valid PDF 1.3)
- [x] All 40 tests still passing

## Phase 15: Student Wrong-Answer Review
- [x] Join questions table in getAnswersForAttempt (returns questionText, options, correctAnswer, explanation, imageUrl, maxPoints)
- [x] Add "Review Wrong" tab to MyResults page showing only incorrect answers
- [x] WrongAnswerReview component: full question text, MC options highlighted (correct=green, wrong=red), explanation panel, teacher feedback
- [x] "All Questions" tab: inline explanation shown when expanding a wrong answer
- [x] Hint shown in compact list when explanation is available ("Explanation available")

## Phase 16: Student PDF Download + Student ID in PDF + Teacher Notifications + Question Editing

- [x] Add student_code/ID field to PDF header (student and class reports)
- [x] Add "Download My Report" button on student MyResults page (after results published)
- [x] Notify teacher via notifyOwner when results are published (with PDF link)
- [x] Teacher can edit existing questions (text, options, correct answer, explanation, type)
- [x] Question type selector when adding/editing: Multiple Choice, Short Answer, Drawing
- [x] Drawing questions: add Part B where student writes answer (auto-corrected against teacher-set answer)
- [x] Update exam taking UI to show Part B text input for drawing questions
- [x] Update auto-correction logic to handle Part B drawing answers

## Phase 17: Progress Charts & Teacher Analytics
- [x] Backend: student.getProgressData — return all submitted attempts with scores, math%, science%, domains
- [x] Backend: teacher.getClassAnalytics — class averages, pass rates, domain breakdowns, per-student rows
- [x] Backend: teacher.getStudentAnalytics — single student progress across all exams (for teacher filter)
- [x] Student Progress page: bar chart (score % per mock) + radar chart (domain breakdown)
- [x] Student Progress page: progress summary cards (best score, average, trend arrow)
- [x] Teacher analytics page at /teacher/analytics with class selector
- [x] Teacher analytics: class overview cards (avg score, pass rate, top/bottom students)
- [x] Teacher analytics: bar chart comparing class average per mock
- [x] Teacher analytics: domain radar chart for class average
- [x] Teacher analytics: per-student score matrix with drill-down to individual progress
- [x] Teacher analytics: filter by student (show individual progress charts)
- [x] Teacher analytics: export class analytics as PDF
- [x] Add Analytics link to teacher sidebar navigation
- [x] Add My Progress button to the student dashboard header

## Phase 18: Fully Automated Assessment and Subject Analysis
- [x] Audit all active drawing questions and replace them with automatically scored alternatives
- [x] Remove drawing-canvas options from the question editor and student exam interface
- [x] Verify every active question type has a deterministic automatic scoring path
- [x] Add Mathematics and Science analysis tabs to the student results review
- [x] Show per-subject scores, domain strengths, improvement targets, and wrong-answer review in each tab
- [x] Verify login, exam visibility, auto-scoring, results publishing, and PDF download end to end

## Phase 19: Close Remaining Automated Assessment Gaps
- [x] Remove obsolete drawing-canvas rendering and drawing-review paths from the student and teacher interfaces
- [x] Add an explicit per-subject Improvement Targets panel based on weakest domains and incorrect questions
- [x] Re-verify post-change exam visibility and published-result access with the live data model

## Phase 20: Student-Facing Access Verification
- [x] Verify assigned active exams through the student available-exams procedure
- [x] Verify published-result access and unpublished-result blocking through the student result procedure
- [x] Repair STD001’s stale individual exam assignment and re-test the available-exams procedure

## Phase 21: Grade 4 Support and Extra Grade 8 Questions
- [x] Add `grade` (4 or 8) to questions and exams; allow Life Science / Physical Science sub-domains (migration 0005)
- [x] Grade picker and grade filter in the Question Bank; Grade 4 domains (Number, Measurement and Geometry, Data; Life, Physical, Earth Science)
- [x] "Add question packs": Grade 4 starter pack (80 questions) and Grade 8 extra pack (105 questions), additive and safe to run twice
- [x] Grade on exams (Grade 4 defaults to two 36-minute sessions); exam editor only offers questions of the exam's grade, plus "Add all shown"
- [x] Class grade can be set when creating a class and changed later; exams can only be assigned to classes of the same grade
- [x] Student dashboard, instructions and PDF reports show the right grade; larger question text for Grade 4
- [x] Short numeric answers are marked by value ("48 crayons" and "x = 6" count as correct)
- [x] Run `pnpm db:push` to apply migration 0005, then run `pnpm check` and `pnpm test` (51 tests passing)

## Phase 22: School Branding (American School of Creative Science, Nad Al Sheba)
- [x] School logo, crest and favicon added to client/public
- [x] Colours taken from the crest (navy #2B2A7A, red #D23A27, blue #2F6EB4) and applied site-wide through theme tokens; Tailwind blue scale remapped to the school colours
- [x] New login page with the school logo; password field now hidden by default with a Show button
- [x] Removed the public demo-credentials panel (it showed the admin password on the login page)
- [x] Crest and school name in the admin/teacher sidebar, student dashboard, exam instructions and exam screens
- [x] Crest, school name and colours in student and class PDF reports
- [x] Check the login, Teacher and Grade 4 student pages visually on the public deployment
- [x] Visually verify the remaining core public pages, including Admin and Class management

## Phase 23: Excel Export and Report Security
- [x] Teacher → Reports: "Export class results" downloads an Excel file (CSV) with every student's score, Maths/Science, each domain and thinking level, class average and who has not submitted
- [x] "Export question analysis" downloads how the class did on each question, hardest first
- [x] Teachers can only load reports and exports for classes they teach (admins see all)
- [x] PDF report downloads now require sign-in; students only get their own report once results are published

## Phase 24: Grade 4, Export and Security Release Validation
- [x] Load the 80-question Grade 4 starter pack and verify it through the Grade 4 Question Bank filter
- [x] Generate and inspect class-results and question-analysis Excel exports from the teacher Reports interface
- [x] Verify anonymous, student, and administrator PDF-report access boundaries
- [x] Make PDF report generation tolerant of incomplete legacy report data
- [x] Normalize incomplete legacy scores in the teacher Reports table and Excel export
- [x] Verify teacher report listing preserves every class report and publication status
- [x] Re-run TypeScript and the full automated suite after the compatibility fix (56 tests passing)
- [x] Save the validated release checkpoint and push it to the connected GitHub repository (main at 558077b)
- [x] Change live hosting visibility to Public, publish, and verify the live Grade 4/8 login page

## Phase 25: Grade 4 and Grade 8 Student Roster Import
- [x] Inspect and validate the supplied Grade 4/Grade 8 workbook structure
- [x] Add secure school user-ID storage so the imported institutional identifiers are retained
- [x] Create the roster's Grade 4 and Grade 8 classes and apply the supplied teacher assignments
- [x] Create student platform accounts, enroll each student in the supplied class, and preserve existing records
- [x] Verify imported class totals, grade totals, credentials, and duplicate handling
- [x] Optimize and verify the Admin Classes list for the expanded 12-class roster
- [x] Save and push the verified roster-import checkpoint (main at e1bf307)

## Phase 26: Subject-Specific Teacher Assignment
- [x] Add support for separate Mathematics and Science teachers per class without replacing the existing class teacher
- [x] Create Rasha Albay as the Grade 8 Science teacher and assign all Grade 8 imported classes
- [x] Create Rowiena Akram as the Grade 4 Science teacher and assign all Grade 4 imported classes
- [x] Verify subject-teacher class access and the Admin Classes display
- [x] Save and push the verified subject-teacher assignment checkpoint (main at 5b5d594)

## Phase 27: Staff Administration Access
- [x] Create the explicitly requested MarwaNo administrator account with a secure temporary password
- [x] Update Ingy Fahmy's supplied email address without changing her current teacher class assignments
- [x] Confirm Yasmeen Ali as Administrator and retain Ingy Fahmy as a Teacher
- [x] Create Yasmeen Ali's administrator account with a secure temporary password and verify access
- [x] Save and push the verified staff access checkpoint (main at 31fa854)

## Phase 28: Live Teacher Dashboard Roster Counts
- [x] Return enrolled-student counts with the teacher class list
- [x] Verify the teacher class API returns Ingy's Grade 8 counts (24 and 25)
- [x] Verify the live Teacher dashboard displays the correct Grade 8 class counts after publishing
- [x] Fix the student sign-in redirect race after a successful login
- [x] Re-verify the complete Grade 4 login-to-dashboard flow in preview
- [ ] Verify the complete Grade 4 login-to-dashboard flow on the public deployment
- [ ] Run validation, save, and publish the corrected live release
