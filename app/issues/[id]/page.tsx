import prisma from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";

import { DeleteIssueButton, EditIssueButton, IssueDetails } from "./";
import authOptions from "@/app/auth/authOptions";
import AssigneeSelect from "./AssigneeSelect";
import IssueStatusUpdater from "./IssueStatusUpdater";
import { Metadata } from "next";
import { describe } from "node:test";

interface Props {
  params: {
    id: string;
  };
}

const IssueDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!issue) notFound();

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className="md:col-span-4">
        <IssueDetails issue={issue} />
      </Box>
      {session && (
        <Box>
          <Flex direction="column" gap="3">
            <EditIssueButton issueId={issue.id} />
            <DeleteIssueButton issueId={issue.id} />
            <AssigneeSelect issue={issue} />
            <IssueStatusUpdater issue={issue} />
          </Flex>
        </Box>
      )}
    </Grid>
  );
};

export default IssueDetailPage;

export async function generateMetadata({ params }: Props) {
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });
  return { title: issue?.title, description: issue?.description };
}
