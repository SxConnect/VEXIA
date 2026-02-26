-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_codes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "code_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,

    CONSTRAINT "login_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionarios" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questionarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perguntas" (
    "id" TEXT NOT NULL,
    "questionario_id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "contexto" TEXT,
    "tipo" TEXT NOT NULL,
    "obrigatoria" BOOLEAN NOT NULL DEFAULT true,
    "permitir_outro" BOOLEAN NOT NULL DEFAULT false,
    "ordem" INTEGER NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "perguntas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opcoes" (
    "id" TEXT NOT NULL,
    "pergunta_id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "opcoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respondentes" (
    "id" TEXT NOT NULL,
    "questionario_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "tipo_empresa" TEXT,
    "data_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_final" TIMESTAMP(3),

    CONSTRAINT "respondentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respostas" (
    "id" TEXT NOT NULL,
    "respondente_id" TEXT NOT NULL,
    "pergunta_id" TEXT NOT NULL,
    "resposta" TEXT,
    "resposta_texto" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "respostas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_whatsapp_key" ON "users"("whatsapp");

-- CreateIndex
CREATE INDEX "users_tenant_id_idx" ON "users"("tenant_id");

-- CreateIndex
CREATE INDEX "login_codes_user_id_idx" ON "login_codes"("user_id");

-- CreateIndex
CREATE INDEX "questionarios_tenant_id_idx" ON "questionarios"("tenant_id");

-- CreateIndex
CREATE INDEX "perguntas_questionario_id_idx" ON "perguntas"("questionario_id");

-- CreateIndex
CREATE INDEX "opcoes_pergunta_id_idx" ON "opcoes"("pergunta_id");

-- CreateIndex
CREATE INDEX "respondentes_questionario_id_idx" ON "respondentes"("questionario_id");

-- CreateIndex
CREATE INDEX "respostas_respondente_id_idx" ON "respostas"("respondente_id");

-- CreateIndex
CREATE INDEX "respostas_pergunta_id_idx" ON "respostas"("pergunta_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "login_codes" ADD CONSTRAINT "login_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionarios" ADD CONSTRAINT "questionarios_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perguntas" ADD CONSTRAINT "perguntas_questionario_id_fkey" FOREIGN KEY ("questionario_id") REFERENCES "questionarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opcoes" ADD CONSTRAINT "opcoes_pergunta_id_fkey" FOREIGN KEY ("pergunta_id") REFERENCES "perguntas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respondentes" ADD CONSTRAINT "respondentes_questionario_id_fkey" FOREIGN KEY ("questionario_id") REFERENCES "questionarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respostas" ADD CONSTRAINT "respostas_respondente_id_fkey" FOREIGN KEY ("respondente_id") REFERENCES "respondentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respostas" ADD CONSTRAINT "respostas_pergunta_id_fkey" FOREIGN KEY ("pergunta_id") REFERENCES "perguntas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
