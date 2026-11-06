import { describe, expect, test } from "bun:test";
import { hasCarriageReturn, isBinary } from "../scripts/check-lf";

describe("hasCarriageReturn", () => {
  test("flags a CRLF worktree even when the index is normalized", () => {
    expect(hasCarriageReturn("i/lf    w/crlf  attr/text=auto eol=lf \tfile.txt")).toBe(
      true
    );
  });

  test("flags a CRLF index", () => {
    expect(hasCarriageReturn("i/crlf  w/lf    attr/ \tfile.txt")).toBe(true);
  });

  test("flags mixed endings", () => {
    expect(hasCarriageReturn("i/mixed w/lf    attr/ \tfile.txt")).toBe(true);
  });

  test("passes an all-LF file", () => {
    expect(hasCarriageReturn("i/lf    w/lf    attr/text=auto eol=lf \tfile.txt")).toBe(
      false
    );
  });

  test("passes a file git reports as binary", () => {
    expect(hasCarriageReturn("i/-text w/-text attr/text \timage.png")).toBe(false);
  });
});

describe("isBinary", () => {
  test("treats a NUL byte as binary", () => {
    expect(isBinary(Buffer.from("PNG\x00\x01\x02\r\n"))).toBe(true);
  });

  test("treats CRLF text as convertible", () => {
    expect(isBinary(Buffer.from("line one\r\nline two\r\n"))).toBe(false);
  });

  test("treats an empty file as convertible", () => {
    expect(isBinary(Buffer.from(""))).toBe(false);
  });
});
