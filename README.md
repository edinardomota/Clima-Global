# Clima Global — PWA inicial

Protótipo instalável pelo navegador Android (Chrome), sem Android Studio.

## Recursos funcionais
- Previsão atual e próximos 7 dias via Open-Meteo.
- Busca de cidades via geocodificação Open-Meteo.
- Solicitação opcional de localização pelo navegador.
- Feed de notícias via GDELT, com links para as fontes originais.
- Navegação premium e cache básico do app.

## Limitações
- O mapa ainda é um atalho para Windy, não um radar integrado.
- Notícias dependem da disponibilidade da API pública e podem vir em outros idiomas.
- Não há alertas push, conta de usuário ou funcionamento offline dos dados meteorológicos.
- Para instalar como PWA, os arquivos precisam estar publicados em um endereço HTTPS. Abrir o HTML localmente não basta para instalar.
- O conteúdo meteorológico não substitui alertas oficiais da Defesa Civil ou serviços meteorológicos nacionais.

## Como publicar usando apenas o celular
1. Crie uma conta gratuita no GitHub, se ainda não tiver.
2. No navegador, acesse github.com e crie um repositório público chamado `clima-global`.
3. Envie os arquivos desta pasta para a raiz do repositório (Add file > Upload files).
4. Em Settings > Pages, escolha Deploy from a branch, selecione `main` e `/ (root)`, e salve.
5. Aguarde a publicação. Abra o endereço `https://SEU-USUARIO.github.io/clima-global/` no Chrome do Android.
6. No menu ⋮ do Chrome, toque em “Instalar app” ou “Adicionar à tela inicial”.

O nome do repositório pode variar; nesse caso, o endereço final também muda.

