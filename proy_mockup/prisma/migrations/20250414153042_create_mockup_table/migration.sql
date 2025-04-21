-- CreateTable
CREATE TABLE "Mockup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Mockup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Mockup" ADD CONSTRAINT "Mockup_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
