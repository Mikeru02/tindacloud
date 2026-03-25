import { TextEncoder, TextDecoder } from "util";

// Make them global so jsdom + React Router works
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;