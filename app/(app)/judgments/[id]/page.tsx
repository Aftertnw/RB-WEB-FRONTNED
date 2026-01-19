import { notFound } from "next/navigation";
import { getJudgment } from "@/lib/api";
import JudgmentDetailView from "./view-client";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const j = await getJudgment(id);
    return <JudgmentDetailView j={j} />;
  } catch (e: unknown) {
    const msg = String((e as Error)?.message || "").toLowerCase();
    if (msg.includes("not found") || msg.includes("404")) notFound();
    throw e;
  }
}
