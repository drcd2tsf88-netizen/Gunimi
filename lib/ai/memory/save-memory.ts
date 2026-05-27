type SaveMemoryProps = {
  workspaceId: string;

  role: string;

  content: string;
};

export async function saveMemory({
  workspaceId,
  role,
  content,
}: SaveMemoryProps) {
  return true;
}