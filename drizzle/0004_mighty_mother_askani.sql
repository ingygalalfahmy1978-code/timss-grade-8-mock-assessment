CREATE TABLE `student_exam_assignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`exam_id` int NOT NULL,
	`class_id` int NOT NULL,
	`assigned_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `student_exam_assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `student_answers` ADD `drawing_part_b_answer` text;--> statement-breakpoint
ALTER TABLE `student_exam_attempts` ADD `results_published` boolean DEFAULT false NOT NULL;