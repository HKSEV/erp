export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;
export const PASSWORD_MAX_BYTES = 72;

export const PASSWORD_RULE_MESSAGE =
  `비밀번호는 ${PASSWORD_MIN_LENGTH}~${PASSWORD_MAX_LENGTH}자, UTF-8 기준 ${PASSWORD_MAX_BYTES}바이트 이하로 입력해 주세요.`;

export function getPasswordError(password: string): string | undefined {
  if (
    !password.trim()
    || password.length < PASSWORD_MIN_LENGTH
    || password.length > PASSWORD_MAX_LENGTH
    || new TextEncoder().encode(password).length > PASSWORD_MAX_BYTES
  )
    return PASSWORD_RULE_MESSAGE;

  return undefined;
};