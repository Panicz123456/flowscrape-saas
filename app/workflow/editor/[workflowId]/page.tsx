import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { Editor } from "../../_components/Editor";

const page = async ({ params }: { params: { workflowId: string } }) => {
  const { workflowId } = params;
  const { userId } = await auth();

  if (!userId) {
    return <div>unauthenticated</div>;
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  });

  if (!workflow) {
    notFound();
  }

  return <Editor workflow={workflow} />
};

export default page;
