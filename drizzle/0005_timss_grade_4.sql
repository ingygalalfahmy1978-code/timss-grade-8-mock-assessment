ALTER TABLE `questions` ADD `grade` int DEFAULT 8 NOT NULL;--> statement-breakpoint
ALTER TABLE `questions` MODIFY COLUMN `science_sub_domain` enum('Earth Science','Biology','Chemistry','Physics','Life Science','Physical Science');--> statement-breakpoint
ALTER TABLE `exams` ADD `grade` int DEFAULT 8 NOT NULL;