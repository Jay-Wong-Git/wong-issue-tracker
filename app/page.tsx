import prisma from "@/prisma/client";
import IssueSummary from "./IssueSummary";
import LatestIssues from "./LatestIssues";
import { Flex, Grid } from "@radix-ui/themes";
import IssueChart from "./IssueChart";
import { initialize } from "next/dist/server/lib/render-server";
import { Metadata } from "next";

export default async function Home() {
  const open = await prisma.issue.count({ where: { status: "OPEN" } });
  const inProgress = await prisma.issue.count({
    where: { status: "IN_PROGRESS" },
  });
  const closed = await prisma.issue.count({ where: { status: "CLOSED" } });
  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5">
      <LatestIssues />
      <Flex direction="column" gap="5">
        <IssueSummary open={open} inProgress={inProgress} closed={closed} />
        <IssueChart open={open} inProgress={inProgress} closed={closed} />
      </Flex>
    </Grid>
  );
}

export const metadata: Metadata = {
  title: "Wong Issue Tracker - Dashboard",
  description: "Summary of project issues.",
};
