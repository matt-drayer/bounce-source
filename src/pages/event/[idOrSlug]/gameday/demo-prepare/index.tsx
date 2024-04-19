import React from 'react';
import { useRouter } from 'next/router';
import { useApiGateway } from 'hooks/useApi';
import Button from 'components/Button';

export default function PrepareGameday() {
  const router = useRouter();
  const {
    data,
    error,
    isLoading,
    post: fetchPrepareTournament,
  } = useApiGateway('/v1/tournaments/prepare-gameday');

  return (
    <>
      <div className="space-y-4 p-8">
        <div>PrepareGameday</div>
        <div>
          <Button
            variant="brand"
            size="lg"
            isInline
            onClick={() =>
              fetchPrepareTournament({
                payload: {
                  id: router.query.idOrSlug,
                },
              })
            }
          >
            {isLoading ? 'Loading...' : 'Call API to set up tournament'}
          </Button>
        </div>
        {data && (
          <div className="text-xs">
            <div>Data</div>
            <div className="whitespace-pre">{JSON.stringify(data, null, 2)}</div>
          </div>
        )}
        {error && (
          <div className="text-red-600">
            <div>Error: {error}</div>
          </div>
        )}
      </div>
    </>
  );
}
