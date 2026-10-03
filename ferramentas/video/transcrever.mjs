// Transcreve narração (PT) com Whisper local e gera <nome>.words.json com tempo de cada palavra.
// Uso: ffmpeg -i narr.mp3 -ac 1 -ar 16000 -f f32le narr.raw && node transcrever.mjs narr.raw narr.words.json
import { pipeline, env } from '@huggingface/transformers';
import fs from 'fs';
const [,, raw, out] = process.argv;
env.allowRemoteModels = false; env.localModelPath = './node_modules/sts-whisper-small/models/';
const asr = await pipeline('automatic-speech-recognition', 'Xenova/whisper-small', { dtype: 'q8' });
const b = fs.readFileSync(raw); const a = new Float32Array(b.buffer, b.byteOffset, b.length / 4);
const r = await asr(a, { language: 'portuguese', task: 'transcribe', return_timestamps: 'word', chunk_length_s: 30, stride_length_s: 5 });
fs.writeFileSync(out, JSON.stringify(r.chunks)); console.log(out, r.chunks.length, 'palavras');
