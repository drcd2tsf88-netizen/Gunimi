export type EmailLocale = "en" | "sk" | "cs";

export const SUPPORTED_EMAIL_LOCALES: EmailLocale[] = ["en", "sk", "cs"];

export function resolveEmailLocale(lang: string | null | undefined): EmailLocale {
  if (lang && (SUPPORTED_EMAIL_LOCALES as string[]).includes(lang)) return lang as EmailLocale;
  return "en";
}

// ─── Task Assigned ────────────────────────────────────────────────────────────

export type TaskAssignedStrings = {
  subject: string;
  badge: string;
  heading: string;
  body: string;
  cta: string;
  footerNote: string;
  textBody: string;
};

export function getTaskAssignedStrings(
  locale: EmailLocale,
  taskTitle: string,
  workspaceName: string,
  email: string,
  taskUrl: string,
): TaskAssignedStrings {
  const s: Record<EmailLocale, TaskAssignedStrings> = {
    en: {
      subject: `New task: ${taskTitle}`,
      badge: "Task Assigned",
      heading: "A task has been assigned to you.",
      body: `You have a new task waiting in <strong style="color:#F7F8FC;">${workspaceName}</strong>.`,
      cta: "View Task →",
      footerNote: `This notification was sent to <strong>${email}</strong> because a task was assigned to you in Gunimi.`,
      textBody: `A task has been assigned to you in ${workspaceName}.\n\nTask: ${taskTitle}\n\nView it here:\n${taskUrl}\n\n---\nGunimi — AI Workspace OS`,
    },
    sk: {
      subject: `Nová úloha: ${taskTitle}`,
      badge: "Úloha priradená",
      heading: "Bola vám priradená nová úloha.",
      body: `Máte novú úlohu v <strong style="color:#F7F8FC;">${workspaceName}</strong>.`,
      cta: "Zobraziť úlohu →",
      footerNote: `Toto upozornenie bolo odoslané na <strong>${email}</strong>, pretože vám bola priradená úloha v Gunimi.`,
      textBody: `Bola vám priradená nová úloha v ${workspaceName}.\n\nÚloha: ${taskTitle}\n\nZobrazte ju tu:\n${taskUrl}\n\n---\nGunimi — AI Workspace OS`,
    },
    cs: {
      subject: `Nový úkol: ${taskTitle}`,
      badge: "Úkol přiřazen",
      heading: "Byl vám přiřazen nový úkol.",
      body: `Máte nový úkol v <strong style="color:#F7F8FC;">${workspaceName}</strong>.`,
      cta: "Zobrazit úkol →",
      footerNote: `Toto upozornění bylo odesláno na <strong>${email}</strong>, protože vám byl přiřazen úkol v Gunimi.`,
      textBody: `Byl vám přiřazen nový úkol v ${workspaceName}.\n\nÚkol: ${taskTitle}\n\nZobrazte ho zde:\n${taskUrl}\n\n---\nGunimi — AI Workspace OS`,
    },
  };
  return s[locale];
}

// ─── Task Done ───────────────────────────────────────────────────────────────

export type TaskDoneStrings = {
  subject: string;
  badge: string;
  heading: string;
  body: string;
  cta: string;
  footerNote: string;
  textBody: string;
};

export function getTaskDoneStrings(
  locale: EmailLocale,
  taskTitle: string,
  workspaceName: string,
  email: string,
  taskUrl: string,
): TaskDoneStrings {
  const s: Record<EmailLocale, TaskDoneStrings> = {
    en: {
      subject: `Done: ${taskTitle}`,
      badge: "Task Completed",
      heading: "A task has been completed.",
      body: `The task in <strong style="color:#F7F8FC;">${workspaceName}</strong> was marked as done.`,
      cta: "View Task →",
      footerNote: `This notification was sent to <strong>${email}</strong> because you are involved in this task in Gunimi.`,
      textBody: `A task was marked as done in ${workspaceName}.\n\nTask: ${taskTitle}\n\nView it here:\n${taskUrl}\n\n---\nGunimi — AI Workspace OS`,
    },
    sk: {
      subject: `Hotovo: ${taskTitle}`,
      badge: "Úloha dokončená",
      heading: "Úloha bola dokončená.",
      body: `Úloha v <strong style="color:#F7F8FC;">${workspaceName}</strong> bola označená ako hotová.`,
      cta: "Zobraziť úlohu →",
      footerNote: `Toto upozornenie bolo odoslané na <strong>${email}</strong>, pretože ste zapojený do tejto úlohy v Gunimi.`,
      textBody: `Úloha bola dokončená v ${workspaceName}.\n\nÚloha: ${taskTitle}\n\nZobrazte ju tu:\n${taskUrl}\n\n---\nGunimi — AI Workspace OS`,
    },
    cs: {
      subject: `Hotovo: ${taskTitle}`,
      badge: "Úkol dokončen",
      heading: "Úkol byl dokončen.",
      body: `Úkol v <strong style="color:#F7F8FC;">${workspaceName}</strong> byl označen jako hotový.`,
      cta: "Zobrazit úkol →",
      footerNote: `Toto upozornění bylo odesláno na <strong>${email}</strong>, protože jste zapojen do tohoto úkolu v Gunimi.`,
      textBody: `Úkol byl dokončen v ${workspaceName}.\n\nÚkol: ${taskTitle}\n\nZobrazte ho zde:\n${taskUrl}\n\n---\nGunimi — AI Workspace OS`,
    },
  };
  return s[locale];
}

// ─── New Comment ──────────────────────────────────────────────────────────────

export type TaskCommentStrings = {
  subject: string;
  badge: string;
  heading: string;
  body: string;
  cta: string;
  footerNote: string;
  textBody: string;
};

export function getTaskCommentStrings(
  locale: EmailLocale,
  taskTitle: string,
  workspaceName: string,
  email: string,
  taskUrl: string,
  commenterName: string,
): TaskCommentStrings {
  const s: Record<EmailLocale, TaskCommentStrings> = {
    en: {
      subject: `New comment on: ${taskTitle}`,
      badge: "New Comment",
      heading: "Someone left a comment.",
      body: `<strong style="color:#F7F8FC;">${commenterName}</strong> commented on a task in <strong style="color:#F7F8FC;">${workspaceName}</strong>.`,
      cta: "View Comment →",
      footerNote: `This notification was sent to <strong>${email}</strong> because you are assigned to this task in Gunimi.`,
      textBody: `${commenterName} commented on a task in ${workspaceName}.\n\nTask: ${taskTitle}\n\nView the comment:\n${taskUrl}\n\n---\nGunimi — AI Workspace OS`,
    },
    sk: {
      subject: `Nový komentár: ${taskTitle}`,
      badge: "Nový komentár",
      heading: "Niekto pridal komentár.",
      body: `<strong style="color:#F7F8FC;">${commenterName}</strong> okomentoval(a) úlohu v <strong style="color:#F7F8FC;">${workspaceName}</strong>.`,
      cta: "Zobraziť komentár →",
      footerNote: `Toto upozornenie bolo odoslané na <strong>${email}</strong>, pretože ste priradený k tejto úlohe v Gunimi.`,
      textBody: `${commenterName} pridal(a) komentár k úlohe v ${workspaceName}.\n\nÚloha: ${taskTitle}\n\nZobrazte komentár:\n${taskUrl}\n\n---\nGunimi — AI Workspace OS`,
    },
    cs: {
      subject: `Nový komentář: ${taskTitle}`,
      badge: "Nový komentář",
      heading: "Někdo přidal komentář.",
      body: `<strong style="color:#F7F8FC;">${commenterName}</strong> okomentoval(a) úkol v <strong style="color:#F7F8FC;">${workspaceName}</strong>.`,
      cta: "Zobrazit komentář →",
      footerNote: `Toto upozornění bylo odesláno na <strong>${email}</strong>, protože jste přiřazen k tomuto úkolu v Gunimi.`,
      textBody: `${commenterName} přidal(a) komentář k úkolu v ${workspaceName}.\n\nÚkol: ${taskTitle}\n\nZobrazte komentář:\n${taskUrl}\n\n---\nGunimi — AI Workspace OS`,
    },
  };
  return s[locale];
}

// ─── Due Date Changed ─────────────────────────────────────────────────────────

export type TaskDueDateChangedStrings = {
  subject: string;
  badge: string;
  heading: string;
  body: string;
  cta: string;
  footerNote: string;
  textBody: string;
};

export function getTaskDueDateChangedStrings(
  locale: EmailLocale,
  taskTitle: string,
  workspaceName: string,
  email: string,
  taskUrl: string,
  newDueDate: string,
): TaskDueDateChangedStrings {
  const s: Record<EmailLocale, TaskDueDateChangedStrings> = {
    en: {
      subject: `Due date updated: ${taskTitle}`,
      badge: "Due Date Changed",
      heading: "Task due date was updated.",
      body: `The due date for a task in <strong style="color:#F7F8FC;">${workspaceName}</strong> was changed to <strong style="color:#F7F8FC;">${newDueDate}</strong>.`,
      cta: "View Task →",
      footerNote: `This notification was sent to <strong>${email}</strong> because you are assigned to this task in Gunimi.`,
      textBody: `The due date for a task in ${workspaceName} was changed.\n\nTask: ${taskTitle}\nNew due date: ${newDueDate}\n\nView it here:\n${taskUrl}\n\n---\nGunimi — AI Workspace OS`,
    },
    sk: {
      subject: `Termín zmenený: ${taskTitle}`,
      badge: "Termín zmenený",
      heading: "Termín úlohy bol aktualizovaný.",
      body: `Termín úlohy v <strong style="color:#F7F8FC;">${workspaceName}</strong> bol zmenený na <strong style="color:#F7F8FC;">${newDueDate}</strong>.`,
      cta: "Zobraziť úlohu →",
      footerNote: `Toto upozornenie bolo odoslané na <strong>${email}</strong>, pretože ste priradený k tejto úlohe v Gunimi.`,
      textBody: `Termín úlohy v ${workspaceName} bol zmenený.\n\nÚloha: ${taskTitle}\nNový termín: ${newDueDate}\n\nZobrazte ju tu:\n${taskUrl}\n\n---\nGunimi — AI Workspace OS`,
    },
    cs: {
      subject: `Termín změněn: ${taskTitle}`,
      badge: "Termín změněn",
      heading: "Termín úkolu byl aktualizován.",
      body: `Termín úkolu v <strong style="color:#F7F8FC;">${workspaceName}</strong> byl změněn na <strong style="color:#F7F8FC;">${newDueDate}</strong>.`,
      cta: "Zobrazit úkol →",
      footerNote: `Toto upozornění bylo odesláno na <strong>${email}</strong>, protože jste přiřazen k tomuto úkolu v Gunimi.`,
      textBody: `Termín úkolu v ${workspaceName} byl změněn.\n\nÚkol: ${taskTitle}\nNový termín: ${newDueDate}\n\nZobrazte ho zde:\n${taskUrl}\n\n---\nGunimi — AI Workspace OS`,
    },
  };
  return s[locale];
}

// ─── Task Due Reminder ────────────────────────────────────────────────────────

export type TaskDueStrings = {
  subject: string;
  badge: string;
  heading: string;
  body: string;
  cta: string;
  dueLabel: string;
  mark: string;
  footerNote: string;
  textBody: string;
  dateLocale: string;
};

export function getTaskDueStrings(
  locale: EmailLocale,
  taskTitle: string,
  workspaceName: string,
  email: string,
  taskUrl: string,
  dueDate: string,
): TaskDueStrings {
  const s: Record<EmailLocale, TaskDueStrings> = {
    en: {
      subject: `Due today: ${taskTitle}`,
      badge: "Due Today",
      heading: "A task is due today.",
      body: `You have a task due today in <strong style="color:#F7F8FC;">${workspaceName}</strong>.`,
      cta: "Open Tasks →",
      dueLabel: "Due:",
      mark: "Mark it complete or update the due date.",
      footerNote: `This reminder was sent to <strong>${email}</strong> because this task is assigned to you in Gunimi.`,
      textBody: `A task is due today in ${workspaceName}.\n\nTask: ${taskTitle}\nDue: ${dueDate}\n\nMark it complete or update the due date:\n${taskUrl}\n\n---\nGunimi — AI Workspace OS`,
      dateLocale: "en-US",
    },
    sk: {
      subject: `Dnes vyprší: ${taskTitle}`,
      badge: "Vyprší dnes",
      heading: "Úloha vyprší dnes.",
      body: `Máte úlohu na dnes v <strong style="color:#F7F8FC;">${workspaceName}</strong>.`,
      cta: "Otvoriť úlohy →",
      dueLabel: "Termín:",
      mark: "Označte ju ako hotovú alebo aktualizujte termín.",
      footerNote: `Toto pripomenutie bolo odoslané na <strong>${email}</strong>, pretože táto úloha je priradená vám v Gunimi.`,
      textBody: `Máte úlohu na dnes v ${workspaceName}.\n\nÚloha: ${taskTitle}\nTermín: ${dueDate}\n\nOznačte ju ako hotovú alebo aktualizujte termín:\n${taskUrl}\n\n---\nGunimi — AI Workspace OS`,
      dateLocale: "sk-SK",
    },
    cs: {
      subject: `Dnes vyprší: ${taskTitle}`,
      badge: "Vyprší dnes",
      heading: "Úkol vyprší dnes.",
      body: `Máte úkol na dnes v <strong style="color:#F7F8FC;">${workspaceName}</strong>.`,
      cta: "Otevřít úkoly →",
      dueLabel: "Termín:",
      mark: "Označte ho jako hotový nebo aktualizujte termín.",
      footerNote: `Toto připomenutí bylo odesláno na <strong>${email}</strong>, protože tento úkol je přiřazen vám v Gunimi.`,
      textBody: `Máte úkol na dnes v ${workspaceName}.\n\nÚkol: ${taskTitle}\nTermín: ${dueDate}\n\nOznačte ho jako hotový nebo aktualizujte termín:\n${taskUrl}\n\n---\nGunimi — AI Workspace OS`,
      dateLocale: "cs-CZ",
    },
  };
  return s[locale];
}
