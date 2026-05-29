import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

declare const global: typeof globalThis;

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;
