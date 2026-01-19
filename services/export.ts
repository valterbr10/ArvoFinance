
declare const JSZip: any;
declare const saveAs: any;

/**
 * Exporta o projeto completo: Código + Dados
 * Isso garante que o usuário tenha um backup tanto da lógica quanto dos investimentos.
 */
export const exportProject = async (files: Record<string, string>, data: any) => {
  const zip = new JSZip();

  // 1. Adiciona os arquivos de código fornecidos
  Object.entries(files).forEach(([path, content]) => {
    zip.file(path, content);
  });

  // 2. Adiciona os dados de investimentos (Banco de Dados Local)
  zip.file("data/investimentos_backup.json", JSON.stringify(data, null, 2));

  // 3. Adiciona um README de instruções para o GitHub
  const readmeContent = `
# Arvo Wealth - Backup do Projeto
Gerado em: ${new Date().toLocaleString('pt-BR')}

## Como usar este backup:
1. Extraia o conteúdo deste ZIP.
2. Suba para o seu repositório no GitHub.
3. Seus dados de investimentos estão em /data/investimentos_backup.json.

## Desenvolvedor:
Este projeto foi construído com React, TailwindCSS e Gemini AI.
  `;
  zip.file("README_BACKUP.md", readmeContent);

  // 4. Gera o arquivo final
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `arvo-full-backup-${new Date().toISOString().split('T')[0]}.zip`);
};
