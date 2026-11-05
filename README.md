# Cat Phone

Site estático responsivo em português, com componentes React compilados para os cinco botões principais. Sirva a pasta `dist` com um servidor HTTP.

Inclui filtros por categoria, consulta em modal, cópia de mensagem para atendimento, navegação móvel e perguntas frequentes. O atendimento usa o link de WhatsApp publicado no site original. Não existe checkout nem estoque conectado.

As fotografias, o endereço, o telefone e os horários foram extraídos de https://catphonethe.my.canva.site/cat-phone em 04/11/2026. O Instagram não permitiu leitura automatizada. Os dados da loja devem ser confirmados pela empresa antes de uma divulgação comercial definitiva. Os produtos são categorias ilustrativas; não representam estoque confirmado.

A tipografia usa Google Fonts, com fontes locais de sistema como alternativa. O símbolo no cabeçalho usa a referência da marca enviada pelo usuário, restaurada com a ferramenta integrada de imagens e fundo transparente. Arquivo: dist/assets/catphone-logo.png. Prompt: extrair o símbolo real, remover o fundo marrom, ampliar e limpar as bordas preservando o desenho e o verde original.

## Componentes e compilação

O botão enviado pelo usuário está em `components/ui/liquid-glass-button.tsx`. A pasta `components/ui` concentra os componentes reutilizáveis e é o destino configurado em `components.json` para compatibilidade com shadcn. O exemplo fica em `components/ui/liquid-glass-button-demo.tsx`, os estilos Tailwind em `src/buttons.css` e a integração dos cinco links em `src/buttons.tsx`. O restante da página mantém o HTML existente.

O projeto já inclui React, TypeScript, Tailwind CSS 4 e a configuração shadcn, com o alias `@/`. Em uma máquina com Node e npm instalados:

```sh
npm ci
npm run typecheck
npm run build
```

A compilação gera `dist/assets/buttons.js` e `dist/assets/buttons.css`. Para adicionar componentes futuros pelo CLI do shadcn, use `npx shadcn@latest add <componente>` na raiz deste projeto; não é necessário inicializar novamente. Os links originais continuam funcionais mesmo se o módulo React não carregar. O efeito usa camadas de brilho, refração SVG e uma alternativa com desfoque para navegadores sem suporte a filtros SVG no backdrop. O movimento respeita a preferência de movimento reduzido. Nenhum provedor de contexto ou gerenciamento de estado externo é necessário.

A navegação flutuante em `components/ui/navigation-menu.tsx` usa transições CSS de transform e opacidade, com ícones Lucide. A animação não altera a largura nem aplica backdrop blur. O evento de rolagem é passivo e agrupado com requestAnimationFrame; o estado React só muda quando a navegação abre ou fecha. Mantém os destinos `#colecao`, `#experiencia` e `#visite`. Recolhe após rolar para baixo além de 150 px, expande após 80 px de rolagem para cima ou ao tocar no botão de menu, e pode ser recolhida com Escape. Os links recolhidos ficam fora da navegação por teclado. A preferência de movimento reduzido desativa as animações. A integração compartilha os arquivos de entrada e de estilos dos botões, sem exigir um novo provedor React.
