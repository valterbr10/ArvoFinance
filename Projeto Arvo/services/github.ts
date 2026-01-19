
import { RepoInfo, GitHubFile } from '../types';

export const fetchRepoInfo = async (repoUrl: string): Promise<RepoInfo> => {
  const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
  const match = repoUrl.match(regex);
  
  if (!match) {
    throw new Error('URL do GitHub inválida. Use o formato: https://github.com/usuario/projeto');
  }

  const owner = match[1];
  const repo = match[2].replace('.git', '').split('#')[0]; // Remove fragments

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Repositório não encontrado. Verifique se ele é público.');
    }
    if (response.status === 403) {
      throw new Error('Limite de requisições do GitHub atingido. Tente novamente em instantes.');
    }
    throw new Error('Erro ao buscar informações do repositório.');
  }

  return response.json();
};

export const fetchRepoTree = async (fullName: string, branch: string): Promise<GitHubFile[]> => {
  const response = await fetch(`https://api.github.com/repos/${fullName}/git/trees/${branch}?recursive=1`);
  if (!response.ok) {
    throw new Error(`Não foi possível ler a estrutura da branch ${branch}.`);
  }
  const data = await response.json();
  return data.tree;
};

export const fetchFileContent = async (fullName: string, path: string): Promise<string> => {
  const response = await fetch(`https://api.github.com/repos/${fullName}/contents/${path}`);
  if (!response.ok) return "Erro ao carregar conteúdo do arquivo.";
  const data = await response.json();
  // GitHub returns content in base64
  return atob(data.content);
};

export const fetchReadme = async (fullName: string): Promise<string> => {
  const response = await fetch(`https://api.github.com/repos/${fullName}/readme`, {
    headers: { 'Accept': 'application/vnd.github.v3.raw' }
  });
  
  if (!response.ok) return "README não encontrado.";
  return response.text();
};
