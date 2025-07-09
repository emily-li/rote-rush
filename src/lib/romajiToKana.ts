/**
 * Basic Romaji to Kana conversion utility.
 * This utility is simplified and does not cover all complex Romaji rules or edge cases.
 * It primarily focuses on direct mappings for single kana characters.
 */

// A simplified mapping for common romaji to hiragana and katakana.
// This map prioritizes common single-character romaji inputs.
const ROMAJI_TO_KANA_MAP: Record<string, { hiragana: string; katakana: string }> = {
  a: { hiragana: 'あ', katakana: 'ア' },
  i: { hiragana: 'い', katakana: 'イ' },
  u: { hiragana: 'う', katakana: 'ウ' },
  e: { hiragana: 'え', katakana: 'エ' },
  o: { hiragana: 'お', katakana: 'オ' },
  ka: { hiragana: 'か', katakana: 'カ' },
  ki: { hiragana: 'き', katakana: 'キ' },
  ku: { hiragana: 'く', katakana: 'ク' },
  ke: { hiragana: 'け', katakana: 'ケ' },
  ko: { hiragana: 'こ', katakana: 'コ' },
  sa: { hiragana: 'さ', katakana: 'サ' },
  shi: { hiragana: 'し', katakana: 'シ' },
  su: { hiragana: 'す', katakana: 'ス' },
  se: { hiragana: 'せ', katakana: 'セ' },
  so: { hiragana: 'そ', katakana: 'ソ' },
  ta: { hiragana: 'た', katakana: 'タ' },
  chi: { hiragana: 'ち', katakana: 'チ' },
  tsu: { hiragana: 'つ', katakana: 'ツ' },
  te: { hiragana: 'て', katakana: 'テ' },
  to: { hiragana: 'と', katakana: 'ト' },
  na: { hiragana: 'な', katakana: 'ナ' },
  ni: { hiragana: 'に', katakana: 'ニ' },
  nu: { hiragana: 'ぬ', katakana: 'ヌ' },
  ne: { hiragana: 'ね', katakana: 'ネ' },
  no: { hiragana: 'の', katakana: 'ノ' },
  ha: { hiragana: 'は', katakana: 'ハ' },
  hi: { hiragana: 'ひ', katakana: 'ヒ' },
  fu: { hiragana: 'ふ', katakana: 'フ' },
  he: { hiragana: 'へ', katakana: 'ヘ' },
  ho: { hiragana: 'ほ', katakana: 'ホ' },
  ma: { hiragana: 'ま', katakana: 'マ' },
  mi: { hiragana: 'み', katakana: 'ミ' },
  mu: { hiragana: 'む', katakana: 'ム' },
  me: { hiragana: 'め', katakana: 'メ' },
  mo: { hiragana: 'も', katakana: 'モ' },
  ya: { hiragana: 'や', katakana: 'ヤ' },
  yu: { hiragana: 'ゆ', katakana: 'ユ' },
  yo: { hiragana: 'よ', katakana: 'ヨ' },
  ra: { hiragana: 'ら', katakana: 'ラ' },
  ri: { hiragana: 'り', katakana: 'リ' },
  ru: { hiragana: 'る', katakana: 'ル' },
  re: { hiragana: 'れ', katakana: 'レ' },
  ro: { hiragana: 'ろ', katakana: 'ロ' },
  wa: { hiragana: 'わ', katakana: 'ワ' },
  wo: { hiragana: 'を', katakana: 'ヲ' },
  n: { hiragana: 'ん', katakana: 'ン' },
  // Dakuten and Handakuten (voiced and semi-voiced consonants)
  ga: { hiragana: 'が', katakana: 'ガ' },
  gi: { hiragana: 'ぎ', katakana: 'ギ' },
  gu: { hiragana: 'ぐ', katakana: 'グ' },
  ge: { hiragana: 'げ', katakana: 'ゲ' },
  go: { hiragana: 'ご', katakana: 'ゴ' },
  za: { hiragana: 'ざ', katakana: 'ザ' },
  ji: { hiragana: 'じ', katakana: 'ジ' },
  zu: { hiragana: 'ず', katakana: 'ズ' },
  ze: { hiragana: 'ぜ', katakana: 'ゼ' },
  zo: { hiragana: 'ぞ', katakana: 'ゾ' },
  da: { hiragana: 'だ', katakana: 'ダ' },
  dji: { hiragana: 'ぢ', katakana: 'ヂ' }, // Alternative for ぢ
  dzu: { hiragana: 'づ', katakana: 'ヅ' }, // Alternative for づ
  de: { hiragana: 'で', katakana: 'デ' },
  do: { hiragana: 'ど', katakana: 'ド' },
  ba: { hiragana: 'ば', katakana: 'バ' },
  bi: { hiragana: 'び', katakana: 'ビ' },
  bu: { hiragana: 'ぶ', katakana: 'ブ' },
  be: { hiragana: 'べ', katakana: 'ベ' },
  bo: { hiragana: 'ぼ', katakana: 'ボ' },
  pa: { hiragana: 'ぱ', katakana: 'パ' },
  pi: { hiragana: 'ぴ', katakana: 'ピ' },
  pu: { hiragana: 'ぷ', katakana: 'プ' },
  pe: { hiragana: 'ぺ', katakana: 'ペ' },
  po: { hiragana: 'ぽ', katakana: 'ポ' },
  // Small ya, yu, yo combinations (e.g., kya, shu)
  kya: { hiragana: 'きゃ', katakana: 'キャ' },
  kyu: { hiragana: 'きゅ', katakana: 'キュ' },
  kyo: { hiragana: 'きょ', katakana: 'キョ' },
  sha: { hiragana: 'しゃ', katakana: 'シャ' },
  shu: { hiragana: 'しゅ', katakana: 'シュ' },
  sho: { hiragana: 'しょ', katakana: 'ショ' },
  cha: { hiragana: 'ちゃ', katakana: 'チャ' },
  chu: { hiragana: 'ちゅ', katakana: 'チュ' },
  cho: { hiragana: 'ちょ', katakana: 'チョ' },
  nya: { hiragana: 'にゃ', katakana: 'ニャ' },
  nyu: { hiragana: 'にゅ', katakana: 'ニュ' },
  nyo: { hiragana: 'にょ', katakana: 'ニョ' },
  hya: { hiragana: 'ひゃ', katakana: 'ヒャ' },
  hyu: { hiragana: 'ひゅ', katakana: 'ヒュ' },
  hyo: { hiragana: 'ひょ', katakana: 'ヒョ' },
  mya: { hiragana: 'みゃ', katakana: 'ミャ' },
  myu: { hiragana: 'みゅ', katakana: 'ミュ' },
  myo: { hiragana: 'みょ', katakana: 'ミョ' },
  rya: { hiragana: 'りゃ', katakana: 'リャ' },
  ryu: { hiragana: 'りゅ', katakana: 'リュ' },
  ryo: { hiragana: 'りょ', katakana: 'リョ' },
  gya: { hiragana: 'ぎゃ', katakana: 'ギャ' },
  gyu: { hiragana: 'ぎゅ', katakana: 'ギュ' },
  gyo: { hiragana: 'ぎょ', katakana: 'ギョ' },
  ja: { hiragana: 'じゃ', katakana: 'ジャ' },
  ju: { hiragana: 'じゅ', katakana: 'ジュ' },
  jo: { hiragana: 'じょ', katakana: 'ジョ' },
  bya: { hiragana: 'びゃ', katakana: 'ビャ' },
  byu: { hiragana: 'びゅ', katakana: 'ビュ' },
  byo: { hiragana: 'びょ', katakana: 'ビョ' },
  pya: { hiragana: 'ぴゃ', katakana: 'ピャ' },
  pyu: { hiragana: 'ぴゅ', katakana: 'ピュ' },
  pyo: { hiragana: 'ぴょ', katakana: 'ピョ' },
};

/**
 * Converts a romaji string to its corresponding kana character (hiragana or katakana).
 * This function attempts to find the longest possible romaji match.
 * @param romajiInput - The romaji string to convert.
 * @param targetKanaType - 'hiragana' or 'katakana'. Determines which kana type to return.
 * @returns The converted kana character, or null if no full match is found.
 */
export const convertRomajiToKana = (
  romajiInput: string,
  targetKanaType: 'hiragana' | 'katakana',
): string | null => {
  const normalizedInput = romajiInput.toLowerCase();

  // Try to find the longest matching romaji sequence
  const sortedRomajiKeys = Object.keys(ROMAJI_TO_KANA_MAP).sort(
    (a, b) => b.length - a.length,
  );

  for (const romaji of sortedRomajiKeys) {
    if (normalizedInput === romaji) {
      return ROMAJI_TO_KANA_MAP[romaji][targetKanaType];
    }
  }

  return null;
};

/**
 * Checks if a romaji string is a partial match for any kana character.
 * This is useful for providing feedback as the user types.
 * @param romajiInput - The romaji string to check.
 * @returns True if the romajiInput is a prefix of any valid romaji representation of a kana character.
 */
export const isPartialRomajiMatch = (romajiInput: string): boolean => {
  const normalizedInput = romajiInput.toLowerCase();
  if (normalizedInput.length === 0) return false;

  for (const romaji of Object.keys(ROMAJI_TO_KANA_MAP)) {
    if (romaji.startsWith(normalizedInput)) {
      return true;
    }
  }
  return false;
};
