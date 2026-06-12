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
