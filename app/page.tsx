import { getDocument } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { Providers } from '@/lib/store';
import { ConfirmProvider } from '@/components/editable/Confirm';
import { Portfolio } from '@/components/Portfolio';

export const dynamic = 'force-dynamic';

/** Same route, same tree for visitors and owner (§2.2). Owner receives the draft; visitors receive live. */
export default async function Page() {
  const auth = isAuthenticated();
  const { content } = await getDocument(auth ? 'draft' : 'live');
  return (
    <Providers initialContent={content} initialAuth={auth}>
      <ConfirmProvider>
        <Portfolio />
      </ConfirmProvider>
    </Providers>
  );
}
