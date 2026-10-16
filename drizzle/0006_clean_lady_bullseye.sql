ALTER TABLE `platform_users` ADD `school_user_id` varchar(64);--> statement-breakpoint
ALTER TABLE `platform_users` ADD CONSTRAINT `platform_users_school_user_id_unique` UNIQUE(`school_user_id`);