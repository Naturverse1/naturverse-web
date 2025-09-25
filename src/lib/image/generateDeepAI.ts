import { NAVATAR_BUCKET, NAVATAR_PREFIX, getSessionUserId } from '@/lib/navatar';
import { supabase } from '@/lib/supabaseClient';

export type DeepAIGenerateOptions = {
  prompt: string;
  width?: number;
  height?: number;
  filename?: string;
};

export type DeepAIResult = {
  file: File;
  path: string;
  url: string | null;
  contentType: string;
};

const DEFAULT_PROMPT =
  'cute friendly mascot portrait, bright, soft lighting, simple background';

export async function generateWithDeepAI({
  prompt,
  width = 1024,
  height = 1024,
  filename,
}: DeepAIGenerateOptions): Promise<DeepAIResult> {
  const trimmedPrompt = prompt.trim();
  const payload = {
    prompt: trimmedPrompt.length > 0 ? trimmedPrompt : DEFAULT_PROMPT,
    width,
    height,
  };

  const response = await fetch('/.netlify/functions/deepai-generate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const { contentType, data } = (await response.json()) as {
    contentType: string;
    data: string;
  };

  if (!contentType || !data) {
    throw new Error('DeepAI response missing image data');
  }

  const blob = b64toBlob(data, contentType);
  const fileName = filename ?? `navatar-${Date.now()}.png`;
  const file = new File([blob], fileName, { type: contentType });

  const ownerId = await getSessionUserId();
  const extension = fileName.split('.').pop() || contentType.split('/').pop() || 'png';
  const storagePath = `${NAVATAR_PREFIX}/${ownerId}/deepai-${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(NAVATAR_BUCKET).upload(storagePath, file, {
    upsert: true,
    contentType,
  });

  if (error) {
    throw error;
  }

  const { data: pub } = supabase.storage.from(NAVATAR_BUCKET).getPublicUrl(storagePath);

  return {
    file,
    path: storagePath,
    url: pub?.publicUrl ?? null,
    contentType,
  };
}

function b64toBlob(b64Data: string, contentType = '', sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    byteArrays.push(new Uint8Array(byteNumbers));
  }

  return new Blob(byteArrays, { type: contentType });
}
