import { ProjectView } from '@/components/projects/project-view';
import { Spinner } from '@/components/ui/spinner';
import React, { Suspense } from 'react';

type Props = {
  params: Promise<{ id: string }>;
};

async function ProjectPageContent({ params }: Props) {
  const { id } = await params;

  return <ProjectView projectId={id} />;
}

export default function ProjectPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      }
    >
      <ProjectPageContent params={params} />
    </Suspense>
  );
}
