CREATE TABLE `background_questionnaire_responses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`attempt_id` int NOT NULL,
	`student_id` int NOT NULL,
	`exam_id` int NOT NULL,
	`responses` json NOT NULL,
	`completed_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `background_questionnaire_responses_id` PRIMARY KEY(`id`),
	CONSTRAINT `background_questionnaire_responses_attempt_id_unique` UNIQUE(`attempt_id`)
);
--> statement-breakpoint
CREATE TABLE `exam_blocks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`exam_id` int NOT NULL,
	`block_number` int NOT NULL,
	`session` enum('math_session','science_session') NOT NULL,
	`label` varchar(32),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `exam_blocks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `questions` MODIFY COLUMN `question_type` enum('multiple_choice','short_answer','drag_drop','matching','ordering','hotspot','drawing_canvas','pattern_interaction','psi_lab','partial_credit_short_answer') NOT NULL;--> statement-breakpoint
ALTER TABLE `student_exam_attempts` MODIFY COLUMN `status` enum('in_progress','on_break','session2','submitted','graded') NOT NULL DEFAULT 'in_progress';--> statement-breakpoint
ALTER TABLE `class_exam_assignments` ADD `assigned_blocks` json;--> statement-breakpoint
ALTER TABLE `exam_questions` ADD `session` enum('math_session','science_session');--> statement-breakpoint
ALTER TABLE `exam_questions` ADD `block_number` int;--> statement-breakpoint
ALTER TABLE `exams` ADD `session1_minutes` int DEFAULT 45 NOT NULL;--> statement-breakpoint
ALTER TABLE `exams` ADD `break_minutes` int DEFAULT 5 NOT NULL;--> statement-breakpoint
ALTER TABLE `exams` ADD `session2_minutes` int DEFAULT 45 NOT NULL;--> statement-breakpoint
ALTER TABLE `exams` ADD `use_block_rotation` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `questions` ADD `science_sub_domain` enum('Earth Science','Biology','Chemistry','Physics');--> statement-breakpoint
ALTER TABLE `questions` ADD `block_number` int;--> statement-breakpoint
ALTER TABLE `questions` ADD `session` enum('math_session','science_session');--> statement-breakpoint
ALTER TABLE `questions` ADD `max_points` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `student_answers` ADD `points_earned` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `student_answers` ADD `session` enum('math_session','science_session');--> statement-breakpoint
ALTER TABLE `student_exam_attempts` ADD `current_session` enum('math_session','science_session') DEFAULT 'math_session' NOT NULL;--> statement-breakpoint
ALTER TABLE `student_exam_attempts` ADD `session1_completed_at` timestamp;--> statement-breakpoint
ALTER TABLE `student_exam_attempts` ADD `session2_started_at` timestamp;--> statement-breakpoint
ALTER TABLE `student_exam_attempts` ADD `session1_time_spent_seconds` int;--> statement-breakpoint
ALTER TABLE `student_exam_attempts` ADD `session2_time_spent_seconds` int;--> statement-breakpoint
ALTER TABLE `student_exam_attempts` ADD `total_max_points` int;--> statement-breakpoint
ALTER TABLE `student_exam_attempts` ADD `math_max_points` int;--> statement-breakpoint
ALTER TABLE `student_exam_attempts` ADD `science_max_points` int;--> statement-breakpoint
ALTER TABLE `student_exam_attempts` ADD `questionnaire_completed` boolean DEFAULT false NOT NULL;