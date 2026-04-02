/**
 * Emoji Parser Utility
 * 
 * Parses message text to detect and process emoji codes (like :PogChamp:, :Kappa:, etc.)
 * and maps common Twitch emotes to Unicode equivalents where possible.
 */

/**
 * Emoji data interface containing name and optional Unicode representation
 */
export interface EmojiData {
  name: string;
  unicode?: string;
}

/**
 * Message part representing either text or an emoji
 */
export interface MessagePart {
  type: 'text' | 'emoji';
  value: string;
  emojiData?: EmojiData;
}

/**
 * Mapping of common Twitch emote codes to Unicode emoji equivalents
 * or descriptive alternatives when no direct Unicode equivalent exists
 */
const TWITCH_EMOTE_MAP: Record<string, string> = {
  // Popular Twitch emotes with Unicode equivalents
  'Kappa': '🦎',
  'PogChamp': '😲',
  'LUL': '😂',
  'KEKW': '🤣',
  'TriHard': '💪',
  '4Head': '😄',
  'BibleThump': '😢',
  'Kreygasm': '😍',
  'DansGame': '🤢',
  'SwiftRage': '😡',
  'NotLikeThis': '😰',
  'FailFish': '🤦',
  'VoHiYo': '👋',
  'PJSalt': '🧂',
  'MrDestructoid': '🤖',
  'BabyRage': '😭',
  'WutFace': '😨',
  'Jebaited': '🎣',
  'ResidentSleeper': '😴',
  'GivePLZ': '🙏',
  'TakeNRG': '⚡',
  'CoolStoryBob': '📖',
  'ThunBeast': '🦍',
  'TBAngel': '😇',
  'SeemsGood': '👍',
  'BlessRNG': '🍀',
  'FrankerZ': '🐕',
  'RalpherZ': '🐕',
  'OhMyDog': '🐶',
  'EleGiggle': '😆',
  'KappaPride': '🏳️‍🌈',
  'CoolCat': '😺',
  'CorgiDerp': '🐕',
  'SeriousSloth': '🦥',
  'TwitchUnity': '💜',
  'POGGERS': '😮',
  'Pepega': '🤪',
  'monkaS': '😰',
  'monkaW': '😱',
  'PepeHands': '😢',
  'WeirdChamp': '😬',
  'Sadge': '😔',
  'Copium': '💊',
  'Hopium': '✨',
  'Clap': '👏',
  'OMEGALUL': '🤣',
  'LULW': '😂',
  'PepeLaugh': '😏',
  'FeelsGoodMan': '😊',
  'FeelsBadMan': '☹️',
  'FeelsOkayMan': '🙂',
  'GachiGASM': '😩',
  'widepeepoHappy': '😊',
  'peepoShy': '☺️',
  'Pog': '😮',
  'PagMan': '😳',
  'BASED': '💯',
  'Aware': '👁️',
  'Clueless': '🤔',
  'Susge': '🤨',
  'GIGACHAD': '💪',
  'EZ': '😎',
  'KEKL': '😆',
  'KEKWait': '⏰',
  'Madge': '😠',
  'Okayge': '👌',
  'PauseChamp': '⏸️',
  'Stare': '👀',
  'monkaHmm': '🤔',
  'WAYTOODANK': '🔥',
  'pepeD': '🎵',
  'catJAM': '🎶',
  'NOTED': '📝',
  'SOY': '😱',
  'HACKERMANS': '💻',
  'FeelsDankMan': '😏',
  'forsenCD': '💿',
  'Okayga': '👌',
  'COCKA': '🐔',
};

/**
 * Regular expression to match emoji codes in the format :emojiName:
 * - Must start with an unescaped colon
 * - Contains one or more word characters (letters, numbers, underscores)
 * - Must end with a closing colon
 * - Uses negative lookbehind to exclude escaped colons
 */
const EMOJI_CODE_REGEX = /(?<!\\):([a-zA-Z0-9_]+):/g;

/**
 * Parses a message string and extracts emoji codes, converting them to structured parts
 * 
 * @param message - The message text to parse
 * @returns Array of message parts containing text segments and emoji data
 * 
 * @example
 * ```typescript
 * const parts = parseMessageForEmojis("Hello :Kappa: world!");
 * // Returns:
 * // [
 * //   {type: 'text', value: 'Hello '},
 * //   {type: 'emoji', value: ':Kappa:', emojiData: {name: 'Kappa', unicode: '🦎'}},
 * //   {type: 'text', value: ' world!'}
 * // ]
 * ```
 */
export function parseMessageForEmojis(message: string): MessagePart[] {
  // Handle edge cases: empty or whitespace-only messages
  if (!message || typeof message !== 'string') {
    return [];
  }

  // If message is only whitespace, return as single text part
  if (message.trim() === '') {
    return [{ type: 'text', value: message }];
  }

  const parts: MessagePart[] = [];
  let lastIndex = 0;

  // Create a new regex instance to reset lastIndex for each call
  const regex = new RegExp(EMOJI_CODE_REGEX.source, EMOJI_CODE_REGEX.flags);
  let match: RegExpExecArray | null;

  // Iterate through all emoji code matches
  while ((match = regex.exec(message)) !== null) {
    const matchIndex = match.index;
    const fullMatch = match[0]; // Full match including colons (e.g., ":Kappa:")
    const emojiName = match[1]; // Captured group without colons (e.g., "Kappa")

    // Add text part before the emoji if there's any content
    if (matchIndex > lastIndex) {
      const textValue = message.substring(lastIndex, matchIndex);
      parts.push({
        type: 'text',
        value: textValue,
      });
    }

    // Add emoji part
    const unicode = TWITCH_EMOTE_MAP[emojiName];
    parts.push({
      type: 'emoji',
      value: fullMatch,
      emojiData: {
        name: emojiName,
        unicode,
      },
    });

    lastIndex = regex.lastIndex;
  }

  // Add remaining text after the last emoji
  if (lastIndex < message.length) {
    const textValue = message.substring(lastIndex);
    parts.push({
      type: 'text',
      value: textValue,
    });
  }

  // If no emojis were found, return the entire message as text
  if (parts.length === 0) {
    return [{ type: 'text', value: message }];
  }

  return parts;
}

/**
 * Helper function to check if a message contains any emoji codes
 * 
 * @param message - The message text to check
 * @returns True if the message contains at least one emoji code
 */
export function hasEmojis(message: string): boolean {
  if (!message || typeof message !== 'string') {
    return false;
  }
  const regex = new RegExp(EMOJI_CODE_REGEX.source, EMOJI_CODE_REGEX.flags);
  return regex.test(message);
}

/**
 * Helper function to extract just the emoji names from a message
 * 
 * @param message - The message text to parse
 * @returns Array of emoji names found in the message
 * 
 * @example
 * ```typescript
 * const emojis = extractEmojiNames("Hello :Kappa: and :PogChamp:!");
 * // Returns: ['Kappa', 'PogChamp']
 * ```
 */
export function extractEmojiNames(message: string): string[] {
  if (!message || typeof message !== 'string') {
    return [];
  }

  const regex = new RegExp(EMOJI_CODE_REGEX.source, EMOJI_CODE_REGEX.flags);
  const names: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(message)) !== null) {
    names.push(match[1]);
  }

  return names;
}

/**
 * Helper function to get the Unicode representation of a Twitch emote
 * 
 * @param emoteName - The name of the emote (without colons)
 * @returns The Unicode equivalent or undefined if no mapping exists
 * 
 * @example
 * ```typescript
 * const unicode = getEmoteUnicode('Kappa');
 * // Returns: '🦎'
 * ```
 */
export function getEmoteUnicode(emoteName: string): string | undefined {
  return TWITCH_EMOTE_MAP[emoteName];
}

/**
 * Helper function to check if an emote has a Unicode mapping
 * 
 * @param emoteName - The name of the emote (without colons)
 * @returns True if the emote has a Unicode mapping
 */
export function hasEmoteMapping(emoteName: string): boolean {
  return emoteName in TWITCH_EMOTE_MAP;
}
