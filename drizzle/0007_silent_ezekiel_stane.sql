CREATE TABLE `class_subject_teachers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`class_id` int NOT NULL,
	`teacher_id` int NOT NULL,
	`subject` enum('Math','Science') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `class_subject_teachers_id` PRIMARY KEY(`id`),
	CONSTRAINT `class_subject_teachers_class_subject_unique` UNIQUE(`class_id`,`subject`)
);
