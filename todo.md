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
- [ ] Add exam_sessions table (math_session / science_session, 45 min each)
- [ ] Add exam_blocks table (14 blocks, ~14-15 items each, math/science)
- [ ] Add block_rotation to class_exam_assignments (each class gets different block combo)
- [ ] Add science sub-domains: earth_science, biology, chemistry, physics to questions table
- [ ] Add partial_credit field to questions (max_points: 1 or 2)
- [ ] Add points_earned to student_answers (0, 1, or 2)
- [ ] Add session_state to student_exam_attempts (track break between sessions)
- [ ] Add background_questionnaire_responses table
- [ ] Seed expanded question bank (60+ questions across blocks, all types)

### New Question Types
- [ ] drawing_canvas type: student draws on a canvas (geometry, graphs)
- [ ] pattern_interaction type: student completes/extends a pattern by clicking
- [ ] psi_lab type: Problem Solving & Inquiry — simulated lab with variables
- [ ] partial_credit_short_answer type: text answer scored 0/1/2

### Exam Flow
- [ ] Session 1 (Math, 45 min) → Break screen (5 min countdown) → Session 2 (Science, 45 min)
- [ ] Break screen shows motivational message and countdown
- [ ] Auto-advance from break to Session 2 when timer ends
- [ ] Block rotation: assign different question blocks to each student/class

### Scoring
- [ ] Partial credit scoring engine (0/1/2 points for constructed response)
- [ ] Total score = sum of points_earned across all answers
- [ ] Display score breakdown by session and domain

### Background Questionnaire
- [ ] 30-minute questionnaire after exam submission
- [ ] Questions: home resources, parental education, study habits, attitude toward math/science
- [ ] Store responses in background_questionnaire_responses table
- [ ] Questionnaire is optional (can skip) but encouraged

### Admin/Teacher UI
- [ ] Block management UI: assign blocks to exams
- [ ] Question type selector includes new types (drawing, pattern, PSI lab)
- [ ] Science sub-domain selector in question editor
- [ ] Partial credit max points selector in question editor

### Reporting
- [ ] Score breakdown by session (Math vs Science)
- [ ] Score breakdown by sub-domain
- [ ] Partial credit score display in student reports
- [ ] Background questionnaire summary in class reports
