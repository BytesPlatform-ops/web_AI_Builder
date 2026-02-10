declare module 'sanitize-html' {
  interface IOptions {
    allowedTags?: string[] | false;
    allowedAttributes?: Record<string, string[]> | false;
    disallowedTagsMode?: 'discard' | 'escape' | 'recursiveEscape';
    selfClosing?: string[];
    allowedSchemes?: string[];
    allowedSchemesByTag?: Record<string, string[]>;
    allowedSchemesAppliedToAttributes?: string[];
    allowProtocolRelative?: boolean;
    enforceHtmlBoundary?: boolean;
    parseStyleAttributes?: boolean;
  }

  function sanitizeHtml(dirty: string, options?: IOptions): string;
  
  export = sanitizeHtml;
}
