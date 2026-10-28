<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  // One row per problem, with its own ticket. Unlike CauseTable, the one-day moves are their own
  // problem: nothing in them is a flipped month, so they leave the cause their tenant would give them.
  let { ticket, tickets }: { ticket: number; tickets: Record<string, string> } = $props();

  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const oneDay = $derived(merged.filter((r) => notes.oneDayMove.includes(r.id)));
  const rows = $derived.by(() => {
    const flipped = groupByCause(merged.filter((r) => !notes.oneDayMove.includes(r.id)), tenantOf);
    const moved = groupByCause(oneDay, () => undefined).map((g) => ({ ...g, cause: 'one-day' as const }));
    return [...flipped, ...moved];
  });

  const WHAT: Record<string, string> = {
    parser: 'the shared parser reads a day-first date month first: day and month swap',
    hint: 'booking-v3 prints MM/DD/YYYY under the date field; people type month first, the form reads it day first',
    'one-day': 'the date is one day off, not flipped: a time-zone shift between where it is booked and where it is read',
    unplaced: 'no tenant on file: cause unknown',
  };
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} · <strong>{rows.length}</strong> problems ·
  <strong>{rows.length - 1}</strong> of them had no ticket of their own
</p>

<table>
  <thead><tr><th>problem</th><th>reports</th><th>what the reports show</th><th>tenants</th><th>seen</th><th>ticket</th></tr></thead>
  <tbody>
    {#each rows as g (g.cause)}
      <tr>
        <td><code>{g.cause}</code></td>
        <td>{g.reports.length}</td>
        <td>{WHAT[g.cause]}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>{#if tickets[g.cause]}<a href={tickets[g.cause]}>{tickets[g.cause].split('/').slice(-3).join(' ').replace(' issues ', ' #')}</a>{:else}none{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
</style>
