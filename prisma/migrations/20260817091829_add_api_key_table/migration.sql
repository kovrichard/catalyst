-- CreateTable
CREATE TABLE "apikey" (
    "id" TEXT NOT NULL,
    "config_id" TEXT NOT NULL DEFAULT 'default',
    "name" TEXT,
    "start" TEXT,
    "reference_id" TEXT NOT NULL,
    "prefix" TEXT,
    "key" TEXT NOT NULL,
    "refill_interval" INTEGER,
    "refill_amount" INTEGER,
    "last_refill_at" TIMESTAMP(3),
    "enabled" BOOLEAN DEFAULT true,
    "rate_limit_enabled" BOOLEAN DEFAULT true,
    "rate_limit_time_window" INTEGER DEFAULT 86400000,
    "rate_limit_max" INTEGER DEFAULT 10,
    "request_count" INTEGER DEFAULT 0,
    "remaining" INTEGER,
    "last_request" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "permissions" TEXT,
    "metadata" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apikey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "apikey_config_id_idx" ON "apikey"("config_id");

-- CreateIndex
CREATE INDEX "apikey_reference_id_idx" ON "apikey"("reference_id");

-- CreateIndex
CREATE INDEX "apikey_key_idx" ON "apikey"("key");

-- AddForeignKey
ALTER TABLE "apikey" ADD CONSTRAINT "apikey_reference_id_fkey" FOREIGN KEY ("reference_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
