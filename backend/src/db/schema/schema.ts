import {
	pgTable,
	uuid,
	varchar,
	timestamp,
	text,
	index,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	firstName: varchar("first_name", { length: 100 }), //.notNull(),
	lastName: varchar("last_name", { length: 100 }), //.notNull(),
	username: varchar("username", { length: 30 }).notNull().unique(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", {
		withTimezone: true,
	})
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", {
		withTimezone: true,
	})
		.defaultNow()
		.notNull(),
});


export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  token: text("token").notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
	expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("refresh_tokens_user_id_idx").on(table.userId),
]);