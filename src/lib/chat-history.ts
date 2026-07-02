import { supabase } from "@/integrations/supabase/client";

export interface StoredChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export interface StoredAnalysis {
  id: string;
  filename: string;
  analysis: string;
  session_id: string;
  created_at: string;
}

export async function loadChatHistory(): Promise<StoredChatMessage[]> {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, role, content")
    .order("created_at", { ascending: true });
  if (error) {
    console.error("loadChatHistory", error);
    return [];
  }
  return (data ?? []).map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant",
    text: m.content,
  }));
}

export async function saveChatMessage(
  userId: string,
  role: "user" | "assistant",
  content: string,
) {
  const { error } = await supabase
    .from("chat_messages")
    .insert({ user_id: userId, role, content });
  if (error) console.error("saveChatMessage", error);
}

export async function saveAnalysis(
  userId: string,
  fileName: string,
  analysis: string,
  sessionId: string,
) {
  const { error } = await supabase.from("document_analyses").insert({
    user_id: userId,
    file_name: fileName,
    analysis,
    session_id: sessionId,
  });
  if (error) console.error("saveAnalysis", error);
}

export async function loadAnalyses(): Promise<StoredAnalysis[]> {
  const { data, error } = await supabase
    .from("document_analyses")
    .select("id, file_name, analysis, session_id, created_at")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("loadAnalyses", error);
    return [];
  }
  return data ?? [];
}
