import { notFound } from "next/navigation";
import { getJudgment } from "@/lib/api";
import EditJudgmentClient from "./edit-client";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let j;
  try {
    j = await getJudgment(id);
  } catch (e: unknown) {
    const msg = String((e as Error)?.message || "").toLowerCase();
    if (msg.includes("not found") || msg.includes("404")) notFound();
    throw e;
  }

  return <EditJudgmentClient judgment={j} />;
}
