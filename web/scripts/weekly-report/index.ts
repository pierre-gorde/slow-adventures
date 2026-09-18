import { writeFile } from 'node:fs/promises';
import { sendEmail } from './email.ts';
import { buildHtml, buildSubject, type ReportData } from './format.ts';
import {
  dashboardUrl,
  fetchAccessToken,
  fetchStats,
  fetchTopEvents,
  fetchTopPages,
  fetchTopSources,
  parseServiceAccount,
  type Ga4Access,
} from './ga4.ts';
import {
  SAMPLE_PROPERTY_ID,
  SAMPLE_STATS,
  SAMPLE_TOP_EVENTS,
  SAMPLE_TOP_PAGES,
  SAMPLE_TOP_REFERRERS,
} from './sample.const.ts';
import { previousWeekRange, type WeekRange } from './week.ts';

const SAMPLE_FLAG = '--sample';
const DRY_RUN_FLAG = '--dry-run';
const PREVIEW_DEFAULT_PATH = 'weekly-report-preview.html';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`❌ Variable d'environnement manquante : ${name}`);
    process.exit(1);
  }
  return value;
}

function optionalEnv(name: string): string | undefined {
  return process.env[name] || undefined;
}

function previewPath(): string {
  const flagIndex = process.argv.findIndex(
    (arg) => arg === SAMPLE_FLAG || arg === DRY_RUN_FLAG
  );
  const next = process.argv[flagIndex + 1];
  return next && !next.startsWith('--') ? next : PREVIEW_DEFAULT_PATH;
}

function sampleReport(range: WeekRange): ReportData {
  return {
    range,
    stats: SAMPLE_STATS,
    topPages: SAMPLE_TOP_PAGES,
    topReferrers: SAMPLE_TOP_REFERRERS,
    topEvents: SAMPLE_TOP_EVENTS,
    dashboardUrl: dashboardUrl(SAMPLE_PROPERTY_ID),
  };
}

async function fetchReport(range: WeekRange): Promise<ReportData> {
  const propertyId = requireEnv('GA4_PROPERTY_ID');
  const key = parseServiceAccount(requireEnv('GA4_SERVICE_ACCOUNT_JSON'));
  const access: Ga4Access = {
    propertyId,
    accessToken: await fetchAccessToken(key),
  };
  console.log(
    `📊 Récupération des stats GA4 du ${range.startDateIso} au ${range.endDateIso}`
  );
  const [stats, topPages, topReferrers, topEvents] = await Promise.all([
    fetchStats(access, range),
    fetchTopPages(access, range),
    fetchTopSources(access, range),
    fetchTopEvents(access, range),
  ]);
  return {
    range,
    stats,
    topPages,
    topReferrers,
    topEvents,
    dashboardUrl: dashboardUrl(propertyId),
  };
}

async function main(): Promise<void> {
  const sampleMode = process.argv.includes(SAMPLE_FLAG);
  const dryRun = process.argv.includes(DRY_RUN_FLAG);
  const range = previousWeekRange(Date.now());
  const report = sampleMode ? sampleReport(range) : await fetchReport(range);
  const html = buildHtml(report);

  if (sampleMode || dryRun) {
    const outputPath = previewPath();
    await writeFile(outputPath, html);
    console.log(
      `👀 Aperçu écrit dans ${outputPath} — sujet : « ${buildSubject(range)} »`
    );
    return;
  }

  const messageId = await sendEmail(requireEnv('BREVO_API_KEY'), {
    from: requireEnv('REPORT_EMAIL_FROM'),
    to: requireEnv('REPORT_EMAIL_TO'),
    cc: optionalEnv('REPORT_EMAIL_CC'),
    subject: buildSubject(range),
    html,
  });
  console.log(`✉️ Rapport envoyé (id Brevo : ${messageId})`);
}

main().catch((error) => {
  console.error('❌ Échec du rapport hebdo :', error);
  process.exit(1);
});
