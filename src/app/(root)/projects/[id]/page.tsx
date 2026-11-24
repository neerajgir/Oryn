import { auth } from "@clerk/nextjs/server";
import { getProjectById } from "@/features/projects/actions";
import { GlassNavbar } from "@/components/home/glass-navbar";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await auth.protect();
  const { id } = await params;
  const project = await getProjectById(id);

  if ("error" in project) {
    return <p className="pt-28 text-center text-sm text-muted-foreground">Project not found.</p>;
  }

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <GlassNavbar />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 pb-16 pt-28">
        <h1 className="text-2xl font-semibold tracking-tight capitalize">
          {project.name.replace(/-/g, " ")}
        </h1>
        {project.messages.map((message) => (
          <p
            key={message.id}
            className="rounded-2xl border border-border/50 bg-card/50 p-4 text-sm text-left"
          >
            {message.content}
          </p>
        ))}
      </main>
    </div>
  );
}
