-- AlterTable
ALTER TABLE "perguntas" ADD COLUMN     "campo_condicional" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "campo_condicional_texto" TEXT,
ADD COLUMN     "campo_obrigatorio" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "condicao_opcoes" TEXT;
