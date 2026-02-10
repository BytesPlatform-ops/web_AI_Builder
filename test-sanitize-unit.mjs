#!/usr/bin/env node
/**
 * Unit Tests for Sanitization Functions
 */

import sanitizeHtml from 'sanitize-html';

// Replicate sanitizeText from lib/sanitize.ts
function sanitizeText(input) {
  if (!input) return '';
  const sanitized = sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'recursiveEscape',
  });
  return sanitized.trim();
}

// Replicate sanitizeUrl from lib/sanitize.ts
function sanitizeUrl(input) {
  if (!input) return '';
  const trimmed = input.trim();
  const allowedProtocols = ['http:', 'https:', 'data:'];
  try {
    const url = new URL(trimmed);
    if (!allowedProtocols.includes(url.protocol)) {
      return '';
    }
    return trimmed;
  } catch {
    if (!trimmed.includes('://')) {
      try {
        new URL('https://' + trimmed);
        return 'https://' + trimmed;
      } catch {
        return '';
      }
    }
    return '';
  }
}

// Replicate sanitizeColor from lib/sanitize.ts
function sanitizeColor(input) {
  if (!input) return '';
  const color = input.trim();
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!hexRegex.test(color)) {
    return '';
  }
  return color;
}

console.log('\n🧪 UNIT TESTS FOR SANITIZATION FUNCTIONS\n');
console.log('='.repeat(50));

let passed = 0;
let failed = 0;

function test(name, input, fn, expected, checkFn) {
  const result = fn(input);
  const success = checkFn ? checkFn(result) : result === expected;
  if (success) {
    passed++;
    console.log(`✅ ${name}`);
  } else {
    failed++;
    console.log(`❌ ${name}`);
    console.log(`   Input:    ${input}`);
    console.log(`   Output:   ${result}`);
    console.log(`   Expected: ${expected}`);
  }
}

// XSS Tests
console.log('\n📝 TEXT SANITIZATION (XSS Prevention)\n');

test(
  'Script tag XSS stripped',
  '<script>alert("XSS")</script>Hello',
  sanitizeText,
  'Hello',
  (r) => !r.includes('<script>') && r.includes('Hello')
);

test(
  'Img onerror XSS stripped',
  '<img src=x onerror=alert(1)>Evil',
  sanitizeText,
  'Evil',
  (r) => !r.includes('<img') && r.includes('Evil')
);

test(
  'Iframe injection stripped',
  '<iframe src="evil.com"></iframe>Safe',
  sanitizeText,
  'Safe',
  (r) => !r.includes('<iframe') && r.includes('Safe')
);

test(
  'Normal text preserved',
  'Hello World',
  sanitizeText,
  'Hello World'
);

// URL Tests
console.log('\n🔗 URL SANITIZATION\n');

test(
  'JavaScript URL blocked',
  'javascript:alert(1)',
  sanitizeUrl,
  ''
);

test(
  'FTP URL blocked',
  'ftp://files.example.com',
  sanitizeUrl,
  ''
);

test(
  'HTTPS URL allowed',
  'https://example.com',
  sanitizeUrl,
  'https://example.com'
);

test(
  'HTTP URL allowed',
  'http://example.com',
  sanitizeUrl,
  'http://example.com'
);

test(
  'URL without protocol fixed',
  'instagram.com/user',
  sanitizeUrl,
  'https://instagram.com/user'
);

// Color Tests
console.log('\n🎨 COLOR SANITIZATION\n');

test(
  'Valid hex color allowed',
  '#6366f1',
  sanitizeColor,
  '#6366f1'
);

test(
  'Valid short hex allowed',
  '#F00',
  sanitizeColor,
  '#F00'
);

test(
  'Color with XSS blocked',
  '#FF0000<script>',
  sanitizeColor,
  ''
);

test(
  'Invalid color format blocked',
  'rgb(255,0,0)',
  sanitizeColor,
  ''
);

test(
  'Missing # blocked',
  '6366f1',
  sanitizeColor,
  ''
);

// Summary
console.log('\n' + '='.repeat(50));
console.log(`\n📊 RESULTS: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('✅ All sanitization tests passed!\n');
  process.exit(0);
} else {
  console.log('❌ Some tests failed!\n');
  process.exit(1);
}
