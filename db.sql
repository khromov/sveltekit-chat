-- Adminer 4.8.1 PostgreSQL 14.5 dump

DROP TABLE IF EXISTS "chats";
DROP SEQUENCE IF EXISTS chats_id_seq;
CREATE SEQUENCE chats_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."chats" (
    "id" integer DEFAULT nextval('chats_id_seq') NOT NULL,
    "status" character varying(16) NOT NULL,
    "participants" integer[],
    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "participants_array" ON "public"."chats" USING btree ("participants");


DROP TABLE IF EXISTS "messages";
DROP SEQUENCE IF EXISTS messages_id_seq;
CREATE SEQUENCE messages_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."messages" (
    "id" integer DEFAULT nextval('messages_id_seq') NOT NULL,
    "message" text NOT NULL,
    "created" timestamptz NOT NULL,
    "lastUpdate" timestamptz NOT NULL,
    "metadata" json,
    "chat" integer NOT NULL,
    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "messages_chat" ON "public"."messages" USING btree ("chat");


DROP TABLE IF EXISTS "users";
DROP SEQUENCE IF EXISTS users_id_seq;
CREATE SEQUENCE users_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."users" (
    "id" integer DEFAULT nextval('users_id_seq') NOT NULL,
    "name" text,
    "status" text,
    "avatar" json,
    "settings" json,
    "primaryChat" integer,
    "firebaseUid" text,
    "phone" text,
    "email" text,
    "user_type" character varying(16) DEFAULT 'firebase' NOT NULL,
    "biography" text,
    "secretToken" character varying(255) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


ALTER TABLE ONLY "public"."messages" ADD CONSTRAINT "messages_chat_fkey" FOREIGN KEY (chat) REFERENCES chats(id) ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."users" ADD CONSTRAINT "users_primary_chat_fkey" FOREIGN KEY ("primaryChat") REFERENCES chats(id) ON DELETE SET NULL NOT DEFERRABLE;

-- 2022-08-14 17:17:18.168781+00