const CUSTOM_CODE_MAP = {
  HELLO_WORLD: {
    exampleMessage: `안녕!`,
    reason: "hello world",
  },
  USER_MUST_BE_LOGGED_IN: {
    exampleMessage: `로그인되어 있지 않습니다.`,
    reason: null,
  },
  CONFIG_NOT_VALID: {
    exampleMessage: "올바른 설정 데이터가 아닙니다.",
    reason: "현재 미사용",
  },
  LOGIN_FAIL_EMAIL: {
    exampleMessage: "유저 정보가 없습니다.",
    reason: "로그인 실패(이메일)",
  },
  LOGIN_FAIL_PASSWORD: {
    exampleMessage: "유저 정보가 없습니다.",
    reason: "로그인 실패(패스워드)",
  },
} as const;

export default CUSTOM_CODE_MAP;
