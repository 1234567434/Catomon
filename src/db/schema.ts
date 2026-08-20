import { pgTable, serial, text, integer, timestamp, boolean, varchar } from "drizzle-orm/pg-core";

export const catmons = pgTable("catmons", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  type: varchar("type", { length: 40 }).notNull(),
  description: text("description"),
  // Base64 data-URI of the AI-generated pokemon card art (main display image)
  imageData: text("image_data").notNull(),
  // Base64 thumbnail of the original user photo
  originalImageData: text("original_image_data"),
  hp: integer("hp").notNull(),
  attack: integer("attack").notNull(),
  defense: integer("defense").notNull(),
  speed: integer("speed").notNull(),
  is_shiny: boolean("is_shiny").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Catmon = typeof catmons.$inferSelect;
export type NewCatmon = typeof catmons.$inferInsert;
