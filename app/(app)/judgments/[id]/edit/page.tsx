'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getJudgment, type Judgment } from '@/lib/api';
import EditJudgmentClient from './edit-client';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

import { useTranslation } from 'react-i18next';

export default function Page() {
  const { t } = useTranslation();
  const params = useParams();
  const id = params?.id as string;
  const [judgment, setJudgment] = useState<Judgment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getJudgment(id)
      .then(setJudgment)
      .catch((e) => {
        const msg = String((e as Error)?.message || '').toLowerCase();
        if (msg.includes('not found') || msg.includes('404')) notFound();
        // For other errors, we might want to show them or throw them
        throw e;
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <LoadingOverlay isLoading={true} message={t('common.loading')} />;
  }

  if (!judgment) return null;

  return <EditJudgmentClient judgment={judgment} />;
}
