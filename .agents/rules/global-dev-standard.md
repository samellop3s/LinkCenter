---
trigger: always_on
---

# Padrões Globais de Desenvolvimento
- **UI:** Sempre utilize a escala de cores 'zinc' ou 'slate' do Tailwind para interfaces neutras.
- **Interatividade:** Todo elemento clicável deve ter 'transition-all' e um feedback visual de 'active:scale-95'.
- **Código:** Prefira funções puras e utilize nomes de variáveis que descrevam o propósito (ex: userPreferences em vez de prefs).
- **Acessibilidade:** Garanta que todos os inputs tenham '<label>' e que as cores tenham constraste alto (padrão WCAG).