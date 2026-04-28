// Default auto-mock for @huggingface/transformers in Jest (ESM not supported in jsdom)
// Individual test files can override with jest.mock('@huggingface/transformers', factory)

const AutoProcessor = {
  from_pretrained: jest.fn().mockResolvedValue({
    apply_chat_template: jest.fn().mockReturnValue('mock prompt'),
    batch_decode: jest.fn().mockReturnValue(['Mock VLM output']),
  }),
};

const AutoModelForVision2Seq = {
  from_pretrained: jest.fn().mockResolvedValue({
    generate: jest.fn().mockResolvedValue({ slice: jest.fn().mockReturnValue([]) }),
  }),
};

const RawImage = {
  fromBlob: jest.fn().mockResolvedValue({ width: 640, height: 480, data: new Uint8Array(10) }),
};

module.exports = { AutoProcessor, AutoModelForVision2Seq, RawImage };
