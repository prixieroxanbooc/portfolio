/* =====================================================================
   In-browser mock MCP server (high-fidelity demo)
   Speaks the real Model Context Protocol shape — initialize, tools/list,
   tools/call — with proper JSON-RPC 2.0 envelopes and tool schemas.
   All data is fabricated. No network, no real Google/account access.
   ===================================================================== */
window.MockMCP = (function () {
  let _id = 1000;
  const nextId = () => String(++_id);

  const TOOLS = {
    gmail: [
      { name: 'gmail.search_messages', description: 'Search the mailbox with a Gmail query', inputSchema: { type: 'object', properties: { query: { type: 'string' }, maxResults: { type: 'integer' } }, required: ['query'] } },
      { name: 'gmail.get_message',     description: 'Fetch one message by id',               inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
      { name: 'gmail.create_draft',    description: 'Create a draft email',                  inputSchema: { type: 'object', properties: { to: { type: 'string' }, subject: { type: 'string' }, body: { type: 'string' } }, required: ['to', 'subject'] } },
      { name: 'gmail.send_message',    description: 'Send an email',                         inputSchema: { type: 'object', properties: { to: { type: 'string' }, subject: { type: 'string' }, body: { type: 'string' } }, required: ['to', 'subject'] } },
      { name: 'gmail.list_labels',     description: 'List Gmail labels',                     inputSchema: { type: 'object', properties: {} } },
    ],
    sheets: [
      { name: 'sheets.get_values',        description: 'Read a cell range',          inputSchema: { type: 'object', properties: { spreadsheetId: { type: 'string' }, range: { type: 'string' } }, required: ['spreadsheetId', 'range'] } },
      { name: 'sheets.append_row',        description: 'Append a row of values',      inputSchema: { type: 'object', properties: { spreadsheetId: { type: 'string' }, range: { type: 'string' }, values: { type: 'array' } }, required: ['spreadsheetId', 'values'] } },
      { name: 'sheets.update_cells',      description: 'Update a range of cells',     inputSchema: { type: 'object', properties: { spreadsheetId: { type: 'string' }, range: { type: 'string' }, values: { type: 'array' } }, required: ['spreadsheetId', 'range', 'values'] } },
      { name: 'sheets.create_spreadsheet',description: 'Create a spreadsheet',        inputSchema: { type: 'object', properties: { title: { type: 'string' } }, required: ['title'] } },
    ],
    docs: [
      { name: 'docs.create_document', description: 'Create a Google Doc',                inputSchema: { type: 'object', properties: { title: { type: 'string' } }, required: ['title'] } },
      { name: 'docs.insert_text',     description: 'Insert text at an index',           inputSchema: { type: 'object', properties: { documentId: { type: 'string' }, index: { type: 'integer' }, text: { type: 'string' } }, required: ['documentId', 'text'] } },
      { name: 'docs.replace_text',    description: 'Replace all occurrences of text',   inputSchema: { type: 'object', properties: { documentId: { type: 'string' }, find: { type: 'string' }, replace: { type: 'string' } }, required: ['documentId', 'find', 'replace'] } },
      { name: 'drive.list_files',     description: 'List Drive files',                  inputSchema: { type: 'object', properties: { q: { type: 'string' } } } },
    ],
    slides: [
      { name: 'slides.create_presentation', description: 'Create a presentation',       inputSchema: { type: 'object', properties: { title: { type: 'string' } }, required: ['title'] } },
      { name: 'slides.add_slide',           description: 'Add a slide',                 inputSchema: { type: 'object', properties: { presentationId: { type: 'string' }, layout: { type: 'string' } }, required: ['presentationId'] } },
      { name: 'slides.replace_all_text',    description: 'Replace placeholder text',    inputSchema: { type: 'object', properties: { presentationId: { type: 'string' }, find: { type: 'string' }, replace: { type: 'string' } }, required: ['presentationId', 'find', 'replace'] } },
    ],
  };
  // headline tool counts (real fleet); the demo lists a representative subset
  const COUNTS = { gmail: 58, sheets: 'Sheets API', docs: 61, slides: 32 };

  function isDestructive(name) {
    return /(delete|remove|trash|purge|drop|clear|wipe|destroy)/i.test(name) && !/(undelete|untrash|unarchive)/i.test(name);
  }
  function primaryTool(service) {
    return { gmail: 'gmail.search_messages', sheets: 'sheets.append_row', docs: 'docs.create_document', slides: 'slides.create_presentation' }[service];
  }
  function sampleArgs(service, identity) {
    const h = (identity || 'you@gmail.com').split('@')[0];
    return {
      gmail:  { query: 'is:unread newer_than:7d', maxResults: 5 },
      sheets: { spreadsheetId: '1Sheet' + h.slice(0, 4), range: 'Sheet1!A:D', values: [[new Date().toISOString().slice(0, 10), 'NovaBank', 'SETTLED', 1850.0]] },
      docs:   { title: h + ' — Meeting Notes (demo)' },
      slides: { title: h + ' — Quarterly Review (demo)' },
    }[service];
  }

  // returns an MCP CallToolResult { content:[{type:'text',text}], isError }
  function callTool(name, args, identity) {
    if (isDestructive(name)) {
      return { isError: true, content: [{ type: 'text', text: JSON.stringify({ error: 'tool_disabled', reason: 'destructive tool off by default (safe-defaults policy)', hint: 'enable per-profile in the gateway admin panel' }, null, 2) }] };
    }
    const h = (identity || 'you@gmail.com').split('@')[0];
    let payload;
    switch (name) {
      case 'gmail.search_messages':
        payload = { matches: 3, messages: [
          { id: '18f3a1', from: 'billing@vendor.example', subject: 'Your March statement is ready', unread: true },
          { id: '18f3b2', from: 'team@novabank.example', subject: 'Welcome to NovaBank, ' + h + '!', unread: true },
          { id: '18f3c3', from: 'calendar@workspace.example', subject: 'Reminder: product demo at 3:00 PM', unread: true },
        ] }; break;
      case 'sheets.append_row':
        payload = { spreadsheetId: args.spreadsheetId, updatedRange: 'Sheet1!A42:D42', updatedRows: 1, values: args.values }; break;
      case 'docs.create_document':
        payload = { documentId: '1Demo' + h.slice(0, 4) + 'XYZ', title: args.title, url: 'https://docs.google.com/document/d/1Demo' + h.slice(0, 4) + 'XYZ/edit' }; break;
      case 'slides.create_presentation':
        payload = { presentationId: '1Deck' + h.slice(0, 4), title: args.title, slides: 5, url: 'https://docs.google.com/presentation/d/1Deck' + h.slice(0, 4) + '/edit' }; break;
      default:
        payload = { ok: true, note: 'sample result for ' + name };
    }
    return { isError: false, content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }] };
  }

  const rpcRequest  = (method, params) => ({ jsonrpc: '2.0', id: nextId(), method, params });
  const rpcResponse = (id, result)    => ({ jsonrpc: '2.0', id, result });

  return { TOOLS, COUNTS, primaryTool, sampleArgs, callTool, isDestructive, rpcRequest, rpcResponse, nextId };
})();
