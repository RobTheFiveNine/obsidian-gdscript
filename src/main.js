import { Plugin } from 'obsidian';


export default class GdscriptSyntaxPlugin extends Plugin {
    onload() {
        var self = this;

        // The defineSimpleMode function is not immediately available during
        // onload, so continue to try and define the language until it is.
        const setupInterval = setInterval(() => {
            if (CodeMirror && CodeMirror.defineSimpleMode) {
                const KEYWORDS = new Set([
                    'and','as','assert','await','break','breakpoint','const','continue','elif','else','enum',
                    'for','if','in','master','mastersync','match','not','null','or','pass','preload',
                    'puppet','puppetsync','remote','remotesync','return','self','setget','static','tool',
                    'var','while','yield'
                ]);

                const mode = {
                    start: [
                        { regex: /\b0x[0-9a-f]+\b/i, token: 'number' },
                        { regex: /\b-?\d+\b/, token: 'number' },
                        { regex: /#.+/, token: 'comment' },
                        { regex: /\s*(@onready|@export)\b/, token: 'keyword' },
                        { regex: /[()\[\]{},]/, token: 'meta' },

                        // The words following func, class_name and class should be highlighted as attributes,
                        // so push onto the definition stack
                        { regex: /\b(func|class_name|class|extends|signal|is)\b/, token: 'keyword', push: 'definition' },

                        { regex: /@?(?:("|')(?:(?!\1)[^\n\\]|\\[\s\S])*\1(?!"|')|"""(?:[^\\]|\\[\s\S])*?""")/, token: 'string' },
                        { regex: /\$[\w\/]+\b/, token: 'variable' },
                        { regex: /\:[\s]*$/, token: 'operator' },
                        { regex: /\:[ ]*/, token: 'meta', push: 'var_type' },
                        { regex: /\->[ ]*/, token: 'operator', push: 'definition' },
                        { regex: /\+|\*|-|\/|:=|>|<|\^|&|\||%|~|=/, token: 'operator' },
                        { regex: /\b(?:false|true)\b/, token: 'number' },
                        { regex: /\b[A-Z][A-Z_\d]*\b/, token: 'operator' },

                        // Function calls on objects: object.doSomething()
                        {
                            regex: /(\.)([A-Za-z_]\w*)(?=\s*\()/,
                            token: ['operator', 'variable'],
                        },

                        // Normal function calls: doSomething()
                        {
                            regex: /[A-Za-z_]\w*(?=\s*\()/,
                            token: 'variable',
                        },

                        {
                            regex: /[A-Za-z_]\w*/,
                            token: (match) => {
                                const word = Array.isArray(match) ? match[0] : match;
                                return KEYWORDS.has(word) ? 'keyword' : null;
                            }
                        },
                    ],
                    var_type: [
                        { regex: /(\w+)/, token: 'attribute', pop: true },
                    ],
                    definition: [
                        { regex: /(\w+)/, token: "attribute", pop: true }
                    ]
                };

                CodeMirror.defineSimpleMode('gdscript', mode);
                CodeMirror.defineSimpleMode('GDScript', mode);
                CodeMirror.defineSimpleMode('GDscript', mode);

                self.app.workspace.iterateAllLeaves((leaf) => {
                    leaf.rebuildView();
                 });

                 clearInterval(setupInterval);
            }
        }, 100);
    }

    onunload() {
        delete CodeMirror.modes['gdscript'];
        delete CodeMirror.modes['GDScript'];
        delete CodeMirror.modes['GDscript'];
    }
}
