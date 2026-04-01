(function () {
  const LANGUAGE_KEY = "quickfocus-language";
  const translations = {
    "site-title": { en: "QuickFocus | Tray-first Windows productivity", pt: "QuickFocus | Produtividade Windows tray-first" },
    "site-description": { en: "QuickFocus is a lightweight Windows productivity app with tray-first workflow, projects, workspaces, reminders, and focus tools.", pt: "QuickFocus é um app leve de produtividade para Windows com fluxo tray-first, projetos, workspaces, lembretes e ferramentas de foco." },
    "nav-benefits": { en: "Benefits", pt: "Benefícios" },
    "nav-media": { en: "Media", pt: "Mídia" },
    "nav-plans": { en: "Free vs Pro", pt: "Free vs Pro" },
    "nav-faq": { en: "FAQ", pt: "FAQ" },
    "nav-home": { en: "Home", pt: "Início" },
    "nav-terms": { en: "Terms", pt: "Termos" },
    "nav-privacy": { en: "Privacy", pt: "Privacidade" },
    "nav-support": { en: "Support", pt: "Suporte" },
    "nav-licenses": { en: "Licenses", pt: "Licenças" },
    "theme-label": { en: "Theme:", pt: "Tema:" },
    "theme-system": { en: "System", pt: "Sistema" },
    "theme-dark": { en: "Dark", pt: "Escuro" },
    "theme-light": { en: "White", pt: "Claro" },
    "lang-label": { en: "Language:", pt: "Idioma:" },
    "hero-eyebrow": { en: "Desktop productivity, without friction", pt: "Produtividade desktop, sem fricção" },
    "hero-title": { en: "Focus faster with a tray-first workflow.", pt: "Foque mais rápido com um fluxo tray-first." },
    "hero-sub": { en: "QuickFocus keeps your tasks close, keyboard-ready, and lightweight, so you can move projects without context switching overload.", pt: "QuickFocus mantém suas tarefas por perto, pronto para teclado e leve, para você avançar projetos sem sobrecarga de troca de contexto." },
    "hero-download": { en: "Download for Windows", pt: "Baixar para Windows" },
    "hero-upgrade": { en: "Upgrade to Pro", pt: "Fazer upgrade para Pro" },
    "hero-latest": { en: "Latest release", pt: "Última release" },
    "hero-history": { en: "Release history", pt: "Histórico de releases" },
    "media-title": { en: "Media", pt: "Mídia" },
    "media-sub": { en: "Screenshots, GIFs and videos from recent builds.", pt: "Capturas de tela, GIFs e vídeos de builds recentes." },
    "media-images": { en: "Images", pt: "Imagens" },
    "media-gifs": { en: "GIFs", pt: "GIFs" },
    "media-videos": { en: "Videos", pt: "Vídeos" },
    "media-placeholder-images": { en: "Add files to /Images and list them in media-manifest.json", pt: "Adicione arquivos em /Images e liste em media-manifest.json" },
    "media-placeholder-gifs": { en: "Add files to /Gifs and list them in media-manifest.json", pt: "Adicione arquivos em /Gifs e liste em media-manifest.json" },
    "media-placeholder-videos": { en: "Add files to /Videos and list them in media-manifest.json", pt: "Adicione arquivos em /Videos e liste em media-manifest.json" },
    "benefits-title": { en: "What you get", pt: "O que você recebe" },
    "benefit-1-title": { en: "Keyboard-first productivity", pt: "Produtividade keyboard-first" },
    "benefit-1-body": { en: "Shortcuts, fast editing, and low-friction navigation keep your flow intact.", pt: "Atalhos, edição rápida e navegação sem fricção mantêm seu fluxo intacto." },
    "benefit-2-title": { en: "Tray-first desktop app", pt: "App desktop tray-first" },
    "benefit-2-body": { en: "Keep QuickFocus always available without occupying your screen all day.", pt: "Mantenha o QuickFocus sempre disponível sem ocupar sua tela o dia todo." },
    "benefit-3-title": { en: "Projects, workspaces, reminders", pt: "Projetos, workspaces e lembretes" },
    "benefit-3-body": { en: "Organize by context with focus tools like Pomodoro, tags, and alarms.", pt: "Organize por contexto com ferramentas de foco como Pomodoro, tags e alarmes." },
    "plans-title": { en: "Free vs Pro", pt: "Free vs Pro" },
    "plans-col-feature": { en: "Feature", pt: "Recurso" },
    "plans-col-free": { en: "Free", pt: "Free" },
    "plans-col-pro": { en: "Pro", pt: "Pro" },
    "plans-row-projects": { en: "Projects", pt: "Projetos" },
    "plans-row-projects-free": { en: "Up to 2", pt: "Até 2" },
    "plans-row-projects-pro": { en: "Unlimited", pt: "Ilimitado" },
    "plans-row-workspaces": { en: "Custom workspaces", pt: "Workspaces personalizados" },
    "plans-row-workspaces-free": { en: "Up to 2", pt: "Até 2" },
    "plans-row-workspaces-pro": { en: "Unlimited", pt: "Ilimitado" },
    "plans-row-sync": { en: "Google Drive sync", pt: "Sincronização com Google Drive" },
    "plans-row-sync-free": { en: "No", pt: "Não" },
    "plans-row-sync-pro": { en: "Yes", pt: "Sim" },
    "plans-row-tags": { en: "Tags", pt: "Tags" },
    "plans-row-tags-free": { en: "Basic", pt: "Básico" },
    "plans-row-tags-pro": { en: "Custom tags and colors", pt: "Tags e cores personalizadas" },
    "plans-row-recurring": { en: "Recurring tasks", pt: "Tarefas recorrentes" },
    "plans-row-recurring-free": { en: "No", pt: "Não" },
    "plans-row-recurring-pro": { en: "Yes", pt: "Sim" },
    "plans-row-sounds": { en: "Sound library", pt: "Biblioteca de sons" },
    "plans-row-sounds-free": { en: "Limited", pt: "Limitada" },
    "plans-row-sounds-pro": { en: "Full library", pt: "Biblioteca completa" },
    "plans-row-channels": { en: "Alpha/Beta channels", pt: "Canais Alpha/Beta" },
    "plans-row-channels-free": { en: "No", pt: "Não" },
    "plans-row-channels-pro": { en: "Yes", pt: "Sim" },
    "cta-title": { en: "Install in minutes. Keep your focus for hours.", pt: "Instale em minutos. Mantenha seu foco por horas." },
    "cta-download": { en: "Download QuickFocus", pt: "Baixar QuickFocus" },
    "cta-upgrade": { en: "Upgrade to Pro", pt: "Fazer upgrade para Pro" },
    "faq-title": { en: "FAQ", pt: "FAQ" },
    "faq-q-updates": { en: "How do updates work?", pt: "Como funcionam as atualizações?" },
    "faq-a-updates": { en: "QuickFocus checks release manifests and guides you to install the latest stable build.", pt: "QuickFocus verifica manifestos de release e orienta a instalar a build estável mais recente." },
    "faq-q-free": { en: "Is QuickFocus free?", pt: "QuickFocus é gratuito?" },
    "faq-a-free": { en: "Yes. The Free plan is available with core productivity features.", pt: "Sim. O plano Free está disponível com recursos essenciais de produtividade." },
    "faq-q-unlock": { en: "How do I unlock Pro?", pt: "Como desbloqueio o Pro?" },
    "faq-a-unlock": { en: "Use the Upgrade to Pro link to activate a Pro license.", pt: "Use o link de upgrade para Pro para ativar uma licença Pro." },
    "faq-q-subscription": { en: "Does Pro require a subscription?", pt: "O Pro exige assinatura?" },
    "faq-a-subscription": { en: "Current license options are managed in the official upgrade page.", pt: "As opções atuais de licença são gerenciadas na página oficial de upgrade." },
    "faq-q-transfer": { en: "Can I use my license on another computer?", pt: "Posso usar minha licença em outro computador?" },
    "faq-a-transfer": { en: "License transfer and activation details are provided in the upgrade documentation.", pt: "Detalhes de transferência e ativação de licença são fornecidos na documentação de upgrade." },
    "footer-product": { en: "QuickFocus for Windows", pt: "QuickFocus para Windows" },
    "footer-terms": { en: "Terms", pt: "Termos" },
    "footer-privacy": { en: "Privacy", pt: "Privacidade" },
    "footer-support": { en: "Support", pt: "Suporte" },
    "footer-licenses": { en: "Licenses", pt: "Licenças" },
    "terms-title": { en: "Terms of Use", pt: "Termos de Uso" },
    "terms-updated": { en: "Last updated: April 2026", pt: "Última atualização: abril de 2026" },
    "terms-intro": { en: "These terms govern your use of QuickFocus desktop app and this website.", pt: "Estes termos regem o uso do aplicativo QuickFocus e deste site." },
    "terms-section-usage": { en: "1. Use of QuickFocus", pt: "1. Uso do QuickFocus" },
    "terms-usage-1": { en: "QuickFocus is offered as Free and Pro plans. Free includes core productivity functionality. Pro includes expanded features defined in the product pages.", pt: "QuickFocus é oferecido nos planos Free e Pro. O Free inclui funcionalidade essencial de produtividade. O Pro inclui recursos expandidos definidos nas páginas do produto." },
    "terms-usage-2": { en: "You agree to use the app lawfully and not attempt to reverse, disrupt, or abuse platform services.", pt: "Você concorda em usar o app de forma legal e não tentar reverter, interromper ou abusar de serviços da plataforma." },
    "terms-section-license": { en: "2. License and activation", pt: "2. Licença e ativação" },
    "terms-license-1": { en: "Pro features require valid activation according to the current upgrade flow.", pt: "Recursos Pro exigem ativação válida conforme o fluxo de upgrade atual." },
    "terms-license-2": { en: "License transfer and device limits follow the rules communicated in the official upgrade documentation.", pt: "Transferência de licença e limites por dispositivo seguem as regras comunicadas na documentação oficial de upgrade." },
    "terms-section-liability": { en: "3. Availability and liability", pt: "3. Disponibilidade e responsabilidade" },
    "terms-liability-1": { en: "QuickFocus is provided on an as-is basis. We continuously improve stability, but we do not guarantee uninterrupted availability.", pt: "QuickFocus é fornecido no estado em que se encontra. Melhoramos continuamente a estabilidade, mas não garantimos disponibilidade ininterrupta." },
    "terms-liability-2": { en: "To the extent permitted by law, liability is limited for indirect losses or downtime related to usage, updates, or third-party platform issues.", pt: "Na extensão permitida por lei, a responsabilidade é limitada para perdas indiretas ou indisponibilidade relacionadas ao uso, atualizações ou problemas de plataformas de terceiros." },
    "terms-section-changes": { en: "4. Changes", pt: "4. Alterações" },
    "terms-changes-1": { en: "We may update these terms to reflect product or legal changes. New versions are published on this page.", pt: "Podemos atualizar estes termos para refletir mudanças no produto ou legais. Novas versões são publicadas nesta página." },
    "privacy-title": { en: "Privacy Policy", pt: "Política de Privacidade" },
    "privacy-updated": { en: "Last updated: April 2026", pt: "Última atualização: abril de 2026" },
    "privacy-intro": { en: "QuickFocus is designed as a local-first desktop app.", pt: "QuickFocus foi projetado como um app desktop local-first." },
    "privacy-section-data": { en: "1. Local data", pt: "1. Dados locais" },
    "privacy-data-1": { en: "Tasks, settings, and productivity state are stored locally on your device.", pt: "Tarefas, configurações e estado de produtividade são armazenados localmente no seu dispositivo." },
    "privacy-data-2": { en: "Theme and language preferences on this website are saved in your browser localStorage.", pt: "Preferências de tema e idioma deste site são salvas no localStorage do navegador." },
    "privacy-section-sync": { en: "2. Optional Google Drive sync", pt: "2. Sincronização opcional com Google Drive" },
    "privacy-sync-1": { en: "Google Drive sync is optional and only used when you explicitly connect and enable it.", pt: "A sincronização com Google Drive é opcional e só é usada quando você conecta e ativa explicitamente." },
    "privacy-sync-2": { en: "When enabled, app data is synchronized through your Drive appDataFolder using your Google account permissions.", pt: "Quando ativada, os dados do app são sincronizados pelo appDataFolder do seu Drive usando as permissões da sua conta Google." },
    "privacy-section-collection": { en: "3. Data collection", pt: "3. Coleta de dados" },
    "privacy-collection-1": { en: "QuickFocus does not require unnecessary personal data to run core local features.", pt: "QuickFocus não exige dados pessoais desnecessários para executar os recursos locais principais." },
    "privacy-collection-2": { en: "This website does not include third-party analytics scripts at this time.", pt: "Este site não inclui scripts de analytics de terceiros neste momento." },
    "privacy-section-contact": { en: "4. Contact", pt: "4. Contato" },
    "privacy-contact-1": { en: "For privacy questions, use the Support page channels.", pt: "Para dúvidas de privacidade, use os canais da página de suporte." },
    "support-title": { en: "Support", pt: "Suporte" },
    "support-updated": { en: "Need help with QuickFocus?", pt: "Precisa de ajuda com o QuickFocus?" },
    "support-intro": { en: "Use the channels below for installation, update, license, and sync issues.", pt: "Use os canais abaixo para problemas de instalação, atualização, licença e sincronização." },
    "support-section-channels": { en: "1. Support channels", pt: "1. Canais de suporte" },
    "support-channel-contact": { en: "Contact: Hugo Uchôas Borges — hugouchoas@outlook.com", pt: "Contato: Hugo Uchôas Borges — hugouchoas@outlook.com" },
    "support-channel-issues": { en: "Bug reports and feature issues: GitHub Issues", pt: "Relato de bugs e problemas de recurso: GitHub Issues" },
    "support-channel-releases": { en: "Installer and release history: QuickFocus Releases", pt: "Instalador e histórico de releases: QuickFocus Releases" },
    "support-section-before": { en: "2. Before opening an issue", pt: "2. Antes de abrir um issue" },
    "support-before-1": { en: "Confirm you are on the latest stable installer.", pt: "Confirme que você está no instalador estável mais recente." },
    "support-before-2": { en: "Include steps to reproduce, expected behavior, and what happened.", pt: "Inclua passos para reproduzir, comportamento esperado e o que aconteceu." },
    "support-before-3": { en: "When relevant, include app version and whether Google Drive sync is enabled.", pt: "Quando relevante, inclua versão do app e se a sincronização com Google Drive está ativada." },
    "support-section-troubleshoot": { en: "3. Quick troubleshooting", pt: "3. Troubleshooting rápido" },
    "support-troubleshoot-1": { en: "Retry after restarting QuickFocus.", pt: "Tente novamente após reiniciar o QuickFocus." },
    "support-troubleshoot-2": { en: "Reinstall with the latest installer if update flow fails.", pt: "Reinstale com o instalador mais recente se o fluxo de atualização falhar." },
    "support-troubleshoot-3": { en: "For sync errors, disconnect/reconnect Google Drive and retry sync.", pt: "Para erros de sincronização, desconecte/conecte novamente o Google Drive e tente sincronizar." },
    "licenses-title": { en: "Third-Party Licenses", pt: "Licenças de Terceiros" },
    "licenses-updated": { en: "Runtime dependencies used by QuickFocus.App", pt: "Dependências de runtime usadas por QuickFocus.App" },
    "licenses-intro": { en: "List based on package references in QuickFocus.App.csproj.", pt: "Lista baseada nos PackageReference em QuickFocus.App.csproj." },
    "licenses-col-package": { en: "Package", pt: "Pacote" },
    "licenses-col-license": { en: "License", pt: "Licença" },
    "licenses-col-link": { en: "Project", pt: "Projeto" },
    "licenses-google-auth": { en: "Google.Apis.Auth", pt: "Google.Apis.Auth" },
    "licenses-google-drive": { en: "Google.Apis.Drive.v3", pt: "Google.Apis.Drive.v3" },
    "licenses-sqlite": { en: "Microsoft.Data.Sqlite", pt: "Microsoft.Data.Sqlite" },
    "licenses-note": { en: "Test-only packages (xUnit, coverlet, test SDK) are not listed because they are not shipped as app runtime dependencies.", pt: "Pacotes apenas de teste (xUnit, coverlet, test SDK) não são listados porque não são dependências de runtime do app distribuído." },
    "common-open": { en: "Open", pt: "Abrir" }
  };

  function normalizeLanguage(input) {
    if (!input) {
      return "en";
    }
    return String(input).toLowerCase().startsWith("pt") ? "pt-BR" : "en";
  }

  function localeKey(language) {
    return normalizeLanguage(language) === "pt-BR" ? "pt" : "en";
  }

  function getPreferredLanguage() {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (saved) {
      return normalizeLanguage(saved);
    }
    return normalizeLanguage(navigator.language || navigator.userLanguage || "en");
  }

  function resolveText(key, language) {
    const entry = translations[key];
    if (!entry) {
      return null;
    }
    const current = localeKey(language);
    return entry[current] || entry.en || null;
  }

  function applyTranslations(language) {
    const activeLanguage = normalizeLanguage(language);
    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const translated = resolveText(key, activeLanguage);
      if (!translated) {
        return;
      }

      const attr = element.getAttribute("data-i18n-attr");
      if (attr) {
        element.setAttribute(attr, translated);
      } else {
        element.textContent = translated;
      }
    });

    const selectors = document.querySelectorAll("[data-lang-select]");
    selectors.forEach((select) => {
      select.value = activeLanguage;
    });

    document.documentElement.lang = activeLanguage;
    localStorage.setItem(LANGUAGE_KEY, activeLanguage);
    window.dispatchEvent(new CustomEvent("quickfocus:language-changed", { detail: { language: activeLanguage } }));
  }

  function initializeLanguageSelector() {
    const selectors = document.querySelectorAll("[data-lang-select]");
    selectors.forEach((select) => {
      select.addEventListener("change", () => {
        applyTranslations(select.value);
      });
    });
  }

  function initialize() {
    initializeLanguageSelector();
    applyTranslations(getPreferredLanguage());
  }

  window.QuickFocusI18n = {
    initialize,
    applyTranslations,
    getPreferredLanguage
  };
})();
