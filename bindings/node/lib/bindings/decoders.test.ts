import {
    bpeDecoder,
    ctcDecoder,
    metaspaceDecoder,
    sequenceDecoder,
    wordPieceDecoder,
    byteFallbackDecoder,
} from "./decoders";

describe("wordPieceDecoder", () => {
    it("accepts `undefined` as first parameter", () => {
        expect(wordPieceDecoder(undefined)).toBeDefined();
    });

    it("accepts `undefined` as second parameter", () => {
        expect(wordPieceDecoder("test", undefined)).toBeDefined();
    });

    it("can decode arrays of strings", () => {
        expect(
            wordPieceDecoder().decode(["Hel", "##lo", "there", "my", "fr", "##iend"])
        ).toEqual("Hello there my friend");
    });
});

describe("byteFallbackDecoder", () => {
    it("accepts `undefined` as first parameter", () => {
        expect(byteFallbackDecoder()).toBeDefined();
    });

    it("can decode arrays of strings", () => {
        expect(byteFallbackDecoder().decode(["Hel", "lo"])).toEqual("Hello");
        expect(byteFallbackDecoder().decode(["<0x61>"])).toEqual("a");
        expect(byteFallbackDecoder().decode(["<0x61>"])).toEqual("a");
        expect(byteFallbackDecoder().decode(["My", " na", "me"])).toEqual("My name");
        expect(byteFallbackDecoder().decode(["<0x61>"])).toEqual("a");
        expect(byteFallbackDecoder().decode(["<0xE5>"])).toEqual("�");
        expect(byteFallbackDecoder().decode(["<0xE5>", "<0x8f>"])).toEqual("��");
        expect(byteFallbackDecoder().decode(["<0xE5>", "<0x8f>", "<0xab>"])).toEqual(
            "叫"
        );
        expect(byteFallbackDecoder().decode(["<0xE5>", "<0x8f>", "a"])).toEqual("��a");
        expect(byteFallbackDecoder().decode(["<0xE5>", "<0x8f>", "<0xab>", "a"])).toEqual(
            "叫a"
        );
    });
});

describe("metaspaceDecoder", () => {
    it("accepts `undefined` as first parameter", () => {
        expect(metaspaceDecoder(undefined)).toBeDefined();
    });

    it("accepts `undefined` as second parameter", () => {
        expect(metaspaceDecoder("t", undefined)).toBeDefined();
    });
});

describe("bpeDecoder", () => {
    it("accepts `undefined` as parameter", () => {
        expect(bpeDecoder(undefined)).toBeDefined();
    });
});

describe("ctcDecoder", () => {
    it("accepts `undefined` as parameter", () => {
        expect(ctcDecoder(undefined)).toBeDefined();
    });
    it("encodes correctly", () => {
        expect(
            ctcDecoder().decode([
                "<pad>",
                "h",
                "h",
                "e",
                "e",
                "l",
                "l",
                "<pad>",
                "l",
                "l",
                "o",
            ])
        ).toEqual("hello");
    });
});

describe("sequenceDecoder", () => {
    it("accepts `empty list` as parameter", () => {
        expect(sequenceDecoder([])).toBeDefined();
    });
    it("encodes correctly", () => {
        expect(
            sequenceDecoder([ctcDecoder(), metaspaceDecoder()]).decode([
                "▁",
                "▁",
                "H",
                "H",
                "i",
                "i",
                "▁",
                "y",
                "o",
                "u",
            ])
        ).toEqual("Hi you");
    });
});
